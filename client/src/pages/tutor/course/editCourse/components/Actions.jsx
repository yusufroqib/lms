// "use client";
// import axios from "axios";
import { LuTrash } from "react-icons/lu";
import { useState } from "react";
import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/confirm-modal";
// import { useConfettiStore } from "@/hooks/use-confetti-store";

import { useDispatch, useSelector } from "react-redux";
import {
	openConfetti,
	closeConfetti,
	selectConfettiIsOpen,
} from "@/features/confettiSlice";
import { useToggleCoursePublishMutation } from "@/features/courses/coursesApiSlice";

export const Actions = ({ disabled, courseId, isPublished }) => {
	// const router = useRouter();
	// const confetti = useConfettiStore();
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const [toggleCoursePublish] = useToggleCoursePublishMutation(); // Ensure you have the appropriate mutation hook

	const onClick = async () => {
		try {
			setIsLoading(true);
			if (isPublished) {
				await toggleCoursePublish({
					id: courseId,
				}).unwrap();
				toast.success("Course unpublished");
			} else {
				await toggleCoursePublish({
					id: courseId,
				}).unwrap();
				toast.success("Course published");
				// confetti.onOpen();
				dispatch(openConfetti());
			}
			// router.refresh();
		} catch {
			toast.error("Something went wrong");
		} finally {
			setIsLoading(false);
		}
	};
	const onDelete = async () => {
		try {
			setIsLoading(true);
			// await axios.delete(`/api/courses/${courseId}`);
			toast.success("Course deleted");
			// router.refresh();
			// router.push(`/teacher/courses`);
		} catch {
			toast.error("Something went wrong");
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<div className="flex items-center gap-x-2">
			<Button
				onClick={onClick}
				disabled={disabled || isLoading}
				variant="outline"
				size="sm"
			>
				{isPublished ? "Unpublish" : "Publish"}
			</Button>
			<ConfirmModal onConfirm={onDelete}>
				<Button size="sm" disabled={isLoading}>
					<LuTrash className="h-4 w-4" />
				</Button>
			</ConfirmModal>
		</div>
	);
};
