import React from "react";
import { Button } from "@/components/ui/button";
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
import toast from "react-hot-toast";
import { useBecomeTutorMutation } from "@/features/users/usersApiSlice";

const BecomeTutorDialog = ({ open, setOpen }) => {
	const [becomeTutor] = useBecomeTutorMutation();

	const handleConfirm = async () => {
		try {
			await becomeTutor().unwrap();

			setOpen(false);
			toast.success("You are now a tutor!");
			window.location.reload();
		} catch (error) {
			console.error("Error becoming a tutor:", error);
			toast.error("Error becoming a tutor. Please try again later.");
		}
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			{/* <AlertDialogTrigger asChild>
				<Button variant="default">Become a Tutor</Button>
			</AlertDialogTrigger> */}
			<AlertDialogContent className="sm:max-w-[425px]">
				<AlertDialogHeader>
					<AlertDialogTitle>Become a Tutor</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to become a tutor? This will allow you to
						create and share courses on our platform.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<div className="grid gap-4 py-4">
					<p className="text-sm text-gray-500">
						As a tutor, you'll be able to:
					</p>
					<ul className="list-disc list-inside text-sm text-gray-500">
						<li>Create and manage your own courses</li>
						<li>Interact with students</li>
						<li>Share your knowledge and expertise</li>
						<li>Receive payments through Stripe</li>
					</ul>
					<p className="text-sm text-gray-500 font-semibold">
						Important: You'll need to set up a Stripe Connect account to receive
						payments. This process will begin after you confirm.
					</p>
				</div>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleConfirm}>Confirm</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default BecomeTutorDialog;
