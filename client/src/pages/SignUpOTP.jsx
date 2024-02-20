import { useEffect, useState } from "react";
// import OtpInput from "react-otp-input";
import OtpInput from "react18-input-otp";
import { Button } from "@material-tailwind/react";

const SignUpOTP = () => {
	const [otp, setOtp] = useState("");
	const [seconds, setSeconds] = useState(0); // Initial countdown duration in seconds

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

	const resetCountdown = () => {
		setSeconds(60); // Reset countdown duration to 60 seconds
	};

	useEffect(() => {
		console.log(otp);
	}, [otp]);

	const handleChange = (enteredOtp) => {
		setOtp(enteredOtp);
	};

	// const handleChange = (e) => {
	// 	const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
	// 	console.log(Number(e))
	// 	// if (typeof Number(e) !== Number) return;

	// 	// setOtp(e);
	// };

	const handleRegistration = () => {};
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
						<h1 className=" text-slate-600">OTP Verification</h1>
					</div>
					<h4 className="text-center mb-6">
						Enter the OTP you received at <strong>yusufroqib@gmail.com</strong>
					</h4>
					<form
						onSubmit={handleRegistration}
						className=" flex justify-center w-full flex-col "
					>
						<OtpInput
							value={otp}
							onChange={handleChange}
							numInputs={6}
							isInputNum
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
									onClick={resetCountdown}
								>
									Resend OTP
								</button>
							)}
						</div>

						<Button type="submit" className="mt-6" color="blue">
							{" "}
							Confirm
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default SignUpOTP;
