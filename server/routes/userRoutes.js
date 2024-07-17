const express = require("express");
const multer = require('multer');
const upload = multer();
const {createUsername, loggedInUser, videocall, becomeTutor, updateProfile, changePassword } = require("../controllers/userController");
const verifyJWT = require("../middleware/verifyJWT");
const router = express.Router();

router.get("/me", verifyJWT, loggedInUser);
router.put("/username", verifyJWT, createUsername);
router.post("/become-tutor", verifyJWT, becomeTutor);
router.patch("/profile", verifyJWT, upload.none(), updateProfile);
router.post("/change-password", verifyJWT, changePassword);
router.get("/videocall",  videocall);


module.exports = router;
