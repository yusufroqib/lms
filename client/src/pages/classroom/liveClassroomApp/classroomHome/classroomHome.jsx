import React from "react";
import MeetingTypeList from "../../components/MeetingTypeList";
import { useGetMyClassroomsQuery } from "@/features/users/usersApiSlice";
import { useParams } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

const ClassroomHome = () => {
	const { classroomId } = useParams();
	const { _id } = useAuth();

	const {
		data: classrooms,
		isLoading,
		isError,
		error,
	} = useGetMyClassroomsQuery();

	const currentClassroom = classrooms?.find(
		(classroom) => classroom._id === classroomId
	);
	console.log(currentClassroom);

	const now = new Date();
	const time = now.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
	});
	const date = new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(
		now
	);

	if (currentClassroom) {
		return (
			<section className="flex size-full  flex-col gap-5 text-white">
				<div
					className={`h-[303px] w-full rounded-[20px] bg-cover overflow-hidden`}
					style={{
						backgroundImage: `url(${currentClassroom?.course?.courseImage})`,
					}}
				>
					{" "}
					<div className="flex h-full flex-col justify-between bg-gray-800 bg-opacity-90 max-md:px-5 max-md:py-8 lg:p-11">
						<h2 className="glassmorphism max-w-[273px] rounded py-2 text-center text-base font-normal">
							Upcoming Meeting at: 12:30 PM
						</h2>
						<div className="flex flex-col gap-2">
							<h1 className="text-4xl font-extrabold lg:text-7xl">{time}</h1>
							<p className="text-lg font-medium text-sky-1 lg:text-2xl">
								{date}
							</p>
						</div>
					</div>
				</div>

				{_id === currentClassroom?.tutor?._id && (
					<MeetingTypeList currentClassroom={currentClassroom} />
				)}
			</section>
		);
	}
};
export default ClassroomHome;
