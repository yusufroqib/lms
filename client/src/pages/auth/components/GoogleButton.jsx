import { Button } from "@material-tailwind/react";
import React from "react";

const GoogleButton = () => {
	const baseUrl = import.meta.env.VITE_SERVER_BASE_URL;
	const [isLoading, setIsLoading] = React.useState(false);

	const handleGoogleAuth = () => {
		setIsLoading(true);

		window.location.href = `${baseUrl}/auth/google`;
	};

	return (
		<Button
			size="lg"
			variant="outlined"
			onClick={handleGoogleAuth}
			color="blue-gray"
			className="flex items-center justify-center gap-3 w-full py-3"
			// className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-600 flex items-center justify-center w-full py-3 space-x-4 border rounded-md focus:ring-2 focus:ring-offset-1 border-gray-300 dark:border-gray-700 hover:border-purple-400 focus:ring-purple-400 dark:hover:border-purple-600"
		>
			<img
				src="https://docs.material-tailwind.com/icons/google.svg"
				alt="google"
				className="h-6 w-6"
			/>
      {isLoading ? "Loading..." : "Continue with Google"}
		</Button>
	);
};

export default GoogleButton;
