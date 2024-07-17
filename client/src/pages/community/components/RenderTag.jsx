import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const RenderTag = ({ _id, name, totalPosts, showCount, className }) => {
	return (
		<Link to={`/community/tags/${_id}`} className="flex justify-between gap-2">
			<Badge
				className={cn(
					`subtle-medium ${
						!className && "background-light800_dark300"
					} text-light400_light500 hover:bg-gray-300 rounded-md border-none px-4 py-2 uppercase`,
					className
				)}
			>
				{name}
			</Badge>

			{showCount && (
				<p className="small-medium text-dark500_light700">{totalPosts}</p>
			)}
		</Link>
	);
};

export default RenderTag;
