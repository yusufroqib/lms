import SearchInput from "@/components/SearchInput";
import React from "react";
import { Categories } from "./components/Categories";
import {
	useGetCourseCategoriesQuery,
	useGetCoursesQuery,
} from "@/features/courses/coursesApiSlice";
import { CoursesList } from "./components/CoursesList";
import { useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

const BrowseCourses = () => {
	const [dynamicSearchParams, setDynamicSearchParams] = useSearchParams();
	const searchParams = dynamicSearchParams.toString();
	const { data } = useGetCourseCategoriesQuery("");

	const {
		data: courses,
		isLoading,
		isSuccess,
		error,
		isError,
	} = useGetCoursesQuery({ searchParams: searchParams });

	// console.log(error)
	// console.log(courses)

	if (!courses)
		return (
			<div className="flex min-h-[80vh] justify-center items-center">
				<Loader2 key="loader" className="mr-2 h-10 w-10 animate-spin" />{" "}
			</div>
		);

	if (data && courses) {
		const categories = data?.ids.map((id) => data.entities[id]);
		const allCourses = courses?.ids.map((id) => courses.entities[id]);
		return (
			<div className="min-h-[calc(100vh-72px)] py-6 ">
				<div className="px-6 md:hidden md:mb-0 block">
					<SearchInput />
				</div>
				<div className=" pt-6 md:pt-0 px-6 space-y-4">
					<Categories items={categories} />
					<CoursesList items={allCourses} />
					{/* <div className="h-[500px] w-full bg-blue-gray-300">Test</div> */}
				</div>
			</div>
		);
	}
};

export default BrowseCourses;
