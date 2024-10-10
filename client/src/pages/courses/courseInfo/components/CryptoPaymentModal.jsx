import { useCoursePayment } from "@/hooks/useCoursePayment";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const CryptoPaymentModal = ({
	isCryptoModalOpen,
	setIsCryptoModalOpen,
	tutorId,
	courseId,
	price,
}) => {
	const [toastId, setToastId] = useState(null);
	const [approvalToastId, setApprovalToastId] = useState(null);
	const { address } = useAccount();
	const {
		purchaseCourse,
		purchaseDataHash,
		getAllowanceStat,
		isPurchasePending,
		approveUSDC,
		approveDataHash,
		approveError,
		isApproving,
		purchaseError,
	} = useCoursePayment();
	const { isLoading: isConfirmingApproval, isSuccess: isApprovalConfirmed } =
		useWaitForTransactionReceipt({
			hash: approveDataHash,
		});
	const { isLoading: isConfirming, isSuccess: isConfirmed } =
		useWaitForTransactionReceipt({
			hash: purchaseDataHash,
		});
	const { data: isAllowanceSufficient, refetch } = getAllowanceStat(
		address,
		price.toString()
	);

	const navigate = useNavigate();
	// console.log(isAllowanceSufficient);

	useEffect(() => {
		if (isPurchasePending) {
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
			toast.success("Payment successful!", { id: toastId });
			navigate(`/study/${courseId}`);
		}
		// toast.dismiss(toastId);
		if (purchaseError) {
			toast.error(
				purchaseError.startsWith("Insufficient allowance")
					? `${purchaseError}, kindly approve this action to continue`
					: purchaseError,
				{ id: toastId }
			);
		}
	}, [isPurchasePending, isConfirming, isConfirmed, purchaseError]);

	useEffect(() => {
		if (isApproving) {
			const newToastId = toast.loading("Waiting for approval from wallet...");
			// console.log(toastId)
			setApprovalToastId(newToastId);
			// console.log("Transaction is pending...");
		}
		if (isConfirmingApproval) {
			if (approvalToastId) toast.dismiss(approvalToastId);
			const newToastId = toast.loading(
				"Approving USDC... Waiting for confirmation on the blockchain..."
			);
			setApprovalToastId(newToastId);
			// console.log("Waiting for confirmation...");
		}
		if (isApprovalConfirmed) {
			// console.log("Transaction confirmed!");
			toast.success("USDC approved successfully, kindly proceed with payment", {
				id: approvalToastId,
			});
            refetch();
		}
		// toast.dismiss(toastId);
		if (approveError) {
			toast.error(approveError, { id: approvalToastId });
		}
	}, [isApproving, isConfirmingApproval, isApprovalConfirmed, approveError]);

	// useAccount

	// console.log(tutorBalance);
	const handlePurchase = async () => {
		if (!isAllowanceSufficient) {
			approveUSDC(price.toString());
		}

		// Proceed with purchase
		purchaseCourse(tutorId, price.toString(), courseId);
	};

	return (
		<AlertDialog open={isCryptoModalOpen} onOpenChange={setIsCryptoModalOpen}>
			{/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Confirm payment with crypto</AlertDialogTitle>
					<AlertDialogDescription>
						Kindly proceed to complete this transaction with your wallet
					</AlertDialogDescription>
				</AlertDialogHeader>
				<p>
					<strong>Amount: </strong>
					{price} USDC
				</p>
				<p>
					<strong>Network: </strong>CELO Alfajores
				</p>
				<AlertDialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={() => setIsCryptoModalOpen(false)}
					>
						Cancel
					</Button>
					<Button
						onClick={handlePurchase}
						disabled={isConfirming || isPurchasePending}
						type="submit"
					>
						Continue
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default CryptoPaymentModal;
