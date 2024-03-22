import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import RenderTag from "./RenderTag";
// import { getHotQuestions } from "@/lib/actions/question.action";
// import { getTOpPopularTags } from "@/lib/actions/tag.actions";

const RightSidebar = () => {
    const [hotQuestions, setHotQuestions] = useState([]);
    const [popularTags, setPopularTags] = useState([]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const hotQuestionsData = await getHotQuestions();
    //         const popularTagsData = await getTOpPopularTags();
    //         setHotQuestions(hotQuestionsData);
    //         setPopularTags(popularTagsData);
    //     };

    //     fetchData();
    // }, []);

    return (
        <section className="bg-blue-500 light-border custom-scrollbar fixed mr-1 right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-l p-6 pt-32 shadow-light-300 dark:shadow-none max-xl:hidden">
            <div>
                <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
                <div className="mt-7 flex w-full flex-col gap-[30px]">
                    {hotQuestions.map((question) => (
                        <Link to={`/question/${question._id}`} key={question._id} className="flex cursor-pointer items-start justify-between gap-7">
                            <p className="body-medium text-dark500_light700">
                                {question.title}
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
                        <RenderTag key={tag._id} _id={tag._id} name={tag.name} totalQuestions={tag.numberOfQuestions} showCount/>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RightSidebar;
