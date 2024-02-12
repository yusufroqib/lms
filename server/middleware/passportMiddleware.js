const passport = require("passport");

const authenticateGoogle = passport.authenticate('google', { scope: ['profile', 'email'] });


const googleAuthCallback = passport.authenticate("google", {
	successRedirect: "http://localhost:5173",
	failureRedirect: "http://localhost:3000/auth" // Redirect on authentication failure
});


module.exports = {authenticateGoogle, googleAuthCallback };
