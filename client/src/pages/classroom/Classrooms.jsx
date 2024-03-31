import React from "react";
import { Link } from "react-router-dom";
import ClassroomCard from "./components/ClassroomCard";
import { useGetMyClassroomsQuery } from "@/features/users/usersApiSlice";

const Classrooms = () => {
	const {
		data: classrooms,
		isLoading,
		isError,
		error,
	} = useGetMyClassroomsQuery();
	console.log(classrooms);

	if (isLoading) return <div>Loading...</div>;
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
			<div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 p-6 gap-4">
				{/* {items.map((item) => ( */}
				{classrooms.map((classroom) => (
					<Link key={classroom._id} to={`/classrooms/${classroom._id}`}>
						<ClassroomCard classroom={classroom} />
					</Link>
				))}

				{/* ))} */}
			</div>
			{/* {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
            No courses found
        </div>
    )} */}
		</div>
	);
};

export default Classrooms;
