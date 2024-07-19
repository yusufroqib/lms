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
	getStorage,
	ref,
	uploadBytesResumable,
	deleteObject,
	getDownloadURL,
} from "firebase/storage";
import app from "@/firebase";
import {
	useChangePasswordMutation,
	useGetMyDetailsQuery,
	useUpdateProfileMutation,
} from "@/features/users/usersApiSlice";
import { Badge } from "@/components/ui/badge";
import useAuth from "@/hooks/useAuth";
import toast from "react-hot-toast";
import PasswordForm from "./components/PasswordForm";
import { useRefreshMutation } from "@/features/auth/authApiSlice";

export default function ProfilePage() {
	const { _id: userId } = useAuth();
	const { status } = useAuth();
	const [isEditing, setIsEditing] = useState(false);
	const [isChangingPassword, setIsChangingPassword] = useState(false);
	const [avatarFile, setAvatarFile] = useState(null);
	const [editedUser, setEditedUser] = useState(null);
	// console.log(editedUser.avatar)
	const [refresh] = useRefreshMutation();
	const { user, isLoading } = useGetMyDetailsQuery("myDetails", {
		selectFromResult: ({ data, isLoading }) => ({
			user: Object.values(data?.entities ?? {})[0],
			isLoading,
		}),
	});

	const [updateProfile] = useUpdateProfileMutation();
	const [changePassword] = useChangePasswordMutation();

	useEffect(() => {
		setEditedUser(user);
	}, [user]);

	const uploadImage = async (file) => {
		const storage = getStorage(app);
		const fileName = file.name;
		const folderPath = `Users/${userId}/Avatar`;

		// Check if there is an existing image URL
		const existingImageUrl = user.avatar;

		// If an existing image URL is found, delete the corresponding file from Firebase Storage
		if (existingImageUrl) {
			const existingImageRef = ref(storage, existingImageUrl);
			try {
				await deleteObject(existingImageRef);
				console.log("Previous image deleted successfully");
			} catch (error) {
				console.error("Error deleting previous image:", error);
			}
		}

		// Concatenate the folder path with the file name to create storage reference
		const storageRef = ref(storage, `${folderPath}/${fileName}`);
		const uploadTask = uploadBytesResumable(storageRef, file);
		// setUploadTask(uploadTask);

		return new Promise((resolve, reject) => {
			// Removed the "state_changed" listener to stop tracking upload progress
			uploadTask.on(
				"state_changed",
				null, // No longer handling state changes
				(error) => {
					reject(error); // Reject promise if there's an upload error
				},
				async () => {
					try {
						const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
						resolve(downloadURL); // Resolve promise with the download URL
					} catch (error) {
						reject(error); // Reject promise if there's an error getting the download URL
					}
				}
			);
		});
	};

	const handleEdit = () => setIsEditing(true);
	const handleCancel = () => {
		setIsEditing(false);
		setEditedUser(user);
		setAvatarFile(null);
	};

	const handleSave = async () => {
		try {
			// await axios.patch(`/api/courses/${courseId}`, values);
			let url;
			if (avatarFile) url = await uploadImage(avatarFile);
			const formData = new FormData();
			Object.keys(editedUser).forEach((key) => {
				if (key !== "avatar") {
					// Skip avatar here
					formData.append(key, editedUser[key]);
				}
			});

			// Only append the new avatar URL if it exists
			if (url) {
				formData.append("avatar", url);
			} else if (editedUser.avatar) {
				// If no new avatar was uploaded, use the existing one
				formData.append("avatar", editedUser.avatar);
			}
			// console.log(url)

			await updateProfile(formData).unwrap();
			setIsEditing(false);
			await refresh().unwrap();

			toast.success("Profile updated successfully");
			// router.refresh();
		} catch (error) {
			console.log(error);
			toast.error(error?.data?.message ?? "Something went wrong");
			setAvatarFile(null);
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

	const handlePasswordSubmit = async (passwords) => {
		try {
			await changePassword({
				currentPassword: passwords.currentPassword,
				newPassword: passwords.newPassword,
			}).unwrap();
			setIsChangingPassword(false);
			toast.success("Password changed successfully");
		} catch (err) {
			toast.error(err?.data?.message ?? "Something went wrong");
			console.error("Failed to change password", err);
			throw err; // Re-throw the error so the PasswordForm can handle it
		}
	};

	if (isLoading || !user || !editedUser) return <p>Loading...</p>;

	return (
		<div className="container mx-auto p-6 flex justify-center items-center min-h-full">
			<Card className="w-full max-w-3xl mx-auto">
				{!isEditing && (
					<div className=" flex justify-end mr-4">
						<Button onClick={handleEdit} className="relative top-4 max-md:text-xs">
							<Edit className="mr-2 h-4 w-4" /> Edit Profile
						</Button>
					</div>
				)}
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
							<CardTitle className="text-lg md:text-2xl font-bold">
								{editedUser.name}
							</CardTitle>
							<p className="text-xs md:text-sm text-gray-500">@{editedUser.username}</p>
							<div className="mt-2">
								<Badge className="mr-2 ">{status}</Badge>
							</div>
						</div>
					</div>
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
									<Button onClick={handleCancel} className="max-md:text-xs" variant="outline">
										<X className="mr-2 h-4 w-4" /> Cancel
									</Button>
									<Button onClick={handleSave} className="max-md:text-xs">
										<Save className="mr-2 h-4 w-4" /> Save Changes
									</Button>
								</div>
							</>
						) : (
							<>
								<div className="flex items-center space-x-2 max-md:text-sm">
									<User className="h-5 w-5  text-gray-500" />
									{editedUser.bio ? (
										<span>{editedUser.bio}</span>
									) : (
										<span className="italic">No bio provided</span>
									)}
								</div>
								<div className="flex items-center space-x-2 max-md:text-sm">
									<Mail className="h-5 w-5 max-md:h-4 max-md:w-4 text-gray-500" />
									<span>{editedUser.email}</span>
								</div>
								<div className="flex items-center space-x-2 max-md:text-sm">
									<Briefcase className="h-5 w-5 max-md:h-4 max-md:w-4 text-gray-500" />
									<span>Reputation: {editedUser.reputation}</span>
								</div>
								{status === "Student" && (
									<div className="flex items-center space-x-2 max-md:text-sm">
										<MapPin className="h-5 w-5 text-gray-500" />
										<span>
											Enrolled Courses:{" "}
											{editedUser.enrolledCourses?.length || 0}
										</span>
									</div>
								)}
								<div className="flex items-center space-x-2 max-md:text-sm">
									<Calendar className="h-5 w-5 max-md:h-4 max-md:w-4 text-gray-500"  />
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
							className="mt-4 max-md:text-xs"
						>
							<Key className="mr-2 h-4 w-4" /> Change Password
						</Button>
					) : (
						<PasswordForm
							onCancel={() => setIsChangingPassword(false)}
							onSubmit={handlePasswordSubmit}
						/>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
