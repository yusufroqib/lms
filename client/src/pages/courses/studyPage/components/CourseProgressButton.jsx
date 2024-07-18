"use client";
// import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
// import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
// import { useConfettiStore } from "@/hooks/use-confetti-store";
import { openConfetti } from "@/features/confettiSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useUpdateChapterProgressMutation } from "@/features/courses/coursesApiSlice";
export const CourseProgressButton = ({
	chapterId,
	courseId,
	isCompleted,
	nextChapterId,
	isTutor,
}) => {
	// const router = useRouter();
	// const confetti = useConfettiStore();
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const [updateCourseProgress] = useUpdateChapterProgressMutation();

	const onClick = async () => {
		try {
			if (isTutor) return;
			setIsLoading(true);
			// await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
			//     isCompleted: !isCompleted
			// });
			await updateCourseProgress({
				courseId,
				chapterId,
			}).unwrap();
			if (!isCompleted && !nextChapterId) {
				// confetti.onOpen();
				dispatch(openConfetti());
			}
			if (!isCompleted && nextChapterId) {
				navigate(`/study/${courseId}/chapter/${nextChapterId}`);
			}
			toast.success("Progress updated");
			// router.refresh();
		} catch {
			toast.error("Something went wrong");
		} finally {
			setIsLoading(false);
		}
	};
	const Icon = isCompleted ? CheckCircle : CheckCircle;

	return (
		<Button
			onClick={onClick}
			disabled={isLoading || isCompleted}
			type="button"
			variant={isCompleted ? "success" : "outline"}
			className="w-full md:w-auto"
		>
			{isCompleted ? "Completed" : "Mark as complete"}
			<Icon className="h-4 w-4 ml-2" />
		</Button>
	);
};
