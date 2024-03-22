import React, { useState, useEffect } from "react";
import { getUserQuestions } from "@/lib/actions/user.action";
import QuestionCard from "../cards/QuestionCard";
import Pagination from "./Pagination";

const QuestionTab = ({ searchParams, userId, clerkId }) => {
    const [questions, setQuestions] = useState([]);
    const [isNextQuestions, setIsNextQuestions] = useState(false);

    useEffect(() => {
        const fetchQuestions = async () => {
            const result = await getUserQuestions({
                userId,
                page: searchParams.page ? +searchParams.page : 1,
            });
            setQuestions(result.questions);
            setIsNextQuestions(result.isNextQuestions);
        };

        fetchQuestions();
    }, [searchParams, userId]);

    return (
        <>
            {questions.map((question) => (
                <QuestionCard
                    key={question._id}
                    _id={question._id}
                    clerkId={clerkId}
                    title={question.title}
                    tags={question.tags}
                    author={question.author}
                    upvotes={question.upvotes}
                    views={question.views}
                    answers={question.answers}
                    createdAt={question.createdAt}
                />
            ))}
            <div className="mt-10">
                <Pagination pageNumber={searchParams?.page ? +searchParams.page : 1} isNext={isNextQuestions} />
            </div>
        </>
    );
};

export default QuestionTab;
