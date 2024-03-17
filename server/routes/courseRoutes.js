
const express = require("express");
const verifyJWT = require("../middleware/verifyJWT");
const { browseAllCourses, purchaseCourse, getCourseWithProgress } = require("../controllers/courseController");


const router = express.Router();
router.get("/search", verifyJWT, browseAllCourses);
router.get("/student-course/:courseId", verifyJWT, getCourseWithProgress);
router.post("/:courseId/purchase", verifyJWT, purchaseCourse);

module.exports = router;
