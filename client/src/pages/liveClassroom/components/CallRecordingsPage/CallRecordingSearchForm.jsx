import { useStreamVideoClient, } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState, } from 'react';
export const CallRecordingSearchForm = ({ setLoading, setResult, setResultError, }) => {
    const router = useRouter();
    const videoClient = useStreamVideoClient();
    const [enabled, setEnabled] = useState(false);
    const [callIdInput, setCallIdInput] = useState(null);
    const [callTypeInput, setCallTypeInput] = useState(null);
    const queryRecordings = useCallback(async (callType, callId) => {
        if (!videoClient)
            return;
        const call = videoClient.call(callType, callId);
        try {
            setLoading(true);
            setEnabled(false);
            const { recordings } = await call.queryRecordings();
            setResult(recordings);
            setResultError(undefined);
        }
        catch (err) {
            setResultError(err);
        }
        finally {
            setLoading(false);
        }
    }, [setLoading, setResult, setResultError, setEnabled, videoClient]);
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const callId = callIdInput?.value.trim();
        const callType = callTypeInput?.value.trim();
        if (!(callId && callType))
            return;
        await router.push({
            pathname: '/call-recordings/[...callCid]',
            query: { callCid: [callType, callId] },
        }, undefined, {
            shallow: true,
        });
    }, [callIdInput, callTypeInput, router]);
    const handleChange = useCallback(() => {
        setEnabled(!!(callTypeInput?.value && callIdInput?.value));
        setResult(undefined);
        setResultError(undefined);
    }, [callTypeInput, callIdInput, setResult, setResultError]);
    useEffect(() => {
        const { callCid } = router.query;
        if (callCid?.length && typeof callCid !== 'string') {
            const [callType, callId] = callCid;
            if (!(callId && callType && callIdInput && callTypeInput))
                return;
            callTypeInput.value = callType;
            callIdInput.value = callId;
            queryRecordings(callType, callId).catch((err) => {
                console.error('Error querying recordings', err);
                setResultError(err);
            });
        }
    }, [
        callIdInput,
        callTypeInput,
        router,
        router.query,
        queryRecordings,
        setResultError,
    ]);
    const formId = 'recording-search-form';
    return (<div className="rd__call-recordings-page-form">
      <form onSubmit={handleSubmit} id={formId}>
        <div className="rd__call-recordings-page-form__container">
          <div className="rd__call-type-dropdown-container">
            <input form={formId} ref={setCallTypeInput} className="rd__input rd__input--underlined rd__call-recording-search-input" type="text" onChange={handleChange} placeholder="Call Type" defaultValue="default"/>
          </div>
          <input form={formId} className="rd__input rd__input--underlined rd__call-recording-search-input" type="text" onChange={handleChange} ref={setCallIdInput} placeholder="Call ID"/>
        </div>
        <button disabled={!enabled} className="rd__button rd__button--primary" type="submit">
          Search
        </button>
      </form>
    </div>);
};
