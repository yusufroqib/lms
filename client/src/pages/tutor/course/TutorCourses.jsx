// import { Button } from "@material-tailwind/react";
import { Button } from "@/components/ui/button";
import { useGetTutorCoursesQuery } from "@/features/courses/coursesApiSlice";
import React from "react";
import { useNavigate } from "react-router-dom";

const TutorCourses = () => {
    const navigate = useNavigate()
	const { data: courses, isLoading, isSuccess } = useGetTutorCoursesQuery();

	if(isLoading) return <p>Fetching all tutor courses</p>
	return (
		<div>
			<div>
				<Button onClick={() => navigate('/tutors/create-course')}>Create New Course</Button>
			</div>
			<div>
				{isSuccess && JSON.stringify(courses)}
			</div>
		</div>
	);
};

export default TutorCourses;
