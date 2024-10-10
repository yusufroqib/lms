import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// import OtpInput from "react-otp-input";
import OtpInput from "react18-input-otp";
import { Button } from "@material-tailwind/react";
import { useVerifyDeviceOTPMutation } from "@/features/auth/authApiSlice";
import { useDispatch, useSelector } from "react-redux";
import {
	selectCurrentActivationToken,
	// setUser,
} from "@/features/auth/authSlice";
import toast from "react-hot-toast";
import { useAccount, useDisconnect } from "wagmi";
import { set } from "date-fns";

const VerifyDeviceOTP = ({ email, handleLogin }) => {
	const dispatch = useDispatch();
	const [otp, setOtp] = useState("");
	const [seconds, setSeconds] = useState(60); // Initial countdown duration in seconds
	const [verifyDeviceOTP, { isLoading }] = useVerifyDeviceOTPMutation();
	const activationToken = useSelector(selectCurrentActivationToken);
	const [isResendeng, setIsResemding] = useState(false)
	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from?.pathname || "/dashboard";

	useEffect(() => {
		let countdown = setInterval(() => {
			setSeconds((prevSeconds) => {
				if (prevSeconds === 0) {
					clearInterval(countdown); // Stop the countdown when it reaches 0
				}
				return prevSeconds === 0 ? 0 : prevSeconds - 1;
			});
		}, 1000);

		return () => clearInterval(countdown); // Cleanup function to clear interval
	}, [seconds]); // Run effect only once when the component mounts

	const resendOTP = async (e) => {
		setIsResemding(true)
		await handleLogin(e);
		toast.success("OTP resent successfully");
		setSeconds(60); // Reset countdown duration to 60 seconds
		setIsResemding(false)
	};

	const handleChange = (enteredOtp) => {
		setOtp(enteredOtp);
	};

	const verifyOTP = async (e) => {
		e.preventDefault();
		try {
			await verifyDeviceOTP({
				activation_code: otp,
				activation_token: activationToken,
			}).unwrap();

			toast.success("New device authorized successfully");
			localStorage.setItem("isLogin", "true");
			navigate(from, { replace: true });

			// navigate("/dashboard");
		} catch (err) {
			console.log(err);
			if (!err.status) {
				console.log("No Server Response");
			} else if (err.data.error === "jwt expired") {
				toast.error("OTP expired");
			} else {
				toast.error("Failed to verify OTP, please try again later");
			}
			// errRef.current.focus();
		}

		// console.log(data);
	};

	if (!email) {
		return window.location.reload();
	}

	return (
		<div className="flex flex-col items-center sm:justify-center w-full">
			<div className="w-full px-6 py-6 bg-white dark:bg-gray-900 shadow-md rounded-md sm:rounded-lg max-w-sm">
				<div className="text-center text-2xl font-bold mb-3">
					<h1 className=" text-slate-600">
						You are signing in from a new device/IP
					</h1>
				</div>
				<h4 className="text-center mb-6">
					Enter the OTP sent to <strong>{email}</strong> to authorize this
					device
				</h4>
				<form
					onSubmit={verifyOTP}
					className=" flex justify-center w-full flex-col "
				>
					<OtpInput
						value={otp}
						onChange={handleChange}
						numInputs={6}
						isInputNum
						shouldAutoFocus={true}
						// hasErrored={true}
						isInputSecure={true}
						errorStyle={{
							border: "solid red 1px",
							color: "red",
							fontWeight: "bold",
							fontSize: "1rem",
							width: "40px",
							height: "40px",
							borderRadius: "5px",
							textAlign: "center",
							backgroundColor: "white",
							boxShadow: "0px 0px 0px 1px red",
							animation: "shake 0.5s 5",
						}}
						containerStyle={{
							display: "flex",
							justifyContent: "space-between",
						}}
						inputStyle={{
							height: "40px",
							width: "40px",
							border: "solid black 1px",
							borderRadius: "5px",
						}}
						// separator={<span>-</span>}
					/>
					<div className="flex mt-2 justify-between">
						<p>Didn&apos;t receive OTP? </p>

						{seconds > 0 ? (
							<div className="text-slate-600">
								Resend OTP in:{" "}
								{Math.floor(seconds / 60)
									.toString()
									.padStart(2, "0")}
								:{(seconds % 60).toString().padStart(2, "0")}
							</div>
						) : (
							<button
								className="text-blue-700 font-medium cursor-pointer hover:underline hover:text-blue-500"
								onClick={(e) => resendOTP(e)}
								disabled={isResendeng}
							>
								Resend OTP
							</button>
						)}
					</div>

					<Button type="submit" className="mt-6" color="blue">
						{" "}
						Verify
					</Button>
				</form>
			</div>
		</div>
	);
};

export default VerifyDeviceOTP;
