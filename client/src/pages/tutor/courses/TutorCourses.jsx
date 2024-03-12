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

	const allTutorCourses = courses?.ids.map(id => courses?.entities[id]);

	return (
		<div className="p-6">
			<DataTable columns={columns} data={allTutorCourses} />
		</div>
	);
};

export default TutorCourses;
