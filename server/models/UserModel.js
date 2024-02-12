const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		name: String,
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		avatar: String,
		bio: String,
		followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
		following: [{ type: Schema.Types.ObjectId, ref: "User" }],
		roles: {
			Student: {
				type: String,
				default: "Student",
			},
			Editor: String,
			Admin: String,
		},
		enrolledCourses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
		createdCourses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
		refreshToken: String,
		points: [
			{
				description: String,
				amount: Number,
				date: Date,
			},
		],
		badges: [{ type: Schema.Types.ObjectId, ref: "Badge" }],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("User", userSchema);
