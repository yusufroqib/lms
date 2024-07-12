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
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from "@/components/ui/table";
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

export default function StudentDashBoard() {
	return (
		<div className="flex min-h-screen">
			<main className="flex-1 p-8 bg-white">
				<header className="flex items-center justify-between mb-8">
					<h1 className="text-3xl font-bold">Overview</h1>
					<div className="flex items-center space-x-4">
						<div className="relative">
							<SearchIcon className="absolute top-2.5 left-2.5 w-4 h-4 text-gray-400" />
							<Input type="search" placeholder="Search..." className="pl-10" />
						</div>
						<div className="flex items-center space-x-2">
							<Avatar>
								<AvatarImage src="/placeholder-user.jpg" />
								<AvatarFallback>AC</AvatarFallback>
							</Avatar>
							<div>
								<div className="text-sm font-medium">Alexa Calen</div>
								<div className="text-xs text-gray-500">Student</div>
							</div>
						</div>
					</div>
				</header>
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
					<div className="lg:col-span-1 space-y-8">
						<Card className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
							<div className="flex justify-between">
								<div>
									<h2 className="text-xl font-bold">
										Foundations of User Experience (UX) Design
									</h2>
									<p className="mt-2">4 Assignment • 20 Videos</p>
								</div>
							</div>
							<div className="grid  grid-cols-3 gap-5 items-center">
								<Button className="mt-4 col-span-2 bg-white text-blue-500">
									Continue
								</Button>
								<div className="flex items-center">
									{/* <div className="text-4xl font-bold">80%</div>
									<CircleIcon className="w-16 h-16 ml-2 text-white" /> */}

									<CircularProgressbarWithChildren
										background={"#fff"}
										backgroundPadding={0}
										value={66}
										strokeWidth={16}
										styles={buildStyles({
											// Rotation of path and trail, in number of turns (0-1)
											rotation: 0.25,

									
											pathTransitionDuration: 3,

											backgroundColor: "#fff",

											// trailColor: "#fff",
										})}
									>
										{/* Put any JSX content in here that you'd like. It'll be vertically and horizonally centered. */}

										<div className=" text-lg lg:text-[10px] xl:text-xl text-gray-800">
											<strong>66%</strong>
										</div>
									</CircularProgressbarWithChildren>
								</div>
							</div>
						</Card>
						<Card className="p-6 bg-gray-100">
							<div className="flex justify-between">
								<div>
									<h2 className="text-xl font-bold">
										Start the UX Design Process: Empathize, Define, and Ideate
									</h2>
									<p className="mt-2">4 Assignment • 20 Videos</p>
								</div>
								<div className="flex items-center">
									<div className="text-4xl font-bold">65%</div>
									<CircleIcon className="w-16 h-16 ml-2 text-gray-500" />
								</div>
							</div>
							<Button className="mt-4 bg-blue-500 text-white">
								Continue Course
							</Button>
						</Card>
						<Card className="p-6 bg-gray-100">
							<div className="flex justify-between">
								<div>
									<h2 className="text-xl font-bold">
										Build Wireframes and Low-Fidelity Prototypes
									</h2>
									<p className="mt-2">4 Assignment • 20 Videos</p>
								</div>
								<div className="flex items-center">
									<div className="text-4xl font-bold">85%</div>
									<CircleIcon className="w-16 h-16 ml-2 text-gray-500" />
								</div>
							</div>
							<Button className="mt-4 bg-blue-500 text-white">
								Continue Course
							</Button>
						</Card>
						<Card className="p-6 bg-gray-100">
							<div className="flex justify-between">
								<div>
									<h2 className="text-xl font-bold">
										Build Wireframes and Low-Fidelity Prototypes
									</h2>
									<p className="mt-2">4 Assignment • 20 Videos</p>
								</div>
								<div className="flex items-center">
									<div className="text-4xl font-bold">85%</div>
									<CircleIcon className="w-16 h-16 ml-2 text-gray-500" />
								</div>
							</div>
							<Button className="mt-4 bg-blue-500 text-white">
								Continue Course
							</Button>
						</Card>
					</div>
					<div className="lg:col-span-2  space-y-8">
						<div className="grid grid-cols-2 gap-4">
							<Card className="p-6 bg-gray-100">
								<div className="flex items-center justify-between">
									<div>
										<div className="text-3xl font-bold">04</div>
										<div className="text-sm text-gray-500">
											Completed Course
										</div>
									</div>
									<GraduationCapIcon className="w-8 h-8 text-blue-500" />
								</div>
								<div className="mt-4 text-xs text-green-500">20% Increase</div>
							</Card>
							<Card className="p-6 bg-gray-100">
								<div className="flex items-center justify-between">
									<div>
										<div className="text-3xl font-bold">12</div>
										<div className="text-sm text-gray-500">
											Course in Progress
										</div>
									</div>
									<BookOpenIcon className="w-8 h-8 text-blue-500" />
								</div>
								<div className="mt-4 text-xs text-red-500">1% Decrease</div>
							</Card>
						</div>
						<Card className="p-6 bg-gray-100">
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-xl font-bold">Course Activity</h2>
								<Select>
									<SelectTrigger className="text-muted-foreground">
										<SelectValue placeholder="Monthly" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="monthly">Monthly</SelectItem>
										<SelectItem value="weekly">Weekly</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<BarchartChart className="w-full aspect-[4/3]" />
						</Card>
						<Card className="p-6 bg-gray-100">
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-xl font-bold">Reminders</h2>
								<Select>
									<SelectTrigger className="text-muted-foreground">
										<SelectValue placeholder="Monthly" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="monthly">Monthly</SelectItem>
										<SelectItem value="weekly">Weekly</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Type</TableHead>
										<TableHead>Due</TableHead>
										<TableHead>Faculty</TableHead>
										<TableHead>Status</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									<TableRow>
										<TableCell>
											<div className="flex items-center space-x-2">
												<ClipboardIcon className="w-4 h-4 text-blue-500" />
												<span>Assignment -1</span>
											</div>
										</TableCell>
										<TableCell>5 June 2024</TableCell>
										<TableCell>
											<div className="flex items-center space-x-2">
												<Avatar>
													<AvatarImage src="/placeholder-user.jpg" />
													<AvatarFallback>SJ</AvatarFallback>
												</Avatar>
												<span>Same Jhon</span>
											</div>
										</TableCell>
										<TableCell>
											<Badge variant="default">Done</Badge>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>
											<div className="flex items-center space-x-2">
												<ClipboardIcon className="w-4 h-4 text-blue-500" />
												<span>Quiz - 2</span>
											</div>
										</TableCell>
										<TableCell>5 Aug 2024</TableCell>
										<TableCell>
											<div className="flex items-center space-x-2">
												<Avatar>
													<AvatarImage src="/placeholder-user.jpg" />
													<AvatarFallback>JA</AvatarFallback>
												</Avatar>
												<span>Jhon Ab</span>
											</div>
										</TableCell>
										<TableCell>
											<Badge variant="secondary">Coming</Badge>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>
											<div className="flex items-center space-x-2">
												<ClipboardIcon className="w-4 h-4 text-blue-500" />
												<span>Last Class</span>
											</div>
										</TableCell>
										<TableCell>5 June 2024</TableCell>
										<TableCell>
											<div className="flex items-center space-x-2">
												<Avatar>
													<AvatarImage src="/placeholder-user.jpg" />
													<AvatarFallback>KS</AvatarFallback>
												</Avatar>
												<span>Kabir Same</span>
											</div>
										</TableCell>
										<TableCell>
											<Badge variant="default">Done</Badge>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>
											<div className="flex items-center space-x-2">
												<ClipboardIcon className="w-4 h-4 text-blue-500" />
												<span>Quiz - 2</span>
											</div>
										</TableCell>
										<TableCell>5 June 2024</TableCell>
										<TableCell>
											<div className="flex items-center space-x-2">
												<Avatar>
													<AvatarImage src="/placeholder-user.jpg" />
													<AvatarFallback>LJ</AvatarFallback>
												</Avatar>
												<span>Lee Jhon</span>
											</div>
										</TableCell>
										<TableCell>
											<Badge variant="secondary">Coming</Badge>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>
											<div className="flex items-center space-x-2">
												<ClipboardIcon className="w-4 h-4 text-blue-500" />
												<span>Assignment - 4</span>
											</div>
										</TableCell>
										<TableCell>5 June 2024</TableCell>
										<TableCell>
											<div className="flex items-center space-x-2">
												<Avatar>
													<AvatarImage src="/placeholder-user.jpg" />
													<AvatarFallback>AL</AvatarFallback>
												</Avatar>
												<span>Abraham Leo</span>
											</div>
										</TableCell>
										<TableCell>
											<Badge variant="default">Done</Badge>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>
											<div className="flex items-center space-x-2">
												<ClipboardIcon className="w-4 h-4 text-blue-500" />
												<span>Last Class</span>
											</div>
										</TableCell>
										<TableCell>5 June 2024</TableCell>
										<TableCell>
											<div className="flex items-center space-x-2">
												<Avatar>
													<AvatarImage src="/placeholder-user.jpg" />
													<AvatarFallback>AS</AvatarFallback>
												</Avatar>
												<span>Atik Saw</span>
											</div>
										</TableCell>
										<TableCell>
											<Badge variant="default">Done</Badge>
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</Card>
					</div>
				</div>
			</main>
		</div>
	);
}

function BarChartIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<line x1="12" x2="12" y1="20" y2="10" />
			<line x1="18" x2="18" y1="20" y2="4" />
			<line x1="6" x2="6" y1="20" y2="16" />
		</svg>
	);
}

function BarchartChart(props) {
	return (
		<div {...props}>
			<ChartContainer
				config={{
					desktop: {
						label: "Desktop",
						color: "hsl(var(--chart-1))",
					},
				}}
				className="min-h-[300px]"
			>
				<BarChart
					accessibilityLayer
					data={[
						{ month: "January", desktop: 186 },
						{ month: "February", desktop: 305 },
						{ month: "March", desktop: 237 },
						{ month: "April", desktop: 73 },
						{ month: "May", desktop: 209 },
						{ month: "June", desktop: 214 },
					]}
				>
					<CartesianGrid vertical={false} />
					<XAxis
						dataKey="month"
						tickLine={false}
						tickMargin={10}
						axisLine={false}
						tickFormatter={(value) => value.slice(0, 3)}
					/>
					<ChartTooltip
						cursor={false}
						content={<ChartTooltipContent hideLabel />}
					/>
					<Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
				</BarChart>
			</ChartContainer>
		</div>
	);
}

function BookOpenIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
			<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
		</svg>
	);
}

function CircleCheckIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="12" cy="12" r="10" />
			<path d="m9 12 2 2 4-4" />
		</svg>
	);
}

function CircleIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="12" cy="12" r="10" />
		</svg>
	);
}

function ClipboardIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
			<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
		</svg>
	);
}

function CreditCardIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<rect width="20" height="14" x="2" y="5" rx="2" />
			<line x1="2" x2="22" y1="10" y2="10" />
		</svg>
	);
}

function DollarSignIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<line x1="12" x2="12" y1="2" y2="22" />
			<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
		</svg>
	);
}

function GraduationCapIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
			<path d="M22 10v6" />
			<path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
		</svg>
	);
}

function LayoutTemplateIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<rect width="18" height="7" x="3" y="3" rx="1" />
			<rect width="9" height="7" x="3" y="14" rx="1" />
			<rect width="5" height="7" x="16" y="14" rx="1" />
		</svg>
	);
}

function LifeBuoyIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="12" cy="12" r="10" />
			<path d="m4.93 4.93 4.24 4.24" />
			<path d="m14.83 9.17 4.24-4.24" />
			<path d="m14.83 14.83 4.24 4.24" />
			<path d="m9.17 14.83-4.24 4.24" />
			<circle cx="12" cy="12" r="4" />
		</svg>
	);
}

function LinechartChart(props) {
	return (
		<div {...props}>
			<ChartContainer
				config={{
					desktop: {
						label: "Desktop",
						color: "hsl(var(--chart-1))",
					},
				}}
			>
				<LineChart
					accessibilityLayer
					data={[
						{ month: "January", desktop: 186 },
						{ month: "February", desktop: 305 },
						{ month: "March", desktop: 237 },
						{ month: "April", desktop: 73 },
						{ month: "May", desktop: 209 },
						{ month: "June", desktop: 214 },
					]}
					margin={{
						left: 12,
						right: 12,
					}}
				>
					<CartesianGrid vertical={false} />
					<XAxis
						dataKey="month"
						tickLine={false}
						axisLine={false}
						tickMargin={8}
						tickFormatter={(value) => value.slice(0, 3)}
					/>
					<ChartTooltip
						cursor={false}
						content={<ChartTooltipContent hideLabel />}
					/>
					<Line
						dataKey="desktop"
						type="natural"
						stroke="var(--color-desktop)"
						strokeWidth={2}
						dot={false}
					/>
				</LineChart>
			</ChartContainer>
		</div>
	);
}

function PieChartIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
			<path d="M22 12A10 10 0 0 0 12 2v10z" />
		</svg>
	);
}

function SearchIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="11" cy="11" r="8" />
			<path d="m21 21-4.3-4.3" />
		</svg>
	);
}

function SettingsIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
			<circle cx="12" cy="12" r="3" />
		</svg>
	);
}

function SunIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="12" cy="12" r="4" />
			<path d="M12 2v2" />
			<path d="M12 20v2" />
			<path d="m4.93 4.93 1.41 1.41" />
			<path d="m17.66 17.66 1.41 1.41" />
			<path d="M2 12h2" />
			<path d="M20 12h2" />
			<path d="m6.34 17.66-1.41 1.41" />
			<path d="m19.07 4.93-1.41 1.41" />
		</svg>
	);
}

function XIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M18 6 6 18" />
			<path d="m6 6 12 12" />
		</svg>
	);
}
