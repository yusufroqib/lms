const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const { connect } = require("getstream");

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;

const loggedInUser = async (req, res) => {
	try {
		const username = req.user;
		const user = await User.findOne({ username });
		user.password = "";
		user.refreshToken = "";
		res.status(200).json({ user });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const videocall = async (req, res) => {
	try {
		const { api_key, user_id } = req.query;
		const serverClient = connect(api_key, api_secret, app_id);
		const streamToken = serverClient.createUserToken(
			// JSON.stringify(foundUser._id)
			user_id
		);
		res.status(200).json({ token: streamToken });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

module.exports = { loggedInUser, videocall };
