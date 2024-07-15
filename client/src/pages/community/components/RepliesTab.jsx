// import { getUserReplies } from "@/lib/actions/user.action";
// import { Link, useSearchParams } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import ReplyCard from "./cards/ReplyCard";
import Pagination from "./Pagination";
import { useGetUserRepliesQuery } from "@/features/posts/postsApiSlice";
const RepliesTab = ({ searchParams, userId }) => {
	const { username, isTutor, isAdmin, _id: loggedUserId } = useAuth();

	const reqData = {
		userId,
		page: searchParams.page ? +searchParams.page : 1,
	};

	const {
		data: result,
		isLoading,
		isError,
		error,
	} = useGetUserRepliesQuery(reqData);


	if (result) {
		return (
			<>
				{result.replies.map((item) => (
					<ReplyCard
						key={item._id}
						_id={item._id}
						post={item.post}
						author={item.author}
						upvotes={item.upvotes.length}
						createdAt={item.createdAt}
						// className={"background-light700_dark300"}

					/>
				))}
				<div className="mt-10">
					<Pagination
						pageNumber={searchParams?.page ? +searchParams.page : 1}
						isNext={result.isNextReply}
					/>
				</div>
			</>
		);
	}
};
export default RepliesTab;
