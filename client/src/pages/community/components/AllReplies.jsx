import React, { useState, useEffect } from "react";
import Filter from "./Filter";
import { ReplyFilters } from "@/lib/filters";
// import { getReplies } from "@/lib/actions/reply.action";
import { Link, useLocation } from "react-router-dom";
import { getTimestamp } from "@/lib/utils";
// import ParseHTML from "./ParseHTML";
import Votes from "./Votes";
import qs from "query-string";
// import parse from "html-react-parser";
import { useGetRepliesQuery } from "@/features/posts/postsApiSlice";
import ParseHTML from "./ParseHTML";
import AllRepliesLoading from "./AllRepliesLoading";

const AllReplies = ({ postId, userId, totalReplies, page, filter }) => {
	// const [result, setResult] = useState({ replies: [] });
	const location = useLocation();
	const url = qs.stringifyUrl(
		{
			url: location.pathname,
			query: {
				postId,
				sortBy: filter,
				page: page ? Number(page) : 1,
			},
		},
		{ skipEmptyString: true, skipNull: true }
	);

	// console.log(url);
	const queryString = url.split("?")[1];
	// console.log(queryString);

	const {
		data: result = {},
		isLoading,
		isSuccess,
		isFetching,
		error,
		isError,
	} = useGetRepliesQuery(queryString);

	// console.log(result)
	// console.log(error)

	if ( isLoading || !result) return <AllRepliesLoading />;
	// if (isError) return <div>{error.message}</div>;

	return (
		<div className="mt-11">
			<div className="flex items-center border-light-2 border-b pb-1 justify-between">
				<h3 className="primary-text-gradient">{totalReplies} Replies</h3>
				<Filter filters={ReplyFilters} />
			</div>

			<div>
				{result.replies.map((reply) => (
					<article
						key={reply._id}
						className="text-dark100_light900 light-border-2 border-b py-6 px-5 rounded-md m-4 bg-gray-100"
					>
						<div className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
							<Link
								to={`/community/profile/${reply.author._id}`}
								className="flex flex-1 items-start gap-1  sm:max-w-fit sm:items-center"
							>
								<img
									src={reply.author.avatar}
									width={18}
									height={18}
									alt="profile"
									className="rounded-full object-cover max-sm:mt-0.5"
								/>
								<div className="flex flex-col sm:gap-2 sm:flex-row sm:items-center">
									<p className="body-semibold text-dark300_light700 hover:text-blue-700">
										{reply.author.name}
									</p>
									<p className="small-regular text-light400_light500 ml-0.5 mt-0.5 line-clamp-1">
										replied {getTimestamp(reply.createdAt)}
									</p>
								</div>
							</Link>
							<div className="flex justify-end">
								<Votes
									type="Reply"
									itemId={reply?._id}
									userId={userId}
									upvotes={reply.upvotes.length}
									hasupVoted={reply.upvotes.includes(userId)}
									downvotes={reply.downvotes.length}
									hasdownVoted={reply.downvotes.includes(userId)}
								/>
							</div>
						</div>
						<ParseHTML data={reply.content} />
					</article>
				))}
			</div>
		</div>
	);
};

export default AllReplies;
