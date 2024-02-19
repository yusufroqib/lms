import { useEffect, useRef, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@material-tailwind/react";
import { loginScreen } from "@/features/authScreen";

const Login = () => {
	const dispatch = useDispatch();
	const [pwd, setPwd] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [data, setData] = useState({
		username: "",
		password: "",
	});

	const [isValidPassword, setIsValidPassword] = useState(true);
	const errorMessageRef = useRef(null);
	const inputRef = useRef(null);

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

	const handleRegistration = (e) => {
		e.preventDefault();

		console.log(data);
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
					<form action="" onSubmit={handleRegistration} className="group">
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
									autoComplete="off"
									required
									pattern="^(?!\s+$).{3,}$"
									onChange={(e) => {
										setData({
											...data,
											username: e.target.value,
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
							{/* <div className=" relative flex flex-col items-start">
									<input
										type={showPassword ? 'text' : 'password'}
										name="password"
										placeholder="Password"
										className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500 placeholder-gray-300 valid:[&:not(:placeholder-shown)]:border-green-500 [&:not(:placeholder-shown):not(:focus):invalid~span]:block invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400"
										autoComplete="off"
										required
										pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
										onChange={(e) => {
											setData({
												...data,
												password: e.target.value,
											});
										}}
									/>

									<button
										type="button"
										className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 focus:outline-none"
										onClick={handleTogglePassword}
									>
										{showPassword ? (
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M10 4C6.13 4 3 7.13 3 10s3.13 6 7 6 7-3.13 7-6-3.13-6-7-6zM5 10c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3zm5 5c-2.33 0-4.47-1.07-5.87-2.77l1.5-1.5C7.24 12.36 8.06 13 9 13s1.76-.64 2.37-1.65l1.5 1.5C9.53 13.93 7.38 15 5 15zm8.87-5.27l1.56 1.56C16.76 12.36 17.98 13 19 13c1.1 0 2-.9 2-2s-.9-2-2-2c-.69 0-1.31.35-1.67.88l1.56 1.56C18.38 10.93 18 10.01 18 9c0-1.66 1.34-3 3-3s3 1.34 3 3c0 1.01-.38 1.93-1 2.73z"
													clipRule="evenodd"
												/>
											</svg>
										) : (
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M10 4a6 6 0 00-6 6c0 2.6 1.46 4.82 3.56 5.96A2.505 2.505 0 006 15c-1.38 0-2.5-1.12-2.5-2.5S4.62 10 6 10c.21 0 .41.03.59.08A6 6 0 1010 4zm4.07 6.07a4 4 0 11-5.66 0L10 9.41l-1.41 1.42a4 4 0 11-2.83-2.83L7.17 6.3A6.017 6.017 0 0010 6a5.998 5.998 0 003.54-1.15l1.95 1.95 1.06-1.06zM11 11.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
													clipRule="evenodd"
												/>
											</svg>
										)}
									</button>
								<span className="mt-1 hidden text-sm text-red-400">
									Password must be at least 8 characters long and must contain
									at least 1 uppercase letter, 1 lowercase letter, 1 number and
									can include optional special characters.
								</span>
							</div> */}
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
										{/* {showPassword ? (
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M10 4C6.13 4 3 7.13 3 10s3.13 6 7 6 7-3.13 7-6-3.13-6-7-6zM5 10c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3zm5 5c-2.33 0-4.47-1.07-5.87-2.77l1.5-1.5C7.24 12.36 8.06 13 9 13s1.76-.64 2.37-1.65l1.5 1.5C9.53 13.93 7.38 15 5 15zm8.87-5.27l1.56 1.56C16.76 12.36 17.98 13 19 13c1.1 0 2-.9 2-2s-.9-2-2-2c-.69 0-1.31.35-1.67.88l1.56 1.56C18.38 10.93 18 10.01 18 9c0-1.66 1.34-3 3-3s3 1.34 3 3c0 1.01-.38 1.93-1 2.73z"
													clipRule="evenodd"
												/>
											</svg>
										) : (
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M10 4a6 6 0 00-6 6c0 2.6 1.46 4.82 3.56 5.96A2.505 2.505 0 006 15c-1.38 0-2.5-1.12-2.5-2.5S4.62 10 6 10c.21 0 .41.03.59.08A6 6 0 1010 4zm4.07 6.07a4 4 0 11-5.66 0L10 9.41l-1.41 1.42a4 4 0 11-2.83-2.83L7.17 6.3A6.017 6.017 0 0010 6a5.998 5.998 0 003.54-1.15l1.95 1.95 1.06-1.06zM11 11.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
													clipRule="evenodd"
												/>
											</svg>
										)} */}
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
								Create account
							</button>
						</div>
					</form>
					<div className="mt-4 text-zinc-600 text-md dark:text-zinc-300">
						Don&apos;t have an account?{" "}
						<span
							className="text-purple-600 cursor-pointer hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-100 hover:underline"
							onClick={() => dispatch(loginScreen("signup"))}
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
