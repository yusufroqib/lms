import React from "react";
import {
	useGetEnrolledCoursesQuery,
} from "@/features/courses/coursesApiSlice";
import { CoursesList } from "./components/CoursesList";
import { Loader2 } from "lucide-react";

const EnrolledCourses = () => {
	// console.log(searchParams)

	const {
		data: courses,

	} = useGetEnrolledCoursesQuery("enrolledCourses");

	// console.log(error)
	// console.log(courses)

	if (!courses)
		return (
			<div className="flex min-h-[80vh] justify-center items-center">
				<Loader2 key="loader" className="mr-2 h-10 w-10 animate-spin" />{" "}
			</div>
		);

	if (courses) {
		const allCourses = courses?.ids.map((id) => courses.entities[id]);
		return (
			<div>
				<div className="px-6 pt-6">
					<h2 className="text-2xl font-bold">Enrolled Courses</h2>
				</div>
				<div className="p-6 space-y-4">
					<CoursesList items={allCourses} />
				</div>
			</div>
		);
	}
};

export default EnrolledCourses;
