import React, { useState, useEffect } from "react";
// import { getUserPosts } from "@/lib/actions/user.action";
import PostCard from "../cards/PostCard";
import Pagination from "./Pagination";

const PostTab = ({ searchParams, userId, clerkId }) => {
    const [posts, setPosts] = useState([]);
    const [isNextPosts, setIsNextPosts] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            // const result = await getUserPosts({
            //     userId,
            //     page: searchParams.page ? +searchParams.page : 1,
            // });
            // setPosts(result.posts);
            // setIsNextPosts(result.isNextPosts);
        };

        fetchPosts();
    }, [searchParams, userId]);

    return (
        <>
            {posts.map((post) => (
                <PostCard
                    key={post._id}
                    _id={post._id}
                    clerkId={clerkId}
                    title={post.title}
                    tags={post.tags}
                    author={post.author}
                    upvotes={post.upvotes}
                    views={post.views}
                    replies={post.replies}
                    createdAt={post.createdAt}
                />
            ))}
            <div className="mt-10">
                <Pagination pageNumber={searchParams?.page ? +searchParams.page : 1} isNext={isNextPosts} />
            </div>
        </>
    );
};

export default PostTab;
