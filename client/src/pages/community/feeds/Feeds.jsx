import React, { useState, useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import PostCard from "../components/cards/PostCard";
import HomeFilters from "../components/HomeFilters";
import Filter from "../components/Filter";
import NoResult from "../components/NoResult";
import Pagination from "../components/Pagination";
import LocalSearchBar from "../components/search/LocalSearchBar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/lib/filters";
import qs from "query-string";
import useAuth from "@/hooks/useAuth";
import { useGetPostsQuery } from "@/features/posts/postsApiSlice";
import Loading from "./components/Loading";


const Feeds = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const { username, isTutor, isAdmin, _id: userId } = useAuth();
	const filter_search = searchParams.get("filter");
	const q_search = searchParams.get("q");
	const page_search = searchParams.get("page");
	const location = useLocation();
	const [stringifyQuery, setStringifyQuery] = useState("");

	const {
		data: postsResult,
		isLoading,
		isSuccess,
		error,
		isError,
	} = useGetPostsQuery({ searchParams: stringifyQuery });


	useEffect(() => {
		const fetchData = async () => {
			let data;
			if (filter_search === "recommended") {
				if (userId) {
					const url = qs.stringifyUrl(
						{
							url: location.pathname,
							query: {
								userId,
								searchQuery: q_search,
								page: page_search ? Number(page_search) : 1,
							},
						},
						{ skipEmptyString: true, skipNull: true }
					);

					const queryString = url.split("?")[1];
					setStringifyQuery(queryString);

					
				} else {
					data = {
						posts: [],
						isNext: false,
					};
				}
			} else {
				const url = qs.stringifyUrl(
					{
						url: location.pathname,
						query: {
							searchQuery: q_search,
							filter: filter_search,
							page: page_search ? Number(page_search) : 1,
						},
					},
					{ skipEmptyString: true, skipNull: true }
				);

				const queryString = url.split("?")[1];
				setStringifyQuery(queryString);
				
			}
		};

		fetchData();
	}, [searchParams, userId]);

	if (isLoading) return <Loading />;

	if (postsResult) {
		return (
			<>
				<div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
					<h1 className="h1-bold text-dark100_light900">Community Feed</h1>

					<Link
						to="/community/posts/create-post"
						className="flex justify-end max-sm:w-full"
					>
						<Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
							Create a Post
						</Button>
					</Link>
				</div>

				<div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
					<LocalSearchBar
						route="/community/feeds"
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
					{postsResult?.posts.length > 0 ? (
						postsResult?.posts.map((post) => (
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
							description="Be the first to break the silence! 🚀 Create a Post and kickstart the discussion. Your post could be the next big thing others learn from. Get involved! 💡"
							link="/community/posts/create-post"
							linkTitle="Create a Post"
						/>
					)}
				</div>
				<div className="mt-10">
					<Pagination
						pageNumber={page_search ? +page_search : 1}
						isNext={postsResult?.isNext}
					/>
				</div>
			</>
		);
	}
};

export default Feeds;
