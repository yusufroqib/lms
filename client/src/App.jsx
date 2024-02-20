import { Routes, Route, Navigate } from "react-router-dom";

import AuthPage from "./pages/AuthPage";
import SignUpOTP from "./pages/SignUpOTP";


function App() {
	return (
	<Routes>
      <Route path="/" element={<AuthPage />}/>
      <Route path="/verify" element={<SignUpOTP />}/>
	</Routes>
	);
}

export default App;
