import { CallRecordingListItem, LoadingIndicator, StreamVideo, StreamVideoClient, } from '@stream-io/video-react-sdk';
import { useEffect, useState } from 'react';
import { CallRecordingSearchForm } from './CallRecordingSearchForm';
import { DefaultAppHeader } from '../DefaultAppHeader';
export const CallRecordingsPage = ({ apiKey, user, userToken, }) => {
    const [recordings, setRecordings] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [videoClient, setVideoClient] = useState();
    useEffect(() => {
        const _client = new StreamVideoClient({
            apiKey,
            user,
            token: userToken,
        });
        setVideoClient(_client);
        // @ts-ignore - for debugging
        window.client = _client;
        return () => {
            _client
                .disconnectUser()
                .catch((e) => console.error(`Couldn't disconnect user`, e));
            setVideoClient(undefined);
        };
    }, [apiKey, user, userToken]);
    if (!videoClient) {
        return null;
    }
    return (<StreamVideo client={videoClient} >
      <DefaultAppHeader />
      <div className="rd__call-recordings-page">
        <div className="rd__call-recordings-page__container">
          <CallRecordingSearchForm setResult={setRecordings} setResultError={setError} setLoading={setLoading}/>
          {loading ? (<LoadingIndicator />) : error?.message ? (<div>{error.message}</div>) : (<div className="rd__call-recordings-page__recordings-list">
              {!recordings
                ? null
                : recordings.length
                    ? recordings.map((recording) => (<CallRecordingListItem recording={recording} key={recording.filename}/>))
                    : 'No recordings found for the call'}
            </div>)}
        </div>
      </div>
    </StreamVideo>);
};
