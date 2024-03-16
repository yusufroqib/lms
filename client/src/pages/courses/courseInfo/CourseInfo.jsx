import { useGetCoursesQuery } from "@/features/courses/coursesApiSlice";
import useAuth from "@/hooks/useAuth";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CourseVideo from "./components/CourseVideo";
import { Avatar, Rating, Typography } from "@material-tailwind/react";
import parse from "html-react-parser";
import {
	Tabs,
	TabsHeader,
	TabsBody,
	Tab,
	TabPanel,
} from "@material-tailwind/react";

const data = [
	{
		label: "Overview",
		value: "overview",
	},
	{
		label: "Chapters",
		value: "chapters",
	},
	{
		label: "Reviews",
		value: "reviews",
    }
];

const CourseInfo = () => {
	const { courseId } = useParams();
	const { username, isTutor, isAdmin, _id } = useAuth();
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [activeTab, setActiveTab] = React.useState("overview");
	const { course, isLoading, isFetching, isSuccess, isError } =
		useGetCoursesQuery("allCourses", {
			selectFromResult: ({
				data,
				isLoading,
				isSuccess,
				isFetching,
				isError,
				error,
			}) => ({
				course: data?.entities[courseId],
				isLoading,
				isSuccess,
				isFetching,
				error,
				isError,
			}),
		});

	console.log(course);

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	if (isLoading) {
		return <p>Loading Tutor Course</p>;
	} else if (isSuccess && !course) {
		return <Navigate to={"/dashboard"} />;
	}
	if (isSuccess && course) {
		return (
			<div className=" flex overflow-hidden">
				<div className="w-full xl:w-3/5 h-full overflow-y-auto   p-6 pr-8 z-9">
					<div className=" h-full">
						<h2 className="text-4xl font-bold mb-4">{course.title}</h2>
						<div className="space-y-2 mb-8">
							<div className="flex items-center gap-2">
								<Avatar
									size="sm"
									variant="circular"
									alt={course.tutor.name}
									src={course.tutor.avatar}
									className="border-2 border-white hover:z-10"
								/>
								<p className="text-md font-bold ">{course.tutor.name}</p>
							</div>
							<p className="text-md text-gray-600">
								<strong>Category: </strong>
								{course.categoryId.name}
							</p>
							{Number(course.averageRating) ? (
								<div className="flex items-center gap-2 font-bold text-blue-gray-500">
									<Rating className=" rating-svg" value={4} readonly />
									<Typography>({Number(course.averageRating)})</Typography>
								</div>
							) : (
								<div className=" text-blue-gray-500 italic">
									<Typography>No Rating</Typography>
								</div>
							)}
						</div>
						<hr className="border-gray-400 mb-8" />

						{windowWidth < 1280 && (
							<div class="w-full sm:w-[90%] md:w-[75%] mx-auto mb-8 ">
								<CourseVideo
									courseImage={course.courseImage}
									price={course.price}
									previewVideoUrl={course.previewVideoUrl}
								/>
							</div>
						)}

						<div>
							<Tabs id="custom-animation" value={activeTab}>
								<TabsHeader>
									{data.map(({ label, value }) => (
										<Tab
											key={value}
											value={value}
											onClick={() => setActiveTab(value)}
											className={
												activeTab === value ? "text-gray-900" : "text-gray-600"
											}
										>
											{label}
										</Tab>
									))}
								</TabsHeader>
								<TabsBody>
									<TabPanel key={"overview"} value={"overview"}>
										<div className="no-tailwindcss-base">
											{parse(course.description)}
										</div>
									</TabPanel>
								</TabsBody>
							</Tabs>
						</div>
					</div>
				</div>
				{windowWidth >= 1280 && (
					<div class="w-2/5 h-screen fixed lg:pl-30 top-26 right-7  ">
						<CourseVideo
							courseImage={course.courseImage}
							price={course.price}
							previewVideoUrl={course.previewVideoUrl}
						/>
					</div>
				)}
			</div>
		);
	}
};

export default CourseInfo;
