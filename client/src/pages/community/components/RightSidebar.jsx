import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import RenderTag from "./RenderTag";
// import { getHotPosts } from "@/lib/actions/post.action";
// import { getTOpPopularTags } from "@/lib/actions/tag.actions";

const RightSidebar = () => {
    const [hotPosts, setHotPosts] = useState([]);
    const [popularTags, setPopularTags] = useState([]);

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
        <section className=" background-light900_dark200 light-border custom-scrollbar fixed mr-1 right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-l p-6 pt-32 shadow-light-300 dark:shadow-none max-xl:hidden">
            <div>
                <h3 className="h3-bold text-dark200_light900">Top Posts</h3>
                <div className="mt-7 flex w-full flex-col gap-[30px]">
                    {hotPosts.map((post) => (
                        <Link to={`/post/${post._id}`} key={post._id} className="flex cursor-pointer items-start justify-between gap-7">
                            <p className="body-medium text-dark500_light700">
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
                    {popularTags.map((tag) => (
                        <RenderTag key={tag._id} _id={tag._id} name={tag.name} totalPosts={tag.numberOfPosts} showCount/>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RightSidebar;
