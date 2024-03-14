import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import qs from "query-string";
import { Tooltip } from "@material-tailwind/react";

export const CategoryItem = ({ label, description, value, icon: Icon }) => {
	const navigate = useNavigate();
	const [dynamicSearchParams, setDynamicSearchParams] = useSearchParams();
	const location = useLocation();
	const currentTitle = dynamicSearchParams.get("title");

	const isSelected = dynamicSearchParams.get("categoryId") === value;

	const onClick = () => {
		const newCategoryId = isSelected ? null : value;
		setDynamicSearchParams({
			...dynamicSearchParams,
			categoryId: newCategoryId,
		});
		// console.log(dynamicSearchParams.toString())
		// setSearchParams({ ...searchParams, categoryId: newCategoryId });
		const url = qs.stringifyUrl(
			{
				url: location.pathname,
				query: {
					title: currentTitle,
					categoryId: newCategoryId,
				},
			},
			{ skipEmptyString: true, skipNull: true }
		);
		// console.log(url)
		navigate(url);
	};

	return (
		<>
			<Tooltip
				content={description}
				placement="bottom"
				animate={{
					mount: { scale: 1, y: 0 },
					unmount: { scale: 0, y: 25 },
				}}
                className='hidden md:block'
			>
				<button
					onClick={onClick}
					className={cn(
						"py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-sky-700 transition",
						isSelected && "border-sky-700 bg-sky-200/20 text-sky-800"
					)}
					type="button"
				>
					{Icon && <Icon size={20} />}
					<div className="truncate">{label}</div>
				</button>
			</Tooltip>
		
			
		</>
	);
};
