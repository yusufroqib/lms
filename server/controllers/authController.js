const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const {sendMail} = require('../utils/sendMail.js')
const createActivationToken = require('../utils/createActivationToken.js')

const signUp = async (req, res) => {
	try {
		// Extracting email, password, and name from the request body
		const { email, username, password, name } = req.body;

		// Checking if the user already exists
		const existingUser = await User.findOne({ email }).select("-password");
		if (existingUser)
			return res.status(400).json({ error: "User already exists" });

		const hashedPassword = await bcrypt.hash(password, 12);
		const user = { email, password: hashedPassword, name, username };

		const activationToken = createActivationToken(user);
		const activationCode = activationToken.activationCode;

		const data = { user: { name: user.name }, activationCode };

		try {
			await sendMail({
				email: user.email,
				subject: "Activation your Account ",
				template: "activation-mail.ejs",
				data,
			});
			res.status(201).json({
				success: true,
				message: `Please check your email ${user.email} to active your account`,
				activationToken: activationToken.token,
			});
		} catch (error) {
			// return next(new ErrorHandler(error.message, 400));
            console.log(error)
            res.status(400).json({ error: error.message });
		}

		// Creating a new Unconfirmed user using the provided email, hashed password, and name
		// const token = crypto.randomBytes(32).toString("hex");
		// const tokenExpiryDate = new Date() + 10 * 60 * 1000; // 10 mins from now

		// const newUnconfirmedUser = await UnconfirmedUser.create({
		// 	email,
		// 	password: hashedPassword,
		// 	name,
		// 	token,
		// 	// tokenExpiryDate,
		// });
		
		// sendConfirmationMail(newUnconfirmedUser, res);
	} catch (error) {
		// Handling any errors that occur during the process
		console.log(error);
		res.status(500).json({ error: "Something went wrong" });
	}
};



module.exports = { signUp };
