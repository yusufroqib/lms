import { useRecordStudyTimeMutation } from "@/features/courses/coursesApiSlice";
import { useState, useEffect, useRef } from "react";

const UPDATE_INTERVAL = 30000; // Update every 30 seconds

const useStudyTimeTracker = (courseId) => {
	const [isTracking, setIsTracking] = useState(false);
	const [totalDuration, setTotalDuration] = useState(0);
	const lastUpdateTimeRef = useRef(null);
	const timeoutRef = useRef(null);
	const [recordStudyTime, { isLoading, isError, isSuccess, error }] =
		useRecordStudyTimeMutation();

	const updateBackend = async () => {
		try {
			const options = {
				courseId,
				duration: UPDATE_INTERVAL / 1000,
			};

			const response = await recordStudyTime(options).unwrap();

            // console.log(response)

			;
			// console.log("Backend updated with 30 seconds");
		} catch (error) {
			console.error("Error updating study time:", error);
			const failedUpdates = JSON.parse(
				localStorage.getItem("failedStudyTimeUpdates") || "[]"
			);
			failedUpdates.push({
				course: courseId,
				duration: UPDATE_INTERVAL / 1000, // Always 30 seconds
			});
			localStorage.setItem(
				"failedStudyTimeUpdates",
				JSON.stringify(failedUpdates)
			);
		}
	};

	const retryFailedUpdates = async () => {
		const failedUpdates = JSON.parse(
			localStorage.getItem("failedStudyTimeUpdates") || "[]"
		);
		for (const update of failedUpdates) {
			try {
				// await axios.post('/api/studyTime/update', update, {
				//   headers: {
				//     'x-auth-token': localStorage.getItem('token')
				//   }
				// });
				failedUpdates.shift();
			} catch (error) {
				console.error("Error retrying update:", error);
				break;
			}
		}
		localStorage.setItem(
			"failedStudyTimeUpdates",
			JSON.stringify(failedUpdates)
		);
	};

	useEffect(() => {
		const handleVisibilityChange = () => {
			console.log("Visibility chainged");
			if (document.hidden) {
				console.log("document hidden");
				stopTracking();
			} else {
				startTracking();
			}
		};

		startTracking();
		document.addEventListener("visibilitychange", handleVisibilityChange);
		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			stopTracking();
		};
	}, []);

	useEffect(() => {
		if (isTracking) {
			const updateDuration = () => {
				setTotalDuration((prevTotal) => prevTotal + UPDATE_INTERVAL / 1000);
				updateBackend();
				timeoutRef.current = setTimeout(updateDuration, UPDATE_INTERVAL);
			};

			lastUpdateTimeRef.current = Date.now();
			timeoutRef.current = setTimeout(updateDuration, UPDATE_INTERVAL);

			return () => {
				if (timeoutRef.current) {
					clearTimeout(timeoutRef.current);
				}
			};
		}
	}, [isTracking]);

	useEffect(() => {
		window.addEventListener("online", retryFailedUpdates);
		return () => window.removeEventListener("online", retryFailedUpdates);
	}, []);

	const startTracking = () => {
		setIsTracking(true);
		lastUpdateTimeRef.current = Date.now();
	};

	const stopTracking = () => {
		setIsTracking(false);
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
	};

	return { duration: totalDuration };
};

export default useStudyTimeTracker;
