import SearchInput from "@/components/SearchInput";
import React from "react";
import { Categories } from "./components/Categories";
import {
	useGetCourseCategoriesQuery,
	useGetCoursesQuery,
	useGetEnrolledCoursesQuery,
} from "@/features/courses/coursesApiSlice";
import { CoursesList } from "./components/CoursesList";
import { Link, useSearchParams } from "react-router-dom";
import { Breadcrumbs } from "@material-tailwind/react";

const EnrolledCourses = () => {
	const [dynamicSearchParams, setDynamicSearchParams] = useSearchParams();
	const searchParams = dynamicSearchParams.toString();
	const { data } = useGetCourseCategoriesQuery("");
	// console.log(searchParams)

	// const {
	// 	data: courses,
	// 	isLoading,
	// 	isSuccess,
	// 	error,
	// 	isError,
	// } = useGetCoursesQuery({ searchParams: searchParams });

	const {
		data: courses,
		isLoading,
		isFetching,
		isSuccess,
		isError,
	} = useGetEnrolledCoursesQuery("enrolledCourses");

	// console.log(error)
	// console.log(courses)

	if (!courses) return <div>Fetching all...</div>;

	if (data && courses) {
		const categories = data?.ids.map((id) => data.entities[id]);
		const allCourses = courses?.ids.map((id) => courses.entities[id]);
		return (
			<div>
				<div className="px-6 pt-6">
					
					{/* <SearchInput /> */}
					<h2 className="text-2xl font-bold">Enrolled Courses</h2>
				</div>
				<div className="p-6 space-y-4">
					{/* <Categories items={categories} /> */}
					<CoursesList items={allCourses} />
					{/* <div className="h-[500px] w-full bg-blue-gray-300">Test</div> */}
				</div>
			</div>
		);
	}
};

export default EnrolledCourses;
