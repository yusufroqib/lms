import React from "react";
import { useNavigate } from "react-router-dom";
import { deleteAnswer } from "@/lib/actions/answer.action";
import { deleteQuestion } from "@/lib/actions/question.action";

const EditDeleteAction = ({ type, itemId }) => {
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate(`/question/edit/${JSON.parse(itemId)}`);
    };

    const handleDelete = async () => {
        if (type === "Question") {
            // Delete question
            await deleteQuestion({
                questionId: JSON.parse(itemId),
                path: window.location.pathname,
            });
        } else if (type === "Answer") {
            // Delete answer
            await deleteAnswer({
                answerId: JSON.parse(itemId),
                path: window.location.pathname,
            });
        }
    };

    return (
        <div className="flex items-center justify-end gap-3 max-sm:w-full">
            {type === "Question" && (
                <img
                    src="/assets/icons/edit.svg"
                    alt="Edit"
                    width={14}
                    height={14}
                    className="cursor-pointer object-contain"
                    onClick={handleEdit}
                />
            )}

            <img
                src="/assets/icons/trash.svg"
                alt="Delete"
                width={14}
                height={14}
                className="cursor-pointer object-contain"
                onClick={handleDelete}
            />
        </div>
    );
};

export default EditDeleteAction;
