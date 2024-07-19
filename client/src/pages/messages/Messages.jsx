import { useNavigate } from "react-router-dom";
import {
	LoadingIndicator,
	Chat,
	useChatContext,
	ChannelList,
	Channel,
	Window,
	MessageInput,
	MessageList,
	ChannelHeader,
	Thread,
} from "stream-chat-react";
// import { useChatContext } from "stream-chat-react/dist/context";
// import "stream-chat-react/dist/css/index.css";

import 'stream-chat-react/dist/css/v2/index.css';
// import "@/styles/messagesStyles.css";
import useAuth from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useStreamChatClient } from "@/context/StreamChatContext";
import "@/styles/streamChatStyles.css";
// import { CustomMessage } from "./components/CustomMessage";
// import useStreamChat from "@/hooks/useStreamChat";
// import { useLoggedInAuth } from "./context/AuthContext";
 function Messages() {
	const { _id } = useAuth();
	const { streamChatClient } = useStreamChatClient();
	// console.log(streamChatClient);
	// console.log(_id);

	// const { user, streamChatClient } = useLoggedInAuth();
	if (streamChatClient == null) return <LoadingIndicator />;
	return (
		<div className="flex h-full">
			<Chat client={streamChatClient}>
				<ChannelList
					List={Channels}
					sendChannelsToList
					filters={{ members: { $in: [_id] } }}
				/>
				<Channel >
					<Window>
						<ChannelHeader />
						<MessageList />
						<MessageInput />
					</Window>
					<Thread />
				</Channel>
			</Chat>
		</div>
	);
}
function Channels({ loadedChannels }) {
	const navigate = useNavigate();
	// const { logout } = useLoggedInAuth();
	const { setActiveChannel, channel: activeChannel } = useChatContext();
	return (
		<div className="w-full flex flex-col gap-4 m-3 flex-grow">
			<h3 className={'text-xl font-bold'}>Messages</h3>
			<hr className="border-gray-500" />
			{loadedChannels != null && loadedChannels.length > 0
				? loadedChannels.map((channel) => {
						const isActive = channel === activeChannel;
						const extraClasses = isActive
							? "bg-blue-500 text-white"
							: "hover:bg-blue-100 bg-gray-100";
						return (
							<button
								onClick={() => setActiveChannel(channel)}
								disabled={isActive}
								className={`p-4 rounded-lg flex gap-3 items-center ${extraClasses}`}
								key={channel.id}
							>
								{channel.data?.image && (
									<img
										src={channel.data.image}
										className="w-10 h-10 rounded-full object-center object-cover"
									/>
								)}
								<div className="text-ellipsis overflow-hidden whitespace-nowrap">
									{channel.data?.name || channel.id}
								</div>
							</button>
						);
				  })
				: "No Conversations"}
			{/* <hr className="border-gray-500 mt-auto" />
			<Button>Logout</Button> */}
		</div>
	);
}

// export const CustomPinIndicator = () => {
// 	return (
// 		<div>
// 			<div className="italic text-gray-800">pinned</div>
// 		</div>
// 	);
// };
export default Messages