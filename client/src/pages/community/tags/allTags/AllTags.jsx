import React, { useState, useEffect } from "react";
import { Link, Navigate, useLocation, useSearchParams } from "react-router-dom";
import Filter from "../../components/Filter";
import NoResult from "../../components/NoResult";
import Pagination from "../../components/Pagination";
import LocalSearchBar from "../../components/search/LocalSearchBar";
import { TagFilters } from "@/lib/filters";
import { useGetAllTagsQuery } from "@/features/posts/postsApiSlice";
import qs from "query-string";
import Loading from "./components/Loading";

// import { getAllTags } from "@/lib/actions/tag.actions";
// import useAuth from "@/hooks/useAuth";

const AllTags = () => {
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
	} = useGetAllTagsQuery({ searchParams: stringifyQuery });
    // console.log(result)

	useEffect(() => {
		const fetchSavedPosts = () => {
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
		};

		fetchSavedPosts();
	}, [searchParams]);

    
    if(isLoading) {
        return <Loading/>
    }

	if ((isSuccess && !result) || isError) {
		return <Navigate to="/community/feeds" />;
	}

	if (result) {
		return (
			<>
				<h1 className="h1-bold text-dark100_light900">All Tags</h1>

				<div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
					<LocalSearchBar
						route="/community/all-tags"
						iconPosition="left"
						imgSrc="/assets/icons/search.svg"
						placeholder="Search for tags"
						otherClasses="flex-1"
					/>

					<Filter
						filters={TagFilters}
						otherClasses="min-h-[56px] sm:min-w-[170px]"
					/>
				</div>

				<section className="mt-12 flex flex-wrap gap-4">
					{result.tags.length > 0 ? (
						result?.tags?.map((tag) => (
							<Link
								to={`/community/tags/${tag._id}`}
								key={tag._id}
								className="shadow-light100_darknone"
							>
								<article className="background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-[260px]">
									<div className="background-light800_dark400 w-fit rounded-xl px-5 py-1.5">
										<p className="paragraph-semibold text-dark300_light900 ">
											{tag.name}
										</p>
									</div>

									<p className="small-medium text-dark400_light500 mt-3.5">
										<span className="body-semibold primary-text-gradient mr-2.5">
											{tag?.posts?.length}+
										</span>{" "}
										{tag.posts.length === 1 ? 'Post' : 'Posts'}
									</p>
								</article>
							</Link>
						))
					) : (
						<NoResult
							title="No Tags Found"
							description="It looks like there are no tags found."
							link="/community/create-post"
							linkTitle="Create a Post"
						/>
					)}
				</section>
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

export default AllTags;
