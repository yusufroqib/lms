// import Image from "next/image";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { IconBadge } from "@/components/ui/icon-badge";
import { formatPrice } from "@/lib/format";
import { FaStar } from "react-icons/fa6";
// import { CourseProgress } from "@/components/course-progress";

import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Typography,
	Avatar,
	Tooltip,
} from "@material-tailwind/react";

const CourseCard = ({
	id,
	title,
	imageUrl,
	chaptersLength,
	price,
	tutor,
	reviews,
	progress,
	category,
	averageRating,
}) => {
	// console.log(reviews);
	// console.log(averageRating);
	return (
		<Card className=" hover:bg-gray-100 transition overflow-hidden">
			<CardHeader
				floated={false}
				shadow={false}
				color="transparent"
				className="m-0 h-50 md:h-50 rounded-none"
			>
				<img
					className="h-full w-full object-cover"
					src={imageUrl}
					alt={title}
				/>
			</CardHeader>
			<CardBody className="h-17 md:h-20 p-3">
				<div className="flex items-center gap-1">
					<Avatar
						size="xs"
						variant="circular"
						alt={tutor?.name}
						src={tutor?.avatar}
						className="border-2 border-white hover:z-10"
					/>
					<p className="text-xs text-muted-foreground">{tutor?.name}</p>
				</div>
				<h5
					// variant="h6"
					className=" text-md md:text-lg font-[500] two-line-truncate"
					color="blue-gray"
				>
					{title}
				</h5>
			</CardBody>
			<CardFooter className="p-3">
				
				<div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
					<div className="flex items-center gap-x-1 text-slate-500">
						<IconBadge size="sm" icon={BookOpen} />
						<span>
							{chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
						</span>
					</div>
				</div>
				<div className="flex justify-between">
					<div className="flex gap-1 items-center">
						<FaStar className="text-yellow-400" />{" "}
						<p className="text-xs text-muted-foreground">
							{averageRating} Based on {reviews.length} Reviews
						</p>
					</div>
					<p className="text-lg md:text-md font-medium text-slate-700">
						{price ? formatPrice(price) : "Free"}
					</p>
				</div>
				{/* <Typography className="font-normal">January 10</Typography> */}
			</CardFooter>
		</Card>
	);
};

// const CourseCard = ({ id, title, imageUrl, chaptersLength, price, progress, category }) => {
// 	return (
// 		<Link to={`/courses/${id}`}>
// 			<div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
// 				<div className="relative w-full aspect-video rounded-md overflow-hidden">
// 					<img  className="object-cover" alt={title} src={imageUrl} />
// 				</div>
// 				<div className="flex flex-col pt-2">
// 					<div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
// 						{title}
// 					</div>
// 					<p className="text-xs text-muted-foreground">{category}</p>
// 					<div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
// 						<div className="flex items-center gap-x-1 text-slate-500">
// 							<IconBadge size="sm" icon={BookOpen} />
// 							<span>
// 								{chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
// 							</span>
// 						</div>
// 					</div>
// 					{/* {progress !== null ? (
// 						<CourseProgress
// 							variant={progress === 100 ? "success" : "default"}
// 							size="sm"
// 							value={progress}
// 						/>
// 					) : ( */}
// 					<p className="text-md md:text-sm font-medium text-slate-700">
// 						{formatPrice(price)}
// 					</p>
// 					{/* )} */}
// 				</div>
// 			</div>
// 		</Link>
// 	);
// };

export default CourseCard;
