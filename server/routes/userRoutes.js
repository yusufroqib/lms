const express = require("express");
const { loggedInUser } = require("../controllers/userController");
const verifyJWT = require("../middleware/verifyJWT");
const router = express.Router();

router.get("/me", verifyJWT, loggedInUser);


module.exports = router;
