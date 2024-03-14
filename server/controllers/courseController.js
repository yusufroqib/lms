const Course = require("../models/CourseModel");
const Category = require("../models/CategoryModel");

const browseAllCourses = async (req, res) => {
	try {
		let query = { isPublished: true };
		const { title, categoryId } = req.query;

		if (title) {
			query.title = { $regex: title, $options: "i" }; // Case-insensitive title search
		}
		if (categoryId) {
			query.categoryId = categoryId;
		}

		const courses = await Course.find(query)
			.populate("categoryId", "name") // Populate category field with name
			.populate({
				path: "chapters",
				match: { isPublished: true }, // Filter published chapters
			})
			.populate({
				path: "tutor",
				select: "name avatar", // Populate tutor field with name and avatar
			})
			.sort({ createdAt: "desc" });

		const coursesWithDetails = await Promise.all(
			courses.map(async (course) => {
				// Filter populated chapters to remove those without isPublished property
				course.chapters = course.chapters.filter(
					(chapter) => chapter.isPublished
				);

				// Calculate average rating for reviews
				const totalReviews = course.reviews.length;
				const totalRating = course.reviews.reduce(
					(acc, review) => acc + review.rating,
					0
				);
				const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

				// Map each review to include user, rating, and comment
				const reviewsWithDetails = course.reviews.map((review) => ({
					user: review.user.username,
					rating: review.rating,
					comment: review.comment,
				}));

				return {
					...course.toObject(),
					averageRating: averageRating.toFixed(2), // Round to 2 decimal places
					reviews: reviewsWithDetails,
				};
			})
		);

		res.status(200).json(coursesWithDetails);
	} catch (error) {
		console.error("[GET_COURSES]", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

module.exports = { browseAllCourses };
