import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
// import { downvoteReply, upvoteReply } from "@/lib/actions/reply.action";
// import { viewPost } from "@/lib/actions/interaction.action";
// import { downvotePost, upvotePost } from "@/lib/actions/post.action";
// import { toggleSavePost } from "@/lib/actions/user.action";
import { formatAndDivideNumber } from "@/lib/utils";
import {
	useDownvotePostMutation,
	useDownvoteReplyMutation,
	useToggleSavePostMutation,
	useUpvotePostMutation,
	useUpvoteReplyMutation,
	useViewPostMutation,
} from "@/features/posts/postsApiSlice";
import toast from "react-hot-toast";
// import { toast } from "../ui/use-toast";

const Votes = ({
	type,
	itemId,
	userId,
	upvotes,
	hasupVoted,
	downvotes,
	hasdownVoted,
	hasSaved,
    refetch
}) => {
	const location = useLocation();
	// const pathname = location.pathname;
	const [viewPost, { isLoading, isSuccess }] = useViewPostMutation();

	const [upvotePost, { isError, error }] = useUpvotePostMutation();
	const [downvotePost] = useDownvotePostMutation();
	const [upvoteReply] = useUpvoteReplyMutation();
	const [downvoteReply] = useDownvoteReplyMutation();
	const [toggleSavePost] = useToggleSavePostMutation();
	// console.log(error)

	const handleSave = async () => {
		try {
			await toggleSavePost({
				userId,
				postId: itemId,
			}).unwrap();

			const title = `Post ${
				!hasSaved ? "saved in" : "removed from"
			} your collection`;
            refetch()
			toast.success(title);

			// return toast({
			//     title: `Post ${!hasupVoted ? "Saved in" : "Removed from"} your collection`,
			//     variant: !hasSaved ? "default" : "destructive",
			// });
		} catch (error) {
			console.log(error);
		}
	};

	const handleVote = async (action) => {
		// console.log(action);
		try {
			if (action === "upvote") {
				// console.log('running')
				if (type === "Post") {
					await upvotePost({
						postId: itemId,
						userId: userId,
						hasupVoted,
						hasdownVoted,
					}).unwrap();
				} else if (type === "Reply") {
					await upvoteReply({
						replyId: itemId,
						userId: userId,
						hasupVoted,
						hasdownVoted,
					}).unwrap();
				}
			}
			if (action === "downvote") {
				// console.log('running')

				if (type === "Post") {
					await downvotePost({
						postId: itemId,
						userId: userId,
						hasupVoted,
						hasdownVoted,
					}).unwrap();
				} else if (type === "Reply") {
					await downvoteReply({
						replyId: itemId,
						userId: userId,
						hasupVoted,
						hasdownVoted,
					}).unwrap();
				}
				// return toast({
				//     title: `Downvote ${!hasupVoted ? "Removed" : "Successful"}`,
				//     variant: !hasupVoted ? "default" : "destructive",
				// });
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		// viewPost({
		//     postId: JSON.parse(itemId),
		//     userId: userId ? JSON.parse(userId) : undefined,
		// });
		const viewPostData = async () => {
			try {
				// console.log(itemId)
				// console.log(userId)
				await viewPost({
					postId: itemId,
					userId: userId ? userId : undefined,
				}).unwrap();
			} catch (error) {
				console.log(error);
			}
		};
		viewPostData();
	}, []);

	return (
		<div className="flex gap-5">
			<div className="flex-center gap-2.5">
				<div className="flex-center gap-1.5">
					<img
						src={
							hasupVoted
								? "/assets/icons/upvoted.svg"
								: "/assets/icons/upvote.svg"
						}
						width={18}
						height={18}
						alt="upvote"
						className="cursor-pointer hover:scale-125"
						onClick={() => handleVote("upvote")}
					/>
					<div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
						<p className="subtle-medium text-dark400_light900">
							{formatAndDivideNumber(upvotes)}
						</p>
					</div>
				</div>
				<div className="flex-center gap-1.5">
					<img
						src={
							hasdownVoted
								? "/assets/icons/downvoted.svg"
								: "/assets/icons/downvote.svg"
						}
						width={18}
						height={18}
						alt="downvote"
						className="cursor-pointer hover:scale-125"
						onClick={() => handleVote("downvote")}
					/>
					<div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
						<p className="subtle-medium text-dark400_light900">
							{formatAndDivideNumber(downvotes)}
						</p>
					</div>
				</div>
			</div>
			{type === "Post" && (
				<img
					src={
						hasSaved
							? "/assets/icons/star-filled.svg"
							: "/assets/icons/star-red.svg"
					}
					width={18}
					height={18}
					alt="star"
					className="cursor-pointer hover:scale-125"
					onClick={handleSave}
				/>
			)}
		</div>
	);
};

export default React.memo(Votes);
