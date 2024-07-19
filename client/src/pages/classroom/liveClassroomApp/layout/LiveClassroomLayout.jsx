import { Navigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import StreamVideoProvider from "@/context/StreamVideoProvider";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import 'stream-chat-react/dist/css/v2/index.css';
// import "@/styles/liveClassroomStyles.css";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "@/styles/index.scss";

// import "react-datepicker/dist/react-datepicker.css";
import useAuth from "@/hooks/useAuth";
import { useGetMyClassroomsQuery } from "@/features/users/usersApiSlice";
import { Loader2 } from "lucide-react";
import { StreamChatProvider } from "@/context/StreamChatContext";

const LiveClassroomLayout = ({ children }) => {
	const location = useLocation();
	const { _id } = useAuth();
	const { classroomId } = useParams();
	const {
		data: classrooms,
		isLoading,
		isError,
		error,
	} = useGetMyClassroomsQuery();
	const currentClassroom = classrooms?.find(
		(classroom) => classroom._id === classroomId
	);

	console.log(currentClassroom);

	if (isLoading) {
		return (
			<div className="flex min-h-[100vh]  justify-center items-center">
				<Loader2 key="loader" className="mr-2 h-10 w-10 animate-spin" />{" "}
			</div>
		);
	}
	const isAuthorized =
		currentClassroom?.students.some((student) => student._id === _id) ||
		currentClassroom?.tutor._id === _id;

	if (!isAuthorized) {
		return <Navigate to={"/classrooms"} />;
	}

	if (currentClassroom) {
		return (
			<StreamVideoProvider>
				<StreamChatProvider>
					<main className="relative bg-dark-2">
						{!location.pathname.includes("meeting") && <Navbar />}

						<div className="flex">
							{!location.pathname.includes("meeting") && <Sidebar />}

							<section
								className={`flex h-[100dvh] flex-1 flex-col  ${
									!location.pathname.includes("meeting") &&
									"px-6 pb-6 pt-28 max-md:pb-14  sm:px-14"
								}`}
							>
								<div className="w-full">
									<Outlet />
								</div>
							</section>
						</div>
					</main>
				</StreamChatProvider>
			</StreamVideoProvider>
		);
	}
};
export default LiveClassroomLayout;
