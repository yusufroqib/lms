import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import { IoPerson } from "react-icons/io5";

const ClassroomCard = ({ classroom }) => {
	return (
		<div className="hover:bg-gray-100 transition">
			<div className="flex relative overflow-hidden flex-col border-2 border-gray-200 gap-2 rounded-xl h-[23rem]">
				<div className="h-60 w-full overflow-hidden">
					<img
						className="min-h-full min-w-full"
						src={classroom.course.courseImage}
						alt="course image"
					/>
				</div>
				<Avatar
					className={"w-15 h-15 absolute right-5 top-40 border-white border-2"}
				>
					<AvatarImage src={classroom.tutor.avatar} alt="@shadcn" />
					<AvatarFallback>{classroom.tutor.name}</AvatarFallback>
				</Avatar>
				<div className="p-2 space-y-4">
					<div className="h-15 ">
						<h5
							// variant="h6"
							className=" text-md md:text-lg font-[500] two-line-truncate"
						>
							{classroom.name}
						</h5>
					</div>
					<div className="space-y-2 text-sm text-muted-foreground">
						<p>Instructor: {classroom.tutor.name}</p>
						<div className="flex gap-2 items-center">
							<div className="inline-block p-2 rounded-md bg-gray-200">
								<IoPerson />
							</div>
							<p>
								{classroom.students.length}{" "}
								{classroom.students.length === 1 ? "student" : 'students'}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ClassroomCard;
