const express = require("express");
// const passport = require("passport");
const {signUp, activateUser, login, logout, successRedirect, getCurrentUserInfo} = require("../controllers/authController");
const {authenticateGoogle, googleAuthCallback } = require('../middleware/passportMiddleware');
// const verifyJWT = require("../middleware/verifyJWT");
const router = express.Router();

router.get(
	"/google",
	authenticateGoogle
);

router.get("/google/callback", googleAuthCallback);
router.get("/google/success", getCurrentUserInfo);
router.post("/signup", signUp);
router.post("/activate-account", activateUser);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
