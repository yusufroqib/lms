import React, { useState, useEffect } from "react";
import {
	Link,
	Navigate,
	useParams,
	useRevalidator,
	useSearchParams,
} from "react-router-dom";
// import Reply from "../../components/forms/Reply";
import AllReplies from "../../components/AllReplies";
import Metric from "../../components/Metric";
// import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "../../components/RenderTag";
import Votes from "../../components/Votes";
// import { getPostById } from "@/lib/actions/post.action";
// import { getUserById } from "@/lib/actions/user.action";
import { formatAndDivideNumber, getTimestamp } from "@/lib/utils";
// import { auth } from "@clerk/nextjs";
// import Image from "next/image";
// import parse from "html-react-parser";
import useAuth from "@/hooks/useAuth";
import { useGetPostByIdQuery } from "@/features/posts/postsApiSlice";
import { useGetUserByIdQuery } from "@/features/users/usersApiSlice";
import Reply from "../../components/forms/Reply";
import ParseHTML from "../../components/ParseHTML";
import Loading from "./components/Loading";
import EditDeleteAction from "../../components/EditDeleteAction";

const PostPage = () => {
	const { postId } = useParams();

	const [searchParams, setSearchParams] = useSearchParams();
	const { username, isTutor, isAdmin, _id: userId } = useAuth();
	const filter_search = searchParams.get("filter");
	const q_search = searchParams.get("q");
	const page_search = searchParams.get("page");

	const {
		data: result = {},
		isLoading,
		isFetching,
		isSuccess,
		error,
		isError,
	} = useGetPostByIdQuery({ postId });

	// console.log(!!result);
	// console.log(isFetching);

	const {
		data: mongoUser = {},
		isLoading: isLoadingUser,
		// isFetching: isFetchingUser,
		error: userError,
		refetch,
	} = useGetUserByIdQuery(userId);

	if (isLoading || isLoadingUser) {
		return <Loading />;
	}
	// if (isError) return <div>{error.message}</div>;

	if (isSuccess && !result) {
		// console.log('working...')
		return <Navigate to={"/community/feeds"} />;
	}

	if (isSuccess && result && mongoUser) {
		const showActionButtons = userId && userId === result?.author?._id;

		return (
			<>
				<div className="bg-gray-100 p-3 rounded-lg">
					<div className="flex-start w-full flex-col ">
						<div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
							<Link
								to={`/community/profile/${result?.author?._id}`}
								className="flex items-center justify-start gap-1 "
							>
								<img
									src={result.author.avatar}
									className="rounded-full"
									width={22}
									height={22}
									alt="profile"
								/>
								<p className="paragraph-semibold text-dark300_light700 hover:text-blue-700">
									{result?.author?.name}
								</p>
							</Link>
							<div className="flex justify-end">
								<Votes
									type="Post"
									itemId={result?._id}
									userId={userId}
									upvotes={result?.upvotes?.length}
									hasupVoted={result.upvotes?.includes(userId)}
									downvotes={result?.downvotes?.length}
									hasdownVoted={result?.downvotes?.includes(userId)}
									hasSaved={mongoUser?.saved.includes(result._id)}
									refetch={refetch}
								/>
							</div>
						</div>
						<h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
							{result.title}
						</h2>
					</div>
					<div className="mb-8 mt-5 flex flex-wrap gap-4">
						<Metric
							imgUrl="/assets/icons/clock.svg"
							alt="clock icon"
							value={` posted ${getTimestamp(result.createdAt)}`}
							title=""
							textStyles="small-medium text-dark400_light800"
						/>
						<Metric
							imgUrl="/assets/icons/message.svg"
							alt="message"
							value={formatAndDivideNumber(result.replies.length)}
							title=" Replies"
							textStyles="small-medium text-dark400_light800"
						/>
						<Metric
							imgUrl="/assets/icons/eye.svg"
							alt="eye"
							value={formatAndDivideNumber(result.views)}
							title=" Views"
							textStyles="small-medium text-dark400_light800"
						/>
					</div>
					<div className="border-gray-200   p-2">
						<ParseHTML data={result.content} />

						{/* <article className="markdown w-full min-w-full  ">
						{parse(result.content)}
					</article> */}
					</div>
					<div className="flex justify-between items-center">
						<div className="mt-8 flex flex-wrap gap-2">
							{result.tags.map((tag) => (
								<RenderTag
									key={tag._id}
									_id={tag._id}
									name={tag.name}
									showCount={false}
									className={"background-light700_dark300"}
								/>
							))}
						</div>
						{showActionButtons && <EditDeleteAction type="Post" itemId={postId} />}

					</div>
				</div>

				<AllReplies
					postId={result._id}
					userId={userId}
					totalReplies={result.replies.length}
					page={page_search}
					filter={filter_search}
				/>

				<Reply
					post={result.content}
					postId={JSON.stringify(result._id)}
					authorId={JSON.stringify(userId)}
				/>
			</>
		);
	}
};

export default PostPage;
