import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

const LocalSearchBar = ({ route, iconPosition, imgSrc, placeholder, otherClasses }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q");
    const [search, setSearch] = useState(query || "");

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search) {
                const newUrl = formUrlQuery({
                    params: searchParams.toString(),
                    key: "q",
                    value: search,
                });
                navigate(newUrl, { replace: true });
            } else {
                if (window.location.pathname === route) {
                    const newUrl = removeKeysFromQuery({
                        params: searchParams.toString(),
                        keysToRemove: ["q"],
                    });
                    navigate(newUrl, { replace: true });
                }
            }
        }, 600);
        return () => clearTimeout(delayDebounceFn);
    }, [search, route, navigate, searchParams, query]);

    return (
        <div className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}>
            {iconPosition === "left" && (<img src="/assets/icons/search.svg" alt="search" width={20} height={24} className="cursor-pointer"/>)}
            <Input type="text" placeholder={placeholder} value={search} onChange={(e) => setSearch(e.target.value)} className="paragraph-regular no-focus placeholder text-dark400_light700 border-none bg-transparent shadow-none outline-none"/>
            {iconPosition === "right" && (<img src={imgSrc} alt="search" width={20} height={24} className="cursor-pointer"/>)}
        </div>
    );
};

export default LocalSearchBar;
