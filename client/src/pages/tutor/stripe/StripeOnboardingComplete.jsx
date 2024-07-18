// src/components/StripeOnboardingComplete.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCompleteStripeConnectAccountMutation } from "@/features/users/usersApiSlice";
import toast from "react-hot-toast";

const StripeOnboardingComplete = () => {
	const [status, setStatus] = useState("loading");
	const navigate = useNavigate();
	const [completeStripeConnectAccount, { isLoading, error, isError }] =
		useCompleteStripeConnectAccountMutation();

	useEffect(() => {
		let timeoutId;

		const completeOnboarding = async () => {
			try {
				const response = await completeStripeConnectAccount().unwrap();
				console.log(response);
				toast.success("Stripe account setup completed successfully!");
				setStatus("success");
				// Redirect to tutor dashboard after a short delay
				timeoutId = setTimeout(() => navigate("/dashboard"), 3000);
			} catch (error) {
				console.error("Failed to complete onboarding:", error);
				setStatus("error");
			}
		};

		completeOnboarding();

		// Cleanup function
		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	}, [navigate]);

	if (status === "loading") {
		return (
			<div className="min-h-full flex justify-center items-center text-lg">
				Completing your Stripe account setup...
			</div>
		);
	} else if (status === "success") {
		return (
			<div className="min-h-full flex justify-center items-center text-lg">
				Your Stripe account has been successfully set up! Redirecting to
				dashboard...
			</div>
		);
	} else {
		return (
			<div className="min-h-full flex justify-center items-center text-lg">
				There was an error setting up your Stripe account. Please try again
				later.
			</div>
		);
	}
};

export default StripeOnboardingComplete;
