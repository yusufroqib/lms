const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		username: {
			type: String,
			// required: true,
			unique: true,
		},
		name: String,
		email: {
			type: String,
			required: true,
			unique: true,
		},
		googleId: String,
		password: {
			type: String,
			select: false, // Excludes the password field from query results
			// required: true,
		},
		bio: String,
		avatar: String,
		followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
		following: [{ type: Schema.Types.ObjectId, ref: "User" }],
		roles: {
			Student: {
				type: String,
				default: "Student",
			},
			Tutor: String,
			Admin: String,
		},
		reputation: { type: Number, default: 0 },
		saved: [{ type: Schema.Types.ObjectId, ref: "Post" }],
		enrolledCourses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
		createdCourses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
		refreshToken: [String],
		points: [
			{
				description: String,
				amount: Number,
				date: Date,
			},
		],
		badges: [{ type: Schema.Types.ObjectId, ref: "Badge" }],
		joinedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("User", userSchema);
