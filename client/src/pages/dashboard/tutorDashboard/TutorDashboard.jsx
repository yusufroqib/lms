import React from "react";
import { BookCheck, BookUp2, CircleDollarSign, Users } from "lucide-react";
import { Book } from "lucide-react";
import {
	useGetTutorStatsQuery,
	useGetTutorTopCoursesQuery,
} from "@/features/courses/coursesApiSlice";
import { Link } from "react-router-dom";
import TutorEarningsChart from "./components/TutorEarningChart";

const TutorDashboard = () => {
	const { data: tutorStats, isLoading } = useGetTutorStatsQuery();
	const { data: topCourses } = useGetTutorTopCoursesQuery();
	// console.log(topCourses);

	return (
		<div className="flex-1 p-8  space-y-8">
			<div
				style={{
					backgroundImage: ` linear-gradient(rgba(0, 0, 0, 0.04), rgba(0, 0, 0, 0.05)), url(/tutor-bg.jpg)`,
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
				className="bg-slate-300 p-8 lg:p-14 rounded-3xl space-y-2 lg:space-y-5 "
			>
				<h1 className="text-2xl md:text-3xl lg:text-5xl font-semibold text-white">
					Hi, Rocco
				</h1>
				<h1 className="text-xs md:text-lg text-white/60  lg:text-xl">
					See what happened with your courses and students
				</h1>
			</div>

			<div className="grid grid-cols-4 gap-5 ">
				<div className="p-5 col-span-1 bg-gray-50 shadow-md rounded-lg space-y-4">
					<div className="flex gap-2 items-center">
						<div className="p-2 shadow-md rounded-md ">
							<CircleDollarSign />
						</div>
						<p className="text-lg">Total Earnings</p>
					</div>
					<div>
						<h3 className="text-3xl">
							${tutorStats?.totalEarnings?.toFixed(2)}
						</h3>
					</div>
				</div>
				<div className="p-5 col-span-1 bg-gray-50 shadow-md rounded-lg space-y-4">
					<div className="flex gap-2 items-center">
						<div className="p-2 shadow-md rounded-md ">
							<Book />
						</div>
						<p className="text-lg">Published Courses</p>
					</div>
					<div>
						<h3 className="text-3xl">
							{tutorStats?.publishedCoursesCount} courses
						</h3>
					</div>
				</div>
				<div className="p-5 col-span-1 bg-gray-50 shadow-md rounded-lg space-y-4">
					<div className="flex gap-2 items-center">
						<div className="p-2 shadow-md rounded-md ">
							<BookCheck />
						</div>
						<p className="text-lg">Courses Sold</p>
					</div>
					<div>
						<h3 className="text-3xl">{tutorStats?.coursesSoldCount} sales</h3>
					</div>
				</div>
				<div className="p-5 col-span-1 bg-gray-50 shadow-md rounded-lg space-y-4">
					<div className="flex gap-2 ">
						<div className="p-2 shadow-md rounded-md ">
							<Users />
						</div>
						<p className="text-lg">Total Students</p>
					</div>
					<div>
						<h3 className="text-3xl">
							{tutorStats?.totalUniqueStudents || 0} Student
							{tutorStats?.totalUniqueStudents === 1 ? null : "s"}
						</h3>
					</div>
				</div>
			</div>
			<div className="grid grid-cols-3 gap-5 ">
				<div className="col-span-2 border rounded-lg border-gray-300/55">
					<TutorEarningsChart />
				</div>
				<div className="col-span-1  ">
					<div className="border rounded-lg border-gray-300/55 p-6">
						<div className="flex justify-between">
							<div className="flex gap-2 items-center">
								<div className="p-2 shadow-md rounded-md ">
									<BookUp2 />
								</div>
								<h3 className="text-xl font-semibold">Top Courses</h3>
							</div>
							<Link
								to={"/tutors/my-courses"}
								className="text-base text-gray-500 hover:text-gray-700"
							>
								View All
							</Link>
						</div>
						<div className="mt-4 space-y-4">
							{topCourses?.map((course, index) => (
								<div
									key={course._id}
									className="grid grid-cols-4 items-center justify-between space-x-4 "
								>
									<div className=" col-span-3 flex flex-col">
										<div className=" text-lg  ">
											<p className="truncate w-full">{course.title}</p>
										</div>
										<div className="text-sm text-gray-500/70">
											{course.salesCount} sales
										</div>
									</div>
									<div className="col-span-1 text-right">
										${course.totalValue.toFixed(2)}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TutorDashboard;
