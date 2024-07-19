import React, { useState } from "react";
// import { useUser } from '@clerk/nextjs';
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useParams } from "react-router-dom";
import { Loader } from "lucide-react";
import { useGetCallById } from "@/hooks/useGetCallById";
import Alert from "../../components/Alert";
import MeetingSetup from "../../components/MeetingSetup";
import MeetingRoom from "../../components/MeetingRoom";
import useAuth from "@/hooks/useAuth";

const MeetingPage = () => {
	const { callId } = useParams();
	const { _id } = useAuth();

	const { call, isCallLoading } = useGetCallById(callId);
	const [isSetupComplete, setIsSetupComplete] = useState(false);

	if (!_id || isCallLoading) return <Loader />;

	if (!call)
		return (
			<p className="text-center text-3xl font-bold text-white">
				Call Not Found
			</p>
		);

	// Check if the user is not allowed to join the meeting
	const notAllowed =
		call.type === "invited" &&
		(!_id || !call.state.members.find((m) => m.user.id === _id));
	if (notAllowed)
		return <Alert title="You are not allowed to join this meeting" />;
	return ( 
		<main className="str-video w-full">
			<StreamCall call={call}>
				<StreamTheme>
					{!isSetupComplete ? (
						<MeetingSetup setIsSetupComplete={setIsSetupComplete} />
					) : (
						<MeetingRoom />
					)}
				</StreamTheme>
			</StreamCall>
		</main>
	);
};

export default MeetingPage;
