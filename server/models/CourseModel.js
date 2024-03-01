const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const reviewSchema = new Schema({
	user: [{ type: Schema.Types.ObjectId, ref: "User" }],
	rating: {
		type: Number,
		default: 0,
	},
	comment: String,
	// commentReplies: [Object],
});

const commentSchema = new Schema({
	user: Object,
	question: String,
	questionReplies: [Object],
});

const courseDataSchema = new Schema({
	videoUrl: String,
	videoThumbnail: String,
	title: String,
	// videoSection: String,
	description: String,
	// videoLength: Number,
	// videoPlayer: String,
	// links: [linkSchema],
	// suggestion: String,
	questions: [commentSchema],
});

const courseSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			// required: true,
		},
		tutor: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		isPublished: {
			type: Boolean,
			default: false,
		},
		price: {
			type: Number,
			// required: true,
		},
		estimatePrice: {
			type: String,
		},
		courseImage: {
			type: String,
		},
		// tags: {
		// 	type: String,
		// 	required: true,
		// },
		// demoUrl: {
		// 	type: String,
		// 	required: true,
		// },
		benefits: [{ title: String }],
		prerequisites: [{ title: String }],
		reviews: [reviewSchema],
		courseData: [courseDataSchema],
		ratings: {
			type: Number,
			default: 0,
		},
		purchasedBy: [
			{
				user: {
					type: Schema.Types.ObjectId,
					ref: "User",
				},
				date: {
					type: Date,
					default: Date.now, // Optional: Set a default value to the current date and time
				},
			},
		],
	},
	{ timestamps: true }
);

module.exports = model("Course", courseSchema);

// module.exports = CourseModel;
