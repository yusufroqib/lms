import { Navigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import StreamVideoProvider from "@/context/StreamVideoProvider";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import "@/styles/liveClassroomStyles.css";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "react-datepicker/dist/react-datepicker.css";
import useAuth from "@/hooks/useAuth";
import { useGetMyClassroomsQuery } from "@/features/users/usersApiSlice";

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
	const isAuthorized =
		currentClassroom?.students.includes(_id) || currentClassroom?.tutor._id === _id;

	if (!isAuthorized) {
		return <Navigate to={"/classrooms"} />;
	}

	if (currentClassroom) {
		return (
			<StreamVideoProvider>
				<main className="relative bg-dark-2">
					{!location.pathname.includes("meeting") && <Navbar />}

					<div className="flex">
						{!location.pathname.includes("meeting") && <Sidebar />}

						<section
							className={`flex min-h-screen flex-1 flex-col  ${
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
			</StreamVideoProvider>
		);
	}
};
export default LiveClassroomLayout;
