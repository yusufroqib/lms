const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const classroomSchema = new Schema({
	name: String,
	tutor: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" }, // Reference to courses collection
	students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Reference to users collection
});

module.exports = mongoose.model("Classroom", classroomSchema);
