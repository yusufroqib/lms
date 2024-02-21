import { useGetMyDetailsQuery } from "@/features/users/usersApiSlice";
import React, { useEffect } from "react";

const Dashboard = () => {
	const {
		data: user,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useGetMyDetailsQuery('myDetails', {
		pollingInterval: 60000,
		refetchOnFocus: true,
		refetchOnMountOrArgChange: true,
	});
	console.log(user);

	useEffect(() => {
		const userId = user?.ids[0];
		const userInfo = user?.entities[userId];
		localStorage.setItem("myInfo", JSON.stringify(userInfo));
	}, [user]);

	if (isSuccess)return <div>Dashboard: {JSON.stringify(user)}</div>;
};

export default Dashboard;
