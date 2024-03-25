import React, { useState, useEffect } from "react";
import {
	Link,
	useLocation,
	useParams,
	useSearchParams,
} from "react-router-dom";
import Filter from "../../components/Filter";
import NoResult from "../../components/NoResult";
import Pagination from "../../components/Pagination";
import LocalSearchBar from "../../components/search/LocalSearchBar";
import { TagFilters } from "@/lib/filters";
import {
	useGetAllTagsQuery,
	useGetPostByTagIdQuery,
} from "@/features/posts/postsApiSlice";
import qs from "query-string";

const TagPosts = () => {
	const { tagId } = useParams();
	const [searchParams, setSearchParams] = useSearchParams();
	const filter_search = searchParams.get("filter");
	const q_search = searchParams.get("q");
	const page_search = searchParams.get("page");
	const location = useLocation();
	const [stringifyQuery, setStringifyQuery] = useState();
	const {
		data: result,
		isLoading,
		isSuccess,
		error,
		isError,
	} = useGetPostByTagIdQuery({ tagId, searchParams: stringifyQuery });
	console.log(result);

	useEffect(() => {
		const fetchPostsByTag = () => {
			const url = qs.stringifyUrl(
				{
					url: location.pathname,
					query: {
						searchQuery: q_search,
						tagId: tagId,
						page: page_search ? Number(page_search) : 1,
					},
				},
				{ skipEmptyString: true, skipNull: true }
			);

			const queryString = url.split("?")[1];
			setStringifyQuery(queryString);
		};

		fetchPostsByTag();
	}, [searchParams, tagId]);

	if (result) {
		return (
			<>
				<h1 className="h1-bold text-dark100_light900">{result.tagTitle}</h1>

				<div className="mt-11 w-full">
					<LocalSearchBar
						route={`/tags/${tagId}`}
						iconPosition="left"
						imgSrc="/assets/icons/search.svg"
						placeholder="Search tag posts"
						otherClasses="flex-1"
					/>
				</div>

				<div className="mt-10 flex w-full flex-col gap-6">
					{result.posts.length > 0 ? (
						result.posts.map((post) => (
							<Link
								to={`/community/posts/${post._id}`}
								key={post._id}
								className="shadow-light100_darknone"
							>
								<article className="background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-[260px]">
									<div className="background-light800_dark400 w-fit rounded-xl px-5 py-1.5">
										<p className="paragraph-semibold text-dark300_light900 ">
											{post.title}
										</p>
									</div>

									<p className="small-medium text-dark400_light500 mt-3.5">
										<span className="body-semibold primary-text-gradient mr-2.5">
											{post.upvotes.length}+
										</span>{" "}
										Upvotes
									</p>
								</article>
							</Link>
						))
					) : (
						<NoResult
							title="There’s no tag post to show"
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
	}
};

export default TagPosts;
