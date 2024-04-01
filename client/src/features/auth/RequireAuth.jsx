import useAuth from "@/hooks/useAuth";
import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";

const RequireAuth = ({ allowedRoles }) => {
	const location = useLocation();
	// const dispatch = useDispatch();
	const { roles } = useAuth();
	console.log('rendering requireauth')


	const content = roles.some((role) => allowedRoles.includes(role)) ? (
		<Outlet />
	) : (
		<Navigate to="/auth" state={{ from: location }} replace />
	);

	return content;
};
export default React.memo(RequireAuth);
