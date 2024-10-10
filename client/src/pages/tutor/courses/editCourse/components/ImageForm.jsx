import * as z from "zod";
import { Pencil, PlusCircle, ImageIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
	getStorage,
	ref,
	uploadBytesResumable,
	deleteObject,
	getDownloadURL,
} from "firebase/storage";
import app from "../../../../../firebase";
import { Progress } from "@material-tailwind/react";
import { useUpdateCourseMutation } from "@/features/courses/coursesApiSlice";
import { compressImage } from "@/lib/compressImage";
import { Input } from "@/components/ui/input";

export const ImageForm = ({ initialData, courseId }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [img, setImg] = useState(null);
	const [imgPerc, setImgPerc] = useState(0);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadTask, setUploadTask] = useState(null);
	const [updateCourse, { isLoading, isError, isSuccess, error }] =
		useUpdateCourseMutation();

	const toggleEdit = () => setIsEditing((current) => !current);

	const uploadImage = async (file) => {
		const storage = getStorage(app);
		const fileName = `${Date.now()}_${file.name.replace(/\.[^/.]+$/, ".webp")}`;
		const folderPath = `Courses/${courseId}/CourseImage`;

		// Check if there is an existing image URL
		const existingImageUrl = initialData.courseImage;

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

		// Compress the image before uploading
		const compressedFile = await compressImage(file);

		// Concatenate the folder path with the file name to create storage reference
		const storageRef = ref(storage, `${folderPath}/${fileName}`);
		const uploadTask = uploadBytesResumable(storageRef, compressedFile);
		setUploadTask(uploadTask);

		return new Promise((resolve, reject) => {
			uploadTask.on(
				"state_changed",
				(snapshot) => {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					setImgPerc(Math.round(progress));
				},
				(error) => {
					reject(error);
				},
				async () => {
					try {
						const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
						resolve(downloadURL);
					} catch (error) {
						reject(error);
					}
				}
			);
		});
	};

	const onSubmit = async () => {
		if (!img) {
			return toast.error("Please select an image");
		}

		try {
			setIsUploading(true);
			const url = await uploadImage(img);
			await updateCourse({ id: courseId, courseImage: url }).unwrap();
			toast.success("Course image updated");
			toggleEdit();
		} catch (error) {
			if (error?.code === "storage/canceled") {
				return toast.error("Upload Cancelled");
			}
			if (error?.data?.message) {
				toast.error(error.data.message);
			} else {
				toast.error("Something went wrong");
			}
		} finally {
			setImg(null);
			setImgPerc(0);
			setIsUploading(false);
			setUploadTask(null);
		}
	};

	const handleCancel = () => {
		if (uploadTask) {
			uploadTask.cancel();
			setUploadTask(null);
		}
		setImg(null);
		setImgPerc(0);
		setIsUploading(false);
		toggleEdit();
	};

	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Course image
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing && !isUploading && <>Cancel</>}
					{!isEditing && !initialData.courseImage && (
						<>
							<PlusCircle className="h-4 w-4 mr-2" />
							Add an image
						</>
					)}
					{!isEditing && initialData.courseImage && (
						<>
							<Pencil className="h-4 w-4 mr-2" />
							Edit image
						</>
					)}
				</Button>
			</div>
			{!isEditing &&
				(!initialData.courseImage ? (
					<div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
						<ImageIcon className="h-10 w-10 text-slate-500" />
					</div>
				) : (
					<div className="relative aspect-video mt-2">
						<img
							alt="Course"
							className="object-cover rounded-md"
							src={initialData.courseImage}
						/>
					</div>
				))}
			{isEditing && (
				<div>
					<Input
						disabled={isUploading}
						type="file"
						name="courseImage"
						accept="image/*"
						onChange={(e) => setImg(e.target.files[0])}
						className="file-input file-input-bordered w-full"
					/>
					<div className="text-xs text-muted-foreground mt-4">
						16:9 aspect ratio recommended
					</div>
					<div className="flex justify-center mt-5 mb-5">
						{!isUploading && img && (
							<Button onClick={onSubmit} className="mx-auto">
								Upload Image
							</Button>
						)}
						{isUploading && (
							<Button
								onClick={handleCancel}
								variant="destructive"
								className="mx-auto"
							>
								Cancel
							</Button>
						)}
					</div>
					{isUploading && <Progress value={imgPerc} color="green" label=" " />}
				</div>
			)}
		</div>
	);
};
