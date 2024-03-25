import React, { useEffect, useRef, useState } from 'react';
import { Input } from "@/components/ui/input";
import { useNavigate, useLocation } from 'react-router-dom'; // Adjusted for React Router
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import GlobalResult from "./GlobalResult";

const GlobalSearch = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchContainerRef = useRef(null);
    const query = searchParams.get("q");
    const [search, setSearch] = useState(query || "");
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearch("");
            }
        };
        document.addEventListener("click", handleOutsideClick);
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search) {
                const newUrl = formUrlQuery({
                    params: searchParams.toString(),
                    key: "global",
                    value: search,
                });
                navigate(newUrl, { replace: true });
            } else {
                if (query) {
                    const newUrl = removeKeysFromQuery({
                        params: searchParams.toString(),
                        keysToRemove: ["global", "type"],
                    });
                    navigate(newUrl, { replace: true });
                }
            }
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [search, navigate, searchParams, query]);

    return (
        <div className="relative w-full max-w-[600px] max-lg:hidden" ref={searchContainerRef}>
            <div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
                <img src="/assets/icons/search.svg" alt="search" width={24} height={24} className="cursor-pointer"/>

                <Input type="text" placeholder="Search globally" value={search} onChange={(e) => {
                    setSearch(e.target.value);
                    if (!isOpen) setIsOpen(true);
                    if (e.target.value === "" && isOpen) setIsOpen(false);
                }} className="paragraph-regular no-focus placeholder text-dark400_light700 border-none bg-transparent shadow-none outline-none"/>
            </div>
            {isOpen && <GlobalResult />}
        </div>
    );
};

export default GlobalSearch;
