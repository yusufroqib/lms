const express = require("express");
const {
	generateGoogleAuthCookie,
	signUp,
	activateUser,
	login,
	verifyDeviceOTP,
	logout,
	submitAdditionalInfo,
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

router.get("/google/callback", googleAuthCallback, generateGoogleAuthCookie);
// router.get("/google/success", getCurrentUserInfo);
router.post("/signup", signUp);
router.post("/activate-account", activateUser);
router.post("/additional-info", submitAdditionalInfo);
router.post("/reset-password", passwordReset);
router.post("/reset-password/confirm", confirmPasswordResetOTP);
router.put("/reset-password/finish", passwordResetConfirmed);
router.post("/login", login);
router.post("/verify-device", verifyDeviceOTP);
router.post("/logout", logout);

module.exports = router;
