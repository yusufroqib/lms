import React from "react";
import { Link } from "react-router-dom";
import RenderTag from "../RenderTag";
import Metric from "../Metric";
import { formatAndDivideNumber, getTimestamp } from "@/lib/utils";
// import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../EditDeleteAction";
import useAuth from "@/hooks/useAuth";

const PostCard = ({
	_id,
	title,
	tags,
	author,
	upvotes,
	views,
	replies,
	createdAt,
}) => {
	// console.log(createdAt)
	const { username, isTutor, isAdmin, _id: userId } = useAuth();

	const showActionButtons = userId && userId === author?._id;
	return (
		<div className="shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] bg-gray-100  rounded-[10px] p-9 sm:px-11">
			<div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
				<div>
					<span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
						{getTimestamp(createdAt)}
					</span>
					<Link to={`/community/posts/${_id}`}>
						<h3 className="sm:h3-semibold base-semibold text-dark200_light900 hover:text-blue-700 line-clamp-1 flex-1">
							{title}
						</h3>
					</Link>
				</div>

				{/* <SignedIn> */}
				{showActionButtons && <EditDeleteAction type="Post" itemId={_id} />}
				{/* </SignedIn> */}
			</div>

			<div className="mt-3.5 flex flex-wrap gap-2">
				{tags.map((tag) => (
					<RenderTag
						key={tag._id}
						_id={tag._id}
						name={tag.name}
						className={"background-light700_dark300"}
					/>
				))}
			</div>

			<div className="flex-between mt-6 w-full flex-wrap gap-3">
				<Metric
					imgUrl={author.avatar}
					alt="user"
					value={author.name}
					title={` - posted ${getTimestamp(createdAt)}`}
					href={`/profile/${author._id}`}
					isAuthor
					textStyles="body-medium text-dark400_light700 hover:text-blue-800"
				/>

				<div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
					<Metric
						imgUrl="/assets/icons/like.svg"
						alt="Upvotes"
						value={formatAndDivideNumber(upvotes.length)}
						title=" Votes"
						textStyles="small-medium text-dark400_light800"
					/>
					<Metric
						imgUrl="/assets/icons/message.svg"
						alt="message"
						value={formatAndDivideNumber(replies.length)}
						title=" Replies"
						textStyles="small-medium text-dark400_light800"
					/>
					<Metric
						imgUrl="/assets/icons/eye.svg"
						alt="eye"
						value={formatAndDivideNumber(views)}
						title=" Views"
						textStyles="small-medium text-dark400_light800"
					/>
				</div>
			</div>
		</div>
	);
};

export default PostCard;
