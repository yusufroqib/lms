const Course = require("../models/CourseModel");

//Create course title
const createTitle = async (req, res) => {
	try {
		const { title } = req.body;
        if (!title) return res.status(400).json({ msg: "Please enter title" });
		const userId = req.userId;
		const course = new Course({ title, tutor: userId });
        await course.save();
        res.status(201).json({ msg: "Created course title", course });

	} catch (error) {
		console.log(error);
	}
};


module.exports = { createTitle };