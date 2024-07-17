import useAuth from "@/hooks/useAuth";
import React, { useState } from "react";
import TutorDashboard from "./tutorDashboard/TutorDashboard";
import StudentDashBoard from "./studentDashboard/StudentDashboard";

const DashboardPage = () => {
	const {  status } = useAuth();
	const [dashboardMode, setDashboardMode] = useState("tutor");

	if (dashboardMode === "tutor" && status === "Tutor") {
		return <TutorDashboard setDashboardMode={setDashboardMode} />;
	}
	if (dashboardMode === "student" || status === "Student") {
		return <StudentDashBoard setDashboardMode={setDashboardMode} />;
	}

	// return (
	// 	<div>
	// 		{/* <TutorDashboard />
	// 		<StudentDashBoard /> */}
	// 	</div>
	// );
};

export default DashboardPage;
