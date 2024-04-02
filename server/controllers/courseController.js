const Course = require("../models/CourseModel");
const Category = require("../models/CategoryModel");
const User = require("../models/userModel");
const StripeCustomer = require("../models/StripeCustomerModel");
const Classroom = require("../models/ClassroomModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

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
			return res
				.status(403)
				.json({ message: "User is already enrolled in this course" });
		}

		const line_items = [
			{
				price_data: {
					currency: "USD",
					product_data: {
						name: course.title,
					},
					unit_amount: Math.round(course.price * 100),
				},
				quantity: 1,
			},
		];

		let stripeCustomer = await StripeCustomer.findOne({ userId });
		if (!stripeCustomer) {
			const customer = await stripe.customers.create({
				email: user.email,
			});
			stripeCustomer = await StripeCustomer.create({
				userId,
				stripeCustomerId: customer.id,
			});
		}

		// Create checkout session
		const session = await stripe.checkout.sessions.create({
			customer: stripeCustomer.stripeCustomerId,
			line_items,
			mode: "payment",
			success_url: `http://localhost:5173/study/${courseId}?success=1`,
			cancel_url: `http://localhost:5173/courses/${courseId}/info?canceled=1`,
			metadata: {
				courseId,
				userId,
			},
		});

		// console.log(session)

		// res.json({ url: session.url });
		res.json({ url: session.url });

		// // Mark the course as purchased for the user
		// course.purchasedBy.push({ user: userId, amount: course.price });
		// await course.save();

		// // Add the course to the enrolledCourses array in the user model
		// user.enrolledCourses.push(courseId);
		// await user.save();

		// res
		// 	.status(200)
		// 	.json({ message: "Course purchased and enrolled successfully" });
	} catch (error) {
		console.error("[PURCHASE_COURSE]", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const handleStripeWebhook = async (req, res, next) => {
	try {
		// console.log(req)
		const { body, headers } = req;
		const signature = headers["stripe-signature"];
		//   console.log('body', body)
		//   console.log('headers', headers)
		//   console.log('signature', signature)

		let event;
		try {
			event = stripe.webhooks.constructEvent(
				body,
				signature,
				process.env.STRIPE_WEBHOOK_SECRET
			);
			// console.log(event)
		} catch (error) {
			// console.log('error', error)
			return res.status(400).send(`Webhook Error: ${error.message}`);
		}

		const session = event.data.object;
		const userId = session?.metadata?.userId;
		const courseId = session?.metadata?.courseId;
		//   console.log(session)
		//   console.log(userId)
		//   console.log(courseId)

		const course = await Course.findById(courseId);
		const courseClassroom = await Classroom.findOne({course: courseId})

		const user = await User.findById(userId);

		if (event.type === "checkout.session.completed") {
			if (!userId || !courseId) {
				return res.status(400).send("Webhook Error: Missing metadata");
			}
			course.purchasedBy.push({ user: userId, amount: course.price });
			await course.save();

			courseClassroom.students.push(userId)
			await courseClassroom.save()


			// Add the course to the enrolledCourses array in the user model
			user.enrolledCourses.push(courseId);
			await user.save();

			// await Purchase.create({ courseId, userId });
		} else {
			return res
				.status(200)
				.send(`Webhook Error: Unhandled event type ${event.type}`);
		}

		res.status(200).send();
	} catch (error) {
		console.error("[HANDLE_STRIPE_WEBHOOK]", error);
		res.status(500).send("Internal server error");
	}
};

const getEnrolledCoursesWithProgress = async (req, res) => {
	try {
		const userId = req.userId; // Assuming you have user information stored in req.user after authentication

		// Find the user by their ID and populate the enrolledCourses field
		const user = await User.findById(userId).populate({
			path: "enrolledCourses",
			populate: {
				path: "tutor",
				select: "name avatar", // Populate tutor field with name and avatar
			},
		});

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Filter and process enrolled courses
		const enrolledCoursesWithProgress = user.enrolledCourses
			.map((course) => {
				// Check if the course is published
				if (!course.isPublished) {
					return null;
				}

				// Extract published chapter IDs
				const publishedChapterIds = course.chapters
					.filter((chapter) => chapter.isPublished)
					.map((chapter) => chapter._id);

				// Count completed chapters for the user
				const validCompletedChapters = course.chapters.reduce(
					(count, chapter) => {
						const userProgress = chapter.userProgress.find(
							(progress) =>
								progress.userId.toString() === userId && progress.isCompleted
						);
						if (userProgress) {
							return count + 1;
						}
						return count;
					},
					0
				);

				// Calculate progress percentage
				const progressPercentage =
					publishedChapterIds.length > 0
						? (validCompletedChapters / publishedChapterIds.length) * 100
						: 0;

				// Return course details with progress
				return {
					...course.toObject(),
					chapters: course.chapters
						.filter((chapter) => chapter.isPublished)
						.map((chapter) => {
							const userProgress = chapter.userProgress.find(
								(progress) => progress.userId.toString() === userId
							);
							return {
								...chapter.toObject(),
								userProgress: userProgress ? userProgress.toObject() : null,
							};
						}),
					progress: progressPercentage,
				};
			})
			.filter((course) => course !== null); // Filter out courses that are not published

		// Return the enrolled courses with progress
		res.status(200).json({ enrolledCourses: enrolledCoursesWithProgress });
	} catch (error) {
		console.error("[GET_ENROLLED_COURSES_WITH_PROGRESS]", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

module.exports = {
	browseAllCourses,
	purchaseCourse,
	getEnrolledCoursesWithProgress,
	handleStripeWebhook,
};
