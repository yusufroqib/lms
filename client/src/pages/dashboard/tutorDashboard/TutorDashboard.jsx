import React, { useEffect, useState } from "react";
import {
	BookCheck,
	BookUp2,
	CircleDollarSign,
	Loader2,
	Receipt,
	Replace,
	Users,
} from "lucide-react";
import { Book } from "lucide-react";
import {
	useGetTutorCoursesSoldQuery,
	useGetTutorStatsQuery,
	useGetTutorTopCoursesQuery,
} from "@/features/courses/coursesApiSlice";

import { Link } from "react-router-dom";
import TutorEarningsChart from "./components/TutorEarningChart";
import { DataTable } from "./components/DataTable";
import { columns } from "./components/Columns";
import {
	useGetMyDetailsQuery,
	useGetTutorBalanceQuery,
} from "@/features/users/usersApiSlice";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { useAccount } from "wagmi";
import { useCoursePayment } from "@/hooks/useCoursePayment";
import { formatUnits } from "viem";
import { Tooltip } from "@material-tailwind/react";

const TUTOR_SHARE = import.meta.env.VITE_TUTOR_SHARE;

const TutorDashboard = ({ setDashboardMode }) => {
	const { myDetails } = useGetMyDetailsQuery("myDetails", {
		selectFromResult: ({ data }) => ({
			myDetails: Object.values(data?.entities ?? {})[0],
		}),
	});
	const { getTutorBalance } = useCoursePayment();
	const { data: tutorStats, isLoading } = useGetTutorStatsQuery();
	const { data: topCourses } = useGetTutorTopCoursesQuery();
	const { data: courseTransactions, error } = useGetTutorCoursesSoldQuery();
	const { data: tutorBalance, error: balanceError } = useGetTutorBalanceQuery();
	const { _id: tutorId } = useAuth();
	const { status, address } = useAccount();
	const { data: tutorUSDCBalance } = getTutorBalance(tutorId);
	// console.log(tutorUSDCBalance)

	// console.log(Number(formatUnits(tutorUSDCBalance || 0, 6)));

	// console.log(tutorUSDCBalance);
	const stripeBalance =
		(tutorBalance && tutorBalance?.available[0]?.amount / 100) || 0;

	const USDCBalance = Number(formatUnits(tutorUSDCBalance || 0, 18)) || 0;

	if (isLoading) {
		return (
			<div className="flex min-h-[80vh] justify-center items-center">
				<Loader2 key="loader" className="mr-2 h-10 w-10 animate-spin" />{" "}
			</div>
		);
	}

	return (
		<div className="flex-1 p-8  space-y-6">
			<div className="flex justify-end">

				<Button
					variant="outline"
					className="flex gap-2 max-md:text-xs text-sm"
					onClick={() => setDashboardMode("student")}
				>
					<Replace className="max-md:w-4 w-5" />
					Switch to student&apos;s dashboard
				</Button>
			</div>
			<div
				style={{
					backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.04), rgba(0, 0, 0, 0.05)), url(/tutor-bg.webp)`,
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
				className="bg-slate-300 p-8 lg:p-14 rounded-3xl space-y-2 lg:space-y-5 flex justify-between items-center max-xl:flex-col-reverse max-xl:items-stretch"
			>
				<div className="max-xl:w-full max-xl:flex max-xl:justify-start">
					<div>
						<h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-white">
							Hi, {myDetails?.name}
						</h1>
						<h1 className="text-xs md:text-lg text-white/60 xl:text-xl">
							See what happened with your courses and students
						</h1>
					</div>
				</div>
				<div className="flex flex-col gap-2  max-xl:w-full max-xl:flex max-xl:justify-end max-xl:mb-4">
					<h1 className="text-xl md:text-2xl xl:text-3xl font-semibold text-white  text-right max-md:hidden">
						Balance
					</h1>
					<h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-white text-right">
						$
						<Tooltip
							content={
								<>
									<p>
										<strong>Stripe: </strong>$
										{stripeBalance?.toFixed(2) || "0.00"}
									</p>
									<p>
										<strong>xUSD: </strong>${USDCBalance?.toFixed(2) || "0.00"}
									</p>
								</>
							}
							placement="left"
							animate={{
								mount: { scale: 1, y: 0 },
								unmount: { scale: 0, y: 25 },
							}}
							// className="hidden md:block"
						>
							{(stripeBalance + USDCBalance)?.toFixed(2) || "0.00"}
						</Tooltip>
					</h1>
				</div>
			</div>

			<div className="grid grid-cols-2 xl:grid-cols-4 gap-5 ">
				<div className="p-5 col-span-1 bg-gray-50 shadow-md rounded-lg space-y-4">
					<div className="flex gap-2 items-center">
						<div className="p-2 shadow-md rounded-md ">
							<CircleDollarSign />
						</div>
						<p className="text-sm md:text-base lg:text-lg">Total Earnings</p>
					</div>
					<div>
						<h3 className="text-lg md:text-2xl xl:text-3xl">
							${(tutorStats?.totalEarnings * TUTOR_SHARE)?.toFixed(2) ?? 0}
						</h3>
					</div>
				</div>
				<div className="p-5 col-span-1 bg-gray-50 shadow-md rounded-lg space-y-4">
					<div className="flex gap-2 items-center">
						<div className="p-2 shadow-md rounded-md ">
							<Book />
						</div>
						<p className="text-sm md:text-base lg:text-lg">Published Courses</p>
					</div>
					<div>
						<h3 className="text-lg md:text-2xl xl:text-3xl">
							{tutorStats?.publishedCoursesCount ?? 0} Courses
						</h3>
					</div>
				</div>
				<div className="p-5 col-span-1 bg-gray-50 shadow-md rounded-lg space-y-4">
					<div className="flex gap-2 items-center">
						<div className="p-2 shadow-md rounded-md ">
							<BookCheck />
						</div>
						<p className="text-sm md:text-base lg:text-lg">Courses Sold</p>
					</div>
					<div>
						<h3 className="text-lg md:text-2xl xl:text-3xl">
							{tutorStats?.coursesSoldCount ?? 0} Sales
						</h3>
					</div>
				</div>
				<div className="p-5 col-span-1 bg-gray-50 shadow-md rounded-lg space-y-4">
					<div className="flex gap-2 items-center">
						<div className="p-2 shadow-md rounded-md ">
							<Users />
						</div>
						<p className="text-sm md:text-base lg:text-lg">Students</p>
					</div>
					<div>
						<h3 className="text-lg md:text-2xl xl:text-3xl">
							{tutorStats?.totalUniqueStudents || 0} Student
							{tutorStats?.totalUniqueStudents === 1 ? null : "s"}
						</h3>
					</div>
				</div>
			</div>
			<div className="grid grid-cols-1 xl:grid-cols-3 gap-6 ">
				<div className="xl:col-span-2 border rounded-lg border-gray-300/55">
					<TutorEarningsChart />
				</div>
				<div className="col-span-1  ">
					<div className="border rounded-lg border-gray-300/55 p-6">
						<div className="flex justify-between items-center">
							<div className="flex gap-2 items-center">
								<div className="p-2 shadow-md rounded-md ">
									<BookUp2 />
								</div>
								<h3 className="text-lg md:text-xl font-semibold">
									Top Courses
								</h3>
							</div>
							<Link
								to={"/tutors/my-courses"}
								className="text-sm md:text-base text-gray-500 hover:text-gray-700"
							>
								View All
							</Link>
						</div>
						<div className="mt-4 space-y-4">
							{topCourses ? (
								topCourses?.map((course, index) => (
									<div
										key={course._id}
										className="grid grid-cols-4 items-center justify-between space-x-4 "
									>
										<div className=" col-span-3 flex flex-col">
											<Link
												to={`/courses/${course._id}/info`}
												className=" text-base md:text-lg hover:text-blue-600 "
											>
												<p className="truncate w-full">{course.title}</p>
											</Link>
											<div className="text-sm text-gray-500/70">
												{course.salesCount} sales
											</div>
										</div>
										<div className=" col-span-1 text-right">
											${(course.totalValue * Number(TUTOR_SHARE)).toFixed(2)}
										</div>
									</div>
								))
							) : (
								<div>
									{" "}
									<p className="text-center mt-20">No data to display</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			<div className="border border-gray-300/55 rounded-lg p-4">
				<div>
					<div className="flex gap-2 items-center">
						<div className="p-2 shadow-md rounded-md ">
							<Receipt />{" "}
						</div>
						<h3 className="text-lg md:text-xl font-semibold">Sales History</h3>
					</div>{" "}
				</div>
				<DataTable columns={columns} data={courseTransactions} />
			</div>
		</div>
	);
};

export default TutorDashboard;
