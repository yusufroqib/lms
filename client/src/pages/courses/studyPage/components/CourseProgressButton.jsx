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
export const CourseProgressButton = ({
	chapterId,
	courseId,
	isCompleted,
	nextChapterId,
}) => {
	// const router = useRouter();
	// const confetti = useConfettiStore();
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const onClick = async () => {
		try {
			setIsLoading(true);
			// await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
			//     isCompleted: !isCompleted
			// });
			if (!isCompleted && !nextChapterId) {
				// confetti.onOpen();
				dispatch(openConfetti());
			}
			// if (!isCompleted && nextChapterId) {
			//     router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
			// }
			toast.success("Progress updated");
			// router.refresh();
		} catch {
			toast.error("Something went wrong");
		} finally {
			setIsLoading(false);
		}
	};
	const Icon = isCompleted ? XCircle : CheckCircle;
	return (
		<Button
			onClick={onClick}
			disabled={isLoading}
			type="button"
			variant={isCompleted ? "outline" : "success"}
			className="w-full md:w-auto"
		>
			{isCompleted ? "Not completed" : "Mark as complete"}
			<Icon className="h-4 w-4 ml-2" />
		</Button>
	);
};
