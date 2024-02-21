const User = require("../models/userModel");
const bcrypt = require("bcrypt");


const loggedInUser = async (req, res) => {
    try {
        const username = req.user
        const user = await User.findOne({ username })
        user.password= ''
        user.refreshToken= ''
        res.status(200).json({user})
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = { loggedInUser }