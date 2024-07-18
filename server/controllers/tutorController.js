const Course = require("../models/CourseModel");
const Category = require("../models/CategoryModel");
const Classroom = require("../models/ClassroomModel");
const User = require("../models/userModel");
const { createStreamChatClient } = require("../utils/createStreamChatClient");
const { default: mongoose } = require("mongoose");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

//Get all courses categories
const getCategories = async (req, res) => {
	try {
		const categories = await Category.find().sort({ name: 1 });
		res.status(200).json(categories);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

//Create course title
const createTitle = async (req, res) => {
	try {
		const { title } = req.body;
		if (!title) return res.status(400).json({ msg: "Please enter title" });
		const userId = req.userId;
		const course = new Course({ title, tutor: userId });
		await course.save();
		res.status(201).json({ course });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

//Get all courses by tutor
const getAllTutorCourses = async (req, res) => {
	try {
		// console.log(req.userId)
		const courses = await Course.find({ tutor: req.userId });
		// console.log(courses)
		if (!courses.length)
			return res.status(404).json({ msg: "No courses found" });
		res.status(200).json(courses);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

const updateCourse = async (req, res) => {
	try {
		const userId = req.userId; // Assuming you have user information stored in req.user after authentication

		// Check if userId exists
		if (!userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		// Check if the course exists and the user is the owner
		const courseOwner = await Course.findOne({
			_id: req.params.id,
			tutor: userId,
		});

		if (!courseOwner) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const course = await Course.findById(req.params.id);

		if (!course) {
			return res.status(404).json({ msg: "Course not found" });
		}

		// Update the course price if provided in req.body
		if (req.body.price !== undefined) {
			course.price = req.body.price;
		}

		// Check if the course is free
		const isFree =
			course.price === 0 || course.price === null || course.price === "";

		// Update each chapter's isFree property
		if (isFree) {
			course.chapters.forEach((chapter) => {
				chapter.isFree = true;
			});
		}

		// Save additional property from req.body if present
		const propertyName = Object.keys(req.body)[0]; // Get the first (and only) property name
		if (propertyName && propertyName !== "price") {
			course[propertyName] = req.body[propertyName];
		}

		// Save the updated course
		const updatedCourse = await course.save();

		res.status(200).json({ course: updatedCourse });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

const updateCourseCategory = async (req, res) => {
	const courseId = req.params.id;
	const categoryId = req.body.categoryId;

	try {
		const userId = req.userId; // Assuming you have user information stored in req.user after authentication

		// Check if userId exists
		if (!userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		// Check if the course exists and the user is the owner
		const courseOwner = await Course.findOne({
			_id: req.params.id,
			tutor: userId,
		});
		if (!courseOwner) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		// Find the course and update its category
		const course = await Course.findById(courseId);
		if (!course) {
			return res.status(404).json({ message: "Course not found" });
		}

		const oldCategoryId = course.categoryId;

		course.categoryId = categoryId;
		await course.save();

		// Update the old category
		if (oldCategoryId) {
			const oldCategory = await Category.findById(oldCategoryId);
			if (oldCategory) {
				oldCategory.courses = oldCategory.courses.filter(
					(id) => id.toString() !== courseId
				);
				await oldCategory.save();
			}
		}

		// Update the new category
		if (categoryId) {
			const newCategory = await Category.findById(categoryId);
			if (newCategory) {
				newCategory.courses.push(courseId);
				await newCategory.save();
			}
		}

		res.status(200).json({ message: "Course category updated successfully" });
	} catch (error) {
		console.log("[UPDATE COURSE CATEGORY]", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

const createChapter = async (req, res) => {
	try {
		const userId = req.userId; // Assuming you have user information stored in req.user after authentication
		const { title } = req.body;

		// Check if userId exists
		if (!userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		// Check if the course exists and the user is the owner
		const courseOwner = await Course.findOne({
			_id: req.params.id,
			tutor: userId,
		});
		if (!courseOwner) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		// Determine the position for the new chapter
		let newPosition = 0;
		if (courseOwner.chapters.length > 0) {
			const lastChapterPosition =
				courseOwner.chapters[courseOwner.chapters.length - 1].position;
			newPosition = lastChapterPosition + 1;
		}

		const isFree = courseOwner.price ? false : true;

		// Create the new chapter
		const newChapter = {
			title,
			isFree,
			position: newPosition,
		};

		// Add the newly created chapter to the course's chapters array
		courseOwner.chapters.push(newChapter);
		await courseOwner.save();

		return res.json(newChapter);
	} catch (error) {
		console.error("[CHAPTERS]", error);
		return res.status(500).json({ message: "Internal Error" });
	}
};

const reorderChapters = async (req, res) => {
	try {
		const { userId } = req; // Assuming you have user information stored in req.user after authentication
		if (!userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const { list } = req.body;
		// console.log(list)

		// Check if the user owns the course
		const ownCourse = await Course.findOne({
			_id: req.params.id,
			tutor: userId,
		});
		if (!ownCourse) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		// Update the positions of chapters based on the provided list
		for (let item of list) {
			const chapterToUpdate = ownCourse.chapters.find((chapter) =>
				chapter._id.equals(item.id)
			);
			if (chapterToUpdate) {
				chapterToUpdate.position = item.position;
			}
		}

		ownCourse.chapters.sort((a, b) => a.position - b.position);

		// Save the updated course with reordered chapters
		await ownCourse.save();
		// console.log(ownCourse)

		return res.status(200).json({ message: "Success" });
	} catch (error) {
		console.log("[REORDER]", error);
		return res.status(500).json({ message: "Internal Error" });
	}
};

//Update Course chapter
const updateChapter = async (req, res) => {
	try {
		const { courseId, chapterId } = req.params;
		// console.log(courseId, chapterId, req.body);

		const { userId } = req;
		//update chapter in a course
		const course = await Course.findOne({
			_id: courseId,
			tutor: userId,
		});
		if (!course) return res.status(404).json({ msg: "Course not found" });
		const chapter = course.chapters.id(chapterId);
		if (!chapter) return res.status(404).json({ msg: "Chapter not found" });
		chapter.set(req.body);
		await course.save();
		res.status(200).json(course);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

const addAttachmentToChapter = async (req, res) => {
	try {
		const { userId } = req; // Assuming you have user information stored in req.user after authentication
		if (!userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const { chapterId, courseId } = req.params;
		const { attachment } = req.body;

		// Check if the user owns the course
		const ownCourse = await Course.findOne({
			_id: courseId,
			tutor: userId,
		});
		if (!ownCourse) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		// Find the chapter by its ID
		const chapterToUpdate = ownCourse.chapters.find((chapter) =>
			chapter._id.equals(chapterId)
		);
		if (!chapterToUpdate) {
			return res.status(404).json({ message: "Chapter not found" });
		}

		// Add attachments to the chapter
		chapterToUpdate.attachments.push(attachment);

		// Save the updated course with added attachments
		await ownCourse.save();

		return res.status(200).json({ message: "Attachment added successfully" });
	} catch (error) {
		console.log("[ADD ATTACHMENTS]", error);
		return res.status(500).json({ message: "Internal Error" });
	}
};

const deleteAttachmentFromChapter = async (req, res) => {
	try {
		const { userId } = req; // Assuming you have user information stored in req.user after authentication
		if (!userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const { chapterId, courseId } = req.params;
		const { attachmentId } = req.body;

		// Check if the user owns the course
		const ownCourse = await Course.findOne({
			_id: courseId,
			tutor: userId,
		});
		if (!ownCourse) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		// Find the chapter by its ID
		const chapterToUpdate = ownCourse.chapters.find((chapter) =>
			chapter._id.equals(chapterId)
		);
		if (!chapterToUpdate) {
			return res.status(404).json({ message: "Chapter not found" });
		}

		// Find the index of the attachment to delete
		const attachmentIndex = chapterToUpdate.attachments.findIndex(
			(attachment) => attachment._id.equals(attachmentId)
		);
		if (attachmentIndex === -1) {
			return res.status(404).json({ message: "Attachment not found" });
		}

		// Remove the attachment from the attachments array
		chapterToUpdate.attachments.splice(attachmentIndex, 1);

		// Save the updated course with deleted attachment
		await ownCourse.save();

		return res.status(200).json({ message: "Attachment deleted successfully" });
	} catch (error) {
		console.log("[DELETE ATTACHMENT]", error);
		return res.status(500).json({ message: "Internal Error" });
	}
};

const deleteChapter = async (req, res) => {
	try {
		const { userId } = req; // Assuming you have user information stored in req.user after authentication
		if (!userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const { chapterId, courseId } = req.params;

		// Check if the user owns the course
		const ownCourse = await Course.findOne({
			_id: courseId,
			tutor: userId,
		});
		if (!ownCourse) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		// Find the chapter index in the chapters array
		const chapterIndex = ownCourse.chapters.findIndex((chapter) =>
			chapter._id.equals(chapterId)
		);
		if (chapterIndex === -1) {
			return res.status(404).json({ message: "Chapter not found" });
		}

		// Remove the chapter from the chapters array
		ownCourse.chapters.splice(chapterIndex, 1);

		// If the deleted chapter is the last chapter, unpublish the course
		if (ownCourse.chapters.length === 0) {
			ownCourse.isPublished = false;
		}

		// Save the updated course with deleted chapter
		await ownCourse.save();

		return res.status(200).json({ message: "Chapter deleted successfully" });
	} catch (error) {
		console.log("[DELETE CHAPTER]", error);
		return res.status(500).json({ message: "Internal Error" });
	}
};

const toggleChapterPublicationStatus = async (req, res) => {
	try {
		const { userId } = req; // Assuming you have user information stored in req.user after authentication
		if (!userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const { chapterId, courseId } = req.params;

		// Check if the user owns the course
		const ownCourse = await Course.findOne({
			_id: courseId,
			tutor: userId,
		});
		if (!ownCourse) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		// Find the chapter by its ID
		const chapterToUpdate = ownCourse.chapters.find((chapter) =>
			chapter._id.equals(chapterId)
		);
		if (!chapterToUpdate) {
			return res.status(404).json({ message: "Chapter not found" });
		}

		// Toggle the chapter's publication status
		chapterToUpdate.isPublished = !chapterToUpdate.isPublished;

		// If the chapter unpublished is the only chapter, unpublish the course
		if (!chapterToUpdate.isPublished && ownCourse.chapters.length === 1) {
			ownCourse.isPublished = false;
		}

		// Save the updated course with toggled publication status of the chapter
		await ownCourse.save();

		return res
			.status(200)
			.json({ message: "Chapter publication status toggled successfully" });
	} catch (error) {
		console.log("[TOGGLE CHAPTER PUBLICATION STATUS]", error);
		return res.status(500).json({ message: "Internal Error" });
	}
};

const toggleCoursePublicationStatus = async (req, res) => {
	try {
		const { userId } = req; // Assuming you have user information stored in req.user after authentication
		if (!userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const client = createStreamChatClient();

		const { id: courseId } = req.params;

		// Check if the user owns the course
		const ownCourse = await Course.findOne({
			_id: courseId,
			tutor: userId,
		});
		if (!ownCourse) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		// Toggle the course's publication status
		ownCourse.isPublished = !ownCourse.isPublished;

		// If the course is being published and has no chapters, return error
		if (ownCourse.isPublished && ownCourse.chapters.length === 0) {
			return res
				.status(400)
				.json({ message: "Cannot publish course with no chapters" });
		}

		if (ownCourse.isPublished) {
			const channel = client.channel("messaging", courseId);
			// console.log(channel)
			await channel.addMembers([
				{ user_id: userId, channel_role: "channel_moderator" },
			]);
			await channel.assignRoles([
				{ user_id: userId, channel_role: "channel_moderator" },
			]);
		}

		const isClassroomExist = await Classroom.findOne({ course: courseId });

		//Create new classroom
		if (ownCourse.isPublished && !isClassroomExist) {
			const classroom = await Classroom.create({
				name: ownCourse.title,
				course: courseId,
				tutor: userId,
			});
			ownCourse.classroom = classroom._id;
			// await ownCourse.save();
		}

		// Save the updated course with toggled publication status
		await ownCourse.save();

		return res
			.status(200)
			.json({ message: "Course publication status toggled successfully" });
	} catch (error) {
		console.log("[TOGGLE COURSE PUBLICATION STATUS]", error);
		return res.status(500).json({ message: "Internal Error" });
	}
};

const deleteCourse = async (req, res) => {
	try {
		const { userId } = req; // Assuming you have user information stored in req.user after authentication
		if (!userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const { id } = req.params;

		// Check if the user owns the course
		const ownCourse = await Course.findOne({
			_id: id,
			tutor: userId,
		});
		if (!ownCourse) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		// Delete the course
		await Course.deleteOne({ _id: id });

		return res.status(200).json({ message: "Course deleted successfully" });
	} catch (error) {
		console.log("[DELETE COURSE]", error);
		return res.status(500).json({ message: "Internal Error" });
	}
};

const getTutorStats = async (req, res) => {
	try {
		const { userId: tutorId } = req;

		// Find all courses by the tutor
		const courses = await Course.find({ tutor: tutorId });

		// Calculate statistics
		let totalEarnings = 0;
		let publishedCoursesCount = 0;
		let coursesSoldCount = 0;
		const uniqueStudents = new Set();

		courses.forEach((course) => {
			// Total earnings
			totalEarnings += course.purchasedBy.reduce(
				(sum, purchase) => sum + purchase.amount,
				0
			);

			// Published courses count
			if (course.isPublished) {
				publishedCoursesCount++;
			}

			// Courses sold count and unique students
			course.purchasedBy.forEach((purchase) => {
				coursesSoldCount++;
				uniqueStudents.add(purchase.user.toString());
			});
		});

		// Prepare the response
		const stats = {
			totalEarnings,
			publishedCoursesCount,
			coursesSoldCount,
			totalUniqueStudents: uniqueStudents.size,
		};

		res.json(stats);
	} catch (error) {
		console.error("Error fetching tutor stats:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

const getTutorTopCourses = async (req, res) => {
	try {
		const { userId: tutorId } = req;

		const topCourses = await Course.aggregate([
			{
				$match: {
					tutor: new mongoose.Types.ObjectId(tutorId),
					isPublished: true, // Only include published courses
				},
			},
			{
				$addFields: {
					salesCount: {
						$cond: {
							if: { $isArray: "$purchasedBy" },
							then: { $size: "$purchasedBy" },
							else: 0,
						},
					},
					totalValue: {
						$cond: {
							if: { $isArray: "$purchasedBy" },
							then: {
								$reduce: {
									input: "$purchasedBy",
									initialValue: 0,
									in: { $add: ["$$value", { $ifNull: ["$$this.amount", 0] }] },
								},
							},
							else: 0,
						},
					},
				},
			},
			{
				$sort: { totalValue: -1 },
			},
			{
				$limit: 5,
			},
			{
				$project: {
					_id: 1,
					title: 1,
					courseImage: 1,
					price: 1,
					salesCount: 1,
					totalValue: 1,
				},
			},
		]);

		res.json(topCourses);
	} catch (error) {
		console.error("Error fetching top courses for tutor:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};
const generateStripeAccountLink = async (req, res) => {
	try {
		const userId = req.userId;
		const user = await User.findById(userId);

		let stripeAccountId = user.stripeAccountId;

		if (!stripeAccountId) {
			// Create a new account if it doesn't exist
			const account = await stripe.accounts.create({
				type: "express",
				country: "US", // Change as needed
				email: user.email,
				capabilities: {
					card_payments: { requested: true },
					transfers: { requested: true },
				},
			});

			stripeAccountId = account.id;
			user.stripeAccountId = stripeAccountId;
			await user.save();
		}

		const accountLink = await stripe.accountLinks.create({
			account: stripeAccountId,
			refresh_url: `${process.env.CLIENT_URL}/tutors/stripe-connect/refresh`,
			return_url: `${process.env.CLIENT_URL}/tutors/stripe-connect/complete`,
			type: "account_onboarding",
		});

		res.json({ url: accountLink.url });
	} catch (error) {
		console.error("[GENERATE_STRIPE_ACCOUNT_LINK]", error);
		res.status(500).json({ message: "Internal server error" });
	}
};
const completeStripeConnectOnboarding = async (req, res) => {
	try {
		const userId = req.userId;
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		if (!user.stripeAccountId) {
			return res
				.status(400)
				.json({ message: "No Stripe account found for this user" });
		}

		// Retrieve the account to check its status
		const account = await stripe.accounts.retrieve(user.stripeAccountId);

		if (account.details_submitted) {
			// The account setup is complete
			user.stripeOnboardingComplete = true;
			await user.save();

			res.json({ message: "Stripe account setup completed successfully" });
		} else {
			// The account setup is not complete
			res.status(400).json({ message: "Stripe account setup is not complete" });
		}
	} catch (error) {
		console.error("[COMPLETE_STRIPE_CONNECT_ONBOARDING]", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const getTutorBalance = async (req, res) => {
	try {
		const userId = req.userId;
		const user = await User.findById(userId);

		if (!user.stripeAccountId) {
			return res.status(400).json({ message: "No connected Stripe account" });
		}

		const balance = await stripe.balance.retrieve({
			stripeAccount: user.stripeAccountId,
		});

		res.json(balance);
	} catch (error) {
		console.error("[GET_TUTOR_BALANCE]", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const getPayoutDetails = async (req, res) => {
	try {
		const userId = req.userId;
		const user = await User.findById(userId);

		if (!user.stripeAccountId) {
			return res
				.status(400)
				.json({ message: "No Stripe account found for this user" });
		}

		// Retrieve the balance from Stripe
		const balance = await stripe.balance.retrieve({
			stripeAccount: user.stripeAccountId,
		});

		// Get the available balance in the default currency (usually USD)
		const availableBalance =
			balance.available.find((bal) => bal.currency === "usd").amount / 100;

		// Retrieve the default bank account (assuming the user has set one up)
		const bankAccounts = await stripe.accounts.listExternalAccounts(
			user.stripeAccountId,
			{ object: "bank_account", limit: 1 }
		);

		let bankAccount = null;
		if (bankAccounts.data.length > 0) {
			const { last4, bank_name } = bankAccounts.data[0];
			bankAccount = { last4, bank_name };
		}

		res.json({ availableBalance, bankAccount });
	} catch (error) {
		console.error("[GET_PAYOUT_DETAILS]", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const initiatePayout = async (req, res) => {
	try {
		const userId = req.userId;
		const { amount } = req.body;
		const user = await User.findById(userId);

		if (!user.stripeAccountId) {
			return res
				.status(400)
				.json({ message: "No Stripe account found for this user" });
		}

		// Create a payout
		const payout = await stripe.payouts.create(
			{
				amount: Math.round(amount * 100), // Convert to cents
				currency: "usd",
			},
			{
				stripeAccount: user.stripeAccountId,
			}
		);

		user.transactions.push({
			type: "payout",
			amount: payout.amount / 100, // Convert cents to dollars
			stripeTransactionId: payout.id,
			status: "initiated",
			createdAt: new Date(payout.created * 1000), // Convert Unix timestamp to Date
		});

		await user.save();

		console.log("payout initiated", payout);

		res.json({ message: "Payout initiated successfully", payoutId: payout.id });
	} catch (error) {
		console.error("[INITIATE_PAYOUT]", error);
		res.status(500).json({ message: "Failed to initiate payout" });
	}
};

const getTransactionHistory = async (req, res) => {
	try {
		const userId = req.userId;
		const user = await User.findById(userId).populate("transactions.courseId");

		res.json(user.transactions);
	} catch (error) {
		console.error("[GET_TRANSACTION_HISTORY]", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const getTutorEarnings = async (req, res) => {
	try {
		const { userId: tutorId } = req;
		const { startDate, endDate } = req.query;

		if (!mongoose.Types.ObjectId.isValid(tutorId)) {
			return res.status(400).json({ error: "Invalid tutor ID" });
		}

		let startDateTime, endDateTime;

		if (startDate && endDate) {
			try {
				startDateTime = new Date(startDate);
				endDateTime = new Date(endDate);

				// Check if the dates are valid
				if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
					throw new Error("Invalid dates");
				}
			} catch (e) {
				console.error("Date parsing error:", e.message);
				// If dates are invalid, default to last 30 days
				endDateTime = new Date();
				startDateTime = new Date(endDateTime);
				startDateTime.setDate(startDateTime.getDate() - 30);
			}
		} else {
			// If dates are not provided, default to last 30 days
			endDateTime = new Date();
			startDateTime = new Date(endDateTime);
			startDateTime.setDate(startDateTime.getDate() - 30);
		}

		// console.log("Final startDateTime:", startDateTime);
		// console.log("Final endDateTime:", endDateTime);

		const courses = await Course.aggregate([
			{
				$match: {
					tutor: new mongoose.Types.ObjectId(tutorId),
				},
			},
			{
				$unwind: "$purchasedBy",
			},
			{
				$match: {
					"purchasedBy.date": {
						$gte: startDateTime,
						$lte: endDateTime,
					},
				},
			},
			{
				$group: {
					_id: {
						date: {
							$dateToString: { format: "%Y-%m-%d", date: "$purchasedBy.date" },
						},
						course: "$title",
					},
					earnings: { $sum: "$purchasedBy.amount" },
				},
			},
			{
				$group: {
					_id: "$_id.date",
					courseEarnings: {
						$push: {
							course: "$_id.course",
							earnings: "$earnings",
						},
					},
				},
			},
			{
				$project: {
					_id: 0,
					date: "$_id",
					courseEarnings: {
						$arrayToObject: {
							$map: {
								input: "$courseEarnings",
								as: "earning",
								in: ["$$earning.course", "$$earning.earnings"],
							},
						},
					},
				},
			},
			{
				$sort: { date: 1 },
			},
		]);

		res.json(courses);
	} catch (error) {
		console.error("Error fetching tutor earnings:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

const getTutorCoursesSold = async (req, res) => {
	try {
		const { userId: tutorId } = req;

		// Find courses by the tutor
		const courses = await Course.find({ tutor: tutorId })
			.populate("purchasedBy.user", "name email") // Populate student name and email
			.exec();

		// Prepare the transaction history data
		const transactionHistory = courses.flatMap((course) =>
			course.purchasedBy.map((purchase) => ({
				courseTitle: course.title,
				coursePrice: course.price,
				studentName: purchase.user.name,
				studentEmail: purchase.user.email,
				amount: purchase.amount,
				date: purchase.date,
			}))
		);

		// Sort the transaction history by date in descending order
		transactionHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
		// console.log(transactionHistory);

		res.json(transactionHistory);
	} catch (error) {
		console.error("[GET_TUTOR_TRANSACTION_HISTORY]", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

module.exports = {
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
	generateStripeAccountLink,
	completeStripeConnectOnboarding,
	getTutorBalance,
	getPayoutDetails,
	initiatePayout,
	getTransactionHistory,
	deleteCourse,
	getTutorStats,
	getTutorTopCourses,
	getTutorEarnings,
	getTutorCoursesSold,
};
