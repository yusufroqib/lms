import { useGetCoursesQuery } from "@/features/courses/coursesApiSlice";
import useAuth from "@/hooks/useAuth";
import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import CourseVideo from "./components/CourseVideo";
import {
	Avatar,
	Breadcrumbs,
	Rating,
	Typography,
} from "@material-tailwind/react";
import parse from "html-react-parser";
import {
	Tabs,
	TabsHeader,
	TabsBody,
	Tab,
	TabPanel,
} from "@material-tailwind/react";
import PreviewChaptersList from "./components/PreviewChaptersList";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import ReviewsTab from "./components/ReviewsTab";

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
	},
];

const CourseInfo = () => {
	const { courseId } = useParams();
	const { username, isTutor, isAdmin, _id } = useAuth();
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [activeTab, setActiveTab] = React.useState("overview");
	const [searchParams, setSearchParams] = useSearchParams();
	const purchaseError = searchParams.get("cancelled");

	useEffect(() => {
		if (!!purchaseError) {
			toast.error("Course purchase was unsuccessful");
		}
	}, [purchaseError]);

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

	const hasPurchased = course?.purchasedBy?.some((item) => item?.user === _id);

	if (isLoading) {
		return (
			<div className="flex min-h-[80vh] justify-center items-center">
				<Loader2 key="loader" className="mr-2 h-10 w-10 animate-spin" />{" "}
			</div>
		);
	} else if (isSuccess && !course) {
		return <Navigate to={"/dashboard"} />;
	}
	if (isSuccess && course) {
		const isPurchased = course.purchasedBy.some((item) => item.user === _id);
		return (
			<>
				<div className="sticky top-19 bg-white  z-99">
					<div className="p-3 ">
						<Breadcrumbs className="bg-transparent " separator=">">
							<Link to="/dashboard" className="opacity-60">
								Dashboard
							</Link>
							<Link to="/courses/search" className="opacity-60">
								All Courses
							</Link>
							<Link disabled href="#">
								Course Info
							</Link>
						</Breadcrumbs>
					</div>
				</div>
				<div className=" flex overflow-hidden">
					<div className="w-full xl:w-3/5 h-full overflow-y-auto   p-6 pr-8 z-9">
						<div className=" h-full">
							<h2 className="text-2xl md:text-3xl font-bold mb-4">
								{course.title}
							</h2>
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
										<Rating
											className=" rating-svg"
											value={Number(course?.averageRating)}
											readonly
										/>
										<Typography>({course?.reviews?.length})</Typography>
									</div>
								) : (
									<div className=" text-blue-gray-500 italic">
										<Typography>No Rating</Typography>
									</div>
								)}
								<p className="text-sm text-gray-400">
									{course?.purchasedBy?.length || 0} students
								</p>
							</div>

							<hr className="border-gray-400 mb-8" />

							{windowWidth < 1280 && (
								<div className="w-full sm:w-[90%] md:w-[75%] mx-auto mb-8 ">
									<CourseVideo
										courseImage={course.courseImage}
										price={course.price}
										previewVideoUrl={course.previewVideoUrl}
										courseId={course._id}
										isPurchased={isPurchased}
										firstChapter={course.chapters[0]}
										tutorId={course.tutor._id}
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
													activeTab === value
														? "text-gray-900"
														: "text-gray-600"
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

										<TabPanel key={"chapters"} value={"chapters"}>
											<div className="">
												<div>
													<h4>
														These chapters have been published within this
														course. Only those marked as 'free' are accessible
														without purchase. To gain access to all chapters,
														purchase the course.
													</h4>
													<div>
														<PreviewChaptersList
															chapters={course.chapters}
															isPurchased={isPurchased}
															tutorId={course.tutor._id}
														/>
													</div>
												</div>
											</div>
										</TabPanel>
										<TabPanel key={"reviews"} value={"reviews"}>
											<div className="">
												<ReviewsTab hasPurchased={hasPurchased} />
											</div>
										</TabPanel>
									</TabsBody>
								</Tabs>
							</div>
						</div>
					</div>
					{windowWidth >= 1280 && (
						<div className="w-2/5 h-screen fixed lg:pl-30 top-40 right-7  ">
							<CourseVideo
								courseImage={course.courseImage}
								price={course.price}
								previewVideoUrl={course.previewVideoUrl}
								courseId={course._id}
								isPurchased={isPurchased}
								tutorId={course.tutor._id}
								firstChapter={course.chapters[0]}
							/>
						</div>
					)}
				</div>
			</>
		);
	}
};

export default CourseInfo;
