import React, { useState, useMemo, useEffect } from "react";
import { useGetStudyTimeQuery } from "@/features/courses/coursesApiSlice";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import CourseChart from "./CourseChart";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const StudyTimeCharts = () => {
	const [timeRange, setTimeRange] = useState("day");
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());

	useEffect(() => {
		const end = new Date();
		let start = new Date();

		if (timeRange === "day") {
			start.setDate(end.getDate() - 7); // Last 7 days
		} else if (timeRange === "week") {
			start.setDate(end.getDate() - 28); // Last 4 weeks
		} else if (timeRange === "month") {
			start.setMonth(end.getMonth() - 6); // Last 6 months
		}

		setEndDate(end);
		setStartDate(start);
	}, [timeRange]);

	const {
		data: studyData,
		error,
		isLoading,
	} = useGetStudyTimeQuery({
		startDate: startDate.toISOString(),
		endDate: endDate.toISOString(),
		groupBy: timeRange,
	});

	const formatDuration = (seconds) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		return `${hours}h ${minutes}m`;
	};

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;
	if (!studyData || studyData.length === 0)
		return (
			<div className="space-y-4 max-lg:hidden">
				<h2 className=" text-lg">Study Time Summary</h2>
				<div className="w-full  lg:h-[500px] bg-gray-300 flex justify-center items-center">
					No data available
				</div>
			</div>
		);

	return (
		<div>
			<h2 className="font-semibold text-xl">Study Time Summary</h2>

			<div className="flex justify-end max-md:my-4">
				<Select
					defaultValue={"day"}
					onValueChange={(value) => setTimeRange(value)}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem value="day">Daily</SelectItem>
							<SelectItem value="week">Weekly</SelectItem>
							<SelectItem value="month">Monthly</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>

			<CourseChart formatDuration={formatDuration} data={studyData} />
			
		</div>
	);
};

export default StudyTimeCharts;
