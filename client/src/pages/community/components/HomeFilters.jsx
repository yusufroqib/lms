import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams, useNavigate } from "react-router-dom";
import { formUrlQuery } from "@/lib/utils";
import { HomePageFilters } from "@/lib/filters";

const HomeFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [active, setActive] = useState("");

    const handleTypeClick = (item) => {
        if (active === item) {
            setActive("");
            const newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: "filter",
                value: null,
            });
            navigate(newUrl, { replace: true });
        } else {
            setActive(item);
            const newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: "filter",
                value: item.toLowerCase(),
            });
            navigate(newUrl, { replace: true });
        }
    };

    return (
        <div className="mt-10 hidden flex-wrap gap-3 md:flex">
            {HomePageFilters.map((item) => (
                <Button
                    key={item.value}
                    onClick={() => handleTypeClick(item.value)}
                    className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${
                        active === item.value
                            ? "dark:hover:bg-dark400 bg-primary-100 text-primary-500 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500"
                            : "bg-light-800 text-light-500 hover:bg-light-700 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300"
                    }`}
                >
                    {item.name}
                </Button>
            ))}
        </div>
    );
};

export default HomeFilters;
