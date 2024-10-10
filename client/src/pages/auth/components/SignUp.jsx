import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { Button } from "@material-tailwind/react";
import { setAuthScreen } from "@/features/authScreenSlice";
import { useSignUpMutation } from "@/features/auth/authApiSlice";
import { setSignUpEmail, setActivationToken } from "@/features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import GoogleButton from "./GoogleButton";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const SignUp = () => {
	const dispatch = useDispatch();
	const [confirmPasword, setConfirmPassword] = useState("");
	const [confirmPwdStyle, setConfirmPwdStyle] = useState("hidden");
	const [pwd, setPwd] = useState("");
	// const [showPassword, setShowPassword] = useState(false);
	const [signUp, { isLoading }] = useSignUpMutation();
	const navigate = useNavigate();

	const [data, setData] = useState({
		name: "",
		email: "",
		password: "",
		username: "",
	});

	const handleRegistration = async (e) => {
		e.preventDefault();
		try {
			const { activationToken } = await signUp(data).unwrap();
			// console.log(res)
			dispatch(setActivationToken({ activationToken }));
			dispatch(setSignUpEmail({signUpEmail: data.email}))

			// console.log(activationToken);
			setData({
				...data,
				name: "",
				email: "",
				password: "",
				username: "",
			});
			navigate("/verify");
		} catch (err) {
			if (!err.status) {
				console.log("No Server Response");
			} else if (err.status === 400) {
				toast.error(err.data.error);
			} else if (err.status === 401) {
				console.log("Unauthorized");
			} else {
				console.log(err.data?.message);
			}
			// errRef.current.focus();
		}

		// console.log(data);
	};

	useEffect(() => {
		if (confirmPasword.length > 7 && confirmPasword !== pwd) {
			setConfirmPwdStyle("block");
		} else {
			setConfirmPwdStyle("hidden");
		}
		// console.log(confirmPasword)
	}, [confirmPasword, pwd]);

	const { ...allData } = data;

	// Disable submit button until all fields are filled in
	const canSubmit =
		[...Object.values(allData)].every(Boolean) && pwd === confirmPasword;

	let buttonText = "Create account";

	if (isLoading) {
		buttonText = (
			<>
				<Loader2 key="loader" className="mr-2 h-4 w-4 animate-spin" /> Creating
				your account
			</>
		);
	}

	return (
		<div className="flex flex-col bg-[#dfdfe6] justify-center items-center min-h-screen">
			<div className="flex flex-col items-center py-10 sm:justify-center w-full">
				<Link to="/">
					<img
						className="w-80 mb-6"
						src="/learniverse-full.svg"
						alt="learniverse-full"
					/>
				</Link>
				<div className="w-full px-6 py-6 bg-white dark:bg-gray-900 shadow-md rounded-md sm:rounded-lg max-w-sm">
					<div className="text-center text-4xl font-bold mb-3">
						<h1 className=" text-slate-600">Sign Up</h1>
					</div>
					<form action="" onSubmit={handleRegistration} className="group">
						<div>
							<label
								htmlFor="name"
								className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
							>
								Full Name <span className="text-red-500"> *</span>
							</label>
							<div className="flex flex-col items-start">
								<input
									type="text"
									name="name"
									placeholder="Full Name"
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500 placeholder-gray-300 valid:[&:not(:placeholder-shown)]:border-green-500 [&:not(:placeholder-shown):not(:focus):invalid~span]:block invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400"
									pattern="^(?!\s+$).{5,}$"
									required
									onChange={(e) => {
										setData({
											...data,
											name: e.target.value,
										});
									}}
								/>
								<span className="mt-1 hidden text-sm text-red-400">
									Full name must be at least 5 characters long
								</span>
							</div>
						</div>
						<div className="mt-4">
							<label
								htmlFor="username"
								className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
							>
								Username <span className="text-red-500"> *</span>
							</label>
							<div className="flex flex-col items-start">
								<input
									type="text"
									name="username"
									placeholder="Username"
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500 placeholder-gray-300 valid:[&:not(:placeholder-shown)]:border-green-500 [&:not(:placeholder-shown):not(:focus):invalid~span]:block invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400"
									// autoComplete="off"
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
									Username must be at least 3 characters long{" "}
								</span>
							</div>
						</div>
						<div className="mt-4">
							<label
								htmlFor="email"
								className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
							>
								Email <span className="text-red-500"> *</span>
							</label>
							<div className="flex flex-col items-start">
								<input
									type="email"
									name="email"
									placeholder="Email"
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500 placeholder-gray-300 valid:[&:not(:placeholder-shown)]:border-green-500 [&:not(:placeholder-shown):not(:focus):invalid~span]:block invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400"
									// autoComplete="off"
									required
									// pattern="[a-z0-9._+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
									onChange={(e) => {
										setData({
											...data,
											email: e.target.value,
										});
									}}
								/>
								<span className="mt-1 hidden text-sm text-red-400">
									Please enter a valid email address.{" "}
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
							<div className="flex flex-col items-start">
								<input
									type="password"
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
										if (e.target.value === confirmPasword) {
											setConfirmPwdStyle("hidden");
										}
										setPwd(e.target.value);
									}}
								/>
								<span className="mt-1 hidden text-sm text-red-400">
									Password must be at least 8 characters long and must contain
									at least 1 uppercase letter, 1 lowercase letter, 1 number and
									can include optional special characters.{" "}
								</span>
							</div>
						</div>
						<div className="mt-4">
							<label
								htmlFor="password_confirmation"
								className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
							>
								Confirm Password <span className="text-red-500 ">*</span>
							</label>
							<div className="flex flex-col items-start">
								<input
									type="password"
									name="password_confirmation"
									placeholder="Confirm password"
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500 placeholder-gray-300 valid:[&:not(:placeholder-shown)]:border-green-500 [&:not(:placeholder-shown):not(:focus):invalid~span]:block invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400"
									autoComplete="off"
									required
									pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
									onChange={(e) => {
										setData({
											...data,
											password: e.target.value,
										});
										setConfirmPassword(e.target.value);
									}}
								/>
								<span className="mt-1 hidden text-sm text-red-400">
									Password must be at least 8 characters.{" "}
								</span>
								<p className={`mt-1 ${confirmPwdStyle} text-sm text-red-400`}>
									Password must match
								</p>
							</div>
						</div>
						<div className="flex items-center mt-4">
							<Button
								type="submit"
								disabled={!canSubmit}
								className="w-full text-white bg-purple-700 hover:bg-purple-600 focus:ring-1 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center mt-2 disabled:bg-gradient-to-br disabled:from-gray-100 disabled:to-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed group-invalid:bg-gradient-to-br group-invalid:from-gray-100 group-invalid:to-gray-300 group-invalid:text-gray-400 group-invalid:pointer-events-none group-invalid:opacity-70"
							>
								{buttonText}
							</Button>
						</div>
					</form>
					<div className="mt-4 text-zinc-600 text-md dark:text-zinc-300">
						Already have an account?{" "}
						<span
							className="text-purple-600 cursor-pointer hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-100 hover:underline"
							onClick={() => dispatch(setAuthScreen("login"))}
						>
							Login instead
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
				</div>
			</div>
		</div>
	);
};

export default SignUp;
