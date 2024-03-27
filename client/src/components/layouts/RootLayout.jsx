import { useGetMyDetailsQuery } from "@/features/users/usersApiSlice";
import React, { useEffect, useState } from "react";
import Header from "../layouts/Header/index";
import Sidebar from "./Sidebar/index";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoggedUser } from "@/features/auth/authSlice";

const RootLayout = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const loggedUser = useSelector((state) => state.auth.loggedUser);
	const dispatch = useDispatch();
	const location = useLocation();
	const {
		data: user,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useGetMyDetailsQuery();
	//   "myDetails",
	//  {
	// 	pollingInterval: 60000,
	// 	refetchOnFocus: true,
	// 	refetchOnMountOrArgChange: true,
	// }

	// console.log(user);

	useEffect(() => {
		const userId = user?.ids[0];
		const userInfo = user?.entities[userId];
		dispatch(setLoggedUser({ loggedUser: userInfo }));
		// localStorage.setItem("myInfo", JSON.stringify(userInfo));
	}, [user]);

	if (isLoading) {
		return <h1>Fetching Details...</h1>;
	} else if (loggedUser) {
		return (
			<div className="dark:bg-boxdark-2 dark:text-bodydark">
				{/* <!-- ===== Page Wrapper Start ===== --> */}
				<div className="flex h-screen overflow-hidden">
					{/* <!-- ===== Sidebar Start ===== --> */}
						<Sidebar
							sidebarOpen={sidebarOpen}
							setSidebarOpen={setSidebarOpen}
						/>
					{/* <!-- ===== Sidebar End ===== --> */}

					{/* <!-- ===== Content Area Start ===== --> */}
					<div className="relative flex flex-1 flex-col min-h-screen overflow-y-auto overflow-x-hidden">
						{/* <!-- ===== Header Start ===== --> */}
						<Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
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
			</div>
		);
	}
};

export default React.memo(RootLayout);
