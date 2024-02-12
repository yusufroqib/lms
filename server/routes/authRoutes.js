const express = require("express");
const {signUp, activateUser, login, logout} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signUp);
router.post("/activate-account", activateUser);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
