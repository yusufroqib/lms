import React from "react";
import { CourseNavbar } from "./components/CourseNavbar";
import CourseSidebar from "./components/CourseSidebar";
import { useGetEnrolledCoursesQuery } from "@/features/courses/coursesApiSlice";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import ChapterContents from "./components/ChapterContents";
import useStudyTimeTracker from "@/hooks/useStudyTimeTracker";

const StudyPage = () => {
	const { courseId, chapterId } = useParams();
	const { username, isTutor, isAdmin, _id } = useAuth();
	const { duration } = useStudyTimeTracker(courseId);
	const navigate = useNavigate();

	// console.log(duration)

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

	// console.log(course)

	// console.log(course);

	// if(!course) return <div>Loading...</div>
	if (isError) return <div>Error</div>;
	if (isLoading || isFetching) return <div>Loading...</div>;

	if ((!course && isSuccess) || isError) {
		navigate("/courses/search");
	}
	// if(isSuccess) console.log(course)

	if (!!course && isSuccess) {
		const isPurchased = course.purchasedBy.some((item) => item.user === _id);
		// console.log('TTTTTTTTTT', isPurchased)\
		const chapter = course.chapters.find(
			(chapter) => chapter._id === chapterId
		);
		const nextChapterIndex =
			course.chapters.findIndex((chapter) => chapter._id === chapterId) + 1;
		const nextChapterId = course.chapters[nextChapterIndex]?._id;
		// console.log(chapter)
		return (
			<div className="min-h-full">
				<div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
					{/* <p>Duration: {duration} seconds</p> */}

					<CourseNavbar
						course={{ ...course }}
						progressCount={course.progress}
					/>
				</div>
				<div className="hidden md:flex h-full bg-white w-80 flex-col fixed  inset-y-0 z-50">
					<CourseSidebar
						course={{ ...course }}
						progressCount={course.progress}
						purchase={isPurchased}
					/>
				</div>
				<main className="md:pl-80 pt-[80px] bg-white h-full">
					<ChapterContents
						chapter={chapter}
						nextChapterId={nextChapterId}
						purchase={isPurchased}
					/>
				</main>
			</div>
		);
	}
};

export default StudyPage;
