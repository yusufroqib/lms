import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
// import { getUserInfo } from "@/lib/actions/user.action";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom"; // Adjusted for React Router
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getJoinedDate } from "@/lib/utils";
import ProfileLink from "../../components/ProfileLink";
import Stats from "../../components/Stats";
import PostTab from "../../components/PostTab";
import RepliesTab from "../../components/RepliesTab";
import { useGetUserInfoQuery } from "@/features/users/usersApiSlice";
import useAuth from "@/hooks/useAuth";
import Loading from "./components/Loading";

// Assuming you have a way to get the current user's ID, similar to auth().userId
const userId = "your_current_user_id_here"; // Placeholder, replace with actual logic

const PublicProfile = ({ params }) => {
	const { user } = useParams();
	const [searchParams, setSearchParams] = useSearchParams();
	const { username, isTutor, isAdmin, _id: userId } = useAuth();
	const [pageSearch, setPageSearch] = useState({});

	const page_search = searchParams.get("page");

	const {
		data: userInfo,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useGetUserInfoQuery(user);

	useEffect(() => {
		setPageSearch((prev) => ({ ...prev, page: page_search }));
	}, [page_search]);

	if (isLoading) {
		return <Loading />;
	}

	if ((isSuccess && !userInfo) || isError) {
		return <Navigate to="/community/feeds" />;
	}

	if (userInfo) {
		return (
			<>
				<div className="flex flex-col-reverse items-start justify-between sm:flex-row">
					<div className="flex flex-col items-start gap-4 lg:flex-row">
						<img
							src={userInfo?.user.avatar}
							alt="profile picture"
							width="140"
							height="140"
							className="rounded-full object-cover"
						/>

						<div className="mt-3">
							<h2 className="h2-bold text-dark100_light900">
								{userInfo.user.name}
							</h2>
							<p className="paragraph-regular text-dark200_light800">
								@{userInfo.user.username}
							</p>

							<div className="mt-5 flex flex-wrap items-center justify-start gap-5">
								{userInfo.user.portfolioWebsite && (
									<ProfileLink
										imgUrl="/assets/icons/link.svg"
										href={userInfo.user.portfolioWebsite}
										title="Portfolio"
									/>
								)}

								{userInfo.user.location && (
									<ProfileLink
										imgUrl="/assets/icons/location.svg"
										title={userInfo.user.location}
									/>
								)}

								<ProfileLink
									imgUrl="/assets/icons/calendar.svg"
									title={getJoinedDate(userInfo.user.joinedAt)}
								/>
							</div>

							{userInfo.user.bio && (
								<p className="paragraph-regular text-dark400_light800 mt-8">
									{userInfo.user.bio}
								</p>
							)}
						</div>
					</div>

					<div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
						{userId === userInfo.user._id && (
							<Link to="/profile/edit">
								<Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3">
									Edit Profile
								</Button>
							</Link>
						)}
					</div>
				</div>

				<Stats
					reputation={userInfo.reputation}
					totalPosts={userInfo.totalPosts}
					totalReplies={userInfo.totalReplies}
					badges={userInfo.badgeCounts}
				/>

				<div className="mt-10 flex gap-10">
					<Tabs defaultValue="top-posts" className="flex-1">
						<TabsList className="background-light800_dark400 min-h-[42px] p-1">
							<TabsTrigger value="top-posts" className="tab">
								Top Posts
							</TabsTrigger>
							<TabsTrigger value="replies" className="tab">
								Replies
							</TabsTrigger>
						</TabsList>
						<TabsContent
							value="top-posts"
							className="mt-5 flex w-full flex-col gap-6"
						>
							<PostTab
								searchParams={pageSearch}
								userId={userInfo.user._id}
								// clerkId={userId}
							/>
						</TabsContent>
						<TabsContent value="replies" className="flex w-full flex-col gap-6">
							<RepliesTab
								searchParams={pageSearch}
								userId={userInfo.user._id}
								// clerkId={userId}
							/>
						</TabsContent>
					</Tabs>
				</div>
			</>
		);
	}
};

export default PublicProfile;
