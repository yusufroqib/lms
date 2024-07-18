// frontend/src/components/InitiateWithdrawal.js
import React, { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DollarSign, AlertCircle, CheckCircle2 } from "lucide-react";
import {
	useGetPayoutDetailsQuery,
	useInitiatePayoutMutation,
} from "@/features/users/usersApiSlice";

const Withdraw = () => {
	//   const [payoutDetails, setPayoutDetails] = useState(null);
	const [amount, setAmount] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const {
		data: payoutDetails,
		isLoading,
		isError,
		refetch,
	} = useGetPayoutDetailsQuery();
	const [initiatePayout, { isLoading: isInitiatingPayout }] =
		useInitiatePayoutMutation();

	if (isError) {
		setError("Failed to fetch payout details. Please try again later.");
	}

    // console.log(payoutDetails)

	// useEffect(() => {
	// 	const fetchPayoutDetails = async () => {
	// 		try {
	// 			const response = await axios.get("/api/tutor/payout-details");
	// 			setPayoutDetails(response.data);
	// 		} catch (error) {
	// 			console.error("Failed to fetch payout details:", error);
	// 			setError("Failed to fetch payout details. Please try again later.");
	// 		}
	// 	};

	// 	fetchPayoutDetails();
	// }, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
			setError("Please enter a valid amount");
			return;
		}

		if (parseFloat(amount) > payoutDetails.availableBalance) {
			setError("Withdrawal amount exceeds available balance");
			return;
		}

		try {
			const response = await initiatePayout({ amount }).unwrap();
			setSuccess("Withdrawal initiated successfully!");
			setAmount("");
			// Refresh payout details
			// const updatedDetails = await axios.get("/api/tutor/payout-details");
			refetch();
			// setPayoutDetails(updatedDetails.data);
		} catch (error) {
			console.error("Failed to initiate withdrawal:", error);
			setError("Failed to initiate withdrawal. Please try again later.");
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-full flex items-center justify-center">
				Loading payout details...
			</div>
		);
	}

	return (
		<div className="flex items-center justify-center min-h-full bg-gray-100">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl font-bold">
						Initiate Withdrawal
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<span className="text-sm text-gray-500">Available Balance:</span>
							<span className="text-lg font-semibold">
								${payoutDetails.availableBalance.toFixed(2)}
							</span>
						</div>
						{payoutDetails.bankAccount ? (
							<div className="text-sm text-gray-600">
								Bank Account: **** {payoutDetails.bankAccount.last4} (
								{payoutDetails.bankAccount.bank_name})
							</div>
						) : (
							<Alert variant="destructive">
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>
									No bank account set up. Please set up a bank account in your
									Stripe dashboard.
								</AlertDescription>
							</Alert>
						)}
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="amount">Withdrawal Amount</Label>
								<div className="relative">
									<DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
									<Input
										type="number"
										id="amount"
										disabled={!payoutDetails.availableBalance}
										value={amount}
										onChange={(e) => setAmount(e.target.value)}
										step="0.01"
										min="0.01"
										max={payoutDetails.availableBalance}
										className="pl-10"
										placeholder="0.00"
									/>
								</div>
							</div>
							<Button
								type="submit"
								className="w-full"
								disabled={
									!payoutDetails.bankAccount ||
									isInitiatingPayout ||
									!payoutDetails.availableBalance ||
									payoutDetails?.availableBalance < amount
								}
							>
								{!payoutDetails.availableBalance ||
								payoutDetails?.availableBalance < amount
									? "Insufficient Balance"
									: "Initiate Withdrawal"}
							</Button>
						</form>
					</div>
				</CardContent>
				<CardFooter className="flex flex-col space-y-2">
					{error && (
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
					{success && (
						<Alert
							variant="success"
							className="bg-green-50 text-green-700 border-green-200"
						>
							<CheckCircle2 className="h-4 w-4" />
							<AlertDescription>{success}</AlertDescription>
						</Alert>
					)}
				</CardFooter>
			</Card>
		</div>
	);
};

export default Withdraw;
