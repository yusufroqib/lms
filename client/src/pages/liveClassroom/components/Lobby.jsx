import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import {
	Icon,
	ToggleAudioPreviewButton,
	ToggleVideoPreviewButton,
	useCall,
	useCallStateHooks,
	useConnectedUser,
	useI18n,
	VideoPreview,
} from "@stream-io/video-react-sdk";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import { DisabledVideoPreview } from "./DisabledVideoPreview";
import { ToggleSettingsTabModal } from "./Settings/SettingsTabModal";
import { ToggleEffectsButton } from "./ToggleEffectsButton";
import { ToggleMicButton } from "./ToggleMicButton";
import { ToggleCameraButton } from "./ToggleCameraButton";
import { ToggleParticipantsPreviewButton } from "./ToggleParticipantsPreview";
import { useEdges } from "../hooks/useEdges";
import { DefaultAppHeader } from "./DefaultAppHeader";
import { useLayoutSwitcher } from "../hooks";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const Lobby = ({ onJoin, mode = "regular" }) => {
	const call = useCall();
	const { data: session, status } = useSession();
	const { useMicrophoneState, useCameraState, useCallSession, useCallMembers } =
		useCallStateHooks();
	const { hasBrowserPermission: hasMicPermission } = useMicrophoneState();
	const { hasBrowserPermission: hasCameraPermission, isMute: isCameraMute } =
		useCameraState();
	const callSession = useCallSession();
	const members = useCallMembers();
	const currentUser = useConnectedUser();
	const { t } = useI18n();
	const { edges } = useEdges();
	const { layout, setLayout } = useLayoutSwitcher();
	useEffect(() => {
		if (status === "unauthenticated") {
			void signIn();
		}
	}, [status]);
	useEffect(() => {
		if (process.env.NEXT_PUBLIC_SKIP_LOBBY !== "true") return;
		const id = setTimeout(() => {
			onJoin();
		}, 500);
		return () => {
			clearTimeout(id);
		};
	}, [onJoin]);

	if (!session) {
		return null;
	}
	const hasBrowserMediaPermission = hasCameraPermission && hasMicPermission;
	const hasOtherParticipants = callSession?.participants.length;
	return (
		<>
			<DefaultAppHeader transparent />
			<div className="rd__lobby">
				<div className="rd__lobby-container">
					<div className="rd__lobby-content">
						{mode !== "anon" && (
							<>
								<h1 className="rd__lobby-heading">
									{t("Set up your call before joining")}
								</h1>
								<p className="rd__lobby-heading__description">
									{t(
										"while our Edge Network is selecting the best server for your call..."
									)}
								</p>
								<div
									className={clsx(
										"rd__lobby-camera",
										isCameraMute && "rd__lobby-camera--off"
									)}
								>
									<div className="rd__lobby-video-preview">
										<VideoPreview
											DisabledVideoPreview={
												hasBrowserMediaPermission
													? DisabledVideoPreview
													: AllowBrowserPermissions
											}
										/>
										<div className="rd__lobby-media-toggle">
											<ToggleAudioPreviewButton />
											{/* @ts-expect-error disable Menu */}
											<ToggleVideoPreviewButton Menu={null} />
										</div>
									</div>
									<div className="rd__lobby-controls">
										<div className="rd__lobby-media">
											<ToggleMicButton />
											<ToggleCameraButton />
										</div>

										<div className="rd__lobby-settings">
											<ToggleParticipantsPreviewButton onJoin={onJoin} />
											<ToggleEffectsButton inMeeting={false} />
											<ToggleSettingsTabModal
												layoutProps={{
													selectedLayout: layout,
													onMenuItemClick: setLayout,
												}}
												tabModalProps={{
													inMeeting: false,
												}}
											/>
										</div>
									</div>
								</div>
							</>
						)}

						<button
							className="rd__button rd__button--primary rd__button--large rd__lobby-join"
							type="button"
							data-testid="join-call-button"
							onClick={onJoin}
						>
							<Icon className="rd__button__icon" icon="login" />
							{hasOtherParticipants ? t("Join") : t("Start call")}
						</button>
					</div>
				</div>
			</div>
		</>
	);
};
const AllowBrowserPermissions = () => {
	return (
		<p className="rd__lobby__no-permission">
			Please grant your browser a permission to access your camera and
			microphone.
		</p>
	);
};
