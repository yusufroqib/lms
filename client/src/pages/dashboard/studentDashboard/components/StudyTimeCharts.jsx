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

	//   console.log(studyData)

	//   const chartData = useMemo(() => {
	//     if (!studyData) return [];
	//     return studyData.map(item => ({
	//       name: item._id,
	//       Total: item.totalDuration,
	//       ...item.courses?.reduce((acc, course) => {
	//         acc[course.course] = course.duration;
	//         return acc;
	//       }, {})
	//     }));
	//   }, [studyData]);

	//   console.log(chartData)

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
			<h2>Study Time Summary</h2>

			<div className="flex justify-end">
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
			{/* <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis tickFormatter={formatDuration} />
          <Tooltip formatter={formatDuration} />
          <Legend />
          <Bar dataKey="Total" fill="#8884d8" name="Total Duration" />
          {Object.keys(chartData[0] || {})
            .filter(key => key !== 'name' && key !== 'Total')
            .map((course, index) => (
              <Bar 
                key={course} 
                dataKey={course} 
                fill={`#${Math.floor(Math.random()*16777215).toString(16)}`} 
                name={`Course ${index + 1}`} 
                radius={4}
              />
            ))
          }
        </BarChart>
      </ResponsiveContainer> */}
		</div>
	);
};

export default StudyTimeCharts;
