
const express = require("express");
const verifyJWT = require("../middleware/verifyJWT");
const {getPosts, createPost} = require("../controllers/communityController"); 
// const { browseAllCourses, purchaseCourse, getEnrolledCoursesWithProgress } = require("../controllers/courseController");


const router = express.Router();
router.get("/posts/search", verifyJWT, getPosts);
router.post("/posts/create-post", verifyJWT, createPost);
// router.get("/all-enrolled", verifyJWT, getEnrolledCoursesWithProgress);
// router.post("/:courseId/purchase", verifyJWT, purchaseCourse);

module.exports = router;
