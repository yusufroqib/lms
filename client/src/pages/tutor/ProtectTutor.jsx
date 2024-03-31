import useAuth from "@/hooks/useAuth";
import { useLocation, Navigate, Outlet } from "react-router-dom";

const RequireTutor = ({ allowedRoles }) => {
	const location = useLocation();
	// const dispatch = useDispatch();
	const { roles } = useAuth();

	const content = roles.some((role) => allowedRoles.includes(role)) ? (
		<Outlet />
	) : (
		<Navigate to="/dashboard" state={{ from: location }} replace />
	);

	return content;
};
export default RequireTutor;
