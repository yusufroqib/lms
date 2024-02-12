const express = require("express");
const {signUp, activateUser, login} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signUp);
router.post("/activate-account", activateUser);
router.post("/login", login);

module.exports = router;
