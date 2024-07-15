const {
	createTitle,
	getAllTutorCourses,
	updateCourse,
	getCategories,
	updateCourseCategory,
	createChapter,
	reorderChapters,
    updateChapter,
    addAttachmentToChapter,
    deleteAttachmentFromChapter,
    deleteChapter,
    toggleChapterPublicationStatus,
    toggleCoursePublicationStatus,
    deleteCourse,
	getTutorStats,
	getTutorTopCourses,
	getTutorEarnings
} = require("../controllers/tutorController");
const express = require("express");
const verifyJWT = require("../middleware/verifyJWT");
const verifyRoles = require("../middleware/verifyRoles");
const { Admin, Tutor, Student } = require("../config/roles_list");

const router = express.Router();
router.get("/course-categories", verifyJWT, getCategories);
router.post("/create-title", verifyJWT, verifyRoles(Admin, Tutor), createTitle);
router.get(
	"/all-courses",
	verifyJWT,
	verifyRoles(Admin, Tutor),
	getAllTutorCourses
);
router.get(
	"/stats",
	verifyJWT,
	verifyRoles(Admin, Tutor),
	getTutorStats
);
router.get(
	"/top-courses",
	verifyJWT,
	verifyRoles(Admin, Tutor),
	getTutorTopCourses
);
router.get(
	"/earnings",
	verifyJWT,
	verifyRoles(Admin, Tutor),
	getTutorEarnings
);
router.put(
	"/edit-course/:id",
	verifyJWT,
	verifyRoles(Admin, Tutor),
	updateCourse
);
router.delete(
	"/edit-course/:id",
	verifyJWT,
	verifyRoles(Admin, Tutor),
	deleteCourse
);
router.put(
	"/edit-course/:id/category",
	verifyJWT,
	verifyRoles(Admin, Tutor),
	updateCourseCategory
);
router.put(
	"/edit-course/:id/toggle-publish",
	verifyJWT,
	verifyRoles(Admin, Tutor),
	toggleCoursePublicationStatus
);
router.put(
	"/edit-course/:id/create-chapter",
	verifyJWT,
	verifyRoles(Admin, Tutor),
	createChapter
);
router.put(
	"/edit-course/:id/reorder-chapters",
	verifyJWT,
	verifyRoles(Admin, Tutor),
	reorderChapters
);

router.put(
    "/edit-course/:courseId/chapter/:chapterId",
    verifyJWT,
    verifyRoles(Admin, Tutor),
    updateChapter
);

router.delete(
    "/edit-course/:courseId/chapter/:chapterId",
    verifyJWT,
    verifyRoles(Admin, Tutor),
    deleteChapter
);

router.put(
    "/edit-course/:courseId/chapter/:chapterId/toggle-publish",
    verifyJWT,
    verifyRoles(Admin, Tutor),
    toggleChapterPublicationStatus
);

router.put(
    "/edit-course/:courseId/chapter/:chapterId/attachment",
    verifyJWT,
    verifyRoles(Admin, Tutor),
    addAttachmentToChapter
);
router.delete(
    "/edit-course/:courseId/chapter/:chapterId/attachment",
    verifyJWT,
    verifyRoles(Admin, Tutor),
    deleteAttachmentFromChapter
);

module.exports = router;
