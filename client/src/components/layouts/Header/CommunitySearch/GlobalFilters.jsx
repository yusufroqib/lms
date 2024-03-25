import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Adjusted for React Router v6
import { GlobalSearchFilters } from "@/lib/filters";
import { formUrlQuery } from "@/lib/utils";

const GlobalFilters = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const typeParams = searchParams.get("type");
    const [active, setActive] = useState(typeParams || "");

    const handleTypeClick = (item) => {
        let newUrl;
        if (active === item) {
            setActive("");
            searchParams.delete("type");
        } else {
            setActive(item);
            searchParams.set("type", item.toLowerCase());
        }
        newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: "type",
            value: item.toLowerCase(),
        });
        navigate(newUrl, { replace: true }); // Using navigate with replace option to update the URL without adding a new entry to the history stack
    };

    return (
        <div className="flex items-center gap-5 px-5">
            <p className="text-dark400_light900 body-medium">Type: </p>
            <div className="flex gap-3">
                {GlobalSearchFilters.map((item) => (
                    <button
                        type="button"
                        key={item.value}
                        className={`light-border-2 small-medium :text-light-800 rounded-2xl px-5 py-2 capitalize dark:hover:text-primary-500
                            ${active === item.value
                                ? "bg-primary-500 text-light-900"
                                : "bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500"}
                        `}
                        onClick={() => handleTypeClick(item.value)}
                    >
                        {item.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default GlobalFilters;
