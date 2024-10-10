"use client";
import * as z from "zod";
// import axios from "axios";
// import MuxPlayer from "@mux/mux-player-react";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	getStorage,
	ref,
	uploadBytesResumable,
	deleteObject,
	getDownloadURL,
} from "firebase/storage";
import app from "../../../../../../firebase";
import { Progress } from "@material-tailwind/react";
import { useUpdateChapterMutation } from "@/features/courses/coursesApiSlice";
import { Input } from "@/components/ui/input";
// import { FileUpload } from "@/components/file-upload";
const formSchema = z.object({
	videoUrl: z.string().min(1),
});
export const ChapterVideoForm = ({ initialData, courseId, chapterId }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [vid, setVid] = useState("");
	const [vidPerc, setVidPerc] = useState(0);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadTask, setUploadTask] = useState(null);
	const [updateChapter, { isLoading, isError, isSuccess, error }] =
		useUpdateChapterMutation();
	const toggleEdit = () => setIsEditing((current) => !current);

	const uploadVideo = async (file, inputs) => {
		const storage = getStorage(app);
		const fileName = file.name;
		const folderPath = `Courses/${courseId}/Chapters/${chapterId}/Video`;

		// Check if there is an existing video URL
		const existingVideoUrl = initialData.videoUrl;

		// If an existing video URL is found, delete the corresponding file from Firebase Storage
		if (existingVideoUrl) {
			const existingVideoRef = ref(storage, existingVideoUrl);
			try {
				await deleteObject(existingVideoRef);
				console.log("Previous video deleted successfully");
			} catch (error) {
				console.error("Error deleting previous video:", error);
			}
		}

		// Concatenate the folder path with the file name to create storage reference
		const storageRef = ref(storage, `${folderPath}/${fileName}`);
		const uploadTask = uploadBytesResumable(storageRef, file);
		setUploadTask(uploadTask);

		return new Promise((resolve, reject) => {
			uploadTask.on(
				"state_changed",
				(snapshot) => {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					setVidPerc(Math.round(progress));
					switch (snapshot.state) {
						case "paused":
							console.log("Upload is paused");
							break;
						case "running":
							console.log("Upload is running");
							break;
						default:
							break;
					}
				},
				(error) => {
					reject(error); // Reject promise if there's an upload error
				},
				async () => {
					try {
						const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
						// Update inputs state with the new video URL
						// setInputs((prev) => ({ ...prev, courseVideo: downloadURL }));
						resolve(downloadURL); // Resolve promise with the download URL
					} catch (error) {
						reject(error); // Reject promise if there's an error getting the download URL
					}
				}
			);
		});
	};

	// const router = useRouter();
	const onSubmit = async (values) => {
		try {
			// await axios.patch(`/api/courses/${courseId}`, values);
			setIsUploading(true);
			const url = await uploadVideo(vid, values);
			// console.log(url);
			await updateChapter({
				courseId: courseId,
				chapterId: chapterId,
				videoUrl: url,
			}).unwrap();
			toast.success("Course updated");
			toggleEdit();
			// router.refresh();
		} catch (error) {
			// console.log(error.code);
			if (error?.code === "storage/canceled") {
				toggleEdit();
				return toast.error("Upload Cancelled");
			}
			if (error?.data?.message) {
				toast.error(error.data.message);
			} else {
				toast.error("Something went wrong");
			}
		} finally {
			setVid("");
			setVidPerc(0);
			setIsUploading(false);
			setUploadTask(null);
		}
	};
	const handleChange = (e) => {
		const file = e.target.files[0];
		if (!file) {
			return;
		}

		const fileURL = URL.createObjectURL(file);
		const video = document.createElement("video");

		video.preload = "metadata";
		video.onloadedmetadata = function () {
			URL.revokeObjectURL(fileURL); // Free memory
			const duration = video.duration;
			console.log(duration);
			if (duration > 1800) {
				// Limit to 1 minute
				toast.error(
					"Video exceeds the maximum allowed duration of 30 minutes."
				);
				setVid(null);
			} else {
				setVid(file);
				// Proceed with the upload or other operations
			}
		};
		video.src = fileURL;
	};

	const handleCancel = () => {
		if (uploadTask) {
			uploadTask.cancel();
			setUploadTask(null);
			setVid("");
			setVidPerc(0);
			setIsUploading(false);
		}
	};
	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Chapter video
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing && <>Cancel</>}
					{!isEditing && !initialData.videoUrl && (
						<>
							<PlusCircle className="h-4 w-4 mr-2" />
							Add a video
						</>
					)}
					{!isEditing && initialData.videoUrl && (
						<>
							<Pencil className="h-4 w-4 mr-2" />
							Edit video
						</>
					)}
				</Button>
			</div>
			{!isEditing &&
				(!initialData.videoUrl ? (
					<div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
						<Video className="h-10 w-10 text-slate-500" />
					</div>
				) : (
					<div className="relative aspect-video mt-2">
						{/* <MuxPlayer playbackId={initialData?.muxData?.playbackId || ""}/> */}
						<video
							src={initialData.videoUrl}
							controls
							className="w-full h-full"
						/>
					</div>
				))}
			{isEditing && (
				<div>
					<Input
						disabled={isUploading}
						type="file"
						name="courseVideo"
						accept="video/*"
						onChange={(e) => handleChange(e)}
						className="file-input file-input-bordered w-full "
					/>
					<div className="text-xs text-muted-foreground mt-4">
						Upload this chapter&apos;s video
					</div>
					<div className="flex justify-center mt-5 mb-5">
						{!isUploading && vid && (
							<Button onClick={onSubmit} className="mx-auto">
								Upload Video
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
					{isUploading && <Progress value={vidPerc} color="green" label=" " />}
				</div>
			)}
			{initialData.videoUrl && !isEditing && (
				<div className="text-xs text-muted-foreground mt-2">
					Videos can take a few minutes to process. Refresh the page if video
					does not appear.
				</div>
			)}
		</div>
	);
};
