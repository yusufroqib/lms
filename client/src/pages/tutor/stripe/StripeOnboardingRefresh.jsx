import React, { useEffect } from "react";
import { useCreateStripeConnectAccountMutation } from "@/features/users/usersApiSlice";

const StripeOnboardingRefresh = () => {
	const [createStripeConnectAccount, { isLoading, error, isError }] =
		useCreateStripeConnectAccountMutation();
	// console.log("isLoading", isLoading);
	// console.log("error", error);

	useEffect(() => {
		const refreshOnboarding = async () => {
			try {
				const { url } = await createStripeConnectAccount().unwrap();
				// console.log(response)
				window.location.href = url;
			} catch (error) {
				console.error("Failed to refresh onboarding link:", error);
				// Handle error (e.g., show an error message to the user)
			}
		};

		refreshOnboarding();
	}, []);

	return (
		<div className="min-h-full flex justify-center items-center text-lg">
			Refreshing your onboarding link...
		</div>
	);
};

export default StripeOnboardingRefresh;
