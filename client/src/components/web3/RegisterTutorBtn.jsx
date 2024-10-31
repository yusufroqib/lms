/* eslint-disable react/prop-types */
import { useCoursePayment } from "@/hooks/useCoursePayment";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useWaitForTransactionReceipt } from "wagmi";
import { Button } from "../ui/button";
import useAuth from "@/hooks/useAuth";

const RegisterTutorBtn = ({ label }) => {
	const [toastId, setToastId] = useState(null);
	const {
		registerTutor,
		registerTutorHash,
		isRegisterTutorPending,
		registerTutorError,
	} = useCoursePayment();
	const { isLoading: isConfirming, isSuccess: isConfirmed } =
		useWaitForTransactionReceipt({
			hash: registerTutorHash,
		});
	const { _id: tutorId } = useAuth();

	useEffect(() => {
		if (isRegisterTutorPending) {
			const newToastId = toast.loading("Waiting for approval from wallet...");
			// console.log(toastId)
			setToastId(newToastId);
			console.log("Transaction is pending...");
		}
		if (isConfirming) {
			if (toastId) toast.dismiss(toastId);
			const newToastId = toast.loading(
				"Waiting for confirmation on the blockchain..."
			);
			setToastId(newToastId);
			console.log("Waiting for confirmation...");
		}
		if (isConfirmed) {
			console.log("Transaction confirmed!");
			toast.success("Registration successful!", { id: toastId });
		}
		// toast.dismiss(toastId);
		if (registerTutorError) {
			toast.error(registerTutorError, { id: toastId });
		}
	}, [isRegisterTutorPending, isConfirming, isConfirmed, registerTutorError]);

	// useAccount

	// console.log(tutorBalance);
	const handleRegister = () => {
		registerTutor(tutorId);
	};
	return (
		<Button
			disabled={isRegisterTutorPending || isConfirming}
			onClick={handleRegister}
		>
			{" "}
			{isRegisterTutorPending || isConfirming
				? "Registering..."
				: label
				? label
				: "Register Tutor"}
		</Button>
	);
};

export default RegisterTutorBtn;
