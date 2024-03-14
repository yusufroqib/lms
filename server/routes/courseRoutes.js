
const express = require("express");
const verifyJWT = require("../middleware/verifyJWT");
const { browseAllCourses } = require("../controllers/courseController");


const router = express.Router();
router.get("/search", verifyJWT, browseAllCourses);

module.exports = router;
