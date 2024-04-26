import { useRef } from 'react';
import { DefaultParticipantViewUI, ParticipantView, SpeakerLayout, useCallStateHooks, } from '@stream-io/video-react-sdk';
import { motion } from 'framer-motion';
const CustomParticipantViewUISpotlight = ({ ParticipantViewUI, }) => {
    const { useParticipants, useHasOngoingScreenShare } = useCallStateHooks();
    const [participantInSpotlight, otherParticipant] = useParticipants();
    const constraintsElementRef = useRef(null);
    const hasOngoingScreenShare = useHasOngoingScreenShare();
    const participantToRender = hasOngoingScreenShare && !participantInSpotlight.isLocalParticipant
        ? participantInSpotlight
        : otherParticipant;
    if (!participantToRender)
        return null;
    return (<>
      <motion.div ref={constraintsElementRef} style={{ width: '100%', height: '100%', position: 'absolute' }}>
        <motion.div dragConstraints={constraintsElementRef} className="rd__framer-participant-view-wrapper" drag dragMomentum dragTransition={{ timeConstant: 100, power: 0.1 }} dragElastic={0}>
          <ParticipantView muteAudio={participantToRender.isLocalParticipant} participant={participantToRender} ParticipantViewUI={ParticipantViewUI || DefaultParticipantViewUI}/>
        </motion.div>
      </motion.div>
      <DefaultParticipantViewUI />
    </>);
};
export const SpeakerOneOnOne = ({ ParticipantViewUI, }) => {
    const { useRemoteParticipants } = useCallStateHooks();
    const otherParticipants = useRemoteParticipants();
    const isOneOnOneCall = otherParticipants.length === 1;
    return (<SpeakerLayout ParticipantViewUISpotlight={isOneOnOneCall ? (<CustomParticipantViewUISpotlight ParticipantViewUI={ParticipantViewUI}/>) : (ParticipantViewUI || DefaultParticipantViewUI)} ParticipantViewUIBar={ParticipantViewUI || DefaultParticipantViewUI} participantsBarPosition={isOneOnOneCall ? null : 'bottom'}/>);
};
