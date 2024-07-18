import React, { useState, useEffect } from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	ResponsiveContainer,
	LabelList,
	ReferenceLine,
	Text,
} from "recharts";
import DatePicker from "react-datepicker";
import { format, subDays, addDays } from "date-fns";
import { useGetTutorEarningsQuery } from "@/features/courses/coursesApiSlice";
import { CustomInput } from "./CustomInput";
const TUTOR_SHARE = import.meta.env.VITE_TUTOR_SHARE
// console.log(TUTOR_SHARE)
const TutorEarningsChart = ({ tutorId }) => {
	const [dateRange, setDateRange] = useState([
		subDays(new Date(), 30),
		new Date(),
	]);
	const [startDate, endDate] = dateRange;
  
	const formattedStartDate = startDate ? format(startDate, "yyyy-MM-dd") : null;
	// Adjust the end date to be inclusive
	const formattedEndDate = endDate
  ? format(addDays(endDate, 1), "yyyy-MM-dd")
  : null;
  
  // console.log(formattedStartDate)
	const { data, isLoading, error } = useGetTutorEarningsQuery({
		startDate: formattedStartDate,
		endDate: formattedEndDate,
	});

	const truncateText = (text, maxLength = 20) => {
		return text.length > maxLength
			? text.substring(0, maxLength) + "..."
			: text;
	};

	const handleDateChange = (update) => {
		setDateRange(update);
	};

	// const processData = (data) => {
	// 	if (!data) return [];
	// 	return data.map((item) => {
	// 		const courseEarnings = {};
	// 		Object.keys(item.courseEarnings).forEach((courseTitle) => {
	// 			courseEarnings[courseTitle] = item.courseEarnings[courseTitle];
	// 		});
	// 		return {
	// 			date: item.date,
	// 			...courseEarnings,
	// 		};
	// 	});
	// };
	const processData = (data) => {
		if (!data) return [];
		return data.map((item) => {
			const courseEarnings = {};
			Object.keys(item.courseEarnings).forEach((courseTitle) => {
				courseEarnings[truncateText(courseTitle)] =
					item.courseEarnings[courseTitle] * Number(TUTOR_SHARE);
			});
			return {
				date: item.date,
				...courseEarnings,
			};
		});
	};

	const processedData = processData(data);

	const getRandomColor = () =>
		`#${Math.floor(Math.random() * 16777215).toString(16)}`;

	const generateColors = (keys) => {
		const colors = {};
		keys.forEach((key, index) => {
			colors[key] = getRandomColor();
		});
		return colors;
	};

	// const getCourseTitles = (data) => {
	// 	const titles = new Set();
	// 	data?.forEach((item) => {
	// 		Object.keys(item?.courseEarnings)?.forEach((title) => {
	// 			titles.add(title);
	// 		});
	// 	});
	// 	return Array.from(titles);
	// };

	const getCourseTitles = (data) => {
		const titles = new Set();
		data?.forEach((item) => {
			Object.keys(item?.courseEarnings)?.forEach((title) => {
				titles.add(truncateText(title));
			});
		});
		return Array.from(titles);
	};

	const courseTitles = getCourseTitles(data);
	const colors = generateColors(courseTitles);

	// Function to format number to USD with 2 decimal places
	const formatUSD = (value) => {
		return `$${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
	};

	// Calculate total sum
	const totalSum = processedData.reduce((sum, item) => {
		Object.values(item)?.forEach((val) => {
			if (typeof val === "number") {
				sum += val;
			}
		});
		return sum;
	}, 0);

	return (
		<div className="w-full max-w-4xl mx-auto p-4">
			<div className="mb-4 flex max-md:flex-col max-md:gap-3 justify-between">
				<DatePicker
					selectsRange={true}
          dateFormat="d/MM/YYYY"
          // dateFormat="MMMM eeee d, yyyy h:mm aa"

					startDate={startDate}
					endDate={endDate}
					onChange={handleDateChange}
					customInput={<CustomInput />}
				/>
				{processedData.length > 0 && (
					<h4 className="text-base md:text-lg font-medium">
						Range Earnings: {formatUSD(totalSum)}
					</h4>
				)}
			</div>
			{isLoading && <p>Loading...</p>}
			{error && (
				<div>
					{" "}
					<p className="text-center mt-20">No data to display</p>
				</div>
			)}

			{processedData.length > 0 && (
				<div>
					<ResponsiveContainer width="100%" height={400}>
						<BarChart data={processedData}>
							<XAxis dataKey="date" tick={{ fontSize: 13 }} />
							<YAxis tickFormatter={formatUSD} tick={{ fontSize: 13 }} />
							<Tooltip formatter={(value) => formatUSD(value)} />
							<Legend
								formatter={(value) => (
									<span className="text-sm" title={value}>
										{value}
									</span>
								)}
							/>{" "}
						
							{courseTitles.map((courseTitle, index) => (
								<Bar
									key={courseTitle}
									dataKey={courseTitle}
									stackId="a"
									fill={colors[courseTitle]}
									name={courseTitle} // This will be used in the tooltip
								/>
							))}
							<ReferenceLine y={0} stroke="#000" />
							<LabelList dataKey="total" position="top" />
						</BarChart>
					</ResponsiveContainer>
				</div>
			)}
		</div>
	);
};

export default TutorEarningsChart;
