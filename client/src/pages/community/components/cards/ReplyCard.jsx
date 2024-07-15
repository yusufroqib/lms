import React from "react";
import { Link } from "react-router-dom";
import Metric from "../Metric";
import { formatAndDivideNumber, getTimestamp } from "@/lib/utils";
// import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../EditDeleteAction";
import useAuth from "@/hooks/useAuth";

const ReplyCard = ({ _id, post, author, upvotes, createdAt }) => {
	const { username, isTutor, isAdmin, _id: userId } = useAuth();
	const showActionButtons = userId && _id === author._id;
	return (
		<Link
			to={`/community/posts/${post._id}/#${_id}`}
			className=" bg-gray-100 rounded-[10px] px-11 py-9"
		>
			<div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
				<div>
					<span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
						{getTimestamp(createdAt)}
					</span>
					<h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
						{post.title}
					</h3>
				</div>
				{/* <SignedIn> */}
				{showActionButtons && (
					<EditDeleteAction type="Reply" itemId={JSON.stringify(_id)} />
				)}
				{/* </SignedIn> */}
			</div>

			<div className="flex-between mt-6 w-full flex-wrap gap-3">
				<Metric
					imgUrl={author.avatar}
					alt="user avatar"
					value={author.name}
					title={` • asked ${getTimestamp(createdAt)}`}
					href={`/profile/${author._id}`}
					textStyles="body-medium text-dark400_light700"
					isAuthor
				/>

				<div className="flex-center gap-3">
					<Metric
						imgUrl="/assets/icons/like.svg"
						alt="like icon"
						value={formatAndDivideNumber(upvotes)}
						title=" Votes"
						textStyles="small-medium text-dark400_light800"
					/>
				</div>
			</div>
		</Link>
	);
};

export default ReplyCard;
