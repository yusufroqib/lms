import React, { useState, useEffect } from "react";
import Filter from "./Filter";
import { AnswerFilters } from "@/constants/filters";
import { getAnswers } from "@/lib/actions/answer.action";
import { Link } from "react-router-dom";
import { getTimestamp } from "@/lib/utils";
import ParseHTML from "./ParseHTML";
import Votes from "./Votes";

const AllAnswers = ({ questionId, userId, totalAnswers, page, filter }) => {
    const [result, setResult] = useState({ answers: [] });

    useEffect(() => {
        const fetchAnswers = async () => {
            const answersResult = await getAnswers({
                questionId,
                page: page ? +page : 1,
                sortBy: filter,
            });
            setResult(answersResult);
        };

        fetchAnswers();
    }, [questionId, page, filter]);

    return (
        <div className="mt-11">
            <div className="flex items-center justify-between">
                <h3 className="primary-text-gradient">{totalAnswers} Answers</h3>
                <Filter filters={AnswerFilters} />
            </div>

            <div>
                {result.answers.map((answer) => (
                    <article key={answer._id} className="text-dark100_light900 light-border border-b py-10">
                        <div className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                            <Link to={`/profile/${answer.author.clerkId}`} className="flex flex-1 items-start gap-1 sm:items-center">
                                <img src={answer.author.picture} width={18} height={18} alt="profile" className="rounded-full object-cover max-sm:mt-0.5"/>
                                <div className="flex flex-col sm:flex-row sm:items-center">
                                    <p className="body-semibold text-dark300_light700">
                                        {answer.author.name}
                                    </p>
                                    <p className="small-regular text-light400_light500 ml-0.5 mt-0.5 line-clamp-1">
                                        answered {getTimestamp(answer.createdAt)}
                                    </p>
                                </div>
                            </Link>
                            <div className="flex justify-end">
                                <Votes type="Answer" itemId={JSON.stringify(answer.id)} userId={JSON.stringify(userId)} upvotes={answer.upvotes.length} hasupVoted={answer.upvotes.includes(userId)} downvotes={answer.downvotes.length} hasdownVoted={answer.downvotes.includes(userId)}/>
                            </div>
                        </div>
                        <ParseHTML data={answer.content} />
                    </article>
                ))}
            </div>
        </div>
    );
};

export default AllAnswers;