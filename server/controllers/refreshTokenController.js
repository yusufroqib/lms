const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const { connect } = require("getstream");
// const StreamChat = require("stream-chat").StreamChat;
const { StreamClient } = require("@stream-io/node-sdk");

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;

const handleRefreshToken = async (req, res) => {
	try {
	  const cookies = req.cookies;
	  if (!cookies?.jwt) return res.sendStatus(401);
	  const refreshToken = cookies.jwt;
	  res.clearCookie("jwt");
  
	  const foundUser = await User.findOne({ refreshToken }).exec();
  
	  if (!foundUser) {
		try {
		  jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET,
			async (err, decoded) => {
			  if (err) return res.sendStatus(403);
			  console.log("No user found, hacked user");
  
			  const hackedUser = await User.findOne({
				_id: decoded._id,
			  }).exec();
			  hackedUser.refreshToken = [];
			  await hackedUser.save();
			}
		  );
		} catch (verifyError) {
		  console.error("Error verifying token:", verifyError);
		}
		console.log("No user found");
		return res.sendStatus(403);
	  }
  
	  const newRefreshTokenArray = foundUser.refreshToken.filter(
		(rt) => rt !== refreshToken
	  );
  
	  try {
		jwt.verify(
		  refreshToken,
		  process.env.REFRESH_TOKEN_SECRET,
		  async (err, decoded) => {
			if (err) {
			  foundUser.refreshToken = [...newRefreshTokenArray];
			  await foundUser.save();
			  return res.sendStatus(403);
			}
			if (foundUser._id.toString() !== decoded._id) {
			  return res.sendStatus(403);
			}
  
			const streamClient = new StreamClient(api_key, api_secret);
			const streamToken = streamClient.createToken(foundUser._id.toString());
  
			const roles = Object.values(foundUser.roles).filter(Boolean);
			const accessToken = jwt.sign(
			  {
				UserInfo: {
				  _id: foundUser._id,
				  username: foundUser.username,
				  fullName: foundUser.name,
				  connectedWallets: foundUser.connectedWallets,
				  paymentWallet: foundUser.paymentWallet,
				  image: foundUser.avatar,
				  roles: roles,
				  streamToken: streamToken,
				  stripeOnboardingComplete: foundUser.stripeOnboardingComplete,
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
  
			foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
			await foundUser.save();
  
			res.cookie("jwt", newRefreshToken, {
			  httpOnly: true,
			  secure: true,
			  sameSite: "None",
			  maxAge: 24 * 60 * 60 * 1000,
			});
			res.json({ accessToken });
		  }
		);
	  } catch (jwtError) {
		console.error("Error verifying or signing JWT:", jwtError);
		return res.sendStatus(500);
	  }
	} catch (error) {
	  console.error("Error in handleRefreshToken:", error);
	  return res.sendStatus(500);
	}
  };

module.exports = { handleRefreshToken };
