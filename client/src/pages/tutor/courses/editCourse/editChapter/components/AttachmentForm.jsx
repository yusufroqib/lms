import * as z from "zod";
// import axios from "axios";
import { PlusCircle, File, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
	getStorage,
	ref,
	uploadBytesResumable,
	deleteObject,
	getDownloadURL,
} from "firebase/storage";
import app from "../../../../../../firebase";
import { Button } from "@/components/ui/button";
import { Progress } from "@material-tailwind/react";
import {
	useDeleteChapterAttachmentMutation,
	useUpdateChapterAttachmentMutation,
} from "@/features/courses/coursesApiSlice";
import { Input } from "@/components/ui/input";
// import { FileUpload } from "@/components/ui/file-upload";
const formSchema = z.object({
	url: z.string().min(1),
});
export const AttachmentForm = ({ initialData, courseId, chapterId }) => {
	const [file, setFile] = useState(null);
	const [fileName, setFileName] = useState(""); // New state for file name
	const [uploadProgress, setUploadProgress] = useState(0);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadTask, setUploadTask] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [delAttachId, setDelAttachId] = useState(null);
	const [updateChapterAttachment] = useUpdateChapterAttachmentMutation(); // Ensure you have the appropriate mutation hook
	const [deleteChapterAttachment] = useDeleteChapterAttachmentMutation(); // Ensure you have the appropriate mutation hook

	const toggleEdit = () => {
		setIsEditing((prevIsEditing) => !prevIsEditing);
	};

	const handleFileChange = (e) => {
		const maxSize = 5 * 1024 * 1024; // 5MB in bytes
		const selectedFile = e.target.files[0];

		if (selectedFile && selectedFile.size > maxSize) {
			toast.error("File size exceeds 5MB. Please select a smaller file.");
			setFile(null);
			setFileName(""); // Update file name
		} else {
			setFile(selectedFile);
			setFileName(selectedFile.name); // Update file name
		}
	};

	const uploadFile = async () => {
		if (!file) return;

		const storage = getStorage(app);
		const folderPath = `Courses/${courseId}/Chapters/${chapterId}/Attachments`;
		const fileName = file.name;

		const storageRef = ref(storage, `${folderPath}/${fileName}`);
		const uploadTask = uploadBytesResumable(storageRef, file);

		setUploadTask(uploadTask);
		// setIsUploading(true);

		return new Promise((resolve, reject) => {
			uploadTask.on(
				"state_changed",
				(snapshot) => {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					setUploadProgress(Math.round(progress));
				},
				(error) => {
					reject(error);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref)
						.then((downloadURL) => {
							console.log("File available at:", downloadURL);
							resolve(downloadURL);
						})
						.catch((error) => {
							reject(error);
						});
				}
			);
		});
	};

	const cancelUpload = () => {
		if (uploadTask) {
			uploadTask.cancel();
			setUploadTask(null);
			setFile(null);
			setFileName(""); // Reset file name
			setIsUploading(false);
			setUploadProgress(0);
		}
	};

	const onSubmit = async () => {
		try {
			setIsUploading(true);
			const fileUrl = await uploadFile();
			const attachment = {
				name: fileName,
				url: fileUrl,
			};
			await updateChapterAttachment({
				courseId,
				chapterId,
				attachment,
			}).unwrap();
			toast.success("File uploaded successfully");
			toggleEdit();
		} catch (error) {
			console.error("Error uploading file:", error);
			if (error?.code === "storage/canceled") {
				toggleEdit();
				return toast.error("Upload Cancelled");
			}
			toast.error("Error uploading file");
		} finally {
			setFile(null);
			setFileName(""); // Reset file name
			setIsUploading(false);
			setUploadProgress(0);
		}
	};

	const onDelete = async (attachment) => {
		// console.log(attachment);
		try {
			setDelAttachId(attachment._id);
			const storage = getStorage(app);
			const fileRef = ref(storage, attachment.url);
			await deleteObject(fileRef);

			// console.log(delAttachId, id);
			// console.log(id)
			await deleteChapterAttachment({
				courseId,
				chapterId,
				attachmentId: attachment._id,
			}).unwrap();

			toast.success("Attachment deleted");
			// router.refresh();
		} catch (error) {
			console.log(error);
			toast.error("Something went wrong");
		} finally {
			setDelAttachId(null);
		}
	};

	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Chapter attachments
				<Button
					onClick={() => {
						setFile(null);
						toggleEdit();
					}}
					variant="ghost"
				>
					{isEditing && <>Cancel</>}
					{!isEditing && (
						<>
							<PlusCircle className="h-4 w-4 mr-2" />
							Add a file
						</>
					)}
				</Button>
			</div>
			{!isEditing && (
				<>
					{initialData?.attachments?.length === 0 && (
						<p className="text-sm mt-2 text-slate-500 italic">
							No attachments yet
						</p>
					)}
					{initialData?.attachments?.length > 0 && (
						<div className="space-y-2">
							{initialData.attachments.map((attachment) => (
								<div
									key={attachment._id}
									className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
								>
									<File className="h-4 w-4 mr-2 flex-shrink-0" />
									<p className="text-xs line-clamp-1">{attachment.name}</p>
									{delAttachId === attachment._id && (
										<div>
											<Loader2 className="h-4 w-4 animate-spin" />
										</div>
									)}
									{delAttachId !== attachment._id && (
										<button
											onClick={() => onDelete(attachment)}
											className="ml-auto hover:opacity-75 transition"
										>
											<X className="h-4 w-4" />
										</button>
									)}
								</div>
							))}
						</div>
					)}
				</>
			)}
			{isEditing && (
				<div>
					<Input
						disabled={isUploading}
						type="file"
						name="fileUpload"
						onChange={handleFileChange}
						accept="image/*, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt"
						className="file-input file-input-bordered w-full "
					/>
					<div className="text-xs text-muted-foreground mt-4">
						Add anything your students might need to complete this chapter.
						(e.g. images, word documents, etc.)
					</div>

					{!isUploading && file && (
						<div className="flex justify-center mt-5 mb-5">
							<Button onClick={onSubmit} className="mx-auto">
								Upload File
							</Button>
						</div>
					)}
					{isUploading && (
						<div className="flex justify-center mt-5 mb-5">
							<Button
								onClick={cancelUpload}
								variant="destructive"
								className="mx-auto"
							>
								Cancel
							</Button>
						</div>
					)}
					{isUploading && (
						<div className="flex justify-center mb-5">
							<Progress value={uploadProgress} color="green" label=" " />
						</div>
					)}
				</div>
			)}
		</div>
	);
};
