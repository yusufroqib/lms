const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		avatar: String,
        bio: String,
		followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
		following: [{ type: Schema.Types.ObjectId, ref: "User" }],
		roles: {
			Student: {
				type: Number,
				default: "Student",
			},
			Editor: String,
			Admin: String,
		},
		password: {
			type: String,
			required: true,
		},
		enrolledCourses: [{ type: Schema.Types.ObjectId, ref: "Course"  }],
		createdCourses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
		refreshToken: String,
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("User", userSchema);
