const { createTitle, getAllTutorCourses, updateCourse, getCategories } = require("../controllers/courseController");
const express = require("express");
const verifyJWT = require("../middleware/verifyJWT");
const verifyRoles = require("../middleware/verifyRoles");
const { Admin, Tutor, Student } = require("../config/roles_list");

const router = express.Router();
router.get("/course-categories", verifyJWT, getCategories)
router.post("/create-title", verifyJWT, verifyRoles(Admin, Tutor), createTitle);
router.get("/all-courses", verifyJWT, verifyRoles(Admin, Tutor), getAllTutorCourses);
router.put("/edit-course/:id", verifyJWT, verifyRoles(Admin, Tutor), updateCourse);

module.exports = router;