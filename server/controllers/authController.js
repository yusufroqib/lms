const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../utils/sendMail.js");
const createActivationToken = require("../utils/createActivationToken.js");
const { connect } = require("getstream");
// const StreamChat = require("stream-chat").StreamChat;

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;

// console.log(api_key)

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
			return res
				.status(400)
				.json({ error: "User already exists with this email" });

		const existingUsername = await User.findOne({ username }).select(
			"-password"
		);
		if (existingUsername)
			return res.status(400).json({ error: "Username already taken" });

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
};

const confirmPasswordResetOTP = async (req, res) => {
	const { activation_token, activation_code } = req.body;

	try {
		const decoded = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
		if (decoded.activationCode !== activation_code) {
			return res.status(400).json({ error: "Invalid activation code" });
		}

		res.status(201).json({
			success: true,
			message: "OTP verified successfully",
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

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
};

const login = async (req, res) => {
	const cookies = req.cookies;
	const { user, password } = req.body;
	// console.log(req.body);

	try {
		if (!user || !password)
			return res
				.status(400)
				.json({ message: "Username and password are required." });

		const foundUser = await User.findOne({
			$or: [{ username: user }, { email: user }],
		})
			.select("+password")
			.exec();

		if (!foundUser)
			return res.status(401).json({ message: "Invalid username or password" }); //Unauthorized

		// evaluate password
		const match = await bcrypt.compare(password, foundUser.password);
		if (match) {
			const roles = Object.values(foundUser.roles).filter(Boolean);

			const newRefreshToken = jwt.sign(
				{ username: foundUser.username },
				process.env.REFRESH_TOKEN_SECRET,
				{ expiresIn: "1d" }
			);

			let newRefreshTokenArray = !cookies?.jwt
				? foundUser.refreshToken
				: foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

			if (cookies?.jwt) {
				/*
					Scenario added here: 
					1) User logs in but never uses RT and does not logout 
					2) RT is stolen
					3) If 1 & 2 occurs, reuse detection is needed to clear all RTs when user logs in
				*/
				const refreshToken = cookies.jwt;
				const foundToken = await User.findOne({ refreshToken }).exec();

				//Detected refresh token reuse!
				if (!foundToken) {
					// console.log("Used cookie already");
					// clear out ALL previous refresh tokens
					newRefreshTokenArray = [];
				}

				res.clearCookie("jwt", {
					httpOnly: true,
					sameSite: "None",
					secure: true,
				});
			}

			// Saving refreshToken with current user
			foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];

			const serverClient = connect(api_key, api_secret, app_id);
			const streamToken = serverClient.createUserToken(
				// JSON.stringify(foundUser._id)
				foundUser._id.toString(), Math.floor(Date.now() / 1000) + (60 * 30)
			);
			// console.log(streamToken);

			// console.log(foundUser)
			const result = await foundUser.save();
			// console.log(result)
			result.password = "";
			result.refreshToken = "";
			// console.log(result)
			const accessToken = jwt.sign(
				{
					UserInfo: {
						_id: foundUser._id,
						username: foundUser.username,
						fullName: foundUser.name,
						image: foundUser.avatar,
						roles: roles,
						streamToken: streamToken,
					},
				},
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: "15m" }
			);

			// const userInfo = {...result, password: ''}

			// Creates Secure Cookie with refresh token
			res.cookie("jwt", newRefreshToken, {
				httpOnly: true,
				secure: true,
				sameSite: "None",
				maxAge: 24 * 60 * 60 * 1000,
			});

			// console.log(accessToken)
			// console.log(accessToken)

			// Send authorization roles and access token to user
			res.json({ accessToken, loggedUser: result });
		} else {
			res.status(401).json({ message: "Invalid username or password" }); //Unauthorized
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const logout = async (req, res) => {
	// On client, also delete the accessToken

	const cookies = req.cookies;

	try {
		if (!cookies?.jwt) return res.sendStatus(204); //No content
		const refreshToken = cookies.jwt;

		// Is refreshToken in db?
		const foundUser = await User.findOne({ refreshToken }).exec();
		if (!foundUser) {
			res.clearCookie("jwt", {
				httpOnly: true,
				sameSite: "None",
				secure: true,
			});
			return res.sendStatus(204);
		}

		// Delete refreshToken in db
		foundUser.refreshToken = foundUser.refreshToken.filter(
			(rt) => rt !== refreshToken
		);
		const result = await foundUser.save();
		// console.log(result);

		res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
		res.sendStatus(204);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	signUp,
	activateUser,
	login,
	logout,
	getCurrentUserInfo,
	passwordReset,
	confirmPasswordResetOTP,
	passwordResetConfirmed,
};
