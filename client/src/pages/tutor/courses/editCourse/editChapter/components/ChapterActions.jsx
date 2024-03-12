"use client";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { getStorage, ref, listAll, deleteObject } from "firebase/storage";
import app from "../../../../../../firebase";
import {
	useDeleteChapterMutation,
	useToggleChapterPublishMutation,
} from "@/features/courses/coursesApiSlice";
import { useNavigate } from "react-router-dom";

export const ChapterActions = ({
	disabled,
	courseId,
	chapterId,
	isPublished,
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [deleteChapter] = useDeleteChapterMutation(); // Ensure you have the appropriate mutation hook
	const [toggleChapterPublish] = useToggleChapterPublishMutation(); // Ensure you have the appropriate mutation hook
	const navigate = useNavigate();

  const deleteFolderAndContents = async (folderPath) => {
    const storage = getStorage(app);
    const folderRef = ref(storage, folderPath);

    try {
        // List all items in the folder
        const { items, prefixes } = await listAll(folderRef);
        // console.log(items)
        // console.log(prefixes)

        // Delete items in the folder if any
        if (items.length > 0) {
            await Promise.all(items.map(async (itemRef) => {
                // Delete individual file
                await deleteObject(itemRef);
            }));
        }

        // Recursively delete subdirectories if any
        if (prefixes.length > 0) {
            await Promise.all(prefixes.map(async (prefix) => {
                await deleteFolderAndContents(prefix._location.path_);
            }));
        }

        console.log('Folder and its contents deleted successfully');
    } catch (error) {
      toast.error('Something went wrong')
        console.error('Error deleting folder and its contents:', error);
    }
};


	const onClick = async () => {
		try {
			setIsLoading(true);
			if (isPublished) {
				await toggleChapterPublish({
					courseId: courseId,
					chapterId: chapterId,
				}).unwrap();
				toast.success("Chapter unpublished");
			} else {
				await toggleChapterPublish({
					courseId: courseId,
					chapterId: chapterId,
				}).unwrap();
				toast.success("Chapter published");
			}
		} catch {
			toast.error("Something went wrong");
		} finally {
			setIsLoading(false);
		}
	};
	const onDelete = async () => {
		try {
			setIsLoading(true);
			const folderPath = 
				`Courses/${courseId}/Chapters/${chapterId}`			
				await deleteFolderAndContents(folderPath);

			await deleteChapter({
				courseId: courseId,
				chapterId: chapterId,
			}).unwrap(); //     toast.success("Chapter deleted");
			navigate(`/tutors/edit-course/${courseId}`);
			toast.success("Chapter deleted");
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
					<Trash className="h-4 w-4" />
				</Button>
			</ConfirmModal>
		</div>
	);
};
