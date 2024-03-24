const express = require("express");
const verifyJWT = require("../middleware/verifyJWT");
const {
	getPosts,
	createPost,
	getHotPosts,
	getReplies,
	getTopPopularTags,
	getPostById,
	getUserById,
	createReply,
	viewPost,
} = require("../controllers/communityController");
// const { browseAllCourses, purchaseCourse, getEnrolledCoursesWithProgress } = require("../controllers/courseController");

const router = express.Router();
router.get("/posts/search", verifyJWT, getPosts);
router.get("/posts/hot", verifyJWT, getHotPosts);
router.get("/posts/:postId", verifyJWT, getPostById);
router.get("/replies/search", verifyJWT, getReplies);
router.get("/users/:userId", verifyJWT, getUserById);
router.get("/tags/popular", verifyJWT, getTopPopularTags);
router.post("/posts/create-post", verifyJWT, createPost);
router.post("/posts/create-reply", verifyJWT, createReply);
router.post("/posts/view", verifyJWT, viewPost);
// router.get("/all-enrolled", verifyJWT, getEnrolledCoursesWithProgress);
// router.post("/:courseId/purchase", verifyJWT, purchaseCourse);

module.exports = router;
