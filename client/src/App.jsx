import { Routes, Route, Navigate } from "react-router-dom";
import LVSpinner from "./LVSpinner/LVSpinner";
import { Button } from "@material-tailwind/react";
import SignUp from "./pages/SignUp";


function App() {
	return (
	<Routes>
      <Route path="/" element={<SignUp />}/>
	</Routes>
	);
}

export default App;
