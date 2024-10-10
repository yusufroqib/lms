import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
	useAddInfoMutation,
	useSignUpMutation,
} from "@/features/auth/authApiSlice";
import {
	selectAddInfoDialogOpen,
	setAddInfoDialogOpen,
	setSignUpEmail,
	setActivationToken,
} from "@/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDisconnect } from "wagmi";

export const AdditionalInfoDialog = ({ ethAddress }) => {
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [fullname, setFullname] = useState("");
	const dispatch = useDispatch();
	const [addInfo, { isLoading }] = useAddInfoMutation();
	const { disconnectAsync } = useDisconnect();
	const navigate = useNavigate();
	const addInfoDialogOpen = useSelector(selectAddInfoDialogOpen);

	const handleCancel = async () => {
		dispatch(setAddInfoDialogOpen({ addInfoDialogOpen: false }));
		await disconnectAsync();
	};

	console.log(ethAddress)
	const handleSubmit = async (e) => {
		e.preventDefault();
		const data = {
			name: fullname,
			email: email,
			username: username,
			ethAddress,
		};
		try {
			const { activationToken } = await addInfo(data).unwrap();
			// console.log(res)
			dispatch(setActivationToken({ activationToken }));
			dispatch(setSignUpEmail({ signUpEmail: data.email }));
			dispatch(setAddInfoDialogOpen({ addInfoDialogOpen: true }));

			navigate("/verify");
		} catch (err) {
			console.log(err);
			if (!err.status) {
				console.log("No Server Response");
			} else if (err.status === 400) {
				toast.error(err.data.error);
			} else if (err.status === 401) {
				console.log("Unauthorized");
			} else {
				console.log(err.data?.message);
			}
			await disconnectAsync();
			// errRef.current.focus();
		}
	};
	return (
		<AlertDialog open={addInfoDialogOpen}>
			<AlertDialogContent className="z-[99214748364699]">
				<AlertDialogHeader>
					<AlertDialogTitle>
						No account connected to this wallet address. Additional Information
						Required
					</AlertDialogTitle>
					<AlertDialogDescription>
						Please provide the following details to create account.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<Label>Fullname</Label>
						<Input
							placeholder="Fullname"
							value={fullname}
							required
							onChange={(e) => setFullname(e.target.value)}
						/>
					</div>

					<div>
						<Label>Email</Label>
						<Input
							placeholder="Email"
							value={email}
							type="email"
							required
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div>
						<Label>Username</Label>
						<Input
							placeholder="Username"
							value={username}
							required
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>
					<div className="flex justify-between gap-5">
						<Button type="submit" className="mx-auto w-full">
							Submit
						</Button>
						<Button
							type="button"
							onClick={handleCancel}
							variant="destructive"
							className="mx-auto w-full"
						>
							Cancel
						</Button>
					</div>
				</form>
			</AlertDialogContent>
		</AlertDialog>
	);
};
