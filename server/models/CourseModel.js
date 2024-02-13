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

const linkSchema = new Schema({
	title: String,
	url: String,
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
	videoSection: String,
	description: String,
	videoLength: Number,
	videoPlayer: String,
	links: [linkSchema],
	suggestion: String,
	questions: [commentSchema],
});

const courseSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		estimatePrice: {
			type: String,
		},
		thumbnail: {
			public_id: {
				type: String,
			},
			url: {
				type: String,
			},
		},
		tags: {
			type: String,
			required: true,
		},
		level: {
			type: String,
			required: true,
		},
		demoUrl: {
			type: String,
			required: true,
		},
		benefits: [{ title: String }],
		prerequisites: [{ title: String }],
		reviews: [reviewSchema],
		courseData: [courseDataSchema],
		ratings: {
			type: Number,
			default: 0,
		},
		purchased: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

const CourseModel = model("Course", courseSchema);

module.exports = CourseModel;
