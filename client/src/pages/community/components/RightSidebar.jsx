import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import RenderTag from "./RenderTag";
import { useGetHotPostsQuery, useGetPopularTagsQuery } from "@/features/posts/postsApiSlice";
// import { getHotPosts } from "@/lib/actions/post.action";
// import { getTOpPopularTags } from "@/lib/actions/tag.actions";

const RightSidebar = () => {
  
    const {
		data: hotPosts,
		isLoading,
		isSuccess,
		error,
		isError,
	} = useGetHotPostsQuery();

    const {
		data: popularTags,
		
	} = useGetPopularTagsQuery();
    // console.log(data)

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const hotPostsData = await getHotPosts();
    //         const popularTagsData = await getTOpPopularTags();
    //         setHotPosts(hotPostsData);
    //         setPopularTags(popularTagsData);
    //     };

    //     fetchData();
    // }, []);

    return (
        <section className=" background-light200_dark200 shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)] custom-scrollbar fixed mr-1 right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-l p-6 pt-32  dark:shadow-none max-xl:hidden">
            <div>
                <h3 className="h3-bold text-dark200_light900">Top Posts</h3>
                <div className="mt-7 flex w-full flex-col  ">
                    {hotPosts?.map((post) => (
                        <Link to={`/community/posts/${post._id}`} key={post._id} className="flex cursor-pointer items-start justify-between gap-7 py-4 hover:bg-gray-100">
                            <p className="body-medium text-dark500_light700 ">
                                {post.title}
                            </p>
                            <img src="/assets/icons/chevron-right.svg" alt="chevron-right" width={20} height={20} className="invert-colors"/>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="mt-16">
                <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
                <div className="mt-7 flex flex-col gap-4">
                    {popularTags?.map((tag) => (
                        <RenderTag key={tag._id} _id={tag._id} name={tag.name} totalPosts={tag.numberOfPosts} className={"bg-gray-100 hover:bg-gray-200"} showCount/>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RightSidebar;
