
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";import React from "react";

const CourseVideo = ({previewVideoUrl, price, courseImage }) => {
	return (
		<div className="p-2 border border-gray-600 rounded-xl">
			<div className="relative aspect-video">
				<video
                poster={courseImage}
					className="h-full w-full"
					controls
					src={previewVideoUrl}
				/>
			</div>
			<div className="mt-2 lg:mt-4 text-sm lg:text-md text-gray-500">
				<p>
					Enjoying this preview? Dive into the full course by enrolling today
					for complete access!
				</p>
			</div>
			<div className="flex justify-between">
				<p
					className={cn(
						"text-xl mt-2 font-bold",
						!price && "text-green-800 "
					)}
				>
					{price ? formatPrice(price) : "Free"}
				</p>
				<Button size="lg" className='animated-blink' variant={"success"}>
					Enroll Now
				</Button>
			</div>
		</div>
	);
};

export default CourseVideo;
