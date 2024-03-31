import { createContext, useContext, useEffect, useState, } from "react";

import { StreamChat } from "stream-chat";
import useAuth from "@/hooks/useAuth";
const apiKey = import.meta.env.VITE_STREAM_API_KEY;

const Context = createContext(null);
export function useStreamChat() {
    return useContext(Context);
}

export function StreamChatProvider({ children }) {

    const [streamChat, setStreamChat] = useState(null);
	const { _id, username, fullName, image, streamToken } = useAuth();

	const chat = new StreamChat(apiKey);

	if (streamToken) {
		chat.connectUser(
			{
				id: _id,
				name: username,
				fullName,
				image,
			},
			streamToken
		);
	}

	useEffect(() => {
		// const initializeChatClient = async () => {
		if (streamToken == null || _id == null) return;
		const chat = new StreamChat(apiKey);
		if (chat.tokenManager.token === streamToken && chat.userID === _id) return;
		let isInterrupted = false;
		const connectPromise = chat
			.connectUser(
				{
					id: _id,
					name: username,
					fullName,
					image,
				},
				streamToken
			)
			.then(() => {
				if (isInterrupted) return;
				setStreamChat(chat);
			});
		// };

		// initializeChatClient();
		return () => {
			isInterrupted = true;
			setStreamChat(undefined);
			connectPromise.then(() => {
				chat.disconnectUser();
			});
		};
	}, [streamToken, _id]);
  
    return (<Context.Provider value={{  streamChat }}>
      {children}
    </Context.Provider>);
}
