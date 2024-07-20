import React from "react";
import { CourseNavbar } from "./components/CourseNavbar";
import CourseSidebar from "./components/CourseSidebar";
import {
	useGetEnrolledCoursesQuery,
	useGetTutorCoursesQuery,
} from "@/features/courses/coursesApiSlice";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import ChapterContents from "./components/ChapterContents";
import useStudyTimeTracker from "@/hooks/useStudyTimeTracker";
import { Loader2 } from "lucide-react";

const StudyPage = () => {
	const { courseId, chapterId } = useParams();
	const { username, isTutor, isAdmin, _id } = useAuth();
	const { duration } = useStudyTimeTracker(courseId);
	const navigate = useNavigate();

	// console.log(duration)

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

	let course = purchasedCourse || tutorCourse;

	const publishedChapters =
		course?.chapters?.filter((chapter) => chapter.isPublished) || [];

	console.log(publishedChapters);

	// console.log(course);

	// console.log(course);

	// if(!course) return <div>Loading...</div>
	if (isError) return <div>Error</div>;
	if (isLoading || isFetching)
		return (
			<div className="flex min-h-[80vh] justify-center items-center">
				<Loader2 key="loader" className="mr-2 h-10 w-10 animate-spin" />{" "}
			</div>
		);

	if (
		(!course && isSuccess && !isTutorLoading) ||
		(isError && !isTutorLoading && !isLoading)
	) {
		// navigate("/courses/search");
		return <Navigate to={"/courses/search"} />;
	}
	// if(isSuccess) console.log(course)

	if (!!course && (isSuccess || isTutorSuccess)) {
		const isPurchased = course.purchasedBy.some((item) => item.user === _id);
		const isTutor = course.tutor === _id;
		// console.log('TTTTTTTTTT', isPurchased)\
		const chapter = publishedChapters.find(
			(chapter) => chapter._id === chapterId
		);
		const nextChapterIndex =
			publishedChapters.findIndex((chapter) => chapter._id === chapterId) + 1;
		const nextChapterId = course.chapters[nextChapterIndex]?._id;
		// console.log(chapter)
		return (
			<div className="min-h-full">
				<div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
					{/* <p>Duration: {duration} seconds</p> */}

					<CourseNavbar
						isTutor={isTutor}
						course={{ ...course }}
						progressCount={course.progress}
					/>
				</div>
				<div className="hidden md:flex h-full bg-white w-80 flex-col fixed  inset-y-0 z-50">
					<CourseSidebar
						course={{ ...course }}
						progressCount={course.progress}
						purchase={isPurchased}
						isTutor={isTutor}
					/>
				</div>
				<main className="md:pl-80 pt-[80px] bg-white h-full">
					<ChapterContents
						chapter={chapter}
						nextChapterId={nextChapterId}
						purchase={isPurchased}
						isTutor={isTutor}
					/>
				</main>
			</div>
		);
	}
};

export default StudyPage;
