import React, { useState, useEffect } from "react";
import Filter from "./Filter";
import { ReplyFilters } from "@/lib/filters";
// import { getReplies } from "@/lib/actions/reply.action";
import { Link } from "react-router-dom";
import { getTimestamp } from "@/lib/utils";
// import ParseHTML from "./ParseHTML";
import Votes from "./Votes";

const AllReplies = ({ postId, userId, totalReplies, page, filter }) => {
    
    const [result, setResult] = useState({ replies: [] });

    useEffect(() => {
        const fetchReplies = async () => {
            // const repliesResult = await getReplies({
            //     postId,
            //     page: page ? +page : 1,
            //     sortBy: filter,
            // });
            // setResult(repliesResult);
        };

        fetchReplies();
    }, [postId, page, filter]);

    return (
        <div className="mt-11">
            <div className="flex items-center justify-between">
                <h3 className="primary-text-gradient">{totalReplies} Replies</h3>
                <Filter filters={ReplyFilters} />
            </div>

            <div>
                {result.replies.map((reply) => (
                    <article key={reply._id} className="text-dark100_light900 light-border border-b py-10">
                        <div className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                            <Link to={`/profile/${reply.author.clerkId}`} className="flex flex-1 items-start gap-1 sm:items-center">
                                <img src={reply.author.picture} width={18} height={18} alt="profile" className="rounded-full object-cover max-sm:mt-0.5"/>
                                <div className="flex flex-col sm:flex-row sm:items-center">
                                    <p className="body-semibold text-dark300_light700">
                                        {reply.author.name}
                                    </p>
                                    <p className="small-regular text-light400_light500 ml-0.5 mt-0.5 line-clamp-1">
                                        replyed {getTimestamp(reply.createdAt)}
                                    </p>
                                </div>
                            </Link>
                            <div className="flex justify-end">
                                <Votes type="Reply" itemId={JSON.stringify(reply.id)} userId={JSON.stringify(userId)} upvotes={reply.upvotes.length} hasupVoted={reply.upvotes.includes(userId)} downvotes={reply.downvotes.length} hasdownVoted={reply.downvotes.includes(userId)}/>
                            </div>
                        </div>
                        {/* <ParseHTML data={reply.content} /> */}
                        {JSON.stringify(reply.content)}
                    </article>
                ))}
            </div>
        </div>
    );
};

export default AllReplies;
