const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken")


const { sendMail } = require("../utils/sendMail.js");
const createActivationToken = require("../utils/createActivationToken.js");

const signUp = async (req, res) => {
	try {
		// Extracting email, password, and name from the request body
		const { email, username, password, name } = req.body;

		// Checking if the user already exists
		const existingUser = await User.findOne({ email }).select("-password");
		if (existingUser)
			return res.status(400).json({ error: "User already exists" });

		const hashedPassword = await bcrypt.hash(password, 12);
		const user = { name, username, email, password: hashedPassword };

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
			console.log(error);
			return res.status(400).json({ error: error.message });
		}
	} catch (error) {
		// Handling any errors that occur during the process
		console.log(error);
		res.status(500).json({ error: "Something went wrong" });
	}
};
 
const activateUser = async (req, res) => {
	try {
		const { activation_token, activation_code } = req.body;

		const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);

		if (newUser.activationCode !== activation_code) {
			return res.status(400).json({ error: "Invalid activation code" });
		}

		const { name, email, username, password } = newUser.user;

		const existUser = await User.findOne({ email });

		if (existUser) {
			return res.status(400).json({ error: "User already exists" });
		}
		const user = await User.create({
			name,
            username,
			email,
			password,
		});

		res.status(201).json({
			success: true,
            user
		});
	} catch (error) {
		// return next(new ErrorHandler(error.message, 400));
        console.log(error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired, kindly signup again' });
        }
		res.status(500).json({ error: "Something went wrong" });
	}
};


const login = async (req, res) => {
	// const { email, password } = req.body;

	// try {
	// 	// Checking if the user exists in the database
	// 	const existingUser = await User.findOne({ email });

	// 	if (!existingUser)
	// 		return res.status(404).json({ error: "User doesn't exist" });

	// 	if (!existingUser.password) {
	// 		return res.status(404).json({
	// 			error: "This user was registered using google Authentication",
	// 		});
	// 	}

	// 	// Comparing the provided password with the hashed password stored in the database
	// 	const correctPassword = await bcrypt.compare(
	// 		password,
	// 		existingUser.password
	// 	);
	// 	if (!correctPassword)
	// 		return res.status(400).json({ error: "Invalid credentials" });

	// 	// Generating a JSON Web Token (JWT) for authentication

	// 	// const token = generateCookieToken({
	// 	// 	email: existingUser.email,
	// 	// 	id: existingUser._id,
	// 	// });




	// 	existingUser.password = null;
	// 	existingUser.updatedAt = null;
	// 	existingUser.createdAt = null;

	// 	res.status(200).json({ loggedInUser: existingUser, token });
	// } catch (error) {
	// 	// Handling any errors that occur during the process
	// 	console.log(error);
	// 	res.status(500).json({ message: "Something went wrong" });
	// }

    const { user, password } = req.body;
    if (!user || !password) return res.status(400).json({ 'message': 'Username and password are required.' });

    const foundUser = await User.findOne({ username: user } || { email: user}).exec();
    if (!foundUser) return res.sendStatus(401); //Unauthorized 
    // evaluate password 
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles).filter(Boolean);
        // create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '10s' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);
        console.log(roles);
 
        // Creates Secure Cookie with refresh token
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

        // Send authorization roles and access token to user
        res.json({ roles, result, accessToken });

    } else {
        res.sendStatus(401);
    }
};


module.exports = { signUp, activateUser, login };
