import { useGetMyDetailsQuery } from "@/features/users/usersApiSlice";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const Dashboard = () => {
	const loggedUser = useSelector((state) => state.auth.loggedUser);

	// console.log(loggedUser)


	if (loggedUser.roles) return <div className="min-h-screen">Dashboard: {JSON.stringify(loggedUser)}</div>;
};

export default React.memo(Dashboard);
