import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, X, Save } from "lucide-react";
import toast from "react-hot-toast";

const PasswordRequirements = ({ password }) => {
	const requirements = [
		{ regex: /.{8,}/, text: "At least 8 characters long" },
		{ regex: /[A-Z]/, text: "At least 1 uppercase letter" },
		{ regex: /[a-z]/, text: "At least 1 lowercase letter" },
		{ regex: /[0-9]/, text: "At least 1 number" },
	];
	return (
		<div className="mt-2">
			<p className="text-sm font-medium text-gray-700">Password must have:</p>
			<ul className="list-disc pl-5 mt-1 text-sm text-gray-600">
				{requirements.map((requirement, index) => (
					<li
						key={index}
						className={
							requirement.regex.test(password)
								? "text-green-600"
								: "text-red-600"
						}
					>
						{requirement.text}
					</li>
				))}
			</ul>
		</div>
	);
};

const PasswordForm = ({ onCancel, onSubmit }) => {
	const [passwords, setPasswords] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isFormValid, setIsFormValid] = useState(false);

	const handlePasswordChange = (e) => {
		setPasswords({ ...passwords, [e.target.name]: e.target.value });
		setErrors({ ...errors, [e.target.name]: "" });
	};

	const validatePassword = (password) => {
		const requirements = [
			{
				regex: /.{8,}/,
				message: "Password must be at least 8 characters long",
			},
			{
				regex: /[A-Z]/,
				message: "Password must contain at least 1 uppercase letter",
			},
			{
				regex: /[a-z]/,
				message: "Password must contain at least 1 lowercase letter",
			},
			{ regex: /[0-9]/, message: "Password must contain at least 1 number" },
		];

		for (let requirement of requirements) {
			if (!requirement.regex.test(password)) {
				return requirement.message;
			}
		}

		return "";
	};

	const checkFormValidity = () => {
		const newErrors = {};

		const passwordError = validatePassword(passwords.newPassword);
		if (passwordError) {
			newErrors.newPassword = passwordError;
		}

		if (passwords.newPassword !== passwords.confirmPassword) {
			newErrors.confirmPassword = "Passwords don't match";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	useEffect(() => {
		setIsFormValid(checkFormValidity());
	}, [passwords]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!isFormValid) return;

		setIsSubmitting(true);
		try {
			await onSubmit(passwords);
			setPasswords({
				currentPassword: "",
				newPassword: "",
				confirmPassword: "",
			});
			toast.success("Password changed successfully");
		} catch (err) {
			toast.error(err?.data?.message ?? "Something went wrong");
			console.error("Failed to change password", err);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="mt-4 space-y-4">
			<div>
				<Label htmlFor="currentPassword">Current Password</Label>
				<Input
					id="currentPassword"
					name="currentPassword"
					type="password"
					placeholder="Enter your current password"
					value={passwords.currentPassword}
					onChange={handlePasswordChange}
				/>
				{!passwords.currentPassword && (
					<Alert  className="mt-2">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription className='text-gray-400 text-sm'>{`Leave current password field blank if this account doesn't have a password`}</AlertDescription>
					</Alert>
				)}
			</div>
			<div>
				<Label htmlFor="newPassword">New Password</Label>
				<Input
					id="newPassword"
					name="newPassword"
					type="password"
					value={passwords.newPassword}
					onChange={handlePasswordChange}
				/>
				<PasswordRequirements password={passwords.newPassword} />
				{errors.newPassword && (
					<Alert variant="destructive" className="mt-2">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>{errors.newPassword}</AlertDescription>
					</Alert>
				)}
			</div>
			<div>
				<Label htmlFor="confirmPassword">Confirm New Password</Label>
				<Input
					id="confirmPassword"
					name="confirmPassword"
					type="password"
					value={passwords.confirmPassword}
					onChange={handlePasswordChange}
				/>
				{errors.confirmPassword && passwords.confirmPassword && (
					<Alert variant="destructive" className="mt-2">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>{errors.confirmPassword}</AlertDescription>
					</Alert>
				)}
			</div>
			<div className="flex justify-end space-x-2">
				<Button
					type="button"
					onClick={onCancel}
					variant="outline"
					disabled={isSubmitting}
					className='max-md:text-xs'
				>
					<X className="mr-2 h-4 w-4" /> Cancel
				</Button>
				<Button className='max-md:text-xs' type="submit" disabled={!isFormValid || isSubmitting}>
					<Save className="mr-2 h-4 w-4 " />
					{isSubmitting ? "Changing Password..." : "Change Password"}
				</Button>
			</div>
		</form>
	);
};
export default PasswordForm;
