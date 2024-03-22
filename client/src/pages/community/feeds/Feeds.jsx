import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PostCard from "../components/cards/PostCard";
import HomeFilters from "../components/HomeFilters";
import Filter from "../components/Filter";
import NoResult from "../components/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchBar from "../components/search/LocalSearchBar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/lib/filters";
import {
	getPosts,
	getRecommendedPosts,
} from "@/lib/actions/post.action";
import useAuth from "@/hooks/useAuth";
// import { auth } from "@clerk/nextjs";

// export const metadata = {
//     title: "Home | Dev Overflow",
// };
const Feeds = () => {
	// const { userId } = auth();
	const [searchParams, setSearchParams] = useSearchParams();
	const { username, isTutor, isAdmin, _id: userId } = useAuth();
	const [result, setResult] = useState({ posts: [], isNext: false });
	const filter_search = searchParams.get("filter");
	const q_search = searchParams.get("q");
	const page_search = searchParams.get("page");

	useEffect(() => {
		const fetchData = async () => {
			let data;
			if (filter_search === "recommended") {
				if (userId) {
					data = await getRecommendedPosts({
						userId,
						searchQuery: q_search,
						page: page_search ? Number(page_search) : 1,
					});
				} else {
					data = {
						posts: [],
						isNext: false,
					};
				}
			} else {
				data = await getPosts({
					searchQuery: q_search,
					filter: filter_search,
					page: page_search ? Number(page_search) : 1,
				});
			}
			setResult(data);
		};

		fetchData();
	}, [searchParams, userId]);

	return (
		<>
			<div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
				<h1 className="h1-bold text-dark100_light900">All Posts</h1>

				<Link to="/ask-post" className="flex justify-end max-sm:w-full">
					<Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
						Ask a Post
					</Button>
				</Link>
			</div>

			<div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
				<LocalSearchBar
					route="/"
					iconPosition="left"
					imgSrc="/assets/icons/search.svg"
					placeholder="Search for posts"
					otherClasses="flex-1"
				/>

				<Filter
					filters={HomePageFilters}
					otherClasses="min-h-[56px] sm:min-w-[170px]"
					containerClasses="hidden max-md:flex"
				/>
			</div>

			<HomeFilters />

			<div className="mt-10 flex w-full flex-col gap-6">
				{result.posts.length > 0 ? (
					result.posts.map((post) => (
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
					))
				) : (
					<NoResult
						title="There’s no post to show"
						description="Be the first to break the silence! 🚀 Ask a Post and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
						link="/ask-post"
						linkTitle="Ask a Post"
					/>
				)}
			</div>
			<div className="mt-10">
				<Pagination
					pageNumber={searchParams?.page ? +searchParams.page : 1}
					isNext={result.isNext}
				/>
			</div>
		</>
	);
};

export default Feeds;
