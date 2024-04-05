const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { connect } = require("getstream");
// const StreamChat = require("stream-chat").StreamChat;
const { StreamClient } = require("@stream-io/node-sdk");

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;

const handleRefreshToken = async (req, res) => {
	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(401);
	const refreshToken = cookies.jwt;
	res.clearCookie("jwt", {
		httpOnly: true,
		sameSite: "None",
		secure: true,
	});

	const foundUser = await User.findOne({ refreshToken }).exec();

	//Detected refresh token reuse!
	if (!foundUser) {
		jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET,
			async (err, decoded) => {
				if (err) return res.sendStatus(403); //Forbidden
				console.log("No user found, hacked user");

				// Delete refresh token from db
				const hackedUser = await User.findOne({
					_id: decoded._id,
				}).exec();
				hackedUser.refreshToken = [];
				const result = await hackedUser.save();
				// console.log(result);
			}
		);
		console.log("No user found");
		return res.sendStatus(403);
	}

	const newRefreshTokenArray = foundUser.refreshToken.filter(
		(rt) => rt !== refreshToken
	);

	// evaluate jwt
	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET,
		async (err, decoded) => {
			if (err) {
				// expired refresh token
				foundUser.refreshToken = [...newRefreshTokenArray];
				const result = await foundUser.save();
			}
			if (err || foundUser._id.toString() !== decoded._id) {
				
				console.log(foundUser._id.toString());
				console.log( decoded._id);
				console.log("_id not equals");

				return res.sendStatus(403);
			}

			// console.log(foundUser)

			// const serverClient = connect(api_key, api_secret, app_id);
			// const expirationTime = Math.floor(Date.now() / 1000) + 3600;
			// const issuedAt = Math.floor(Date.now() / 1000) - 60;
			// const streamToken = serverClient.createUserToken(foundUser._id.toString(), expirationTime, issuedAt);

			const streamClient = new StreamClient(api_key, api_secret);
			const expirationTime = Math.floor(Date.now() / 1000) + 3600;
			const issuedAt = Math.floor(Date.now() / 1000) - 60;
			// const streamToken = streamClient.createToken(foundUser._id.toString(), expirationTime, issuedAt);
			const streamToken = streamClient.createToken(foundUser._id.toString());

			// console.log("refreshTokenStream", streamToken);

			// Refresh token was still valid
			// const roles = Object.values(foundUser.roles);
			const roles = Object.values(foundUser.roles).filter(Boolean);
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

			const newRefreshToken = jwt.sign(
				{ _id: foundUser._id.toString() },
				process.env.REFRESH_TOKEN_SECRET,
				{ expiresIn: "1d" }
			);

			// Saving refreshToken with current user
			foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
			const result = await foundUser.save();
			// console.log(result);

			// Creates Secure Cookie with refresh token
			res.cookie("jwt", newRefreshToken, {
				httpOnly: true,
				secure: true,
				sameSite: "None",
				maxAge: 24 * 60 * 60 * 1000,
			});

			res.json({ accessToken });
		}
	);
};

module.exports = { handleRefreshToken };
