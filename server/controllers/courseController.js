const Course = require("../models/CourseModel");
const Category = require("../models/CategoryModel");
const User = require("../models/UserModel");
const StripeCustomer = require("../models/StripeCustomerModel");
const Classroom = require("../models/ClassroomModel");
const { createStreamChatClient } = require("../utils/createStreamChatClient");
const StudyTime = require("../models/StudyTimeModel");
const { default: mongoose } = require("mongoose");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const clientUrl = process.env.CLIENT_URL;

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
		const userId = req.userId;
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
		if (
			user.enrolledCourses.some(
				(enrollment) => enrollment.course.toString() === courseId
			)
		) {
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
			success_url: `${clientUrl}/study/${courseId}?success=1`,
			cancel_url: `${clientUrl}/courses/${courseId}/info?cancelled=1`,
			metadata: {
				courseId,
				userId,
			},
		});

		res.json({ url: session.url });
	} catch (error) {
		console.error("[PURCHASE_COURSE]", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const handleStripeWebhook = async (req, res) => {
	try {
		const { body, headers } = req;
		const signature = headers["stripe-signature"];

		let event;
		try {
			event = stripe.webhooks.constructEvent(
				body,
				signature,
				process.env.STRIPE_WEBHOOK_SECRET
			);
		} catch (error) {
			console.log(error);
			return res.status(400).send(`Webhook Error: ${error.message}`);
		}

		const session = event.data.object;
		const userId = session?.metadata?.userId;
		const courseId = session?.metadata?.courseId;

		const courseClassroom = await Classroom.findOne({ course: courseId });
		const client = createStreamChatClient();

		const user = await User.findById(userId);

		if (event.type === "checkout.session.completed") {
			const course = await Course.findById(courseId);
			const tutor = await User.findById(course.tutor);

			if (!tutor.stripeAccountId) {
				console.error("Tutor has no connected Stripe account");
				return res.status(400).send("Tutor has no connected Stripe account");
			}

			const totalAmount = session.amount_total;
			const platformFee = Math.round(totalAmount * 0.1); // 10% platform fee
			const tutorAmount = totalAmount - platformFee;

			// Transfer funds to tutor's Stripe account
			try {
				const transfer = await stripe.transfers.create({
					amount: tutorAmount,
					currency: session.currency,
					destination: tutor.stripeAccountId,
					transfer_group: session.id,
				});

				// Record the transaction for the tutor (payout)
				tutor.transactions.push({
					type: "balanceTransfers",
					amount: tutorAmount,
					courseId: course._id,
					stripeTransactionId: transfer.id,
					status: "success",
				});
				await tutor.save();
			} catch (error) {
				console.error("Failed to transfer funds to tutor:", error);
				return res.status(500).send("Failed to transfer funds to tutor");
			}

			// Record the transaction for the student (purchase)
			user.transactions.push({
				type: "purchase",
				amount: totalAmount,
				courseId: course._id,
				stripeTransactionId: session.id,
				status: "completed",
			});
			await user.save();

			// Update course and user as before
			course.purchasedBy.push({ user: userId, amount: totalAmount });
			await course.save();

			courseClassroom.students.push(userId);
			await courseClassroom.save();

			// Add the course to the enrolledCourses array in the user model
			user.enrolledCourses.push({
				course: courseId,
				lastStudiedAt: new Date(),
			});
			await user.save();

			const channel = client.channel("messaging", courseId);
			await channel.addMembers([
				{ user_id: userId, channel_role: "channel_member" },
			]);
		} else if (
			event.type === "payout.paid" ||
			event.type === "payout.failed" ||
			event.type === "payout.pending" ||
			event.type === "payout.updated"
		) {
			const payout = event.data.object;
			const status = payout.status;
			const payoutId = payout.id;

			// console.log("payout webhook", payout);

			// Find the user with the transaction that has the payout ID
			const user = await User.findOne({
				"transactions.stripeTransactionId": payoutId,
			});

			// console.log("User found:", user ? user._id : "No user found");

			if (user) {
				// Find the existing transaction
				const existingTransaction = user.transactions.find(
					(transaction) => transaction.stripeTransactionId === payoutId
				);

				// console.log("Existing transaction:", existingTransaction);

				if (existingTransaction) {
					// Update the existing transaction
					existingTransaction.status = status;
				} else {
					console.log("No existing transaction found, this shouldn't happen.");
				}

				await user.save();
			} else {
				console.log(`No user found with payout ID: ${payoutId}`);
			}
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
		const userId = req.userId;

		// Find the user by their ID and populate the enrolledCourses field
		const user = await User.findById(userId).populate({
			path: "enrolledCourses.course",
			populate: {
				path: "tutor",
				select: "name avatar",
			},
		});

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Filter and process enrolled courses
		const enrolledCoursesWithProgress = user.enrolledCourses
			.map((enrollment) => {
				const course = enrollment.course;

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
					lastStudiedAt: enrollment.lastStudiedAt,
				};
			})
			.filter((course) => course !== null);

		// Sort the courses by lastStudiedAt
		enrolledCoursesWithProgress.sort((a, b) => {
			if (!a.lastStudiedAt) return 1;
			if (!b.lastStudiedAt) return -1;
			return new Date(b.lastStudiedAt) - new Date(a.lastStudiedAt);
		});

		// Return the enrolled courses with progress
		res.status(200).json({ enrolledCourses: enrolledCoursesWithProgress });
	} catch (error) {
		console.error("[GET_ENROLLED_COURSES_WITH_PROGRESS]", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const updateChapterProgress = async (req, res) => {
	try {
		const { userId } = req;
		const { courseId, chapterId } = req.params;

		if (!userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		// Find the course by courseId
		const course = await Course.findById(courseId);
		if (!course) {
			return res.status(404).json({ message: "Course not found" });
		}

		// Find the chapter within the course by chapterId
		const chapter = course.chapters.find((chapter) => chapter._id == chapterId);
		if (!chapter) {
			return res.status(404).json({ message: "Chapter not found" });
		}

		// Update user progress for the chapter
		const userProgressIndex = chapter.userProgress.findIndex(
			(progress) => progress.userId == userId
		);
		if (userProgressIndex === -1) {
			// If user progress for the chapter doesn't exist, create a new entry
			chapter.userProgress.push({ userId, isCompleted: true });
		} else {
			// If user progress for the chapter exists, update the existing entry
			chapter.userProgress[userProgressIndex].isCompleted = true;
		}

		// Update lastStudiedAt for the course in user's enrolledCourses
		await User.findOneAndUpdate(
			{ _id: userId, "enrolledCourses.course": courseId },
			{ $set: { "enrolledCourses.$.lastStudiedAt": new Date() } }
		);

		// Save the updated course
		await course.save();

		return res.json({ message: "Chapter progress updated successfully" });
	} catch (error) {
		console.error("Error updating chapter progress:", error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

const recordStudyTime = async (req, res) => {
	try {
		const { courseId: course, duration } = req.body;
		const userId = req.userId;
		const foundCourse = await Course.findById(course);
		// console.log(foundCourse)

		const now = new Date();
		if (foundCourse?.tutor?.toString() === userId) {
			return res
				.status(204)
				.json({
					message: "Tutor can't record study time for their own course",
				});
		}

		// Get the start and end of the current day in UTC
		const startOfDay = new Date(
			Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
		);
		const endOfDay = new Date(
			Date.UTC(
				now.getUTCFullYear(),
				now.getUTCMonth(),
				now.getUTCDate(),
				23,
				59,
				59,
				999
			)
		);

		// Update study time
		let studyTime = await StudyTime.findOneAndUpdate(
			{
				user: req.userId,
				course,
				date: {
					$gte: startOfDay,
					$lt: endOfDay,
				},
			},
			{
				$inc: { duration: duration },
				$setOnInsert: { date: now },
			},
			{ new: true, upsert: true }
		);

		// Update lastStudiedAt for the enrolled course
		await User.findOneAndUpdate(
			{
				_id: req.userId,
				"enrolledCourses.course": course,
			},
			{
				$set: { "enrolledCourses.$.lastStudiedAt": now },
			}
		);

		res.json(studyTime);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
};

const getStudyTimeRecord = async (req, res) => {
	try {
		const { startDate, endDate, groupBy } = req.query;

		const query = {
			user: new mongoose.Types.ObjectId(req.userId),
			date: {
				$gte: new Date(startDate),
				$lte: new Date(endDate),
			},
		};

		let groupByFormat;
		if (groupBy === "day") {
			groupByFormat = { $dateToString: { format: "%Y-%m-%d", date: "$date" } };
		} else if (groupBy === "week") {
			groupByFormat = {
				$dateToString: {
					format: "%Y-W%V",
					date: {
						$dateFromParts: {
							isoWeekYear: { $isoWeekYear: "$date" },
							isoWeek: { $isoWeek: "$date" },
						},
					},
				},
			};
		} else if (groupBy === "month") {
			groupByFormat = { $dateToString: { format: "%Y-%m", date: "$date" } };
		} else {
			groupByFormat = { $dateToString: { format: "%Y-%m-%d", date: "$date" } };
		}

		const studySummary = await StudyTime.aggregate([
			{ $match: query },
			{
				$group: {
					_id: {
						date: groupByFormat,
						course: "$course",
					},
					totalDuration: { $sum: "$duration" },
				},
			},
			{
				$lookup: {
					from: "courses", // Assuming your course collection is named "courses"
					localField: "_id.course",
					foreignField: "_id",
					as: "courseDetails",
				},
			},
			{
				$unwind: "$courseDetails",
			},
			{
				$group: {
					_id: "$_id.date",
					courses: {
						$push: {
							course: { $toString: "$_id.course" },
							courseTitle: "$courseDetails.title",
							duration: "$totalDuration",
						},
					},
					totalDuration: { $sum: "$totalDuration" },
				},
			},
			{ $sort: { _id: 1 } },
		]);

		res.status(200).json(studySummary);
	} catch (err) {
		console.error("Error in getStudyTimeRecord:", err);
		if (err instanceof mongoose.Error) {
			console.error("Mongoose error:", err.message);
		}
		res.status(500).send("Server Error: " + err.message);
	}
};

const getReviews = async (req, res) => {
	try {
		const { courseId } = req.params;
		const page = parseInt(req.query.page) || 1;
		const limit = 10; // Number of reviews per page

		const course = await Course.findById(courseId)
			.populate({
				path: "reviews.user",
				select: "name avatar",
			})
			.select("reviews")
			.slice("reviews", [(page - 1) * limit, limit]);

		if (!course) {
			return res.status(404).json({ message: "Course not found" });
		}

		const totalReviews = course.reviews.length;
		const hasMore = totalReviews > page * limit;

		res.json({
			reviews: course.reviews,
			hasMore,
		});
	} catch (error) {
		console.error("Error fetching reviews:", error);
		res.status(500).json({ message: "Server error" });
	}
};

const addReview = async (req, res) => {
	try {
		const { courseId } = req.params;
		const { rating, comment } = req.body;
		const userId = req.userId;

		const course = await Course.findById(courseId);
		if (!course) {
			return res.status(404).json({ message: "Course not found" });
		}

		// Check if user has purchased the course
		const hasPurchased = course.purchasedBy.some(
			(purchase) => purchase.user.toString() === userId.toString()
		);
		if (!hasPurchased) {
			return res
				.status(403)
				.json({ message: "You must purchase the course to leave a review" });
		}

		// Check if user has already reviewed
		const existingReview = course.reviews.find(
			(review) => review.user.toString() === userId.toString()
		);
		if (existingReview) {
			return res
				.status(400)
				.json({ message: "You have already reviewed this course" });
		}

		course.reviews.push({ user: userId, rating, comment });

		// Update course average rating
		const totalRatings = course.reviews.reduce(
			(sum, review) => sum + review.rating,
			0
		);
		course.ratings = totalRatings / course.reviews.length;

		await course.save();

		res.json({ message: "Review added successfully" });
	} catch (error) {
		console.error("Error adding review:", error);
		res.status(500).json({ message: "Server error" });
	}
};

module.exports = {
	browseAllCourses,
	purchaseCourse,
	getEnrolledCoursesWithProgress,
	handleStripeWebhook,
	updateChapterProgress,
	recordStudyTime,
	getStudyTimeRecord,
	getReviews,
	addReview,
};
