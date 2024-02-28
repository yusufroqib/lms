import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
	authScreenPage: "login",
};

export const authScreenSlice = createSlice({
	name: "authScreen",
	initialState,
	reducers: {
		setAuthScreen: (state, action) => {
			state.authScreenPage = action.payload;
		},
	
	},
});

// Create a selector using createSelector to extract the authScreenPage value
export const selectAuthScreen = createSelector(
	(state) => state.authScreen,
	(authScreen) => authScreen.authScreenPage
);
export const { setAuthScreen } = authScreenSlice.actions;

export default authScreenSlice.reducer;
