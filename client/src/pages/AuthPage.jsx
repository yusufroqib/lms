import React from "react";
import { useSelector } from "react-redux";
import Login from "./Login";
import SignUp from "./SignUp";
import { selectAuthScreen } from "@/features/authScreen";

const AuthPage = () => {
	const authScreenPage = useSelector(selectAuthScreen);

	return <>{authScreenPage === "login" ? <Login /> : <SignUp />}</>;
};

export default AuthPage;
