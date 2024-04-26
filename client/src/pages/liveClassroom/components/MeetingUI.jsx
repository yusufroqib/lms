import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import Gleap from 'gleap';
import { CallingState, defaultSortPreset, LoadingIndicator, noopComparator, useCall, useCallStateHooks, usePersistedDevicePreferences, } from '@stream-io/video-react-sdk';
import { Lobby } from './Lobby';
import { useKeyboardShortcuts, useWakeLock } from '../hooks';
import { ActiveCall } from './ActiveCall';
const contents = {
    'error-join': {
        heading: 'Failed to join the call',
    },
    'error-leave': {
        heading: 'Error when disconnecting',
    },
};
export const MeetingUI = ({ chatClient, mode }) => {
    const [show, setShow] = useState('lobby');
    const [lastError, setLastError] = useState();
    const router = useRouter();
    const activeCall = useCall();
    const { useCallCallingState } = useCallStateHooks();
    const callState = useCallCallingState();
    const onJoin = useCallback(async ({ fastJoin = false } = {}) => {
        if (!fastJoin)
            setShow('loading');
        try {
            const preferredCodec = router.query['video_codec'];
            if (typeof preferredCodec === 'string') {
                activeCall?.camera.setPreferredCodec(preferredCodec);
            }
            await activeCall?.join({ create: true });
            setShow('active-call');
        }
        catch (e) {
            console.error(e);
            setLastError(e);
            setShow('error-join');
        }
    }, [activeCall, router]);
    const onLeave = useCallback(async () => {
       
        setShow('loading');
        try {
            await router.push(`/leave/${activeCall?.id}`);
        }
        catch (e) {
            console.error(e);
            setLastError(e);
            setShow('error-leave');
        }
    }, [router, activeCall?.id]);
    useEffect(() => {
        if (callState === CallingState.LEFT) {
            onLeave().catch(console.error);
        }
    }, [callState, onLeave]);
    useEffect(() => {
        if (!activeCall)
            return;
        return activeCall.on('call.ended', async (e) => {
            if (!e.user || e.user.id === activeCall.currentUserId)
                return;
            alert(`Call ended for everyone by: ${e.user.name || e.user.id}`);
            if (activeCall.state.callingState !== CallingState.LEFT) {
                await activeCall.leave();
            }
            setShow('lobby');
        });
    }, [activeCall, router]);
    useEffect(() => {
        const handlePageLeave = async () => {
            if (activeCall &&
                [CallingState.JOINING, CallingState.JOINED].includes(callState)) {
                await activeCall.leave();
            }
        };
        router.events.on('routeChangeStart', handlePageLeave);
        return () => {
            router.events.off('routeChangeStart', handlePageLeave);
        };
    }, [activeCall, callState, router.events]);
    const isSortingDisabled = router.query['enableSorting'] === 'false';
    useEffect(() => {
        if (!activeCall)
            return;
        // enable sorting via query param feature flag is provided
        if (isSortingDisabled) {
            activeCall.setSortParticipantsBy(noopComparator());
        }
        else {
            activeCall.setSortParticipantsBy(defaultSortPreset);
        }
    }, [activeCall, isSortingDisabled]);
    useKeyboardShortcuts();
    useWakeLock();
    usePersistedDevicePreferences('@pronto/device-preferences');
    // TODO OL: fix race conditions and enable this
    // usePersistedVideoFilter('@pronto/video-filter');
    let ComponentToRender;
    if (show === 'error-join' || show === 'error-leave') {
        ComponentToRender = (<ErrorPage heading={contents[show].heading} error={lastError} onClickHome={() => router.push(`/`)} onClickLobby={() => setShow('lobby')}/>);
    }
    else if (show === 'lobby') {
        ComponentToRender = <Lobby onJoin={onJoin} mode={mode}/>;
    }
    else if (show === 'loading') {
        ComponentToRender = <LoadingScreen />;
    }
    else if (!activeCall) {
        ComponentToRender = (<ErrorPage heading={'Lost active call connection'} onClickHome={() => router.push(`/`)} onClickLobby={() => setShow('lobby')}/>);
    }
    else {
        ComponentToRender = (<ActiveCall activeCall={activeCall} chatClient={chatClient} onLeave={onLeave} onJoin={onJoin}/>);
    }
    return ComponentToRender;
};
const ErrorPage = ({ heading, onClickHome, onClickLobby, error, }) => (<div className="rd__error">
    <div className="rd__error__container">
      <h1 className="rd__error__header">{heading}</h1>
      <div className="rd__error__content">
        {error?.stack && (<div className="rd__error__message">
            <pre>{error.stack}</pre>
          </div>)}
        <p>(see the console for more info)</p>
      </div>

      <div className="rd__error__actions">
        <button data-testid="return-home-button" className="rd__button rd__button--primary" onClick={onClickHome}>
          Return home
        </button>

        <button data-testid="return-home-button" className="rd__button rd__button--secondary" onClick={onClickLobby}>
          Back to lobby
        </button>

      
      </div>
    </div>
  </div>);
export const LoadingScreen = () => {
    const { useCallCallingState } = useCallStateHooks();
    const callingState = useCallCallingState();
    const [message, setMessage] = useState('');
    useEffect(() => {
        if (callingState === CallingState.RECONNECTING) {
            setMessage('Please wait, we are connecting you to the call...');
        }
        else if (callingState === CallingState.JOINED) {
            setMessage('');
        }
    }, [callingState]);
    return (<div className="str-video__call">
      <div className="str-video__call__loading-screen">
        <LoadingIndicator text={message}/>
      </div>
    </div>);
};
