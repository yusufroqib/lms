import { useEffect, useState } from 'react';
// import { useUser } from '@clerk/nextjs';
import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import useAuth from './useAuth';
import { useParams } from 'react-router-dom';
export const useGetCalls = () => {
    // const { user } = useUser();
    const client = useStreamVideoClient();
    const { _id } = useAuth();
	const { classroomId } = useParams();
    const [calls, setCalls] = useState();
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const loadCalls = async () => {
            if (!client || !_id)
                return;
            setIsLoading(true);
            try {
                // https://getstream.io/video/docs/react/guides/querying-calls/#filters
                const { calls } = await client.queryCalls({
                    sort: [{ field: 'starts_at', direction: -1 }],
                    filter_conditions: {
                        starts_at: { $exists: true },
                        $or: [
                            { created_by_user_id: _id },
                            { members: { $in: [_id] } },
                        ],
                        'custom.classroomId': classroomId, // Add this line
                    },
                });
                setCalls(calls);
            }
            catch (error) {
                console.error(error);
            }
            finally {
                setIsLoading(false);
            }
        };
        loadCalls();
    }, [client, _id]);
    const now = new Date();
    const endedCalls = calls?.filter(({ state: { startsAt, endedAt } }) => {
        return (startsAt && new Date(startsAt) < now) && !!endedAt;
    });
    const upcomingCalls = calls?.filter(({ state: { startsAt } }) => {
        return startsAt && new Date(startsAt) > now;
    });
    const ongoingCalls = calls?.filter(({ state: { startsAt, endedAt } }) => {
        return (startsAt && new Date(startsAt) < now) && !endedAt;
    });
    return { ongoingCalls, endedCalls, upcomingCalls, callRecordings: calls, isLoading };
};
