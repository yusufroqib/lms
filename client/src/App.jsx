import { Routes, Route, Navigate } from "react-router-dom";

import AuthPage from "./pages/auth/AuthPage";
import SignUpOTP from "./pages/auth/SignUpOTPPage";
import Dashboard from "./pages/dashboard/DashboardPage";
import RootLayout from "./components/layouts/RootLayout";

function App() {
	return (
		<Routes>
			<Route path="/" element={<AuthPage />} />
			<Route path="/verify" element={<SignUpOTP />} />
			<Route element={<RootLayout />}>
				<Route path="/dashboard" element={<Dashboard />} />
			</Route>
		</Routes>
	);
}

export default App;
