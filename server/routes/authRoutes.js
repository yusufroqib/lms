const express = require("express");
const {
	signUp,
	activateUser,
	login,
	logout,
	getCurrentUserInfo,
	passwordReset,
	confirmPasswordResetOTP,
	passwordResetConfirmed,
} = require("../controllers/authController");
const {
	authenticateGoogle,
	googleAuthCallback,
} = require("../middleware/passportMiddleware");
const router = express.Router();

router.get("/google", authenticateGoogle);

router.get("/google/callback", googleAuthCallback);
router.get("/google/success", getCurrentUserInfo);
router.post("/signup", signUp);
router.post("/activate-account", activateUser);
router.post("/reset-password", passwordReset);
router.post("/reset-password/confirm", confirmPasswordResetOTP);
router.put("/reset-password/finish", passwordResetConfirmed);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
