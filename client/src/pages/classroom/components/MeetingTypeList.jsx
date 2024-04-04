import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
// import { useUser } from '@clerk/nextjs';
import Loader from "./Loader";
import { Textarea } from "@/components/ui/textarea";
import ReactDatePicker from "react-datepicker";
// import { useToast } from '@/components/ui/use-toast';
import { Input } from "@/components/ui/input";
import HomeCard from "./HomeCard";
import MeetingModal from "./MeetingModal";
import useAuth from "@/hooks/useAuth";
import toast from "react-hot-toast";

const initialValues = {
	dateTime: new Date(),
	description: "",
	link: "",
};

const MeetingTypeList = ({ currentClassroom }) => {
	const { _id, username, fullName, image, streamToken } = useAuth();

	const navigate = useNavigate();
	const [meetingState, setMeetingState] = useState(undefined);
	const [values, setValues] = useState(initialValues);
	const [callDetail, setCallDetail] = useState();
	const client = useStreamVideoClient();
	const { classroomId } = useParams();
	// const { user } = useUser();
	// const { toast } = useToast();

	const createMeeting = async () => {
		if (!client || !_id) return;
		try {
			if (!values.dateTime) {
				toast.error("Please select a date and time");
				return;
			}
			const id = crypto.randomUUID();
			const call = client.call("default", id);
			if (!call) throw new Error("Failed to create meeting");
			const members = currentClassroom.students
				.map((student) => ({ user_id: student._id, role: "call_member" }))
				.concat({ user_id: _id, role: "call_member" })
				.filter(
					(v, i, a) => a.findIndex((v2) => v2.user_id === v.user_id) === i
				);
			const startsAt =
				values.dateTime.toISOString() || new Date(Date.now()).toISOString();
			const description = values.description || "Instant Meeting";
			await call.getOrCreate({
				data: {
					starts_at: startsAt,
					members,
					custom: {
						description,
						classroomId
					},
				},
			});
			setCallDetail(call);
			if (!values.description) {
				navigate(`/classrooms/${classroomId}/meeting/${call.id}`);
			}
			toast.success("Meeting Created");
		} catch (error) {
			console.error(error);
			toast.error("Failed to create Meeting");
		}
	};

	if (!client || !_id) return <Loader />;

	const meetingLink = `${
		import.meta.env.VITE_CLIENT_BASE_URL
	}/classrooms/${classroomId}/meeting/${callDetail?.id}`;

	return (
		<section className="grid grid-cols-1 gap-5 md:grid-cols-2 ">
			<HomeCard
				img="/icons/add-meeting.svg"
				title="New Meeting"
				description="Start an instant meeting"
				handleClick={() => setMeetingState("isInstantMeeting")}
			/>
			{/* <HomeCard
				img="/icons/join-meeting.svg"
				title="Join Meeting"
				description="via invitation link"
				className="bg-blue-1"
				handleClick={() => setMeetingState("isJoiningMeeting")}
			/> */}
			<HomeCard
				img="/icons/schedule.svg"
				title="Schedule Meeting"
				description="Plan your meeting"
				className="bg-purple-1"
				handleClick={() => setMeetingState("isScheduleMeeting")}
			/>
			{/* <HomeCard
				img="/icons/recordings.svg"
				title="View Recordings"
				description="Meeting Recordings"
				className="bg-yellow-1"
				handleClick={() => navigate("/recordings")}
			/> */}

			{!callDetail ? (
				<MeetingModal
					isOpen={meetingState === "isScheduleMeeting"}
					onClose={() => setMeetingState(undefined)}
					title="Create Meeting"
					handleClick={createMeeting}
				>
					<div className="flex flex-col gap-2.5">
						<label className="text-base font-normal leading-[22.4px] text-sky-2">
							Add a description
						</label>
						<Textarea
							className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
							onChange={(e) =>
								setValues({ ...values, description: e.target.value })
							}
						/>
					</div>
					<div className="flex w-full flex-col gap-2.5">
						<label className="text-base font-normal leading-[22.4px] text-sky-2">
							Select Date and Time
						</label>
						<ReactDatePicker
							selected={values.dateTime}
							onChange={(date) => setValues({ ...values, dateTime: date })}
							showTimeSelect
							timeFormat="HH:mm"
							timeIntervals={15}
							timeCaption="time"
							dateFormat="MMMM d, yyyy h:mm aa"
							className="w-full rounded bg-dark-3 p-2 focus:outline-none"
						/>
					</div>
				</MeetingModal>
			) : (
				<MeetingModal
					isOpen={meetingState === "isScheduleMeeting"}
					onClose={() => setMeetingState(undefined)}
					title="Meeting Created"
					handleClick={() => {
						navigator.clipboard.writeText(meetingLink);
						toast.success("Link Copied");
					}}
					image={"/icons/checked.svg"}
					buttonIcon="/icons/copy.svg"
					className="text-center"
					buttonText="Copy Meeting Link"
				/>
			)}

			<MeetingModal
				isOpen={meetingState === "isJoiningMeeting"}
				onClose={() => setMeetingState(undefined)}
				title="Type the link here"
				className="text-center"
				buttonText="Join Meeting"
				handleClick={() => navigate(values.link)}
			>
				<Input
					placeholder="Meeting link"
					onChange={(e) => setValues({ ...values, link: e.target.value })}
					className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
				/>
			</MeetingModal>

			<MeetingModal
				isOpen={meetingState === "isInstantMeeting"}
				onClose={() => setMeetingState(undefined)}
				title="Start an Instant Meeting"
				className="text-center"
				buttonText="Start Meeting"
				handleClick={createMeeting}
			/>
		</section>
	);
};

export default MeetingTypeList;
