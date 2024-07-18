import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Star, Loader2 } from "lucide-react";
// import { Button, Input, Textarea } from "@/components/ui";
import useAuth from "@/hooks/useAuth";
// import axios from "axios";
import {
	useAddCourseReviewMutation,
	useGetCourseReviewsQuery,
} from "@/features/courses/coursesApiSlice";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ReviewsTab = ({ hasPurchased }) => {
	const { courseId } = useParams();
	const { _id: userId } = useAuth();
	// const [reviews, setReviews] = useState([]);
	const [loading, setLoading] = useState(true);
	const [userReview, setUserReview] = useState({ rating: 0, comment: "" });
	const [page, setPage] = useState(1);
	// const [hasMore, setHasMore] = useState(true);

	const {
		data: courseReviews = {},
		isLoading,
		error,
		refetch,
	} = useGetCourseReviewsQuery({ courseId, page });
	const [addCourseReview] = useAddCourseReviewMutation();


	const handleRatingChange = (newRating) => {
		setUserReview((prev) => ({ ...prev, rating: newRating }));
	};

	const handleCommentChange = (e) => {
		setUserReview((prev) => ({ ...prev, comment: e.target.value }));
	};

	const handleSubmitReview = async (e) => {
		e.preventDefault();
		try {
			await addCourseReview({ courseId, ...userReview }).unwrap();
			refetch();
			setUserReview({ rating: 0, comment: "" });
			toast.success("Review submitted successfully");
		} catch (error) {
			console.error("Error submitting review:", error);
			toast.error("Error submitting review");
		}
	};

	const reviews = courseReviews?.reviews;
	const hasMore = courseReviews?.hasMore;
	const hasReviewed = reviews?.some((review) => review.user[0]._id === userId);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-64">
				<Loader2 className="w-8 h-8 animate-spin" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{!hasReviewed && hasPurchased && (
				<form onSubmit={handleSubmitReview} className="space-y-4">
					<div className="flex items-center space-x-2">
						{[1, 2, 3, 4, 5].map((star) => (
							<Star
								key={star}
								className={`w-6 h-6 cursor-pointer ${
									star <= userReview.rating
										? "text-yellow-700 fill-current"
										: "text-gray-300"
								}`}
								onClick={() => handleRatingChange(star)}
							/>
						))}
					</div>
					<Textarea
						placeholder="Write your review..."
						value={userReview.comment}
						onChange={handleCommentChange}
						className="w-full"
					/>
					<Button type="submit">Submit Review</Button>
				</form>
			)}

			<div className="space-y-4">
				{reviews.map((review) => (
					<div key={review._id} className="bg-white p-4 rounded-lg shadow">
						<div className="flex items-center space-x-2 mb-2">
							<div className="flex">
								{[1, 2, 3, 4, 5].map((star) => (
									<Star
										key={star}
										className={`w-4 h-4 ${
											star <= review.rating
												? "text-yellow-700 fill-current"
												: "text-gray-300"
										}`}
									/>
								))}
							</div>
							<span className="ml-2 font-semibold flex gap-1">
								{" "}
								<Avatar className="h-6 w-6">
									<AvatarImage src={review.user[0].avatar} />
									<AvatarFallback>
										{review.user[0].name.charAt(0)}
									</AvatarFallback>
								</Avatar>
								{review.user[0].name}
							</span>
						</div>
						<p>{review.comment}</p>
					</div>
				))}
			</div>

			{hasMore && (
				<div className="flex justify-center">
					<Button onClick={() => setPage((prev) => prev + 1)}>Load More</Button>
				</div>
			)}
		</div>
	);
};

export default ReviewsTab;
