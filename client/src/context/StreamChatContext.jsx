import { createContext, useContext, useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import useAuth from "@/hooks/useAuth";

const apiKey = import.meta.env.VITE_STREAM_API_KEY;

const Context = createContext(null);

export function useStreamChatClient() {
    return useContext(Context);
}

export function StreamChatProvider({ children }) {
    const [streamChatClient, setStreamChatClient] = useState(null);
    const { _id, username, fullName, image, streamToken } = useAuth();


    useEffect(() => {
        if (streamToken == null || _id == null) return;

        // Check if StreamChat is already initialized and connected
        if (streamChatClient && streamChatClient.userID === _id && streamChatClient.tokenManager.token === streamToken) {
			console.log('returning now........')
            return; // No need to reconnect
        }

        const chat = new StreamChat(apiKey);

        // Connect to StreamChat
        chat.connectUser(
            {
                id: _id,
                name: username,
                fullName,
                image,
            },
            streamToken
        ).then(() => {
            setStreamChatClient(chat);
        });

        return () => {
            // Disconnect from StreamChat when component unmounts
            if (streamChatClient) {
                streamChatClient.disconnectUser();
                setStreamChatClient(null);
            }
        };
    }, [streamToken, _id, username, fullName, image]);

    return (
        <Context.Provider value={{ streamChatClient }}>
            {children}
        </Context.Provider>
    );
}
