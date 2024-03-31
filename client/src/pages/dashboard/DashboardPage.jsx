// import { useGetMyDetailsQuery } from "@/features/users/usersApiSlice";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
	Tabs,
	TabsHeader,
	TabsBody,
	Tab,
	TabPanel,
} from "@material-tailwind/react";

import { FaArrowRightLong } from "react-icons/fa6";
import {
	Card,
	CardHeader,
	Input,
	Typography,
	Button,
	CardBody,
	Chip,
	CardFooter,
	//   Tabs,
	//   TabsHeader,
	//   Tab,
	Avatar,
	IconButton,
	Tooltip,
} from "@material-tailwind/react";


const TABLE_ROWS = [
	{
		img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg",
		description:
			"Vorem ipsum dolor sit dsamet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
		email: "john@creative-tim.com",
		time: "Q4 2024",
		bootCamp: "Bootcamp",
		web3: "Web 3",
		online: "online",
		date: "23/04/18",
	},
	{
		img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-2.jpg",
		description:
			"Vorem ipsumfff dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
		email: "alexa@creative-tim.com",
		time: "Q4 2024",
		bootCamp: "Bootcamp",
		web3: "Web 3",
		online: "online",

		date: "23/04/18",
	},
	{
		img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-1.jpg",
		description:
			"Vorem fffipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
		email: "laurent@creative-tim.com",
		time: "Q4 2024",
		bootCamp: "Bootcamp",
		web3: "Web 3",
		online: "online",

		date: "19/09/17",
	},
	{
		img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-4.jpg",
		description:
			"Vorem ipsum dolor sit amet, dfconsectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
		// email: "michael@creative-tim.com",
		time: "Q4 2024",
		bootCamp: "Bootcamp",
		web3: "Web 3",
		online: "online",

		date: "24/12/08",
	},
	{
		img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-5.jpg",
		description:
			"Vorem ipsum dolor sitffh amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
		email: "richard@creative-tim.com",
		time: "Q4 2024",
		bootCamp: "Bootcamp",
		web3: "Web 3",
		online: "online",

		date: "04/10/21",
	},
];

const Dashboard = () => {
	// const loggedUser = useSelector((state) => state.auth.loggedUser);

	// console.log(loggedUser)

	const [activeTab, setActiveTab] = React.useState("all");
	const data = [
		{
			label: "All",
			value: "all",
		},
		{
			label: "Hackaton",
			value: "hackaton",
		},
		{
			label: "Bootcamp",
			value: "bootcamp",
		},
		{
			label: "Event",
			value: "event",
		},
		{
			label: "Incubator",
			value: "incubator",
		},
	];
	return (
		<Card className="h-full p-3 md:p-[50px] w-full">
			<div><Typography className="text-4xl font-semibold mb-[17px]"> Past Events</Typography></div>

			<Tabs value={activeTab}>
				<TabsHeader
					className="rounded-none w-[30%] border-b border-blue-gray-50 bg-transparent p-0"
					indicatorProps={{
						className:
							"bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
					}}
				>
					{data.map(({ label, value }) => (
						<Tab
							key={value}
							value={value}
							onClick={() => setActiveTab(value)}
							className={activeTab === value ? "text-gray-900" : "text-gray-400"}
						>
							{label}
						</Tab>
					))}
				</TabsHeader>
				<hr className="mt-5 border-t-1 border-gray-900"/>
				<TabsBody>
					<TabPanel key={"all"} value={"all"}>
						<div className="w-full  mostly-customized-scrollbar overflow-auto">
							<table className="mt-4 w-full min-w-max  table-auto text-left">
								<tbody>
									{TABLE_ROWS.map(
										(
											{ img, description, email, time, bootCamp, web3, online },
											index
										) => {
											const isLast = index === TABLE_ROWS.length - 1;
											const classes = isLast
												? "p-4"
												: "p-4 border-b border-blue-gray-50";

											return (
												<tr key={description}>
													<td className={classes}>
														<div className="flex items-center gap-3 max-w-100 md:max-w-150">
															<Avatar src={img} alt={description} size="lg" />
															{/* <div className="flex flex-col "> */}
															<Typography
																variant="small"
																color="blue-gray"
																className="font-normal"
															>
																{description}
															</Typography>
														</div>
													</td>
													<td className={classes}>
														<div className="flex flex-col">
															<Typography
																variant="small"
																// color="gray"
																className="font-medium text-gray-700/70"
															>
																{time}
															</Typography>
														</div>
													</td>
													<td className={classes}>
														<div className="w-max">
															<Chip
																variant="ghost"
																size="sm"
																value={bootCamp}
																// color={online ? "light-green" : "blue-gray"}
																className="bg-[#B7FF88] p-2"
															/>
														</div>
													</td>
													<td className={classes}>
														<div className="w-max">
															<Chip
																variant="ghost"
																size="sm"
																value={web3}
																// color={online ? "light-green" : "blue-gray"}
																className="bg-[#FFDBA9] p-2"
															/>
														</div>
													</td>
													<td className={classes}>
														<div className="w-max">
															<Chip
																variant="ghost"
																size="sm"
																value={online}
																// color={online ? "light-green" : "blue-gray"}
																className="bg-[#7B8B76] p-2 text-[#F7FCFE]"
															/>
														</div>
													</td>

													<td className={classes}>
														{/* <Tooltip content="Edit User"> */}
														<IconButton variant="text">
															<FaArrowRightLong className="h-4 w-4" />
														</IconButton>
														{/* </Tooltip> */}
													</td>
												</tr>
											);
										}
									)}
								</tbody>
							</table>{" "}
						</div>
					</TabPanel>
				</TabsBody>
			</Tabs>
		</Card>
	);
};

export default React.memo(Dashboard);
