import React, { useState, useCallback } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { GlobalSearchFilters } from "@/lib/filters";
import { formUrlQuery } from "@/lib/utils";

const GlobalFilters = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const typeParams = searchParams.get("type");
    const [active, setActive] = useState(typeParams || "");

    // console.log('rendering')

    const handleTypeClick = useCallback((item) => {
        let newUrl;
        if (active === item) {
            setActive("");
            searchParams.delete("type");
            newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: "type",
                value: null
            });
        } else {
            setActive(item);
            searchParams.set("type", item.toLowerCase());
            newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: "type",
                value: item.toLowerCase(),
            });
        }
        navigate(newUrl, { replace: true });
    }, [active, navigate, searchParams]);

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
