const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../utils/sendMail.js");
const createActivationToken = require("../utils/createActivationToken.js");

const getCurrentUserInfo = async (req, res) => {
	try {
		// Check if user information exists in the session
		if (!req.user) {
			return res
				.status(404)
				.json({ message: "User information not found in the session" });
		}

		// Retrieve user information from the session
		const user = req.user;

		// Send user information to the frontend
		return res.status(200).json({ user });
	} catch (error) {
		console.error("Error retrieving user information:", error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

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
			user,
		});
	} catch (error) {
		console.log(error);
		if (error.name === "TokenExpiredError") {
			return res
				.status(401)
				.json({ error: "Token expired, kindly signup again" });
		}
		res.status(500).json({ error: "Something went wrong" });
	}
};

//To request for password reset, we need to send the user's email to the server.
	// We will then send a password reset email to the user that will allow them to reset their password.
	// The mail will contain a token that will be used to verify the user's identity and to reset their password.
	// The token will be signed using the secret key and will expire after a certain period of time.
	// The user will be able to reset their password by providing the new password along with the token.
	// The server will then verify the token and the user's email and update the user's password in the database.
	// The user will then be able to login with their new password.
	// The password reset link will be sent to the user's email address.
	// The user will then be able to click on the link to reset their password.
	// The user will then be able to enter their new password and click on the "Reset Password" button.
	// The server will then verify the token and the user's email and update the user's password in the database.
	// The user will then be able to login with their new password.

const passwordReset = async (req, res) => {
	
	const { email } = req.body;
	
	try {
			const user = await User.findOne({ email });
		
			if (!user) {
				return res.status(400).json({ error: "User not found" });
			}
		
			const activationToken = createActivationToken(user);
			const activationCode = activationToken.activationCode;
		
			const data = { user: { name: user.name }, activationCode };
		await sendMail({
			email: user.email,
			subject: "Reset your password",
			template: "password-reset-mail.ejs",
			data,
		});
		res.status(201).json({
			success: true,
			message: `Please check your email ${user.email} to reset your password`,
			activationToken: activationToken.token,
		});
	} catch (error) {
		// return next(new ErrorHandler(error.message, 400));
		console.log(error);
		res.status(500).json({ error: "Something went wrong" });
	}

}

const confirmPasswordResetOTP = async (req, res) => {
	const { activation_token, activation_code } = req.body;

	const decoded = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);

	try {
		if (decoded.activationCode !== activation_code) {
			return res.status(400).json({ error: "Invalid activation code" });
		}
	
		res.status(201).json({
			success: true,
			message: "OTP verified successfully",
		});
	} catch (error) {
		res.status(500).json({ error: "Something went wrong" });

	}

}


const passwordResetConfirmed = async (req, res) => {
	const { activation_token, activation_code, password } = req.body;

	try {
		const decoded = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
	
		if (decoded.activationCode !== activation_code) {
			return res.status(400).json({ error: "Invalid activation code" });
		}
	
		const { email } = decoded.user;
	
		const hashedPassword = await bcrypt.hash(password, 12);
	
		const user = await User.findOneAndUpdate(
			{ email },
			{ password: hashedPassword },
			{ new: true }
		);
	
		res.status(201).json({
			success: true,
			user,
		});
		
	} catch (error) {
		res.status(500).json({ error: "Something went wrong" });
	}

}

const login = async (req, res) => {
	const { user, password } = req.body;
	if (!user || !password)
		return res
			.status(400)
			.json({ message: "Username and password are required." });

	const foundUser =
		(await User.findOne({ username: user }).exec()) ||
		(await User.findOne({ email: user }).exec());
	if (!foundUser) return res.sendStatus(401); //Unauthorized
	// evaluate password
	const match = await bcrypt.compare(password, foundUser.password);
	if (match) {
		const roles = Object.values(foundUser.roles).filter(Boolean);
		// create JWTs
		const accessToken = jwt.sign(
			{
				UserInfo: {
					username: foundUser.username,
					roles: roles,
				},
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: "10s" }
		);
		const refreshToken = jwt.sign(
			{ username: foundUser.username },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: "1d" }
		);
		// Saving refreshToken with current user
		foundUser.refreshToken = refreshToken;
		const result = await foundUser.save();
		// console.log(result);
		// console.log(roles);

		// Creates Secure Cookie with refresh token
		res.cookie("jwt", refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: "None",
			maxAge: 24 * 60 * 60 * 1000,
		});

		// Send authorization roles and access token to user
		res.json({ roles, result, accessToken });
	} else {
		res.sendStatus(401);
	}
};

const logout = async (req, res) => {
	// On client, also delete the accessToken

	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(204); //No content
	const refreshToken = cookies.jwt;

	// Is refreshToken in db?
	const foundUser = await User.findOne({ refreshToken }).exec();
	if (!foundUser) {
		res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
		return res.sendStatus(204);
	}

	// Delete refreshToken in db
	foundUser.refreshToken = "";
	const result = await foundUser.save();
	console.log(result);

	res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
	res.sendStatus(204);
};

module.exports = {
	signUp,
	activateUser,
	login,
	logout,
	getCurrentUserInfo,
	passwordReset,	
	confirmPasswordResetOTP,
	passwordResetConfirmed
	
};
