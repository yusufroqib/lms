import React, { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import Post from "../../components/forms/Post";
// import { getPostById } from "@/lib/actions/post.action";
// import { getUserById } from "@/lib/actions/user.action";
// import { auth } from "@clerk/nextjs";
import { useGetPostByIdQuery } from "@/features/posts/postsApiSlice";
import useAuth from "@/hooks/useAuth";
import { useGetUserByIdQuery } from "@/features/users/usersApiSlice";

const EditPost = () => {
	const { postId } = useParams();
	// const [result, setResult] = useState({});
	// const [mongoUser, setMongoUser] = useState(null);
	// const { userId: clerkId } = auth();
	const { username, isTutor, isAdmin, _id: userId } = useAuth();

	const {
		data: result = {},
		isLoading,
		isSuccess,
		error,
		isError,
	} = useGetPostByIdQuery({ postId });
	const {
		data: mongoUser = {},
		isLoading: isLoadingUser,
		error: userError,
		refetch,
	} = useGetUserByIdQuery(userId);
	// console.log(result);
	// console.log(mongoUser);

    
	if (isSuccess && !result) {
		// console.log('working...')
		return <Navigate to={"/community/feeds"} />;
	}


	if (!userId || !mongoUser || !result) return null;

	if (Object.values(result).length > 0 && Object.values(mongoUser).length > 0) {
		return (
			<>
				<h1 className="h1-bold text-dark100_light900">Edit Post</h1>

				<div className="mt-9">
					<Post type="Edit" mongoUserId={mongoUser._id} postDetails={result} />
				</div>
			</>
		);
	}
};

export default EditPost;
