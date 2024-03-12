import React, { useEffect, useState } from "react";
import { useGetTutorCoursesQuery } from "@/features/courses/coursesApiSlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Eye, File, LayoutDashboard, Video } from "lucide-react";
import { IconBadge } from "@/components/ui/icon-badge";
import { Banner } from "@/components/ui/banner";
import { ChapterActions } from "./components/ChapterActions";
import { ChapterTitleForm } from "./components/ChapterTitleForm";
import { ChapterDescriptionForm } from "./components/ChapterDescriptionForm";
import { ChapterAccessForm } from "./components/ChapterAccessForm";
import { AttachmentForm } from "./components/AttachmentForm";
import { ChapterVideoForm } from "./components/ChapterVideoForm";

const EditChapter = () => {
	const { courseId, chapterId } = useParams();
	const [chapter, setChapter] = useState(null);
	const navigate = useNavigate();
	// console.log(courseId, chapterId);
	const { course, isLoading, isFetching, isSuccess, isError } =
		useGetTutorCoursesQuery("tutorCourses", {
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

	useEffect(() => {
		if (course) {
			const allChapters = course.chapters;
			const chapter = allChapters.find((chapter) => chapter._id === chapterId);
			setChapter(chapter);
		}
	}, [isSuccess, course]);

	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (isError) {
		navigate("/tutors/my-courses");
	}

	if (isSuccess && course && chapter) {
		const requiredFields = [
			chapter.title,
			chapter.description,
			chapter.videoUrl,
		];
		const totalFields = requiredFields.length;
		const completedFields = requiredFields.filter(Boolean).length;
		const completionText = `(${completedFields}/${totalFields})`;
		const isComplete = requiredFields.every(Boolean);
		return (
			<>
				{!chapter.isPublished && (
					<Banner
						variant="warning"
						label="This chapter is unpublished. It will not be visible in the course"
					/>
				)}
				<div className="p-6">
					<div className="flex items-center justify-between">
						<div className="w-full">
							<Link
								to={`/tutors/edit-course/${courseId}`}
								className="flex items-center text-sm hover:opacity-75 transition mb-6"
							>
								<ArrowLeft className="h-4 w-4 mr-2" />
								Back to course setup
							</Link>
							<div className="flex items-center justify-between w-full">
								<div className="flex flex-col gap-y-2">
									<h1 className="text-2xl font-medium">Chapter Creation</h1>
									<span className="text-sm text-slate-700">
										Complete all fields {completionText}
									</span>
								</div>
								<ChapterActions
									disabled={!isComplete}
									courseId={courseId}
									chapterId={chapterId}
									isPublished={chapter.isPublished}
								/>
							</div>
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
						<div className="space-y-4">
							<div>
								<div className="flex items-center gap-x-2">
									<IconBadge icon={LayoutDashboard} />
									<h2 className="text-xl">Customize your chapter</h2>
								</div>
								<ChapterTitleForm
									initialData={chapter}
									courseId={courseId}
									chapterId={chapterId}
								/>
								<ChapterDescriptionForm
									initialData={chapter}
									courseId={courseId}
									chapterId={chapterId}
								/>
							</div>
							<div>
								<div className="flex items-center gap-x-2">
									<IconBadge icon={Eye} />
									<h2 className="text-xl">Access Settings</h2>
								</div>
								<ChapterAccessForm
									coursePrice={course.price}
									initialData={chapter}
									courseId={courseId}
									chapterId={chapterId}
								/>
							</div>
						</div>

						<div className="space-y-4">
							<div>
								<div className="flex items-center gap-x-2">
									<IconBadge icon={Video} />
									<h2 className="text-xl">Add a video</h2>
								</div>
								<ChapterVideoForm
									initialData={chapter}
									courseId={courseId}
									chapterId={chapterId}
								/>
							</div>

							<div>
								<div className="flex items-center gap-x-2">
									<IconBadge icon={File} />
									<h2 className="text-xl">Resources & Attachments</h2>
								</div>
								<AttachmentForm
									initialData={chapter}
									courseId={courseId}
									chapterId={chapterId}
								/>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}
};

export default EditChapter;
