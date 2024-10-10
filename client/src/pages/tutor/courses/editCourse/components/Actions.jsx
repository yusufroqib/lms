// "use client";
// import axios from "axios";
import { LuTrash } from "react-icons/lu";
import { useState } from "react";
import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/confirm-modal";
// import { useConfettiStore } from "@/hooks/use-confetti-store";
import { getStorage, ref, listAll, deleteObject } from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import { openConfetti } from "@/features/confettiSlice";
import {
	useDeleteCourseMutation,
	useToggleCoursePublishMutation,
} from "@/features/courses/coursesApiSlice";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { useStreamChatClient } from "@/context/StreamChatContext";
import { ConfirmPublishModal } from "./ConfirmPublishModal";

export const Actions = ({
	disabled,
	price,
	title,
	courseImage,
	courseId,
	isPublished,
}) => {
	// const { _id, username, fullName, image, streamToken } = useAuth();
	const { streamChatClient } = useStreamChatClient();

	// const router = useRouter();
	// const confetti = useConfettiStore();
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const [toggleCoursePublish] = useToggleCoursePublishMutation(); // Ensure you have the appropriate mutation hook
	const [deleteCourse] = useDeleteCourseMutation(); // Ensure you have the appropriate mutation hook
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);

	// console.log(price);

	const deleteFolderAndContents = async (folderPath) => {
		const storage = getStorage();
		const folderRef = ref(storage, folderPath);

		try {
			// List all items in the folder
			const { items, prefixes } = await listAll(folderRef);
			// console.log(items)
			// console.log(prefixes)

			// Delete items in the folder if any
			if (items.length > 0) {
				await Promise.all(
					items.map(async (itemRef) => {
						// Delete individual file
						await deleteObject(itemRef);
					})
				);
			}

			// Recursively delete subdirectories if any
			if (prefixes.length > 0) {
				await Promise.all(
					prefixes.map(async (prefix) => {
						await deleteFolderAndContents(prefix._location.path_);
					})
				);
			}

			console.log("Folder and its contents deleted successfully");
		} catch (error) {
			toast.error("Something went wrong");
			console.error("Error deleting folder and its contents:", error);
		}
	};

	const onClick = async (data) => {
		let paymentMethod;

		try {
			setIsLoading(true);
			if (isPublished) {
				await toggleCoursePublish({
					id: courseId,
				}).unwrap();
				toast.success("Course unpublished");
				setOpen(false);
			} else {
				if (data.items.includes("card") && data.items.includes("crypto")) {
					paymentMethod = "both";
				} else if (data.items.includes("card")) {
					paymentMethod = "card";
				} else if (data.items.includes("crypto")) {
					paymentMethod = "crypto";
				} else if (
					data.items.includes("card") &&
					data.items.includes("crypto")
				) {
					paymentMethod = "both";
				}
				const channel = await streamChatClient.channel("messaging", courseId, {
					name: title,
					image: courseImage,
					// members: [_id, ...memberIds],
				});
				await channel.create();
				await toggleCoursePublish({
					id: courseId,
					paymentMethod,
				}).unwrap();
				console.log(paymentMethod);
				toast.success("Course published");
				// confetti.onOpen();
				dispatch(openConfetti());
				setOpen(false);
			}
		} catch (error) {
			console.log(error);
			if (error?.data?.message) {
				toast.error(error.data.message);
			} else {
				toast.error("Something went wrong");
			}
		} finally {
			setIsLoading(false);
		}
	};
	const onDelete = async () => {
		try {
			setIsLoading(true);
			const folderPath = `Courses/${courseId}`;
			await deleteFolderAndContents(folderPath);

			await deleteCourse({
				id: courseId,
			}).unwrap(); //     toast.success("Chapter deleted");

			navigate(`/tutors/my-courses`);
			toast.success("Course deleted");
		} catch (error) {
			console.log(error);
			toast.error("Something went wrong");
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<div className="flex items-center gap-x-2">
			<ConfirmPublishModal
				open={open}
				setOpen={setOpen}
				isPublished={isPublished}
				price={price}
				onConfirm={onClick}
			>
				<Button disabled={disabled || isLoading} variant="outline" size="sm">
					{isPublished ? "Unpublish" : "Publish"}
				</Button>
			</ConfirmPublishModal>
			<ConfirmModal onConfirm={onDelete}>
				<Button size="sm" disabled={isLoading}>
					<LuTrash className="h-4 w-4" />
				</Button>
			</ConfirmModal>
		</div>
	);
};
