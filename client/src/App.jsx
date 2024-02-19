import { Routes, Route, Navigate } from "react-router-dom";
import LVSpinner from "./LVSpinner/LVSpinner";
import { Button } from "@material-tailwind/react";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";


function App() {
	return (
	<Routes>
      <Route path="/" element={<SignUp />}/>
      <Route path="/login" element={<Login />}/>
	</Routes>
	);
}

export default App;
