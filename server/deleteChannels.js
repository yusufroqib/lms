const StreamChat = require("stream-chat").StreamChat;
const dotenv = require("dotenv");
dotenv.config();

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID; // Note: app_id is not used in the provided initialization but is often required for other operations

// Initialize the client with your API key and secret
const client = new StreamChat(api_key, api_secret);

async function deleteChannelsOfType(channelType) {
	try {
		const filter = { type: channelType };

		const response = await client.queryChannels(filter);

		console.log(`Found ${response.length} channels of type '${channelType}'.`);

		const newRes = response.map((channel) => {
			return channel.data.cid;
		});
    
		console.log(newRes);
		const result = await client.deleteChannels(
			[
				"videocall:fbfd538d-48b7-4f57-9402-952e386bf3f8",
		
			],
			{ hard_delete: true }
		);
		console.log(result);

		// console.log(response[1].data.id)

		// for (const channel of response) {
		//   try {
		//     await client.delete(channel.data.id);
		//     console.log(`Deleted channel ${channel.data.id}`);
		//   } catch (error) {
		//     console.error(`Failed to delete channel ${channel.dataid}:`, error);
		//   }
		// }
	} catch (error) {
		console.error("Error querying or deleting channels:", error.message);
	}
}

// Example usage
deleteChannelsOfType("videocall") // Replace 'your_channel_type_here' with the actual channel type
	.then(() => console.log("All channels deleted successfully"))
	.catch((error) => console.error("Error deleting channels:", error));
