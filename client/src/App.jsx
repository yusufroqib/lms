import { Routes, Route, Navigate } from "react-router-dom";

import AuthPage from "./pages/auth/AuthPage";
import SignUpOTP from "./pages/auth/SignUpOTPPage";
import Dashboard from "./pages/dashboard/DashboardPage";
import RootLayout from "./components/layouts/RootLayout";
import { ROLES } from "../config/roles";
import RequireAuth from "./features/auth/RequireAuth";
import PersistLogin from "./features/auth/PersistLogin";
import Prefetch from "./features/auth/Prefetch";
import CoursesIndex from "./pages/courses/CoursesIndex";
import TutorCourses from "./pages/tutor/course/TutorCourses";
import CreateCourse from "./pages/tutor/course/createCourse/CreateCourse";

function App() {
	return (
		<Routes>
			<Route path="/auth" element={<AuthPage />} />
			<Route path="/verify" element={<SignUpOTP />} />
			<Route element={<PersistLogin />}>
				<Route
					element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
				>
					<Route element={<Prefetch />}>
						<Route element={<RootLayout />}>
							<Route path="dashboard" element={<Dashboard />} />
							<Route path="courses">
								<Route index element={<CoursesIndex />} />
							</Route>
							<Route path="tutors">
								<Route path="my-courses" element={<TutorCourses />} />
								<Route path="create-course" element={<CreateCourse />} />
							</Route>
						</Route>
					</Route>
				</Route>
			</Route>
			{/* End Protected Routes */}
		</Routes>
	);
}

export default App;
