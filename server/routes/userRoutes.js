const express = require("express");
const { loggedInUser, videocall } = require("../controllers/userController");
const verifyJWT = require("../middleware/verifyJWT");
const router = express.Router();

router.get("/me", verifyJWT, loggedInUser);
router.get("/videocall",  videocall);


module.exports = router;
