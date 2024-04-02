import StreamVideoProvider from "@/context/StreamVideoProvider";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import '@/styles/liveClassroomStyles.css'
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "react-datepicker/dist/react-datepicker.css";

const LiveClassroomLayout = ({ children }) => {
	return (
		<StreamVideoProvider>
		<main className="relative bg-dark-2">
			<Navbar />

			<div className="flex">
				<Sidebar />

				<section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-28 max-md:pb-14  sm:px-14">
					<div className="w-full">
						<Outlet />
					</div>
				</section>
			</div>
		</main>
		</StreamVideoProvider>
	);
};
export default LiveClassroomLayout;
