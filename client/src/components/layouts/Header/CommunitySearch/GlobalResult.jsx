import React, { useEffect, useState, useCallback, useMemo } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import GlobalFilters from "./GlobalFilters";
import qs from "query-string";
import { useGlobalSearchQuery } from "@/features/posts/postsApiSlice";

const GlobalResult = ({setIsOpen}) => {
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams, setSearchParams] = useSearchParams();
	const [reqData, setReqData] = useState("");
	const global = searchParams.get("global");
	const type = searchParams.get("type");

	const renderLink = useCallback((type, id) => {
		switch (type) {
			case "post":
				return `/community/posts/${id}`;
			case "reply":
				return `/community/posts/${id}`;
			case "user":
				return `/community/profile/${id}`;
			case "tag":
				return `/community/tags/${id}`;
			default:
				return "/community/feeds";
		}
	}, []);

	useEffect(() => {
		const url = qs.stringifyUrl(
			{
				url: location.pathname,
				query: {
					query: global,
					type,
				},
			},
			{ skipEmptyString: true, skipNull: true }
		);
		const queryString = url.split("?")[1];
		setReqData(queryString);
	}, [global, type, location.pathname]);

	const {
		data: result,
		isLoading,
		isFetching,
		isSuccess,
		error,
		isError,
	} = useGlobalSearchQuery(
		{ searchParams: reqData },
		{
			skip: !reqData,
		}
	);

	return (
		<div className="absolute top-full z-10 mt-3 w-full rounded-xl bg-light-800 py-5 shadow-sm dark:bg-dark-400">
			<GlobalFilters />
			<div className="my-5 h-[1px] bg-light-700/50 dark:bg-dark-500/50" />

			<div className="space-y-5">
				<p className="text-dark400_light900 paragraph-semibold px-5">
					Top Match
				</p>

				{isLoading || isFetching ? (
					<div className="flex-center flex-col px-5">
						<ReloadIcon className="my-2 h-10 w-10 animate-spin text-primary-500" />
						<p className="text-dark200_light800 body-regular">
							Browsing the entire database
						</p>
					</div>
				) : (
					<div className="flex flex-col gap-2">
						{result?.length > 0 ? (
							result?.map((item, index) => (
								<div
									key={item.type + item.id + index}
									className="flex w-full cursor-pointer items-start gap-3 px-5 py-2.5 hover:bg-light-700/50 dark:bg-dark-500/50"
									onClick={() => {
                    setIsOpen(false)
										navigate(renderLink(item.type, item.id));
									}}
								>
									<img
										src="/assets/icons/tag.svg"
										alt="tags"
										width={18}
										height={18}
										className="invert-colors mt-1 object-contain"
									/>

									<div className="flex flex-col">
										<p className="body-medium text-dark200_light800 line-clamp-1">
											{item.title}
										</p>
										<p className="text-light400_light500 small-medium mt-1 font-bold capitalize">
											{item.type}
										</p>
									</div>
								</div>
							))
						) : (
							<div className="flex-center flex-col px-5">
								<p className="text-dark200_light800 body-regular px-5 py-2.5">
									Oops, no results found
								</p>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default GlobalResult;
