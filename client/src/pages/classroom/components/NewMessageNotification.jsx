import { useEffect, useState, useCallback } from 'react';
import { Notification } from '@stream-io/video-react-sdk';
export const NewMessageNotification = ({ children, chatClient: client, channelWatched, disableOnChatOpen = false, }) => {
    const [message, setMessage] = useState(null);
    const resetIsVisible = useCallback(() => {
        setMessage(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [message]);
    useEffect(() => {
        if (!client || !channelWatched || disableOnChatOpen)
            return;
        const handleEvent = (event) => {
            if (event.message)
                setMessage(event.message);
        };
        client.on('message.new', handleEvent);
        return () => client.off('message.new', handleEvent);
    }, [client, channelWatched, disableOnChatOpen]);
    return (<Notification visibilityTimeout={3000} isVisible={!!message} resetIsVisible={resetIsVisible} message={<div className="str-chat__new-message-notification">
          <strong className="str-chat__utility-ellipsis">
            {message?.user?.name ?? message?.user_id}
          </strong>
          <div className="str-chat__utility-ellipsis">{message?.text}</div>
        </div>} placement="top-end">
      {children}
    </Notification>);
};
