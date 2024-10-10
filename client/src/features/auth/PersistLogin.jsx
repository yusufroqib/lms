import { Outlet, Link, Navigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "@/hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";
import { Loader2 } from "lucide-react";
import { useDisconnect } from "wagmi";

const PersistLogin = () => {
	const [persist] = usePersist();
	const token = useSelector(selectCurrentToken);
	const effectRan = useRef(false);
	const location = useLocation();
	const { disconnectAsync } = useDisconnect();

	const [trueSuccess, setTrueSuccess] = useState(false);

	const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
		useRefreshMutation();

	useEffect(() => {
		if (!token && persist && !isLoading && isError) {
			disconnectWallet();
		}
	}, [persist, isLoading, isError, token]);

	useEffect(() => {
		if (effectRan.current === true || process.env.NODE_ENV !== "development") {
			// React 18 Strict Mode

			const verifyRefreshToken = async () => {
				try {
					//const response =
					await refresh().unwrap();
					//const { accessToken } = response.data
					setTrueSuccess(true);
				} catch (err) {
					console.error(err);
				}
			};

			if (!token && persist) verifyRefreshToken();
		}

		return () => (effectRan.current = true);

		// eslint-disable-next-line
	}, []);

	const disconnectWallet = async () => {
		await disconnectAsync();
	};

	let content;
	if (!persist) {
		// persist: no
		console.log("no persist");
		content = <Outlet />;
	} else if (isLoading) {
		//persist: yes, token: no
		// console.log('loading')
		content = (
			<div className="flex min-h-[100vh] justify-center items-center">
				<Loader2 key="loader" className="mr-2 h-10 w-10 animate-spin" />{" "}
			</div>
		);
	} else if (isError) {
		//persist: yes, token: no
		// console.log('error')
		localStorage.setItem("isLogin", "false");
		content = <Navigate to="/auth" state={{ from: location }} replace />;
	} else if (isSuccess && trueSuccess) {
		//persist: yes, token: yes
		// console.log('success')
		content = <Outlet />;
	} else if (token && isUninitialized) {
		//persist: yes, token: yes
		console.log("token and uninit");
		console.log(isUninitialized);
		content = <Outlet />;
	}

	return content;
};
export default PersistLogin;
