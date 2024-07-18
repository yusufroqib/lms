/**
 * v0 by Vercel.
 * @see https://v0.dev/t/DuR4f1U6FTW
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";
import { CartesianGrid, XAxis, Bar, BarChart, Line, LineChart } from "recharts";
import {
	ChartTooltipContent,
	ChartTooltip,
	ChartContainer,
} from "@/components/ui/chart";
import { Link } from "react-router-dom";
import {
	CircularProgressbarWithChildren,
	buildStyles,
} from "react-circular-progressbar";
import {
	useGetCoursesQuery,
	useGetEnrolledCoursesQuery,
} from "@/features/courses/coursesApiSlice";
import { useEffect, useState } from "react";
import {
	BookOpenIcon,
	GraduationCapIcon,
	Loader2,
	Replace,
} from "lucide-react";
import EnrolledCourseCard from "./components/EnrolledCourseCard";
import ProgressCard from "./components/ProgressCard";
import StudyTimeCharts from "./components/StudyTimeCharts";
import RecommendedCourses from "./components/RecommendedCourses";
import { useGetMyDetailsQuery } from "@/features/users/usersApiSlice";
import useAuth from "@/hooks/useAuth";

export default function StudentDashBoard({ setDashboardMode }) {
	const { status } = useAuth();

	const [completedCourses, setCompletedCourses] = useState([]);
	const [inProgressCourses, setInProgressCourses] = useState([]);
	const [enrolledCourses, setEnrolledCourses] = useState([]);
	const [allRecommendedCourses, setAllRecommendedCourses] = useState([]);
	const [enrolledIds, setEnrolledIds] = useState([]);
	const {
		data: courses,
		isLoading,
		isFetching,
		isSuccess,
		isError,
	} = useGetEnrolledCoursesQuery("enrolledCourses");

	const { myDetails } = useGetMyDetailsQuery("myDetails", {
		selectFromResult: ({
			data,
			isLoading,
			isSuccess,
			isFetching,
			isError,
			error,
		}) => ({
			myDetails: Object.values(data?.entities ?? {})[0],
			isLoading,
			isSuccess,
			isFetching,
			error,
			isError,
		}),
	});
	const {
		data: coursesList,
		isSuccess: coursesSuccess,
		error,
	} = useGetCoursesQuery({ searchParams: "" });

	useEffect(() => {
		if (isSuccess) {
			setEnrolledCourses(courses?.ids.map((id) => courses.entities[id]));
		}
	}, [isSuccess, courses]);
	useEffect(() => {
		if (coursesSuccess && isSuccess) {
			const allCourses = coursesList?.ids.map(
				(id) => coursesList?.entities[id]
			);
			const enrolledCategories = enrolledCourses.map(
				(enrolledCourse) => enrolledCourse.categoryId
			);

			const enrolledIds = enrolledCourses.map(
				(enrolledCourse) => enrolledCourse._id
			);

			// console.log(enrolledIds);

			setEnrolledIds(enrolledIds);
			const unEnrolledCourses = allCourses.filter(
				(course) => !enrolledIds.includes(course._id)
			);
			const recommendedCourses = unEnrolledCourses.filter(
				(course) => !enrolledCategories.includes(course.categoryId)
			);

			const recommendedCoursesId = recommendedCourses.map(
				(recommendedCourse) => recommendedCourse._id
			);

			const unRecommendedCourses = unEnrolledCourses.filter(
				(course) => !recommendedCoursesId.includes(course._id)
			);

			const allRecommendedCoursesList = [
				...recommendedCourses,
				...unRecommendedCourses.slice(0, 6),
			].slice(0, 6);

			setAllRecommendedCourses(allRecommendedCoursesList);

			// console.log(allRecommendedCourses);
		}
	}, [coursesSuccess, coursesList, enrolledCourses]);

	useEffect(() => {
		if (isSuccess) {
			setCompletedCourses(
				enrolledCourses?.filter(
					(enrolledCourse) => enrolledCourse.progress === 100
				)
			);
			setInProgressCourses(
				enrolledCourses?.filter(
					(enrolledCourse) => enrolledCourse.progress !== 100
				)
			);
		}
	}, [isSuccess, courses, enrolledCourses]);

	

	if (!courses || !coursesList)
		return (
			<div className="flex min-h-[80vh] justify-center items-center">
				<Loader2 key="loader" className="mr-2 h-10 w-10 animate-spin" />{" "}
			</div>
		);

	if (allRecommendedCourses && coursesSuccess) {
		// const allCourses = coursesList?.ids.map((id) => coursesList?.entities[id]);
		const splicedCoursesLength = enrolledCourses.length === 0 ? 3 : 2;
		const displayName = myDetails?.name.split(" ")[0];

		return (
			<div className="flex min-h-screen">
				<div className="flex-1 p-8  space-y-8">
					{status === "Tutor" && (
						<div className="flex justify-end">
							<Button
								variant="outline"
								className="flex gap-2 max-md:text-xs text-sm"
								onClick={() => setDashboardMode("tutor")}
							>
								<Replace className="max-md:w-4 w-5" />
								Switch to tutor&apos;s dashboard
							</Button>
						</div>
					)}
					<div
						style={{
							backgroundImage: ` linear-gradient(rgba(0, 0, 128, 0.15), rgba(0, 0, 126, 0.1)), url(/line-background.svg)`,
							backgroundSize: "cover",
							backgroundPosition: "center",
						}}
						className="bg-slate-300 p-8 lg:p-14 rounded-3xl space-y-2 lg:space-y-5 "
					>
						<h1 className="text-2xl md:text-3xl lg:text-5xl font-semibold text-blue-900">
							Hi, {displayName}
						</h1>
						<h1 className="text-xs md:text-lg  lg:text-xl">
							Boost your skills to shine in your life
						</h1>
					</div>
					<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
						<div className="  lg:col-span-1 space-y-8">
							<div
								className={`md:grid ${
									enrolledCourses.length ? "md:grid-cols-2" : "md:grid-cols-3"
								} gap-5 lg:block lg:gap-0 max-md:space-y-8 lg:space-y-8 `}
							>
								{[...enrolledCourses, ...allRecommendedCourses]
									.slice(0, splicedCoursesLength)
									.map((enrolledCourse, index) => (
										<EnrolledCourseCard
											enrolledIds={enrolledIds}
											key={enrolledCourse._id}
											index={index}
											enrolledCourse={enrolledCourse}
										/>
									))}
							</div>
							<div className="flex justify-center">
								{enrolledIds.length ? (
									<Link to={"/courses/enrolled-courses"}>
										<Button>View Enrolled Courses</Button>
									</Link>
								) : (
									<Link to={"/courses/search"}>
										<Button>Explore All Courses</Button>
									</Link>
								)}
							</div>
						</div>
						<div className="max-lg:order-first lg:col-span-2  space-y-8">
							<div className="grid grid-cols-2 gap-4">
								<ProgressCard
									cardCN="p-3 md:p-6 bg-green-100"
									courseLength={completedCourses.length}
									cardText={"Completed Course"}
									CardIcon={GraduationCapIcon}
								/>
								<ProgressCard
									cardCN="p-3 md:p-6 bg-yellow-100"
									courseLength={inProgressCourses.length}
									cardText={"Course in Progress"}
									CardIcon={BookOpenIcon}
								/>
							</div>

							<StudyTimeCharts />
						</div>
						<div className="lg:col-span-3">
							<hr className=" mb-6" />
							<RecommendedCourses items={allRecommendedCourses} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}
