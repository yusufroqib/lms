const Course = require("../models/CourseModel");

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
		// if (!courses) return res.status(404).json({ msg: "No courses found" });
		res.status(200).json( courses );
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: error.message });
	}
};

const updateCourse = async (req, res) => {
	try {
		console.log(req.body)
		const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
		
		if (!course) return res.status(404).json({ msg: "Course not found" });
		res.status(200).json({ course });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

// //Get Course by Id
// const getCourseById = async (req, res) => {
// 	try {
// 		const course = await Course.findById(req.params.id);
// 		if (!course) return res.status(404).json({ msg: "Course not found" });
// 		res.status(200).json({ course });
// 	} catch (error) {
// 		res.status(500).json({ message: error.message });
// 	}

// }

module.exports = { createTitle, getAllTutorCourses, updateCourse };
