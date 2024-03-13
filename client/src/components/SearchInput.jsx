import React, { useEffect, useState } from "react";
import {  useLocation, useNavigate } from "react-router-dom";
import qs from "query-string";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";

const SearchInput = () => {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value);
  const [searchParams, setSearchParams] = useState(new URLSearchParams());
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setSearchParams(new URLSearchParams(location.search));
  }, [location.search]);

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: location.pathname,
        query: {
          categoryId: searchParams.get("categoryId"),
          title: debouncedValue,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );
    // navigate(url);
    window.history.pushState({}, "", url);

  }, [debouncedValue, searchParams, location.pathname, history]);

  const handleInputChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div className="relative">
      <Search className="h-4 w-4 absolute top-3 left-3 text-slate-600" />
      <Input
        onChange={handleInputChange}
        value={value}
        className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
        placeholder="Search for a course"
      />
    </div>
  );
};

export default SearchInput;
