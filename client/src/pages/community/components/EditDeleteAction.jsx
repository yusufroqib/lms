import { useDeletePostMutation } from "@/features/posts/postsApiSlice";
import React from "react";
import { useNavigate } from "react-router-dom";
// import { deleteReply } from "@/lib/actions/reply.action";
// import { deletePost } from "@/lib/actions/post.action";
// import { getTimestamp } from "@/lib/utils";

const EditDeleteAction = ({ type, itemId }) => {
	const navigate = useNavigate();
    const [deletePost] = useDeletePostMutation();

	const handleEdit = () => {
		navigate(`/community/posts/edit-post/${itemId}`);
	};


	const handleDelete = async () => {
		try{
        if (type === "Post") {
			// Delete post
			await deletePost({
				postId: itemId,
			}).unwrap();
		} else if (type === "Reply") {
			// Delete reply
			// await deleteReply({
			// 	replyId: JSON.parse(itemId),
			// 	path: window.location.pathname,
			// });
		}
    }catch(error){
        console.log(error)
    }
	};

	return (
		<div className="flex items-center justify-end gap-3 max-sm:w-full">
			{type === "Post" && (
				<img
					src="/assets/icons/edit.svg"
					alt="Edit"
					width={14}
					height={14}
					className="cursor-pointer object-contain hover:scale-125"
					onClick={handleEdit}
				/>
			)}

			<img
				src="/assets/icons/trash.svg"
				alt="Delete"
				width={14}
				height={14}
				className="cursor-pointer object-contain hover:scale-125"
				onClick={handleDelete}
			/>
		</div>
	);
};

export default EditDeleteAction;
