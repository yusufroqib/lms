import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import React from "react";
import { usePurchaseCourseMutation } from "@/features/courses/coursesApiSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CourseVideo = ({
	previewVideoUrl,
	price,
	courseImage,
	courseId,
	isPurchased,
	firstChapter
}) => {
	const navigate = useNavigate()
	const [purchaseCourse, { isLoading, isError, isSuccess, error }] =
		usePurchaseCourseMutation();

	console.log(courseId);
	const handlePurchase = async () => {
		try {
			// console.log(values);
			await purchaseCourse({ courseId }).unwrap();
			// await axios.patch(`/api/courses/${courseId}`, values);
			toast.success("Course purchased successfully");

			// router.refresh();
		} catch {
			toast.error("Something went wrong");
		}
	};
	const handleStudy = async () => {
		try {
			// console.log(values);
			// await purchaseCourse({ courseId }).unwrap();
			// await axios.patch(`/api/courses/${courseId}`, values);
			// toast.success("Course purchased successfully");
			navigate(`/study/${courseId}/chapter/${firstChapter._id}`)

			// router.refresh();
		} catch {
			toast.error("Something went wrong");
		}
	};
	return (
		<div className="p-2 border border-gray-600 rounded-xl">
			<div className="relative aspect-video">
				<video
					poster={courseImage}
					className="h-full w-full"
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
				{isPurchased ? (
					<Button
						onClick={handleStudy}
						size="lg"
						// className="animated-blink"
						variant={"success"}
					>
						Goto Course Study Page{" "}
					</Button>
				) : (
					<Button
						onClick={handlePurchase}
						size="lg"
						className="animated-blink"
						variant={"success"}
					>
						Enroll Now
					</Button>
				)}
			</div>
		</div>
	);
};

export default CourseVideo;
