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

const chapterSchema = new Schema({
	videoUrl: String,
	// videoThumbnail: String,
	title: String,
	position: Number,
	// videoSection: String,
	description: String,
	isPublished: Boolean,
	isFree: Boolean,
	attachments: [
		{
			name: String,
			url: String,
		},
	],
	userProgress: [
		{
			userId: {
				type: Schema.Types.ObjectId,
				ref: "User",
			},
			isCompleted: Boolean,
		},
	],
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
			default: 0
			// required: true,
		},
		// estimatePrice: {
		// 	type: String,
		// },
		courseImage: {
			type: String,
		},
		categoryId: {
			type: Schema.Types.ObjectId,
			ref: "Category",
		},
		reviews: [reviewSchema],
		chapters: [chapterSchema],
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
				amount: Number,
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
