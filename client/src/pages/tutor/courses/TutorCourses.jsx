// import { Button } from "@material-tailwind/react";
import { Button } from "@/components/ui/button";
import { useGetTutorCoursesQuery } from "@/features/courses/coursesApiSlice";
import React from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "./components/DataTable";
import { columns } from "./components/Columns"; 

const TutorCourses = () => {
	const navigate = useNavigate();
	const {
		data: courses,
		isLoading,
		isSuccess,
	} = useGetTutorCoursesQuery("allTutorCourses");

	if (isLoading) return <p>Fetching all tutor courses</p>;

	return (
		<div className="p-6">
			<DataTable columns={columns} data={courses} />
		</div>
	);
};

export default TutorCourses;
