const Course = require("../models/CourseModel");
const Category = require("../models/CategoryModel");


//Get all courses categories
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


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
		if (!courses.length) return res.status(404).json({ msg: "No courses found" });
		res.status(200).json( courses );
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: error.message });
	}
};

const updateCourse = async (req, res) => {
	try {
		// console.log(req.body)
		const  userId  = req.userId; // Assuming you have user information stored in req.user after authentication
        
        // Check if userId exists
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Check if the course exists and the user is the owner
        const courseOwner = await Course.findOne({
            _id: req.params.id,
            tutor: userId
        });
        if (!courseOwner) {
            return res.status(401).json({ message: "Unauthorized" });
        }
		const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
		
		if (!course) return res.status(404).json({ msg: "Course not found" });
		res.status(200).json({ course });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}



const updateCourseCategory = async (req, res) => {
    const courseId = req.params.id;
    const categoryId = req.body.categoryId;
	
    try {
		const  userId  = req.userId; // Assuming you have user information stored in req.user after authentication
        
        // Check if userId exists
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Check if the course exists and the user is the owner
        const courseOwner = await Course.findOne({
            _id: req.params.id,
            tutor: userId
        });
        if (!courseOwner) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // Find the course and update its category
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const oldCategoryId = course.categoryId;

        course.categoryId = categoryId;
        await course.save();

        // Update the old category
        if (oldCategoryId) {
            const oldCategory = await Category.findById(oldCategoryId);
            if (oldCategory) {
                oldCategory.courses = oldCategory.courses.filter(id => id.toString() !== courseId);
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

        res.status(200).json({ message: 'Course category updated successfully' });
    } catch (error) {
        console.log("[UPDATE COURSE CATEGORY]", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


const createChapter = async (req, res) => {
    try {
        const userId  = req.userId; // Assuming you have user information stored in req.user after authentication
        const { title } = req.body;
        
        // Check if userId exists
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Check if the course exists and the user is the owner
        const courseOwner = await Course.findOne({
            _id: req.params.id,
            tutor: userId
        });
        if (!courseOwner) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Find the last chapter and determine the position for the new chapter
        const lastChapterPosition = courseOwner.chapters.length > 0 ? courseOwner.chapters[courseOwner.chapters.length - 1].position : 0;
        const newPosition = lastChapterPosition + 1;

        // Create the new chapter
        const newChapter = {
            title,
            position: newPosition
        };

        // Add the newly created chapter to the course's chapters array
        courseOwner.chapters.push(newChapter);
        await courseOwner.save();

        return res.json(newChapter);
    } catch (error) {
        console.log("[CHAPTERS]", error);
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
            tutor: userId
        });
        if (!ownCourse) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Update the positions of chapters based on the provided list
        for (let item of list) {
            const chapterToUpdate = ownCourse.chapters.find(chapter => chapter._id.equals(item.id));
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




module.exports = { createTitle, getAllTutorCourses, updateCourse, getCategories, updateCourseCategory, createChapter, reorderChapters };
