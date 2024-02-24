// import { Button } from "@material-tailwind/react";
import { Button } from "@/components/ui/button";
import React from "react";
import { useNavigate } from "react-router-dom";

const TutorCourses = () => {
    const navigate = useNavigate()
	return (
		<div>
			<div>
				<Button onClick={() => navigate('/tutors/create-course')}>Create New Course</Button>
			</div>
		</div>
	);
};

export default TutorCourses;
