import { useNavigate, useSearchParams } from "react-router-dom";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetEnrolledCoursesQuery } from "@/features/courses/coursesApiSlice";
import toast from "react-hot-toast";

const StudyIndex = () => {
	const { courseId } = useParams();
	const [searchParams, setSearchParams] = useSearchParams()

	const purchaseSuccess = searchParams.get('success')

	

	useEffect(() => {
		if(!!purchaseSuccess){
			toast.success('Course purchased successfully')
		}
	}, [purchaseSuccess])
	

	// console.log(courseId);
	const navigate = useNavigate();
	const { course, isLoading, isFetching, isSuccess, isError } =
		useGetEnrolledCoursesQuery("enrolledCourses", {
			selectFromResult: ({
				data,
				isLoading,
				isSuccess,
				isFetching,
				isError,
				error,
			}) => ({
				course: data?.entities[courseId],
				isLoading,
				isSuccess,
				isFetching,
				error,
				isError,
			}),
		});
		
		console.log(course)

	useEffect(() => {
		if (course && isSuccess) {
			const firstChapterId = course.chapters[0]._id;
			navigate(`/study/${courseId}/chapter/${firstChapterId}`);
		}

		if ((!course && isSuccess) || isError) {
			navigate("/courses/search");
		}
	}, [isError, isSuccess, navigate, courseId, course]);

	return null; // or any loading indicator if needed
};

export default StudyIndex;
