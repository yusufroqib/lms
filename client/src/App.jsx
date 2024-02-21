import { Routes, Route, Navigate } from "react-router-dom";

import AuthPage from "./pages/auth/AuthPage";
import SignUpOTP from "./pages/auth/SignUpOTPPage";
import Dashboard from "./pages/dashboard/DashboardPage";
import RootLayout from "./components/layouts/RootLayout";
import { ROLES } from "../config/roles";
import RequireAuth from "./features/auth/RequireAuth";
import PersistLogin from "./features/auth/PersistLogin";
import Prefetch from "./features/auth/Prefetch";

function App() {
	return (
		<Routes>
			<Route path="/" element={<AuthPage />} />
			<Route path="/verify" element={<SignUpOTP />} />
			<Route element={<PersistLogin />}>
				<Route
					element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
				>
					<Route element={<Prefetch />}>
						<Route element={<RootLayout />}>
							<Route path="/dashboard" element={<Dashboard />} />
						</Route>
					</Route>
				</Route>
			</Route>
			{/* End Protected Routes */}
		</Routes>
	);
}

export default App;
