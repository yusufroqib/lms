const Course = require("../models/CourseModel");
const Category = require("../models/CategoryModel");
const User = require("../models/userModel");


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

const purchaseCourse = async (req, res) => {
	try {
	  const userId = req.userId; // Assuming you have user information stored in req.user after authentication
	  const courseId = req.params.courseId;
  
	  // Find the course by its ID
	  const course = await Course.findById(courseId);
	  if (!course) {
		return res.status(404).json({ message: "Course not found" });
	  }
  
	  // Ensure the course is published
	  if (!course.isPublished) {
		return res.status(403).json({ message: "Course is not published" });
	  }
  
	  // Check if the user is already enrolled in the course
	  const user = await User.findById(userId);
	  if (user.enrolledCourses.includes(courseId)) {
		return res.status(403).json({ message: "User is already enrolled in this course" });
	  }
  
	  // Mark the course as purchased for the user
	  course.purchasedBy.push({ user: userId, amount: course.price });
	  await course.save();
  
	  // Add the course to the enrolledCourses array in the user model
	  user.enrolledCourses.push(courseId);
	  await user.save();
  
	  res.status(200).json({ message: "Course purchased and enrolled successfully" });
	} catch (error) {
	  console.error("[PURCHASE_COURSE]", error);
	  res.status(500).json({ message: "Internal server error" });
	}
  };
  

  const getCourseWithProgress = async (req, res) => {
	try {
	  const courseId = req.params.courseId;
	  const userId = req.userId; // Assuming you have user information stored in req.user after authentication
  
	  // Find the course by its ID
	  const course = await Course.findById(courseId);
  
	  if (!course) {
		return res.status(404).json({ message: "Course not found" });
	  }
  
	  // Check if the course is published
	  if (!course.isPublished) {
		return res.status(403).json({ message: "Course is not published" });
	  }
  
	  // Check if the user has purchased the course
	  const hasPurchased = course.purchasedBy.some(purchase => purchase.user.equals(userId));
	  if (!hasPurchased) {
		return res.status(403).json({ message: "User has not purchased this course" });
	  }
  
	  // Filter and populate only published chapters
	  const publishedChapters = course.chapters.filter(chapter => chapter.isPublished);
	  await course.populate('chapters.userProgress.userId').execPopulate();
  
	  res.status(200).json({
		course: {
		  _id: course._id,
		  title: course.title,
		  description: course.description,
		  tutor: course.tutor,
		  isPublished: course.isPublished,
		  price: course.price,
		  courseImage: course.courseImage,
		  previewVideoUrl: course.previewVideoUrl,
		  categoryId: course.categoryId,
		  reviews: course.reviews,
		  ratings: course.ratings,
		  purchasedBy: course.purchasedBy,
		  chapters: publishedChapters.map(chapter => ({
			_id: chapter._id,
			videoUrl: chapter.videoUrl,
			title: chapter.title,
			position: chapter.position,
			description: chapter.description,
			isFree: chapter.isFree,
			attachments: chapter.attachments,
			userProgress: chapter.userProgress.find(progress => progress.userId.equals(userId)),
			questions: chapter.questions,
		  })),
		},
	  });
	} catch (error) {
	  console.error("[GET_COURSE_WITH_PROGRESS]", error);
	  res.status(500).json({ message: "Internal server error" });
	}
  };
  

module.exports = { browseAllCourses, purchaseCourse, getCourseWithProgress };
