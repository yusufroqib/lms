import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

import React, { useState } from "react";
import PreviewDialog from "./PreviewDialog";
import toast from "react-hot-toast";
import useAuth from "@/hooks/useAuth";

const PreviewChaptersList = ({ chapters, isPurchased, tutorId }) => {
	const { username, isTutor, isAdmin, _id } = useAuth();
	const [clickedId, setClickedId] = useState("");
	const [chapter, setChapter] = useState(null);
	const [open, setOpen] = useState(false);

	const isCourseOwner = tutorId === _id

	const handleClick = (chapter) => {
		if (!chapter.isFree && !isPurchased && !isCourseOwner) {
			return toast.error("This chapter is not free for preview");
		}
		setClickedId(chapter._id);
		setChapter(chapter);
		setOpen(true);
	};
	return (
		<div className="border p-4 mt-6 pb-0 rounded-lg">
			{chapters.map((chapter, index) => (
				<div
					key={chapter._id}
					onClick={() => handleClick(chapter)}
					className={cn(
						"flex items-center cursor-pointer justify-between gap-x-2 p-3 bg-sky-100/20 border-sky-200 text-sky-700 border rounded-md mb-4 text-sm transition-all hover:text-sky-600 hover:bg-sky-200/20",
						chapter._id === clickedId &&
							"text-sky-700 bg-sky-200/50 hover:bg-sky-200/60 hover:text-sky-700"
						// chapter.isPublished && "bg-sky-100 border-sky-200 text-sky-700"
					)}
				>
					{chapter.title}
					{!chapter.isFree && !isPurchased && !isCourseOwner&& (
						<div>
							<Lock
								size={22}
								className={cn(
									"text-slate-500 mr-4",
									chapter._id === clickedId && "text-slate-700"
								)}
							/>
						</div>
					)}
					{chapter.isFree && !isPurchased && !isCourseOwner && (
						<div className="ml-auto pr-2 flex items-center gap-x-2">
							<Badge>Free</Badge>
						</div>
					)}
				</div>
			))}
			{chapter && (
				<PreviewDialog
					open={open}
					chapter={chapter}
					setOpen={setOpen}
					setClickedId={setClickedId}
					setChapter={setChapter}
				/>
			)}
		</div>
	);
};

export default PreviewChaptersList;
