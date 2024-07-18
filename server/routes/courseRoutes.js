const express = require("express");
const verifyJWT = require("../middleware/verifyJWT");
const {
	browseAllCourses,
	purchaseCourse,
	getEnrolledCoursesWithProgress,
	updateChapterProgress,
	recordStudyTime,
	getStudyTimeRecord,
	getReviews,
	addReview,
} = require("../controllers/courseController");

const router = express.Router();
router.get("/search", verifyJWT, browseAllCourses);
router.get("/all-enrolled", verifyJWT, getEnrolledCoursesWithProgress);
router.get("/:courseId/reviews", verifyJWT, getReviews);
router.post("/:courseId/reviews", verifyJWT, addReview);
router.post("/:courseId/purchase", verifyJWT, purchaseCourse);
router.get("/study-time", verifyJWT, getStudyTimeRecord);
router.post("/study-time", verifyJWT, recordStudyTime);
router.put(
	"/:courseId/chapter/:chapterId/progress",
	verifyJWT,
	updateChapterProgress
);

module.exports = router;
