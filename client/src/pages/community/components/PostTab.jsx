import React, { useState, useEffect } from "react";
// import { getUserPosts } from "@/lib/actions/user.action";
import PostCard from "./cards/PostCard";
import Pagination from "./Pagination";
import { useGetUserPostsQuery } from "@/features/posts/postsApiSlice";

const PostTab = ({ searchParams, userId }) => {
	// const [posts, setPosts] = useState([]);
	// const [isNextPosts, setIsNextPosts] = useState(false);
	const reqData = {
		userId,
		page: searchParams.page ? +searchParams.page : 1,
	};


    const newnum = searchParams.page ? +searchParams.page : 1
    console.log(searchParams)

	const {
		data: userPosts,
		isLoading,
		isError,
		error,
	} = useGetUserPostsQuery(reqData);

	const posts = userPosts?.posts;
	const isNextPosts = userPosts?.isNextPosts;

	// useEffect(() => {
	//     const fetchPosts = async () => {
	// const result = await getUserPosts({
	//     userId,
	//     page: searchParams.page ? +searchParams.page : 1,
	// });
	// setPosts(result.posts);
	// setIsNextPosts(result.isNextPosts);
	//     };

	//     fetchPosts();
	// }, [searchParams, userId]);
	if (userPosts) {
		return (
			<>
				{posts.map((post) => (
					<PostCard
						key={post._id}
						_id={post._id}
						title={post.title}
						tags={post.tags}
						author={post.author}
						upvotes={post.upvotes}
						views={post.views}
						replies={post.replies}
						createdAt={post.createdAt}
					/>
				))}
				<div className="mt-10">
					<Pagination
						pageNumber={searchParams?.page ? +searchParams.page : 1}
						isNext={isNextPosts}
					/>
				</div>
			</>
		);
	}
};

export default PostTab;
