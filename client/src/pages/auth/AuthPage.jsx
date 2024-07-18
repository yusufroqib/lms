import { Navigate } from "react-router-dom";
import React from "react";
import { useSelector } from "react-redux";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { selectAuthScreen } from "@/features/authScreenSlice";

const AuthPage = () => {
	// const navigate = useNavigate();
	const isLogin = localStorage.getItem("isLogin");

	if (isLogin === "true") {
		return <Navigate to="/dashboard" />;
	}

	const authScreenPage = useSelector(selectAuthScreen);

	return <>{authScreenPage === "login" ? <Login /> : <SignUp />}</>;
};

export default AuthPage;
