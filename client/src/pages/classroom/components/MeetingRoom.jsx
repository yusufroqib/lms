import React, { useEffect, useState } from "react";
import {
	CallControls,
	CallParticipantsList,
	CallStatsButton,
	CallingState,
	CancelCallConfirmButton,
	CompositeButton,
	DefaultParticipantViewUI,
	Icon,
	PaginatedGridLayout,
	ParticipantActionsContextMenu,
	PermissionRequests,
	RecordCallConfirmationButton,
	RecordingInProgressNotification,
	SpeakerLayout,
	SpeakingWhileMutedNotification,
	useCall,
	useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Users, LayoutList } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Loader from "./Loader";
import EndCallButton from "./EndCallButton";
import { cn } from "@/lib/utils";
import MeetingEndedScreen from "./Recordings";
import { ChatWrapper } from "./ChatWrapper";
import { ChatUI } from "./ChatUI";
import { UnreadCountBadge } from "./UnreadCountBadge";
import { NewMessageNotification } from "./NewMessageNotification";
import { useStreamChatClient } from "@/context/StreamChatContext";
import { useWatchChannel } from "@/hooks/useWatchChannel";
import clsx from "clsx";
import { ActiveCallHeader } from "./ActiveCallHeader";

const MeetingRoom = () => {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const [sidebarContent, setSidebarContent] = useState(null);
	const isPersonalRoom = !!searchParams.get("personal");
	const [layout, setLayout] = useState("speaker-left");
	const { streamChatClient: chatClient } = useStreamChatClient();

	// const [showParticipants, setShowParticipants] = useState(false);
	const { useCallCallingState } = useCallStateHooks();
	const activeCall = useCall();
	const channelWatched = useWatchChannel({
		chatClient,
		channelId: activeCall?.id,
	});

	// const callEndedAt = useCallEndedAt();
	// const callStartsAt = useCallStartsAt();

	// for more detail about types of CallingState see: https://getstream.io/video/docs/react/ui-cookbook/ringing-call/#incoming-call-panel
	const callingState = useCallCallingState();
	const { classroomId } = useParams();
	const showParticipants = sidebarContent === "participants";
	const showSidebar = sidebarContent != null;
	const showChat = sidebarContent === "chat";

	// const callHasEnded = !!callEndedAt;
	// if (callHasEnded) {
	//     return <MeetingEndedScreen />;
	// }

	// useEffect(() => {

	//   return () => {
	//     console.log("Component unmounted or navigated away. Ending call and stopping camera...");
	//     stopCameraAndMic()
	//   }
	// }, [])

	// const stopCameraAndMic = async () => {
	//     await camera.disable
	//     await microphone.disable
	//     navigate(`/classrooms/${classroomId}`)
	// };

	if (callingState !== CallingState.JOINED) return <Loader />;

	const CallLayout = () => {
		switch (layout) {
			case "grid":
				// return <DefaultParticipantViewUI ParticipantActionsContextMenu={ParticipantActionsContextMenu}/>
				return <PaginatedGridLayout />;
			case "speaker-right":
				return <SpeakerLayout participantsBarPosition="left" />;
			case "speaker-bottom":
				return <SpeakerLayout participantsBarPosition="top" />;
			default:
				return <SpeakerLayout participantsBarPosition="right" />;
		}
	};

	return (
		<div className="rd__call">
			<div className="rd__main-call-panel">
				<ActiveCallHeader />

				<PermissionRequests />
				{/* <section className="relative h-screen w-full overflow-hidden pt-4 text-white"> */}
				{/* <div className="relative flex size-full items-center justify-center"> */}
				<div className="rd__layout">
					{/* <div className=" flex size-full max-w-[1000px] items-center"> */}
					<div className="rd__layout__stage-container">
						<CallLayout />
					</div>

					<div
						className={clsx("rd__sidebar", showSidebar && "rd__sidebar--open")}
					>
						{showSidebar && (
							<div className="rd__sidebar__container">
								{showParticipants && (
									<div
										// className={cn("h-[calc(100vh-86px)]  ml-2")}
										className="rd__participants"
									>
										<CallParticipantsList
											onClose={() => setSidebarContent(null)}
										/>
									</div>
								)}
								{showChat && (
									<ChatWrapper chatClient={chatClient}>
										<div className="str-video__chat">
											<ChatUI
												onClose={() => {
													setSidebarContent(null);
												}}
												channelId={activeCall.id}
											/>
										</div>
									</ChatWrapper>
								)}
							</div>
						)}
					</div>
				</div>
				{/* video layout and call controls */}
				<div className="rd__notifications">
					<RecordingInProgressNotification />
				</div>
				<div className="fixed bottom-0 flex flex-wrap w-full items-center justify-center gap-1">
					<CallControls
						onLeave={() => navigate(`/classrooms/${classroomId}`)}
					/>

					<DropdownMenu>
						<div className="flex items-center">
							<DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]  ">
								<LayoutList size={20} className="text-white" />
							</DropdownMenuTrigger>
						</div>
						<DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
							{["Grid", "Speaker-Left", "Speaker-Right", "Speaker-Bottom"].map(
								(item, index) => (
									<div key={index}>
										<DropdownMenuItem
											onClick={() => setLayout(item.toLowerCase())}
										>
											{item}
										</DropdownMenuItem>
										<DropdownMenuSeparator className="border-dark-1" />
									</div>
								)
							)}
						</DropdownMenuContent>
					</DropdownMenu>
					<CallStatsButton />
					{/* <RecordCallConfirmationButton /> */}

					{/* <CancelCallConfirmButton onLeave={() => navigate(`/classrooms/${classroomId}`)} /> */}

					<button
						onClick={() =>
							setSidebarContent(showParticipants ? null : "participants")
						}
					>
						<div className=" cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]  ">
							<Users size={20} className="text-white" />
						</div>
					</button>
					<NewMessageNotification
						chatClient={chatClient}
						channelWatched={channelWatched}
						disableOnChatOpen={showChat}
					>
						<div className="str-chat__chat-button__wrapper">
							<CompositeButton
								active={showChat}
								disabled={!chatClient}
								title="Chat"
								onClick={() => {
									setSidebarContent(showChat ? null : "chat");
								}}
							>
								<Icon icon="chat" />
							</CompositeButton>
							{!showChat && (
								<UnreadCountBadge
									channelWatched={channelWatched}
									chatClient={chatClient}
									channelId={activeCall.id}
								/>
							)}
						</div>
					</NewMessageNotification>
					{!isPersonalRoom && <EndCallButton />}
					{/* </section> */}
				</div>
			</div>
		</div>
	);
};

export default MeetingRoom;
