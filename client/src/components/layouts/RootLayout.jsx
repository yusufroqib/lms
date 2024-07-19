import { useGetMyDetailsQuery } from "@/features/users/usersApiSlice";
import React, { useEffect, useState } from "react";
import Header from "../layouts/Header/index";
import Sidebar from "./sidebar/index";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { StreamChatProvider } from "@/context/StreamChatContext";

const RootLayout = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const { classroomId } = useParams();


	return (
		<StreamChatProvider>
			<div className="dark:bg-boxdark-2 dark:text-bodydark">
				<div className="flex h-[100dvh] overflow-hidden">
					{!classroomId && (
						<Sidebar
							sidebarOpen={sidebarOpen}
							setSidebarOpen={setSidebarOpen}
						/>
					)}
					<div className="relative flex flex-1 flex-col min-h-[100dvh] overflow-y-auto overflow-x-hidden">
						{!classroomId && (
							<Header
								sidebarOpen={sidebarOpen}
								setSidebarOpen={setSidebarOpen}
							/>
						)}

						<main className="flex flex-1">
							<div className="w-full bg-white">
								<Outlet /> {/* Render nested child routes */}
							</div>
						
						</main>
					</div>
				</div>
			</div>{" "}
		</StreamChatProvider>
	);
	// }
};

export default React.memo(RootLayout);
