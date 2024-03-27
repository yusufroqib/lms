import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { selectCurrentToken } from "@/features/auth/authSlice";

const useAuth = () => {
	const token = useSelector(selectCurrentToken);
	let isTutor = false;
	let isAdmin = false;
	let status = "Student";

	if (token) {
		const decoded = jwtDecode(token);
		const { _id, username, roles, fullName, image, streamToken } =
			decoded.UserInfo;

		isTutor = roles.includes("Tutor");
		isAdmin = roles.includes("Admin");

		if (isTutor) status = "Tutor";
		if (isAdmin) status = "Admin";

		return {
			_id,
			username,
			roles,
			status,
			isTutor,
			isAdmin,
			fullName,
			image,
			streamToken,
		};
	}

	return {
		_id: "",
		username: "",
		roles: [],
		isTutor,
		isAdmin,
		status,
		fullName: "",
		image: "",
		streamToken: "",
	};
};
export default useAuth;
