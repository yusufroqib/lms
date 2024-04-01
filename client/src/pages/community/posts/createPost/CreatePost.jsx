import React from "react";
import Post from "../../components/forms/Post";
import useAuth from "@/hooks/useAuth";
const CreatePost = () => {
	// const { userId } = auth();
	// if (!userId)
	//     redirect("/sign-in");
	// const mongoUser = await getUserById({ userId });
	// console.log(mongoUser);
	const { username, isTutor, isAdmin, _id: userId } = useAuth();

	return (
		<div>
			<h1 className="h1-bold text-dark100_light900">Create a post</h1>

			<div className="mt-9">
				<Post mongoUserId={userId} />
			</div>
		</div>
	);
};
export default CreatePost;
