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
	getUserInfo,
    getUserPosts,
	createReply,
	viewPost,
	upvotePost,
	upvoteReply,
	downvotePost,
	downvoteReply,
	toggleSavePost,
	getSavedPosts,
	getAllTags,
	getPostByTagId,
	editPost,
	deletePost,
	getAllUsers,
	getTopInteractedTags,
    getUserReplies
} = require("../controllers/communityController");
// const { browseAllCourses, purchaseCourse, getEnrolledCoursesWithProgress } = require("../controllers/courseController");

const router = express.Router();
router.get("/posts/search", verifyJWT, getPosts);
router.get("/posts/saved-posts", verifyJWT, getSavedPosts);
router.get("/tags/all-tags", verifyJWT, getAllTags);
router.get("/users/all-users", verifyJWT, getAllUsers);
router.get(
	"/users/top-interacted-tags/:userId",
	verifyJWT,
	getTopInteractedTags
);
router.get("/tags/get/:tagId", verifyJWT, getPostByTagId);
router.get("/posts/hot", verifyJWT, getHotPosts);
router.get("/posts/:postId", verifyJWT, getPostById);
router.get("/replies/search", verifyJWT, getReplies);
router.get("/users/:userId", verifyJWT, getUserById);
router.get("/users/profile/:user", verifyJWT, getUserInfo);
router.get("/user-posts/:userId", verifyJWT, getUserPosts);
router.get("/user-replies/:userId", verifyJWT, getUserReplies);
router.get("/tags/popular", verifyJWT, getTopPopularTags);
router.post("/posts/create-post", verifyJWT, createPost);
router.put("/posts/edit-post", verifyJWT, editPost);
router.post("/posts/create-reply", verifyJWT, createReply);
router.post("/posts/view", verifyJWT, viewPost);
router.post("/posts/upvote", verifyJWT, upvotePost);
router.post("/posts/downvote", verifyJWT, downvotePost);
router.post("/replies/upvote", verifyJWT, upvoteReply);
router.post("/replies/downvote", verifyJWT, downvoteReply);
router.post("/posts/toggle-save", verifyJWT, toggleSavePost);
router.delete("/posts/:postId", verifyJWT, deletePost);
// router.get("/all-enrolled", verifyJWT, getEnrolledCoursesWithProgress);
// router.post("/:courseId/purchase", verifyJWT, purchaseCourse);

module.exports = router;
