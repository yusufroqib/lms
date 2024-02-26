import { Navigate, useParams } from "react-router-dom";
import React, { useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { useGetTutorCoursesQuery } from "@/features/courses/coursesApiSlice";

const EditCourse = () => {
	const { id } = useParams();
	const { username, isTutor, isAdmin, _id } = useAuth();
	const { course, isLoading, isSuccess } = useGetTutorCoursesQuery(undefined, {
		selectFromResult: ({ data, isLoading, isSuccess }) => ({
			course: data?.entities[id],
			isLoading,
			isSuccess,
		}),
	});

	console.log(course);
	console.log(isSuccess);

	// useEffect(() => {}, []);

	if (isLoading) {
		return <p>Loading Tutor Course</p>;
	} else if (isSuccess && !course) {
		return <Navigate to={"/dashboard"} />;
	} else if (isSuccess && course?.tutor !== _id) {
		return <Navigate to={"/dashboard"} />;
	}
	return <div>{isSuccess && JSON.stringify(course)}</div>;
};

export default EditCourse;
