import { useNavigate, useSearchParams } from "react-router-dom";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetEnrolledCoursesQuery, useGetTutorCoursesQuery } from "@/features/courses/coursesApiSlice";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const StudyIndex = () => {
	const { courseId } = useParams();
	const [searchParams, setSearchParams] = useSearchParams();

	const purchaseSuccess = searchParams.get("success");
	const navigate = useNavigate();

	useEffect(() => {
		if (!!purchaseSuccess) {
			toast.success("Course purchased successfully");
		}
	}, [purchaseSuccess]);

	// console.log(courseId);
	const { purchasedCourse, isLoading, isFetching, isSuccess, isError } =
		useGetEnrolledCoursesQuery("enrolledCourses", {
			selectFromResult: ({
				data,
				isLoading,
				isSuccess,
				isFetching,
				isError,
				error,
			}) => ({
				purchasedCourse: data?.entities[courseId],
				isLoading,
				isSuccess,
				isFetching,
				error,
				isError,
			}),
		});

	const {
		tutorCourse,
		isSuccess: isTutorSuccess,
		isLoading: isTutorLoading,
	} = useGetTutorCoursesQuery("tutorCourses", {
		selectFromResult: ({
			data,
			isLoading,
			isSuccess,
			isFetching,
			isError,
			error,
		}) => ({
			tutorCourse: data?.entities[courseId],
			isLoading,
			isSuccess,
			isFetching,
			error,
			isError,
		}),
	});

	// console.log(course);
	let course = purchasedCourse || tutorCourse;
	console.log(course)

	useEffect(() => {
		if (course && isSuccess) {
			const firstChapterId = course.chapters[0]._id;
			navigate(`/study/${courseId}/chapter/${firstChapterId}`);
		}

		if (
			(!course && isSuccess && !isTutorLoading) ||
			(isError && !isTutorLoading && !isLoading)
		) {
			navigate("/courses/search");
		}
	}, [
		isError,
		isSuccess,
		navigate,
		courseId,
		course,
		isTutorLoading,
		isLoading,
	]);

	return (
		<div className="flex min-h-[80vh] justify-center items-center">
			<Loader2 key="loader" className="mr-2 h-10 w-10 animate-spin" />{" "}
		</div>
	); // or any loading indicator if needed
};

export default StudyIndex;
