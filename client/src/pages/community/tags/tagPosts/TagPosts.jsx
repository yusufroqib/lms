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
import PostCard from "../../components/cards/PostCard";
import Loading from "./components/Loading";

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

    if(isLoading) {
        return <Loading/>
    }

	if (result) {
        return (<>
            <h1 className="h1-bold text-dark100_light900">{result.tagTitle}</h1>
      
            <div className="mt-11 w-full">
              <LocalSearchBar route={`community/tags/${tagId}`} iconPosition="left" imgSrc="/assets/icons/search.svg" placeholder="Search tag posts" otherClasses="flex-1"/>
            </div>
      
            <div className="mt-10 flex w-full flex-col gap-6">
              {result.posts.length > 0 ? (
              //   result.posts.map((post: IPost) => (
              result.posts.map((post) => (<PostCard key={post._id} _id={post._id} title={post.title} tags={post.tags} author={post.author} upvotes={post.upvotes} views={post.views} replies={post.replies} createdAt={post.createdAt}/>))) : (<NoResult title="There’s no tag post to show" description="Be the first to break the silence! 🚀 Create a Post and kickstart the discussion. Your post could be the next big thing others learn from. Get involved! 💡" link="/ask-post" linkTitle="Ask a Post"/>)}
            </div>
            <div className="mt-10">
              <Pagination pageNumber={searchParams?.page ? +searchParams.page : 1} isNext={result.isNext}/>
            </div>
          </>);
	}
};

export default TagPosts;
