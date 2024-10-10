import useAuth from "@/hooks/useAuth";
import React, { useEffect, useState } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateUsernameMutation } from "../users/usersApiSlice";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useRefreshMutation } from "./authApiSlice";
import { useAccount, useDisconnect } from "wagmi";
import { useSelector } from "react-redux";
import { selectWalletAuthStatus } from "./authSlice";
// import { useAuthenticationStatus } from "@rainbow-me/rainbowkit/dist/components/RainbowKitProvider/AuthenticationContext";

const RequireAuth = ({ allowedRoles }) => {
	const location = useLocation();
	const { roles, username, _id, connectedWallets } = useAuth();
	const [newUsername, setNewUsername] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [showModal, setShowModal] = useState(true);
	const [createUsername] = useCreateUsernameMutation();
	const [refresh] = useRefreshMutation();
	const { address } = useAccount();
	const walletAuthStatus = useSelector(selectWalletAuthStatus);

	// const { isAuthenticated } = useAuthenticationStatus();
	// console.log(isAuthenticated)

	const { disconnectAsync } = useDisconnect();
	// console.log(address)

	useEffect(() => {
		if (
			walletAuthStatus === "authenticated" &&
			!connectedWallets?.includes(address)
		) {
			const disconnect = async () => {
				try {
					await disconnectAsync();
					console.log("disconnecting.................xxxx.......");
					// toast.error(
					// 	"You have been disconnected due to authentication failure."
					// );
					//   navigate('/login'); // or wherever you want to redirect unauthenticated users
				} catch (error) {
					console.error("Failed to disconnect:", error);
				}
			};
			disconnect();
		}
	}, [address]);

	const handleSubmit = async () => {
		try {
			setIsLoading(true);
			await createUsername({ username: newUsername }).unwrap();
			await refresh().unwrap();
			toast.success("Username created successfully");
		} catch (error) {
			console.log(error);
			toast.error(error.data.error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const clearDetails = async () => {
			await disconnectAsync();
			console.log("details disconnected");
			localStorage.setItem("isLogin", "false");
		};

		if (!roles.some((role) => allowedRoles.includes(role))) {
			clearDetails();
		}
	}, [roles, allowedRoles]);

	let buttonText = "Continue";

	if (isLoading) {
		buttonText = (
			<>
				<Loader2 key="loader" className="mr-2 h-4 w-4 animate-spin" /> Please
				wait
			</>
		);
	}

	const content =
		!username && _id ? (
			<AlertDialog open={showModal}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Create a username</AlertDialogTitle>
						<AlertDialogDescription>
							Please create a unique username to gain access to this platform.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="username" className="text-right">
								Username
							</Label>
							<Input
								id="username"
								onChange={(e) => setNewUsername(e.target.value)}
								placeholder="username"
								className="col-span-3"
							/>
						</div>
					</div>
					<AlertDialogFooter>
						<Button onClick={handleSubmit}>{buttonText}</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		) : roles.some((role) => allowedRoles.includes(role)) ? (
			<Outlet />
		) : (
			<Navigate to="/auth" state={{ from: location }} replace />
		);

	// if (!roles.some((role) => allowedRoles.includes(role))) {
	// 	// disconnectWallet()
	// 	localStorage.setItem("isLogin", "false");
	// }

	return content;
};
export default React.memo(RequireAuth);
