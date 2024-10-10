import React, { useRef, useEffect, useState } from "react";
import CertificateCanvas from "./CertificateCanvas";
import Confetti from "react-confetti";
import useAuth from "@/hooks/useAuth";
import { useParams } from "react-router-dom";
import {
	useCreateCertificateMutation,
	usePrepareCertificateMutation,
} from "@/features/courses/coursesApiSlice";
import {
	getStorage,
	ref,
	deleteObject,
	getDownloadURL,
	uploadBytesResumable,
} from "firebase/storage";
import app from "@/firebase";
import toast from "react-hot-toast";
import generateCertID from "@/lib/generateCertID";
import { Button } from "@/components/ui/button";
import { useCertificate } from "@/hooks/useCertificate";
import { useWaitForTransactionReceipt } from "wagmi";

const CertificateGenerator = ({
	courseCompleted,
	signature,
	courseTitle,
	certificate,
	isAlreadyCompleted,
}) => {
	const certificateRef = useRef(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const [certificateGenerated, setCertificateGenerated] = useState(false);
	const [certId, setCertId] = useState("");
	const { fullName, _id: userId } = useAuth();
	const { courseId } = useParams();
	const [open, setOpen] = useState(false);
	const [createCertificate] = useCreateCertificateMutation();
	const [prepareCertificate, { data }] = usePrepareCertificateMutation();
	const [certUploadPerc, setCertUploadPerc] = useState(0);
	const {
		mintCertificate,
		mintCertificateHash,
		isMintCertificatePending,
		mintCertificateError,
	} = useCertificate();
	const { isLoading: isConfirming, isSuccess: isConfirmed } =
		useWaitForTransactionReceipt({
			hash: mintCertificateHash,
		});
	const [toastId, setToastId] = useState(null);

	const [showConfetti, setShowConfetti] = useState(false);

	// console.log(data);

	useEffect(() => {
		if (isMintCertificatePending) {
			const newToastId = toast.loading("Waiting for approval from wallet...");
			// console.log(toastId)
			setToastId(newToastId);
			console.log("Transaction is pending...");
		}
		if (isConfirming) {
			if (toastId) toast.dismiss(toastId);
			const newToastId = toast.loading(
				"Waiting for confirmation on the blockchain..."
			);
			setToastId(newToastId);
			console.log("Waiting for confirmation...");
		}
		if (isConfirmed) {
			console.log("Transaction confirmed!");
			toast.success("Certificate minted successfully!", { id: toastId });
		}
		// toast.dismiss(toastId);
		if (mintCertificateError) {
			toast.error(mintCertificateError, { id: toastId });
		}
	}, [
		isMintCertificatePending,
		isConfirming,
		isConfirmed,
		mintCertificateError,
	]);

	useEffect(() => {
		generateCertID(userId).then((id) => setCertId(id));
	}, []);

	// console.log(certId);

	useEffect(() => {
		// if (isAlreadyCompleted  && certId) {
		if (isAlreadyCompleted && !certificate && certId) {
			generateCertificate(certId);
		}
	}, [certId]);

	useEffect(() => {
		if (courseCompleted && certId) {
			generateCertificate();
		}
	}, [courseCompleted, certId]);

	const uploadImage = async (dataUrl) => {
		const storage = getStorage(app);
		const fileName = `${Date.now()}certificate.png`;
		const folderPath = `Users/${userId}/Certificates/${courseId}`;

		// Check if there is an existing image URL
		const existingImageUrl = certificate?.firebaseUrl; //initialData.courseImage;

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

		const dataURItoBlob = (dataURI) => {
			const byteString = atob(dataURI.split(",")[1]);
			const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
			const ab = new ArrayBuffer(byteString.length);
			const ia = new Uint8Array(ab);
			for (let i = 0; i < byteString.length; i++) {
				ia[i] = byteString.charCodeAt(i);
			}
			return new Blob([ab], { type: mimeString });
		};

		const blob = dataURItoBlob(dataUrl);

		// Concatenate the folder path with the file name to create storage reference
		const storageRef = ref(storage, `${folderPath}/${fileName}`);
		const uploadTask = uploadBytesResumable(storageRef, blob);

		return new Promise((resolve, reject) => {
			uploadTask.on(
				"state_changed",
				(snapshot) => {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					// console.log(progress)
					setCertUploadPerc(Math.round(progress));
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
						resolve(downloadURL); // Resolve promise with the download URL
					} catch (error) {
						reject(error); // Reject promise if there's an error getting the download URL
					}
				}
			);
		});
	};

	const generateCertificate = () => {
		console.log("Running generateCertificate");
		setIsGenerating(true);
		// setProgress(0);

		// const interval = setInterval(() => {
		// 	setProgress((prevProgress) => {
		// 		if (prevProgress >= 100) {
		// 			clearInterval(interval);
		// 			return 100;
		// 		}
		// 		return prevProgress + 2;
		// 	});
		// }, 300);

		setTimeout(() => {
			if (certificateRef.current) {
				const createCert = async () => {
					try {
						const dataURL = certificateRef.current.toDataURL();
						const url = await uploadImage(dataURL);

						if (url && certId) {
							await createCertificate({
								courseId,
								certificateId: certId,
								firebaseUrl: url,
							}).unwrap();
							console.log("Certificate generated successfully");
							setOpen(true);
							setShowConfetti(true);
							setCertificateGenerated(true);
							setTimeout(() => setShowConfetti(false), 6000); // Stop confetti after 5 seconds
						} else {
							toast.error("Failed to generate Data URL or CertID");
						}
					} catch (error) {
						console.log(error);
						toast.error("Failed to generate certificate");
					} finally {
						setIsGenerating(false);
						// clearInterval(interval);
					}
				};
				createCert();
			} else {
				toast.error("Certificate ref is null");
				setIsGenerating(false);
				// clearInterval(interval);
			}
		}, 2000);
	};

	const mintAsNFT = async () => {
		console.log("Minting as NFT");

		const newToastId = toast.loading(
			"Preparing certificate for minting. Please wait..."
		);
		try {
			const result = await prepareCertificate({
				courseId,
				courseTitle,
				studentName: fullName,
			}).unwrap();
			console.log(result);
			result.tokenURI &&
				mintCertificate(userId, courseId, result.tokenURI);

			console.log(result.tokenURI);
			// console.log(result.apiEndpoint);
		} catch (error) {
			console.log(error);
			toast.error("Failed to mint certificate");
		} finally {
			toast.dismiss(newToastId);
		}
	};

	const mintLater = () => {
		setOpen(false);
		console.log("Saving for later minting");
	};

	return (
		<div className="relative">
			<Button onClick={mintAsNFT}>Mint now</Button>
			<div className="hidden">
				<CertificateCanvas
					ref={certificateRef}
					certId={certId}
					setCertId={setCertId}
					courseId={courseId}
					userId={userId}
					courseTitle={courseTitle}
					studentName={fullName}
					description="For the successful completion of the course"
					signatureUrl={signature}
				/>
			</div>
			{isGenerating && (
				<div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80">
					<div className="bg-white p-6 rounded-lg shadow-xl w-64">
						<div className="mb-2 text-center font-bold">
							Generating Certificate
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2.5">
							<div
								className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
								style={{ width: `${certUploadPerc}%` }}
							></div>
						</div>
					</div>
				</div>
			)}
			{certificateGenerated && open && (
				<div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80">
					<div className="bg-white p-8 rounded-lg shadow-xl transform transition-all duration-300 ease-in-out animate-pop">
						<h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
						<img
							src={certificateRef.current?.toDataURL()}
							alt="Certificate"
							className="mb-4 max-w-full h-[70vh] animate-reveal"
						/>
						<div className="flex justify-between">
							<button
								onClick={mintAsNFT}
								className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-all duration-300 ease-in-out hover:scale-105"
							>
								Mint as NFT
							</button>
							<button
								onClick={mintLater}
								className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition-all duration-300 ease-in-out hover:scale-105"
							>
								Mint Later
							</button>
						</div>
					</div>
				</div>
			)}
			{showConfetti && (
				<div className="fixed inset-0 pointer-events-none z-[60]">
					<Confetti width={window.innerWidth} height={window.innerHeight} />
				</div>
			)}{" "}
		</div>
	);
};

export default CertificateGenerator;
