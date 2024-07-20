import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import { getTopInteractedTags } from "@/lib/actions/tag.actions";
// import Image from "next/image";
import RenderTag from "../RenderTag";
import { Badge } from "@/components/ui/badge";
import { useGetTopInteractedTagsQuery } from "@/features/posts/postsApiSlice";

const UserCard = ({ user }) => {
	// const [interactedTags, setInteractedTags] = useState([]);
	const {
		data: interactedTags = [],
		isLoading,
		isSuccess,
		error,
		isError,
	} = useGetTopInteractedTagsQuery({ userId: user._id });


	// useEffect(() => {
	//     const fetchTags = async () => {
	//         // const tags = await getTopInteractedTags({ userId: user._id });
	//         // setInteractedTags(tags);
	//     };

	//     fetchTags();
	// }, [user._id]);
	if (interactedTags) {
		return (
			<Link
				to={`/community/profile/${user._id}`}
				className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]"
			>
				<article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
					<img
						src={user.avatar}
						alt="user profile picture"
						width={100}
						height={100}
						className="rounded-full"
					/>
					<div className="mt-4 text-center">
						<h3 className="h3-bold text-dark200_light900 line-clamp-1">
							{user.name}
						</h3>
						<p className="body-regular text-dark500_light500 mt-2">
							@{user.username}
						</p>
					</div>
					<div className="mt-5">
						{interactedTags.length > 0 ? (
							<div className="flex items-center gap-2">
								{interactedTags.map((tag) => (
									<RenderTag key={tag._id} _id={tag._id} name={tag.name} />
								))}
							</div>
						) : (
							<Badge>No tags yet</Badge>
						)}
					</div>
				</article>
			</Link>
		);
	}
};

export default UserCard;
