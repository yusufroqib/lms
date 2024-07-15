const Course = require("../models/CourseModel");
const Category = require("../models/CategoryModel");
const User = require("../models/userModel");
const StripeCustomer = require("../models/StripeCustomerModel");
const Classroom = require("../models/ClassroomModel");
const { createStreamChatClient } = require("../utils/createStreamChatClient");
const StudyTime = require("../models/StudyTimeModel");
const { default: mongoose } = require("mongoose");
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
			success_url: `http://localhost:5173/study/${courseId}?success=1`,
			cancel_url: `http://localhost:5173/courses/${courseId}/info?cancelled=1`,
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

const handleStripeWebhook = async (req, res, next) => {
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
			return res.status(400).send(`Webhook Error: ${error.message}`);
		}

		const session = event.data.object;
		const userId = session?.metadata?.userId;
		const courseId = session?.metadata?.courseId;

		const course = await Course.findById(courseId);
		const courseClassroom = await Classroom.findOne({ course: courseId });
		const client = createStreamChatClient();

		const user = await User.findById(userId);

		if (event.type === "checkout.session.completed") {
			if (!userId || !courseId) {
				return res.status(400).send("Webhook Error: Missing metadata");
			}
			course.purchasedBy.push({ user: userId, amount: course.price });
			await course.save();

			courseClassroom.students.push(userId);
			await courseClassroom.save();

			// Add the course to the enrolledCourses array in the user model
			user.enrolledCourses.push({
				course: courseId,
				lastStudiedAt: new Date(), // Set initial study time to now
			});
			await user.save();

			// console.log("course", course)
			// console.log("[User details]", user)

			const channel = client.channel("messaging", courseId);
			await channel.addMembers([
				{ user_id: userId, channel_role: "channel_member" },
			]);
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
        const now = new Date();

        // Get the start and end of the current day in UTC
        const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));

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
                $setOnInsert: { date: now }
            },
            { new: true, upsert: true }
        );

        // Update lastStudiedAt for the enrolled course
        await User.findOneAndUpdate(
            {
                _id: req.userId,
                'enrolledCourses.course': course
            },
            {
                $set: { 'enrolledCourses.$.lastStudiedAt': now }
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
                    as: "courseDetails"
                }
            },
            {
                $unwind: "$courseDetails"
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

        console.log(studySummary);

        res.status(200).json(studySummary);
    } catch (err) {
        console.error("Error in getStudyTimeRecord:", err);
        if (err instanceof mongoose.Error) {
            console.error("Mongoose error:", err.message);
        }
        res.status(500).send("Server Error: " + err.message);
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
};
