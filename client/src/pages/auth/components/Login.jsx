import { useEffect, useRef, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@material-tailwind/react";
import { authScreen } from "@/features/authScreenSlice";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/features/auth/authApiSlice";
import { setCredentials, setLoggedUser } from "@/features/auth/authSlice";


const Login = () => {
	const dispatch = useDispatch();
	const [pwd, setPwd] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [data, setData] = useState({
		user: "",
		password: "",
	});

	const [isValidPassword, setIsValidPassword] = useState(true);
	const errorMessageRef = useRef(null);
	const inputRef = useRef(null);

	const navigate = useNavigate();
	const [login, { isLoading }] = useLoginMutation();

	const handleTogglePassword = () => {
		setShowPassword((prevState) => !prevState);
	};

	const validatePassword = (value) => {
		// Perform password validation here
		const isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
		setIsValidPassword(isValid);
	};

	const handleChangePassword = (e) => {
		const value = e.target.value;
		setData({
			...data,
			password: e.target.value,
		});
		setPwd(value);
		validatePassword(value); // Call validatePassword function
	};

	const handleInputFocus = () => {
		if (errorMessageRef.current) {
			errorMessageRef.current.style.display = "none";
		}
	};
	
	

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
			const { accessToken, loggedUser } = await 
				login(data).unwrap()
			// console.log(res)
			dispatch(setCredentials({ accessToken }));
			dispatch(setLoggedUser({loggedUser}))
			// console.log(loggedUser);
			navigate("/dashboard")
			setData({
				...data,
				user: "",
				password: "",
			});
			// navigate('/dash')
		} catch (err) {
			if (!err.status) {
				console.log("No Server Response");
			} else if (err.status === 400) {
				console.log(err, "Missing Username or Password");
			} else if (err.status === 401) {
				console.log("Unauthorized");
			} else {
				console.log(err.data?.message);
			}
			// errRef.current.focus();
		}
	};

	const { ...allData } = data;

	// Disable submit button until all fields are filled in
	const canSubmit =
		[...Object.values(allData)].every(Boolean) && isValidPassword;

	return (
		<div className="flex flex-col bg-[#dfdfe6] justify-center items-center min-h-screen ">
			<div className="flex flex-col items-center py-10 sm:justify-center w-full">
				<img
					className="w-80 mb-6"
					src="/learniverse-full.svg"
					alt="learniverse-full"
				/>
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
									// autoComplete="off"
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
										ref={inputRef}
										autoComplete="off"
										onFocus={handleInputFocus}
										required
										onChange={handleChangePassword}
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
										Password must be at least 8 characters long and must contain
										at least 1 uppercase letter, 1 lowercase letter, and 1
										number.
									</span>
								)}
							</div>
						</div>

						<div className="flex items-center mt-4">
							<button
								type="submit"
								disabled={!canSubmit}
								className="w-full text-white bg-purple-700 hover:bg-purple-600 focus:ring-1 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center mt-2 disabled:bg-gradient-to-br disabled:from-gray-100 disabled:to-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed group-invalid:bg-gradient-to-br group-invalid:from-gray-100 group-invalid:to-gray-300 group-invalid:text-gray-400 group-invalid:pointer-events-none group-invalid:opacity-70"
							>
								Login
							</button>
						</div>
					</form>
					<div className="mt-4 text-zinc-600 text-md dark:text-zinc-300">
						Don&apos;t have an account?{" "}
						<span
							className="text-purple-600 cursor-pointer hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-100 hover:underline"
							onClick={() => dispatch(authScreen("signup"))}
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
						<Button
							size="lg"
							variant="outlined"
							color="blue-gray"
							className="flex items-center justify-center gap-3 w-full py-3"
							// className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-600 flex items-center justify-center w-full py-3 space-x-4 border rounded-md focus:ring-2 focus:ring-offset-1 border-gray-300 dark:border-gray-700 hover:border-purple-400 focus:ring-purple-400 dark:hover:border-purple-600"
						>
							<img
								src="https://docs.material-tailwind.com/icons/google.svg"
								alt="googlr"
								className="h-6 w-6"
							/>
							Continue with Google
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
