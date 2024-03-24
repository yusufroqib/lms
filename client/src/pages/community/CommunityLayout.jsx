// import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "./components/RightSidebar";
import { Outlet } from "react-router-dom";
import '@/styles/communityStyles.css'
// import Navbar from "@/components/shared/navbar/Navbar";
// import { Toaster } from "@/components/ui/toaster";

import React from "react";
const CommunityLayout = () => {
	return (
		<main className=" background-light850_dark100 relative">
			{/* <Navbar /> */}
			<div className="flex">
				{/* <LeftSidebar /> */}
				<section className="flex min-h-screen flex-1 flex-col  xl:pr-[350px] pb-6 max-md:pb-14">
					<div className="mx-auto bg-[#fcfcfc] 0 p-8 w-full">
						<Outlet />
					</div>
				</section>
				<RightSidebar />
			</div>
			{/* <Toaster /> */}
		</main>
	);
};
export default CommunityLayout;
