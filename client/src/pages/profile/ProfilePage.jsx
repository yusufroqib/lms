import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
	Edit,
	Save,
	X,
	User,
	Mail,
	Calendar,
	Upload,
	Key,
	Briefcase,
	MapPin,
} from "lucide-react";
import {
	useGetMyDetailsQuery,
	// useUpdateProfileMutation,
	// useChangePasswordMutation,
} from "@/features/users/usersApiSlice";
import { Badge } from "@/components/ui/badge";
import useAuth from "@/hooks/useAuth";

export default function ProfilePage() {
	const { status } = useAuth();
	const [isEditing, setIsEditing] = useState(false);
	const [isChangingPassword, setIsChangingPassword] = useState(false);
	const [avatarFile, setAvatarFile] = useState(null);
	const [editedUser, setEditedUser] = useState(null);
	const [passwords, setPasswords] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	const { user, isLoading } = useGetMyDetailsQuery("myDetails", {
		selectFromResult: ({ data, isLoading }) => ({
			user: Object.values(data?.entities ?? {})[0],
			isLoading,
		}),
	});

	// const [updateProfile] = useUpdateProfileMutation();
	// const [changePassword] = useChangePasswordMutation();

	useEffect(() => {
		setEditedUser(user);
	}, [user]);

	const handleEdit = () => setIsEditing(true);
	const handleCancel = () => {
		setIsEditing(false);
		setEditedUser(user);
		setAvatarFile(null);
	};

	const handleSave = async () => {
		try {
			const formData = new FormData();
			Object.keys(editedUser).forEach((key) =>
				formData.append(key, editedUser[key])
			);
			if (avatarFile) formData.append("avatar", avatarFile);

			await updateProfile(formData).unwrap();
			setIsEditing(false);
		} catch (err) {
			console.error("Failed to save profile", err);
		}
	};

	const handleChange = (e) => {
		setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
	};

	const handleAvatarChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setAvatarFile(file);
			setEditedUser({ ...editedUser, avatar: URL.createObjectURL(file) });
		}
	};

	const handlePasswordChange = (e) => {
		setPasswords({ ...passwords, [e.target.name]: e.target.value });
	};

	const handlePasswordSubmit = async (e) => {
		e.preventDefault();
		if (passwords.newPassword !== passwords.confirmPassword) {
			alert("New passwords don't match");
			return;
		}
		try {
			await changePassword({
				currentPassword: passwords.currentPassword,
				newPassword: passwords.newPassword,
			}).unwrap();
			setIsChangingPassword(false);
			setPasswords({
				currentPassword: "",
				newPassword: "",
				confirmPassword: "",
			});
		} catch (err) {
			console.error("Failed to change password", err);
		}
	};

	if (isLoading || !user || !editedUser) return <p>Loading...</p>;

	return (
		<div className="container mx-auto p-6 flex justify-center items-center min-h-full">
			<Card className="w-full max-w-3xl mx-auto">
				<CardHeader className="relative">
					<div className="flex items-center space-x-4">
						<div className="relative">
							<Avatar className="w-24 h-24">
								<AvatarImage src={editedUser.avatar} alt={editedUser.name} />
								<AvatarFallback>{editedUser.name.charAt(0)}</AvatarFallback>
							</Avatar>
							{isEditing && (
								<label
									htmlFor="avatar-upload"
									className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 cursor-pointer"
								>
									<Upload className="h-4 w-4" />
									<input
										id="avatar-upload"
										type="file"
										accept="image/*"
										className="hidden"
										onChange={handleAvatarChange}
									/>
								</label>
							)}
						</div>
						<div>
							<CardTitle className="text-2xl font-bold">
								{editedUser.name}
							</CardTitle>
							<p className="text-sm text-gray-500">@{editedUser.username}</p>
							<div className="mt-2">
								<Badge className="mr-2">{status}</Badge>
							</div>
						</div>
					</div>
					{!isEditing && (
						<Button onClick={handleEdit} className="absolute top-4 right-4">
							<Edit className="mr-2 h-4 w-4" /> Edit Profile
						</Button>
					)}
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{isEditing ? (
							<>
								<div>
									<Label htmlFor="name">Name</Label>
									<Input
										id="name"
										name="name"
										value={editedUser.name}
										onChange={handleChange}
									/>
								</div>
								<div>
									<Label htmlFor="username">Username</Label>
									<Input
										id="username"
										name="username"
										value={editedUser.username}
										onChange={handleChange}
									/>
								</div>
								<div>
									<Label htmlFor="email">Email</Label>
									<Input
										disabled
										id="email"
										name="email"
										value={editedUser.email}
										onChange={handleChange}
									/>
								</div>
								<div>
									<Label htmlFor="bio">Bio</Label>
									<Textarea
										id="bio"
										name="bio"
										value={editedUser.bio}
										onChange={handleChange}
									/>
								</div>
								<div className="flex justify-end space-x-2">
									<Button onClick={handleCancel} variant="outline">
										<X className="mr-2 h-4 w-4" /> Cancel
									</Button>
									<Button onClick={handleSave}>
										<Save className="mr-2 h-4 w-4" /> Save Changes
									</Button>
								</div>
							</>
						) : (
							<>
								<div className="flex items-center space-x-2">
									<User className="h-5 w-5 text-gray-500" />
									{editedUser.bio ? (
										<span>{editedUser.bio}</span>
									) : (
										<span className="italic">No bio provided</span>
									)}
								</div>
								<div className="flex items-center space-x-2">
									<Mail className="h-5 w-5 text-gray-500" />
									<span>{editedUser.email}</span>
								</div>
								<div className="flex items-center space-x-2">
									<Briefcase className="h-5 w-5 text-gray-500" />
									<span>Reputation: {editedUser.reputation}</span>
								</div>
								{status === "Student" && (
									<div className="flex items-center space-x-2">
										<MapPin className="h-5 w-5 text-gray-500" />
										<span>
											Enrolled Courses:{" "}
											{editedUser.enrolledCourses?.length || 0}
										</span>
									</div>
								)}
								<div className="flex items-center space-x-2">
									<Calendar className="h-5 w-5 text-gray-500" />
									<span>
										Joined {new Date(editedUser.joinedAt).toLocaleDateString()}
									</span>
								</div>
							</>
						)}
					</div>

					{!isChangingPassword ? (
						<Button
							onClick={() => setIsChangingPassword(true)}
							className="mt-4"
						>
							<Key className="mr-2 h-4 w-4" /> Change Password
						</Button>
					) : (
						<form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4">
							<div>
								<Label htmlFor="currentPassword">Current Password</Label>
								<Input
									id="currentPassword"
									name="currentPassword"
									type="password"
									value={passwords.currentPassword}
									onChange={handlePasswordChange}
								/>
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
							</div>
							<div className="flex justify-end space-x-2">
								<Button
									type="button"
									onClick={() => setIsChangingPassword(false)}
									variant="outline"
								>
									<X className="mr-2 h-4 w-4" /> Cancel
								</Button>
								<Button type="submit">
									<Save className="mr-2 h-4 w-4" /> Change Password
								</Button>
							</div>
						</form>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
