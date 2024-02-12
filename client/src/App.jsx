import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./App.css";
import Test from "./pages/Login/Test";

function App() {
	const [user, setUser] = useState(null);

	

	// if (!user) return <h1>Loading...</h1>

	return (
		<div className="container">
			<Routes>
				<Route
					exact
					path="/"
					element={<Test user={user} setUser={setUser}/>}
				/>
				<Route
					exact
					path="/home"
					element={user ? <Home user={user} /> : <Navigate to="/login" />}
				/>
				<Route
					exact
					path="/login"
					element={user ? <Navigate to="/" /> : <Login />}
				/>
				<Route
					path="/signup"
					element={user ? <Navigate to="/" /> : <Signup />}
				/>
			</Routes>
		</div>
	);
}

export default App;
