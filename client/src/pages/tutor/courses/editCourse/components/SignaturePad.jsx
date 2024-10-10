import { Pencil, PlusCircle, ImageIcon, Info } from "lucide-react";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
	getStorage,
	ref,
	deleteObject,
	getDownloadURL,
	uploadString,
} from "firebase/storage";
import app from "../../../../../firebase";
import SignatureCanvas from "react-signature-canvas";
import useAuth from "@/hooks/useAuth";
import { useUpdateSignatureMutation } from "@/features/users/usersApiSlice";

const SignaturePad = ({  signature }) => {
	const sigCanvas = useRef();
	const [isEditing, setIsEditing] = useState(false);
	const { _id: userId } = useAuth();
	const [isUploading, setIsUploading] = useState(false);
	const [updateSignature] = useUpdateSignatureMutation();


	const toggleEdit = () => setIsEditing((current) => !current);

	const uploadImage = async (dataUrl) => {
		const storage = getStorage(app);
		const fileName = `${Date.now()}_signature.png`;
		const folderPath = `Users/${userId}/Signature`;

		// Check if there is an existing image URL
		const existingImageUrl = null; //initialData.courseImage;

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

		try {
			// Upload the data URL string
			const snapshot = await uploadString(storageRef, dataUrl, "data_url");

			// Get the download URL
			const downloadURL = await getDownloadURL(snapshot.ref);

			return downloadURL;
		} catch (error) {
			console.error("Error uploading image:", error);
			throw error;
		}
	};

	const onSubmit = async () => {
		const canvas = sigCanvas.current.getTrimmedCanvas();

		// Check if the canvas is empty
		const isCanvasBlank = isCanvasEmpty(canvas);

		if (isCanvasBlank) {
			toast.error("The signature canvas is empty");
			// You can show an error message to the user here
			return;
		}

		const img = canvas.toDataURL("image/png");
		// if (!img) {
		// 	return toast.error("Please select an image");
		// }
		try {
			setIsUploading(true);
			const url = await uploadImage(img);
			await updateSignature({ signature: url }).unwrap();
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
			console.log(error);
		} finally {
		
			setIsUploading(false);
		}
	};

	// const handleCancel = () => {
	// 	if (uploadTask) {
	// 		uploadTask.cancel();
	// 		setUploadTask(null);
	// 	}
	// 	setImg(null);
	// 	setImgPerc(0);
	// 	setIsUploading(false);
	// 	toggleEdit();
	// };

	// Function to check if the canvas is empty
	function isCanvasEmpty(canvas) {
		const context = canvas.getContext("2d");
		const pixelBuffer = new Uint32Array(
			context.getImageData(0, 0, canvas.width, canvas.height).data.buffer
		);
		return !pixelBuffer.some((color) => color !== 0);
	}

	const clear = () => sigCanvas.current.clear();

	const undo = () => {
		const data = sigCanvas.current.toData();
		if (data) {
			data.pop();
			sigCanvas.current.fromData(data);
		}
	};

	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Signature
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing && !isUploading && <>Cancel</>}
					{!isEditing && !signature && (
						<>
							<PlusCircle className="h-4 w-4 mr-2" />
							Kindly sign
						</>
					)}
					{!isEditing && signature && (
						<>
							<Pencil className="h-4 w-4 mr-2" />
							Edit signature
						</>
					)}
				</Button>
			</div>
			{!isEditing &&
				(!signature ? (
					<div className="flex items-center justify-center h-40 bg-slate-200 opacity-70 rounded-md">
						No signature yet
					</div>
				) : (
					<div className="relative h-50 mt-2 bg-blue-gray-900 flex items-center justify-center">
						<img
							alt="Course"
							className="object-cover rounded-md"
							src={signature}
						/>
						{/* No image yet */}
					</div>
				))}
			{isEditing && (
				<div>
					<div className="inline-flex gap-1  mb-2 ">
						<Info className="h-5 w-5" />
						<p className="text-sm text-blue-gray-800 ">
							Use your mouse or touch screen to sign in the box below. Make sure
							your signature is clear and readable.
						</p>
					</div>

					<div className="w-full h-40 bg-blue-gray-900 mx-auto relative">
						<div className="text-white space-x-4 absolute right-0 mr-3 pt-3">
							<Button size="sm" variant="destructive" onClick={clear}>
								Clear
							</Button>
							{/* <button onClick={save}>Save</button> */}
							<Button variant="orange" size="sm" onClick={undo}>
								Undo
							</Button>
						</div>
						<SignatureCanvas
							ref={sigCanvas}
							// backgroundColor="blue"
							penColor="white"
							canvasProps={{
								className: "w-full h-full",
							}}
						/>

						{/* {imageURL && (
							<img
								src={imageURL}
								alt="signature"
								style={{
									display: "block",
									margin: "10px auto",
									border: "1px solid black",
									width: "150px",
									background: "black",
								}}
							/>
						)} */}
					</div>
					<div className="text-xs text-muted-foreground mt-4">
						This signature will be used on certificates generated for students.
					</div>
					<div className=" mt-5 mb-5">
						<Button
							onClick={onSubmit}
							disabled={isUploading}
							className="mx-auto"
						>
							Save signature
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};

export default SignaturePad;
