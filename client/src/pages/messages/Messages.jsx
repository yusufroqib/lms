import React, { useState } from "react";
import { Chat } from "stream-chat-react";
// import Cookies from 'universal-cookie';
// import { selectStreamChatClient } from "@/features/streamChatClientSlice";
// import { useSelector } from "react-redux";
import { StreamChat } from "stream-chat";
// import { setStreamChatClient } from "../streamChatClientSlice";

import { ChannelListContainer, ChannelContainer } from "./components";

import "stream-chat-react/dist/css/index.css";
import "@/styles/messagesStyles.css";
import useAuth from "@/hooks/useAuth";

const Messages = () => {
	const [createType, setCreateType] = useState("");
	const [isCreating, setIsCreating] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	// const client = useSelector(selectStreamChatClient);
	// console.log(client)
	const { _id, username, fullName, image, streamToken } = useAuth();
  // console.log(image)

	const apiKey = import.meta.env.VITE_STREAM_API_KEY;
	// const authToken = cookies.get("token");

	const client = StreamChat.getInstance(apiKey);

	if (streamToken) {
		client.connectUser(
			{
				id: _id,
				name: username,
				fullName,
				image,
			},
			streamToken
		);
	}

    console.log(client)
	// if(!client) return <Auth />
	// if(!client) return <Auth />
	// if(!authToken) return <Auth />

	return (
		<div className="app__wrapper p-4 rounded-md">
			<Chat client={client} theme="team light">
				<ChannelListContainer
					isCreating={isCreating}
					setIsCreating={setIsCreating}
					setCreateType={setCreateType}
					setIsEditing={setIsEditing}
				/>
				<ChannelContainer
					isCreating={isCreating}
					setIsCreating={setIsCreating}
					isEditing={isEditing}
					setIsEditing={setIsEditing}
					createType={createType}
				/>
			</Chat>
		</div>
	);
};

export default Messages;
