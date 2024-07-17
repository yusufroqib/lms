const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { connect } = require("getstream");
const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;

//create new username
const createUsername = async (req, res) => {
	try {
		const { username } = req.body;
		const userId = req.userId;
		const foundUser = await User.findById(userId);
		const existingUsername = await User.findOne({ username }).select(
			"-password"
		);
		if (existingUsername)
			return res.status(400).json({ error: "Username already taken" });
		foundUser.username = username;
		await foundUser.save();
		res.status(200).json({ message: "Username updated successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

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
const becomeTutor = async (req, res) => {
	try {
	  const userId = req.user.id; // Assuming you have authentication middleware that sets req.user
	  const user = await User.findById(userId);
  
	  if (!user) {
		return res.status(404).json({ message: 'User not found' });
	  }
  
	  if (user.roles.Tutor) {
		return res.status(400).json({ message: 'User is already a tutor' });
	  }
  
	  // Update user role to Tutor
	  user.roles.Tutor = 'Tutor';
	  await user.save();
  
	  res.status(200).json({ message: 'User is now a tutor' });
	} catch (error) {
	  console.error('Error in becomeTutor:', error);
	  res.status(500).json({ message: 'Internal server error' });
	}
  };
const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, username, bio, avatar } = req.body;
        // console.log(req.body);

        // Check if the new username already exists (excluding the current user)
        if (username) {
            const existingUser = await User.findOne({
                username,
                _id: { $ne: userId },
            });
            if (existingUser) {
                return res.status(400).json({ message: "Username already exists" });
            }
        }

        // Prepare the update object
        const updateObject = {};
        if (name) updateObject.name = name;
        if (username) updateObject.username = username;
        if (bio) updateObject.bio = bio;
        if (avatar) {
            // If avatar is an array, take the last element (which should be the Firebase URL)
            updateObject.avatar = Array.isArray(avatar) ? avatar[avatar.length - 1] : avatar;
        }

		// console.log(updateObject)

        // Find the user and update their profile
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateObject,
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error("Profile update error:", error);
        if (error.name === "ValidationError") {
            return res
                .status(400)
                .json({ message: "Validation error", error: error.message });
        }
        res
            .status(500)
            .json({ message: "Error updating profile", error: error.message });
    }
};
const changePassword = async (req, res) => {
	try {
		const userId = req.userId;
		const { currentPassword, newPassword } = req.body;

		// Find the user
		const user = await User.findById(userId).select("+password");
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Check if the current password is correct
		const isMatch = await bcrypt.compare(currentPassword, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: "Current password is incorrect" });
		}

		// Hash the new password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(newPassword, salt);

		// Update the user's password
		user.password = hashedPassword;
		await user.save();

		res.json({ message: "Password updated successfully" });
	} catch (error) {
		console.error("Password change error:", error);
		res
			.status(500)
			.json({ message: "Error changing password", error: error.message });
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

module.exports = {
	createUsername,
	loggedInUser,
	videocall,
	becomeTutor,
	updateProfile,
	changePassword,
};
