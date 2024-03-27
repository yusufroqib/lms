import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
	client: "",
};

export const streamChatClient = createSlice({
	name: "streamChat",
	initialState,
	reducers: {
		setStreamChatClient: (state, action) => {
			state.client = action.payload;
		},
	
	},
});

// Create a selector using createSelector to extract the client value
export const selectStreamChatClient = createSelector(
	(state) => state.streamChat,
	(streamChat) => streamChat.client
);
export const { setStreamChatClient } = streamChatClient.actions;

export default streamChatClient.reducer;
