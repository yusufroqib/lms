const express = require("express");
const {createUsername, loggedInUser, videocall } = require("../controllers/userController");
const verifyJWT = require("../middleware/verifyJWT");
const router = express.Router();

router.get("/me", verifyJWT, loggedInUser);
router.put("/username", verifyJWT, createUsername);
router.get("/videocall",  videocall);


module.exports = router;
