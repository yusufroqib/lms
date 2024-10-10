import { Navigate } from "react-router-dom";
import React from "react";
import { useSelector } from "react-redux";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { selectAuthScreen } from "@/features/authScreenSlice";
import { selectAddInfoDialogOpen } from "@/features/auth/authSlice";
import { add } from "date-fns";
import { AdditionalInfoDialog } from "./AdditionalInfoDialog";
import { useAccount } from "wagmi";
// import { AdditionalInfoDialog } from "@/components/AdditionalInfoDialog";

const AuthPage = () => {
	// const navigate = useNavigate();
	const addInfoDialogOpen = useSelector(selectAddInfoDialogOpen);
	const isLogin = localStorage.getItem("isLogin");
	const {address} = useAccount()

	if (isLogin === "true") {
		return <Navigate to="/dashboard" />;
	}

	const authScreenPage = useSelector(selectAuthScreen);

	return (
		<>
			{authScreenPage === "login" ? <Login /> : <SignUp />}{" "}
			{addInfoDialogOpen && <AdditionalInfoDialog ethAddress={address} />}
		</>
	);
};

export default AuthPage;
