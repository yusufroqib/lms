import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import React from "react";
import {
	CircularProgressbarWithChildren,
	buildStyles,
} from "react-circular-progressbar";
import { Link } from "react-router-dom";

const EnrolledCourseCard = ({ enrolledCourse, enrolledIds, index }) => {
	// console.log(enrolledCourse);

    const courseLink = enrolledIds.includes(enrolledCourse._id)?`/study/${enrolledCourse.id}/chapter/${enrolledCourse.chapters[0]._id}`: `/courses/${enrolledCourse.id}/info`
	return (
		<Card
			className={`p-6 bg-gradient-to-r ${
				(index === 0 && enrolledIds.length) ? "from-gray-800 to-blue-600 text-white" : "bg-gray-100"
			}`}
		>
			<div className="flex justify-between">
				<div>
					<h2 className="text-xl font-bold two-line-truncate">
						{/* Foundations of User Experience (UX) Design */}
						{enrolledCourse?.title}
					</h2>
					<p className="mt-2">{enrolledCourse?.chapters?.length} chapters</p>
				</div>
			</div>
			<div className="grid  grid-cols-3 gap-5 items-center">
				<Link
					className="col-span-2"
					to={courseLink}
				>
					<Button
						className={`mt-4 w-full  ${
							(index === 0 && enrolledIds.length) ? "bg-white text-blue-500" : "bg-blue-500 text-white"
						} `}
					>
						{enrolledIds.includes(enrolledCourse._id)
							? "Continue"
							: "View details"}
					</Button>
				</Link>
				{enrolledIds.includes(enrolledCourse._id) && (
					<div className="flex items-center">
						{/* <div className="text-4xl font-bold">80%</div>
        <CircleIcon className="w-16 h-16 ml-2 text-white" /> */}

						<CircularProgressbarWithChildren
							background={"#fff"}
							backgroundPadding={0}
							value={enrolledCourse?.progress}
							strokeWidth={16}
							styles={buildStyles({
								// Rotation of path and trail, in number of turns (0-1)
								rotation: 0.25,

								pathTransitionDuration: 3,

								backgroundColor: "#fff",
							})}
						>
							{/* Put any JSX content in here that you'd like. It'll be vertically and horizonally centered. */}

							<div className=" text-lg lg:text-[10px] xl:text-lg text-gray-800">
								<strong>{enrolledCourse?.progress}%</strong>
							</div>
						</CircularProgressbarWithChildren>
					</div>
				)}
			</div>
		</Card>
	);
};

export default EnrolledCourseCard;
