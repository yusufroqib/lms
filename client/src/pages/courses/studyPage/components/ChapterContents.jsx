import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CourseProgressButton } from "./CourseProgressButton";
import { File } from "lucide-react";
import { Banner } from "@/components/ui/banner";
import { Separator } from "@/components/ui/separator";
import parse from "html-react-parser";
import ReactPlayer from "react-player/lazy";
import { openConfetti } from "@/features/confettiSlice";
import { useDispatch } from "react-redux";
import { useUpdateChapterProgressMutation } from "@/features/courses/coursesApiSlice";
import toast from "react-hot-toast";

const ChapterContents = ({ nextChapterId, chapter, purchase, isTutor }) => {
	const { courseId } = useParams();
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const [updateCourseProgress] = useUpdateChapterProgressMutation();
	// const { userId } = auth();
	// if (!userId) {
	//     return redirect("/");
	// }
	// const { chapter, course, muxData, attachments, nextChapter, userProgress, purchase, } = await getChapter({
	//     userId,
	//     chapterId: params.chapterId,
	//     courseId: params.courseId,
	// });
	// if (!chapter || !course) {
	//     return redirect("/");
	// }
	const userProgress = chapter.userProgress;
	const attachments = chapter.attachments;
	const isLocked = !chapter.isFree && !purchase;

	const isCompleted = !!userProgress?.isCompleted;

	const updateProgress = async () => {
		try {
			setIsLoading(true);
			// await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
			//     isCompleted: !isCompleted
			// });
			if (!isCompleted && !isTutor)
				await updateCourseProgress({
					courseId,
					chapterId: chapter._id,
				}).unwrap();
			if (!isCompleted && !nextChapterId && !isTutor) {
				// confetti.onOpen();
				dispatch(openConfetti());
			}
			if (nextChapterId) {
				navigate(`/study/${courseId}/chapter/${nextChapterId}`);
			}
			if (!isCompleted && !isTutor) toast.success("Progress updated");
			// router.refresh();
		} catch {
			toast.error("Something went wrong");
		} finally {
			setIsLoading(false);
		}
	};

	// const completeOnEnd = !!purchase && !userProgress?.isCompleted;
	return (
		<div>
			{userProgress?.isCompleted && (
				<Banner variant="success" label="You already completed this chapter." />
			)}
			{isLocked && !isTutor && (
				<Banner
					variant="warning"
					label="You need to purchase this course to watch this chapter."
				/>
			)}
			{isTutor && (
				<Banner
					variant="warning"
					label="You are viewing your own course. No study time will be recorded."
				/>
			)}
			<div className="flex flex-col max-w-4xl mx-auto pb-10">
				<div className="p-4">
					<ReactPlayer
						width={"100%"}
						height={"100%"}
						url={chapter.videoUrl}
						onEnded={updateProgress}
						controls
					/>
				</div>
				<div>
					<div className="p-4 flex flex-col md:flex-row items-center justify-between">
						<h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
						{purchase && (
							<CourseProgressButton
								chapterId={chapter._id}
								courseId={courseId}
								nextChapterId={nextChapterId}
								isCompleted={!!userProgress?.isCompleted}
								isTutor={isTutor}
							/>
						)}
					</div>
					<Separator />
					<div className="p-4">
						{parse(chapter?.description)}
						{/* <Markdown value={chapter.description}/> */}
						{/* <Markdown value={chapter.description}/> */}
					</div>
					{!!attachments.length && (
						<>
							<Separator />
							<div className="p-4">
								{attachments.map((attachment) => (
									<a
										href={attachment.url}
										target="_blank"
										key={attachment._id}
										className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
									>
										<File />
										<p className="line-clamp-1">{attachment.name}</p>
									</a>
								))}
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default ChapterContents;
