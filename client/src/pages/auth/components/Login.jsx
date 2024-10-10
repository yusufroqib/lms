import { useEffect, useRef, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setAuthScreen } from "@/features/authScreenSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/features/auth/authApiSlice";
import { setActivationToken, setCredentials } from "@/features/auth/authSlice";
import toast from "react-hot-toast";
import GoogleButton from "./GoogleButton";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import CustomConnectButton from "@/components/CustomConnectButton";
import { getFingerprint } from "@/lib/fingerprint";
import VerifyDeviceOTP from "../VerifyDeviceOTP";

const Login = () => {
	const dispatch = useDispatch();
	const [pwd, setPwd] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [data, setData] = useState({
		user: "",
		password: "",
	});
	const [fingerprint, setFingerprint] = useState("");
	const [showVerifyDevice, setShowVerifyDevice] = useState(false);
	const [email, setEmail] = useState("");

	// console.log(fingerprint)

	// const { address, isConnecting, isDisconnected, status } = useAccount()

	const [isValidPassword, setIsValidPassword] = useState(true);
	const errorMessageRef = useRef(null);
	const inputRef = useRef(null);

	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from?.pathname || "/dashboard";
	const [login, { isLoading }] = useLoginMutation();

	const handleTogglePassword = () => {
		setShowPassword((prevState) => !prevState);
	};

	const validatePassword = (value) => {
		const isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
		setIsValidPassword(isValid);
	};

	useEffect(() => {
		getFingerprint().then(setFingerprint);
	}, []);

	const handlePasswordChange = (e) => {
		const value = e.target.value;
		setData({
			...data,
			password: e.target.value,
		});
		setPwd(value);
		validatePassword(value);
	};

	const handleInputFocus = () => {
		if (errorMessageRef.current) {
			errorMessageRef.current.style.display = "none";
		}
	};

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, []);

	useEffect(() => {
		if (!inputRef.current) return;
		handleInputFocus();

		const handleInputBlur = () => {
			if (
				pwd.length > 0 &&
				!isValidPassword &&
				document.activeElement !== inputRef.current
			) {
				errorMessageRef.current.style.display = "block";
			}
		};

		inputRef.current.addEventListener("blur", handleInputBlur);

		return () => {
			inputRef.current?.removeEventListener("blur", handleInputBlur);
		};
	}, [isValidPassword, pwd]);

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const { accessToken, email, activationToken } = await login({
				...data,
				fingerprint,
			}).unwrap();

			// console.log('activationToken', activationToken)

			if (activationToken) {
				setEmail(email);
				dispatch(setActivationToken({ activationToken }));

				return setShowVerifyDevice(true);
			}

			dispatch(setCredentials({ accessToken }));
			localStorage.setItem("isLogin", "true");
			navigate(from, { replace: true });
			setData({
				...data,
				user: "",
				password: "",
			});
		} catch (err) {
			console.log(err);
			toast.error(err.data?.error || err.data?.message);
			if (!err.status) {
				console.log("No Server Response");
			} else if (err.status === 400) {
				console.log(err, "Missing Username or Password");
			} else if (err.status === 401) {
				console.log("Unauthorized");
			} else {
				console.log(err.data?.message);
			}
		}
	};

	let buttonText = "Login";

	if (isLoading) {
		buttonText = (
			<>
				<Loader2 key="loader" className="mr-2 h-4 w-4 animate-spin" /> Logging
				in
			</>
		);
	}

	const { ...allData } = data;

	const canSubmit =
		[...Object.values(allData)].every(Boolean) && isValidPassword;

	return (
		<div className="flex flex-col bg-[#dfdfe6] justify-center items-center min-h-screen ">
			<div className="flex flex-col items-center py-10 sm:justify-center w-full">
				<Link to="/">
					<img
						className="w-80 mb-6"
						src="/learniverse-full.svg"
						alt="learniverse-full"
					/>
				</Link>

				{!showVerifyDevice ? (
					<div className="w-full px-6 py-6 bg-white dark:bg-gray-900 shadow-md rounded-md sm:rounded-lg max-w-sm">
						<div className="text-center text-4xl font-bold mb-3">
							<h1 className=" text-slate-600">Login</h1>
						</div>
						<form action="" onSubmit={handleLogin} className="group">
							<div className="mt-4">
								<label
									htmlFor="username"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									Email or Username <span className="text-red-500"> *</span>
								</label>
								<div className="flex flex-col items-start">
									<input
										type="text"
										name="username"
										placeholder="Email or Username"
										className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500 placeholder-gray-300 valid:[&:not(:placeholder-shown)]:border-green-500 [&:not(:placeholder-shown):not(:focus):invalid~span]:block invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400"
										ref={inputRef}
										required
										pattern="^(?!\s+$).{3,}$"
										onChange={(e) => {
											setData({
												...data,
												user: e.target.value,
											});
										}}
									/>
									<span className="mt-1 hidden text-sm text-red-400">
										Email or username must be at least 3 characters long{" "}
									</span>
								</div>
							</div>

							<div className="mt-4">
								<label
									htmlFor="password"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									Password <span className="text-red-500"> *</span>
								</label>

								<div className="relative flex flex-col items-start">
									<div className="relative w-full">
										<input
											type={showPassword ? "text" : "password"}
											name="password"
											placeholder="Password"
											className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500 placeholder-gray-300 ${
												pwd.length > 0 && !isValidPassword && "border-red-400"
											} ${
												pwd.length > 0 && isValidPassword && "border-green-500"
											}`}
											autoComplete="off"
											onFocus={handleInputFocus}
											required
											onChange={handlePasswordChange}
										/>
										<button
											type="button"
											className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 focus:outline-none"
											onClick={handleTogglePassword}
										>
											{showPassword ? (
												<FaRegEye className="w-5 h-5" />
											) : (
												<FaRegEyeSlash className="w-5 h-5" />
											)}
										</button>
									</div>

									{pwd.length > 0 && !isValidPassword && (
										<span
											ref={errorMessageRef}
											className="mt-1 text-sm text-red-400"
										>
											Password must be at least 8 characters long and must
											contain at least 1 uppercase letter, 1 lowercase letter,
											and 1 number.
										</span>
									)}
								</div>
							</div>

							<div className="flex items-center mt-4">
								<Button
									type="submit"
									disabled={!canSubmit || isLoading}
									className="w-full text-white bg-purple-700 hover:bg-purple-600 focus:ring-1 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center mt-2 disabled:bg-gradient-to-br disabled:from-gray-100 disabled:to-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed group-invalid:bg-gradient-to-br group-invalid:from-gray-100 group-invalid:to-gray-300 group-invalid:text-gray-400 group-invalid:pointer-events-none group-invalid:opacity-70"
								>
									{buttonText}
								</Button>
								{/* </Button> */}
							</div>
						</form>
						<div className="mt-4 text-zinc-600 text-md dark:text-zinc-300">
							Don&apos;t have an account?{" "}
							<span
								className="text-purple-600 cursor-pointer hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-100 hover:underline"
								onClick={() => dispatch(setAuthScreen("signup"))}
							>
								Sign up instead
							</span>
						</div>
						<div className="flex items-center w-full my-4">
							<hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700 w-full" />
							<p className="px-3 ">OR</p>
							<hr className="w-full h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
						</div>
						<div className="my-6 space-y-2">
							<GoogleButton />
						</div>
						<div className="my-6 space-y-2">
							<CustomConnectButton className="w-full rounded-lg py-3" />
						</div>
					</div>
				) : (
					<VerifyDeviceOTP email={email} handleLogin={handleLogin}/>
				)}
			</div>
		</div>
	);
};

export default Login;
