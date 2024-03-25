import React, { useState, useEffect } from "react";
import { Link, Navigate, useLocation, useSearchParams } from "react-router-dom";
import PostCard from "../components/cards/PostCard";
import Filter from "../components/Filter";
import NoResult from "../components/NoResult";
import Pagination from "../components/Pagination";
import LocalSearchBar from "../components/search/LocalSearchBar";
import useAuth from "@/hooks/useAuth";
import { PostFilters } from "@/lib/filters";
import qs from "query-string";
import { useGetSavedPostsQuery } from "@/features/posts/postsApiSlice";
import Loading from "./components/Loading";

// import { auth } from "@clerk/nextjs";

export default function MyCollection() {
	const [searchParams, setSearchParams] = useSearchParams();
	const { username, isTutor, isAdmin, _id: userId } = useAuth();
	// const [result, setResult] = useState({ posts: [], isNext: false });
	const filter_search = searchParams.get("filter");
	const q_search = searchParams.get("q");
	const page_search = searchParams.get("page");
	const location = useLocation();
	const [stringifyQuery, setStringifyQuery] = useState();
	// console.log(stringifyQuery);

	const {
		data: result,
		isLoading,
		isSuccess,
		error,
		isError,
	} = useGetSavedPostsQuery({ searchParams: stringifyQuery });

	useEffect(() => {
		const fetchSavedPosts = () => {
			if (!userId) return;
			if (userId) {
				const url = qs.stringifyUrl(
					{
						url: location.pathname,
						query: {
							userId,
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

		fetchSavedPosts();
	}, [userId, searchParams]);

	// if (!userId) return null;

    
	if (isLoading) {
		return <Loading />;
	}

	if ((isSuccess && !result) || isError) {
		return <Navigate to="/community/feeds" />;
	}


	if (result) {
		return (
			<>
				<h1 className="h1-bold text-dark100_light900">Saved Posts</h1>

				<div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
					<LocalSearchBar
						route="/community/my-collection"
						iconPosition="left"
						imgSrc="/assets/icons/search.svg"
						placeholder="Search for posts"
						otherClasses="flex-1"
					/>

					<Filter
						filters={PostFilters}
						otherClasses="min-h-[56px] sm:min-w-[170px]"
					/>
				</div>

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
							title="There’s no saved post to show"
							description="Be the first to break the silence! 🚀 Create a Post and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
							link="/community/posts/create-post"
							linkTitle="Create a Post"
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
	}
}
