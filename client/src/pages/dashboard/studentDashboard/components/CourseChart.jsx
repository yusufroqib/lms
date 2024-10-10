import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	Brush,
} from "recharts";

export default function CourseChart({ data, formatDuration }) {
	// Function to truncate text
	const truncateText = (text, maxLength = 20) => {
		return text.length > maxLength
			? text.substring(0, maxLength) + "..."
			: text;
	};

	// Process the data to create a format suitable for a stacked bar chart
	const processedData = data.map((day) => {
		const courseData = {};
		day.courses.forEach((course) => {
			courseData[truncateText(course.courseTitle)] = course.duration;
		});
		return {
			date: day._id,
			...courseData,
			total: day.totalDuration,
		};
	});

	// Get unique course titles (truncated)
	const courseTitles = [
		...new Set(
			data.flatMap((day) =>
				day.courses.map((course) => truncateText(course.courseTitle))
			)
		),
	];

	// Generate random colors for each course
	const colors = courseTitles.reduce((acc, title) => {
		acc[title] = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
		return acc;
	}, {});

    // console.log(processedData)
    // console.log(courseTitles)

	return (
		<ResponsiveContainer width="100%" height={400}>
			<BarChart
				data={processedData}
				margin={{
					top: 20,
					//   right: 10,
					left: 5,
					bottom: 5,
				}}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="date" tick={{ fontSize: 13 }} />
				<YAxis tickFormatter={formatDuration} tick={{ fontSize: 13 }} />
				<Tooltip
					formatter={(value, name) => [formatDuration(value), name]}
					labelFormatter={(label) => `Date: ${label}`}
				/>
				<Legend formatter={(value) => <span className="text-sm" title={value}>{value}</span>} />
				{courseTitles.map((courseTitle) => (
					<Bar
						key={courseTitle}
						dataKey={courseTitle}
						stackId="a"
						fill={colors[courseTitle]}
						name={courseTitle} // This will be used in the tooltip
					/>
				))}
				<Brush dataKey="date" height={20} stroke="#8884d8" />
			</BarChart>
		</ResponsiveContainer>
	);
}
