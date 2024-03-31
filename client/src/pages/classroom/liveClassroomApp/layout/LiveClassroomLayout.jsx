import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const LiveClassroomLayout = ({ children }) => {
	return (
		<main className="relative">
			<Navbar />

			<div className="flex">
				<Sidebar />

				<section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-28 max-md:pb-14 sm:px-14">
					<div className="w-full">
						<Outlet />
					</div>
				</section>
			</div>
		</main>
	);
};
export default LiveClassroomLayout;
