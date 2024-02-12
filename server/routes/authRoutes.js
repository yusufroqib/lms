const express = require("express");
const {signUp, activateUser} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signUp);
router.post("/activate-account", activateUser);

module.exports = router;
