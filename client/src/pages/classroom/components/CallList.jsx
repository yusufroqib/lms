import React, { useState, useEffect } from "react";
import Loader from "./Loader";
import { useGetCalls } from "@/hooks/useGetCalls";
import MeetingCard from "./MeetingCard";
import { useNavigate, useParams } from "react-router-dom";
import { useCall } from "@stream-io/video-react-sdk";

const CallList = ({ type }) => {
	const navigate = useNavigate();
	const { ongoingCalls, endedCalls, upcomingCalls, callRecordings, isLoading } =
		useGetCalls();
	const [recordings, setRecordings] = useState([]);
	const { classroomId } = useParams();
	const call = useCall();

	const getCalls = () => {
		switch (type) {
			case "ended":
				return endedCalls;
			case "recordings":
				return recordings;
			case "upcoming":
				return upcomingCalls;
			case "ongoing":
				return ongoingCalls;
			default:
				return [];
		}
	};

	const getNoCallsMessage = () => {
		switch (type) {
			case "ended":
				return "No Previous Calls";
			case "upcoming":
				return "No Upcoming Calls";
			case "ongoing":
				return "No Call in Progress";
			case "recordings":
				return "No Recordings";
			default:
				return "";
		}
	};

	useEffect(() => {
		const fetchRecordings = async () => {
			// const callData = await Promise.all(
			// 	callRecordings?.map((meeting) => meeting.queryRecordings()) ?? []
			// );
			// const recordings = callData
			// 	.filter((call) => call.recordings.length > 0)
			// 	.flatMap((call) => call.recordings);
			const { recordings } = await call.queryRecordings();

			setRecordings(recordings);
		};
		if (type === "recordings") {
			fetchRecordings();
		}
	}, [type, callRecordings]);

	if (isLoading) return <Loader />;

	const calls = getCalls();
	const noCallsMessage = getNoCallsMessage();

	return (
		<div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
			{calls && calls.length > 0 ? (
				calls.map((meeting) => (
					<MeetingCard
						key={meeting.id}
						icon={
							type === "ended"
								? "/icons/previous.svg"
								: type === "upcoming"
								? "/icons/upcoming.svg"
								: type === "ongoing"
								? "/icons/in-progress.svg"
								: "/icons/recordings.svg"
						}
						title={
							meeting.state?.custom?.description ||
							meeting.filename?.substring(0, 20) ||
							"No Description"
						}
						date={
							meeting.state?.startsAt?.toLocaleString() ||
							meeting.start_time?.toLocaleString()
						}
						isPreviousMeeting={type === "ended"}
						link={
							type === "recordings"
								? meeting.url
								: `${
										import.meta.env.VITE_CLIENT_BASE_URL
								  }/classrooms/${classroomId}/meeting/${meeting.id}`
						}
						buttonIcon1={type === "recordings" ? "/icons/play.svg" : undefined}
						buttonText={
							type === "recordings" ? "Play" : type === "ended" ? "Recordings" : "Start"
						}
						handleClick={
							type === "recordings"
								? () => window.open(meeting.url, "_blank")
								: () =>
										navigate(`/classrooms/${classroomId}/meeting/${meeting.id}`)
						}
					/>
				))
			) : (
				<h1 className="text-2xl font-bold text-white">{noCallsMessage}</h1>
			)}
		</div>
	);
};

export default CallList;
