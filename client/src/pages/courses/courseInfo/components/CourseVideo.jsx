import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { usePurchaseCourseMutation } from "@/features/courses/coursesApiSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import useAuth from "@/hooks/useAuth";
import CryptoPaymentModal from "./CryptoPaymentModal";

// import {loadStripe} from '@stripe/stripe-js';

const CourseVideo = ({
	previewVideoUrl,
	price,
	courseImage,
	paymentMethod,
	tutorId,
	courseId,
	isPurchased,
	firstChapter,
}) => {
	const { _id, paymentWallet, stripeOnboardingComplete } = useAuth();
	const navigate = useNavigate();
	const [purchaseCourse, { isLoading, isError, isSuccess, error }] =
		usePurchaseCourseMutation();
	const [canStudy, setCanStudy] = useState(false);
	const [isCryptoModalOpen, setIsCryptoModalOpen] = useState(false);

	useEffect(() => {
		setCanStudy(isPurchased || _id === tutorId);
	}, [_id, tutorId, isPurchased]);

	// console.log(courseId);
	const handlePurchase = async () => {
		if (canStudy) return;

		try {
			const response = await purchaseCourse({ courseId }).unwrap();
			window.location.assign(response.url);
		} catch (error) {
			if (error?.data?.message) {
				toast.error(error.data.message);
			} else {
				toast.error("Something went wrong");
			}
		}
	};

	const handleStudy = async () => {
		try {
			navigate(`/study/${courseId}/chapter/${firstChapter._id}`);

			// router.refresh();
		} catch {
			toast.error("Something went wrong");
		}
	};

	// let buttonText = "Enroll now";

	// if (isLoading) {
	// 	buttonText = (
	// 		<>
	// 			<Loader2 key="loader" className="mr-2 h-4 w-4 animate-spin" /> Please
	// 			wait
	// 		</>
	// 	);
	// }

	return (
		<div className="p-2 border border-gray-600 rounded-xl">
			<CryptoPaymentModal isCryptoModalOpen={isCryptoModalOpen} setIsCryptoModalOpen={setIsCryptoModalOpen} tutorId={tutorId} courseId={courseId} price={price} />

			<div className="relative min-w-full aspect-video">
				<video
					className="w-full"
					// poster={courseImage}
					// className="h-full w-full"
					controls
					src={previewVideoUrl}
				/>
			</div>
			<div className="mt-2 lg:mt-4 text-sm lg:text-md text-gray-500">
				<p>
					Enjoying this preview? Dive into the full course by enrolling today
					for complete access!
				</p>
			</div>
			<div className="flex justify-between">
				<p
					className={cn("text-xl mt-2 font-bold", !price && "text-green-800 ")}
				>
					{price ? formatPrice(price) : "Free"}
				</p>
				{canStudy ? (
					<Button
						onClick={handleStudy}
						size="lg"
						// className="animated-blink"
						variant={"success"}
					>
						Goto Course Study Page{" "}
					</Button>
				) : paymentMethod === "card" ? (
					<Button
						onClick={handlePurchase}
						size="lg"
						disabled={isLoading}
						className="animated-blink"
						variant={"success"}
					>
						Pay with card
					</Button>
				) : paymentMethod === "crypto" ? (
					<Button
						onClick={() => setIsCryptoModalOpen(true)}
						size="lg"
						disabled={isLoading}
						className="animated-blink"
						variant={"orange"}
					>
						Pay with crypto
					</Button>
				) : paymentMethod === "both" ? (
					<div className="flex gap-2">
						<Button
							onClick={handlePurchase}
							size="sm"
							disabled={isLoading}
							// className="animated-blink"
							variant={"success"}
						>
							Pay with card
						</Button>
						<Button
							onClick={() => setIsCryptoModalOpen(true)}
							size="sm"
							disabled={isLoading}
							// className="animated-blink"
							variant={"orange"}
						>
							Pay with crypto
						</Button>
					</div>
				) : null}
			</div>
		</div>
	);
};

export default CourseVideo;
