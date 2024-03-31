
const Classroom = require("../models/ClassroomModel");

// Route to retrieve classrooms for a user
const getMyClassrooms = async (req, res) => {   
     try {
        const userId = req.userId

        // Find classrooms where the user is either the tutor or a student
        const classrooms = await Classroom.find({ $or: [{ tutor: userId }, { students: { $in: [userId] } }] })
            .populate({
                path: 'tutor',
                select: 'name avatar', // Select the fields you want from the tutor
            })
            .populate({
                path: 'course',
                select: 'courseImage', // Select the course image field
            })
            .exec();

        res.json(classrooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {getMyClassrooms}