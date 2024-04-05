
const express = require("express");
const verifyJWT = require("../middleware/verifyJWT");
const { browseAllCourses, purchaseCourse, getEnrolledCoursesWithProgress, updateChapterProgress } = require("../controllers/courseController");


const router = express.Router();
router.get("/search", verifyJWT, browseAllCourses);
router.get("/all-enrolled", verifyJWT, getEnrolledCoursesWithProgress);
router.post("/:courseId/purchase", verifyJWT, purchaseCourse);
router.put('/:courseId/chapter/:chapterId/progress',verifyJWT, updateChapterProgress);

module.exports = router;
