import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { CallingState, CallParticipantsList, CancelCallConfirmButton, CompositeButton, Icon, PermissionRequests, ReactionsButton, RecordCallConfirmationButton, RecordingInProgressNotification, ScreenShareButton, SpeakingWhileMutedNotification, useCallStateHooks, } from '@stream-io/video-react-sdk';
import { ActiveCallHeader } from './ActiveCallHeader';
import { Stage } from './Stage';
import { ChatWrapper } from './ChatWrapper';
import { ChatUI } from './ChatUI';
import { CallStatsSidebar, ToggleStatsButton } from './CallStatsWrapper';
import { ClosedCaptions, ClosedCaptionsSidebar } from './ClosedCaptions';
import { ToggleSettingsTabModal } from './Settings/SettingsTabModal';

import { ToggleMoreOptionsListButton } from './ToggleMoreOptionsListButton';
import { ToggleLayoutButton } from './ToggleLayoutButton';
import { ToggleParticipantListButton } from './ToggleParticipantListButton';
import { ToggleDualCameraButton } from './ToggleDualCameraButton';
import { ToggleDualMicButton } from './ToggleDualMicButton';
import { NewMessageNotification } from './NewMessageNotification';
import { UnreadCountBadge } from './UnreadCountBadge';
import { useBreakpoint, useLayoutSwitcher, useWatchChannel } from '../hooks';

import { ToggleEffectsButton } from './ToggleEffectsButton';
export const ActiveCall = (props) => {
    const { chatClient, activeCall, onLeave, onJoin } = props;
    const { useParticipantCount } = useCallStateHooks();
    const participantCount = useParticipantCount();
    const { layout, setLayout } = useLayoutSwitcher();
    const breakpoint = useBreakpoint();
    useEffect(() => {
        if ((layout === 'SpeakerLeft' || layout === 'SpeakerRight') &&
            (breakpoint === 'xs' || breakpoint === 'sm')) {
            setLayout('SpeakerBottom');
        }
    }, [breakpoint, layout, setLayout]);
    const [sidebarContent, setSidebarContent] = useState(null);
    const showSidebar = sidebarContent != null;
    const showParticipants = sidebarContent === 'participants';
    const showChat = sidebarContent === 'chat';
    const showStats = sidebarContent === 'stats';
    const showClosedCaptions = sidebarContent === 'closed-captions';
    // FIXME: could be replaced with "notification.message_new" but users would have to be at least members
    // possible fix with "allow to join" permissions in place (expensive?)
    const channelWatched = useWatchChannel({
        chatClient,
        channelId: activeCall?.id,
    });
    useEffect(() => {
        // helps with Fast-Refresh
        if (activeCall?.state.callingState === CallingState.IDLE) {
            onJoin({ fastJoin: true });
        }
    }, [activeCall, onJoin]);
 

    return (<div className="rd__call">
      <div className="rd__main-call-panel">
        <ActiveCallHeader selectedLayout={layout} onMenuItemClick={setLayout} onLeave={onLeave}/>

        <PermissionRequests />
        <div className="rd__layout">
          <div className="rd__layout__stage-container">
            <Stage selectedLayout={layout}/>
            <ClosedCaptions />
          </div>

          <div className={clsx('rd__sidebar', showSidebar && 'rd__sidebar--open')}>
            {showSidebar && (<div className="rd__sidebar__container">
                {showParticipants && (<div className="rd__participants">
                    <CallParticipantsList onClose={() => setSidebarContent(null)}/>
                  </div>)}

                {showChat && (<ChatWrapper chatClient={chatClient}>
                    <div className="str-video__chat">
                      <ChatUI onClose={() => {
                  
                    setSidebarContent(null);
                }} channelId={activeCall.id}/>
                    </div>
                  </ChatWrapper>)}

                {showStats && <CallStatsSidebar />}
                { showClosedCaptions && <ClosedCaptionsSidebar />}
              </div>)}
          </div>
        </div>
        <div className="rd__notifications">
          <RecordingInProgressNotification />
          <SpeakingWhileMutedNotification />
        </div>
        <div className="str-video__call-controls" data-testid="str-video__call-controls">
          <div className="str-video__call-controls--group str-video__call-controls--options">
            <div className="str-video__call-controls__desktop" title="Settings">
              <ToggleSettingsTabModal layoutProps={{
            selectedLayout: layout,
            onMenuItemClick: setLayout,
        }} tabModalProps={{
            inMeeting: true,
        }}/>
            </div>
         
        
            <div className="str-video__call-controls__mobile">
              <ToggleMoreOptionsListButton />
            </div>
          </div>
          <div className="str-video__call-controls--group str-video__call-controls--media">
            <RecordCallConfirmationButton />

            <div className="str-video__call-controls__desktop">
              <ScreenShareButton />
            </div>
            <div className="str-video__call-controls__desktop">
              <ToggleEffectsButton />
            </div>

            <div className="str-video__call-controls__desktop">
              <ReactionsButton />
            </div>

            <ToggleDualMicButton />
            <ToggleDualCameraButton />
            <div className="str-video__call-controls__desktop">
              <CancelCallConfirmButton onLeave={onLeave}/>
            </div>
          </div>
          <div className="str-video__call-controls--group str-video__call-controls--sidebar">
            <div className="str-video__call-controls__desktop">
              <ToggleLayoutButton selectedLayout={layout} onMenuItemClick={setLayout}/>
            </div>
           <div className="str-video__call-controls__desktop">
                <CompositeButton active={showClosedCaptions} title="Closed Captions" variant="primary" onClick={() => setSidebarContent(showClosedCaptions ? null : 'closed-captions')}>
                  <Icon icon="closed-captions"/>
                </CompositeButton>
              </div>
            <div className="str-video__call-controls__desktop">
              <ToggleStatsButton active={showStats} onClick={() => setSidebarContent(showStats ? null : 'stats')}/>
            </div>

            <ToggleParticipantListButton active={showParticipants} onClick={() => {
            setSidebarContent(showParticipants ? null : 'participants');
        }}/>
            <NewMessageNotification chatClient={chatClient} channelWatched={channelWatched} disableOnChatOpen={showChat}>
              <div className="str-chat__chat-button__wrapper">
                <CompositeButton active={showChat} disabled={!chatClient} title="Chat" onClick={() => {
         
            setSidebarContent(showChat ? null : 'chat');
        }}>
                  <Icon icon="chat"/>
                </CompositeButton>
                {!showChat && (<UnreadCountBadge channelWatched={channelWatched} chatClient={chatClient} channelId={activeCall.id}/>)}
              </div>
            </NewMessageNotification>
          </div>
        </div>
      </div>
    </div>);
};