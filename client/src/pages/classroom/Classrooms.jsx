import React from "react";
import { Link } from "react-router-dom";
import ClassroomCard from "./components/ClassroomCard";
import { useGetMyClassroomsQuery } from "@/features/users/usersApiSlice";
import { Loader2 } from "lucide-react";

const Classrooms = () => {
	const {
		data: classrooms,
		isLoading,
		isError,
		error,
	} = useGetMyClassroomsQuery();
	console.log(classrooms);

	if (isLoading)
		return (
			<div className="flex min-h-[80vh] justify-center items-center">
				<Loader2 key="loader" className="mr-2 h-10 w-10 animate-spin" />{" "}
			</div>
		);
	if (classrooms.length === 0) {
		return (
			<div className=" flex justify-center items-center  mt-20">
				<h2 className="text-center text-lg  w-100">
					You are not a member of any classroom, kindly create a course (for
					tutors) or enroll in a course to join a classroom
				</h2>
			</div>
		);
	}
	return (
		<div>
			<div className="px-6 pt-6">
				<h2 className="text-2xl font-bold">Live Classrooms</h2>
			</div>
			<div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 p-6 gap-4">
				{/* {items.map((item) => ( */}
				{classrooms.map((classroom) => (
					<Link key={classroom._id} to={`/classrooms/${classroom._id}`}>
						<ClassroomCard classroom={classroom} />
					</Link>
				))}

				{/* ))} */}
			</div>
		</div>
	);
};

export default Classrooms;
