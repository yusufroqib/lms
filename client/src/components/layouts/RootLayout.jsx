import { useGetMyDetailsQuery } from "@/features/users/usersApiSlice";
import React, { useEffect, useState } from "react";
import Header from "../layouts/Header/index";
import Sidebar from "./Sidebar/index";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { StreamChatProvider } from "@/context/StreamChatContext";

const RootLayout = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const { classroomId } = useParams();

	return (
		<StreamChatProvider>
			<div className="dark:bg-boxdark-2 dark:text-bodydark">
				{/* <!-- ===== Page Wrapper Start ===== --> */}
				<div className="flex h-screen overflow-hidden">
					{/* <!-- ===== Sidebar Start ===== --> */}
					{!classroomId && (
						<Sidebar
							sidebarOpen={sidebarOpen}
							setSidebarOpen={setSidebarOpen}
						/>
					)}
					{/* <!-- ===== Sidebar End ===== --> */}

					{/* <!-- ===== Content Area Start ===== --> */}
					<div className="relative flex flex-1 flex-col min-h-screen overflow-y-auto overflow-x-hidden">
						{/* <!-- ===== Header Start ===== --> */}
						{!classroomId && (
							<Header
								sidebarOpen={sidebarOpen}
								setSidebarOpen={setSidebarOpen}
							/>
						)}
						{/* <!-- ===== Header End ===== --> */}

						{/* <!-- ===== Main Content Start ===== --> */}
						<main className="flex flex-1">
							<div className="w-full">
								<Outlet /> {/* Render nested child routes */}
							</div>
							{/* <div className="mx-auto flex-grow max-w-screen-2xl p-4 md:p-6 2xl:p-10"> */}
							{/* {children} */}
							{/* </div> */}
						</main>
						{/* <!-- ===== Main Content End ===== --> */}
					</div>
					{/* <!-- ===== Content Area End ===== --> */}
				</div>
				{/* <!-- ===== Page Wrapper End ===== --> */}
			</div>{" "}
		</StreamChatProvider>
	);
	// }
};

export default React.memo(RootLayout);
