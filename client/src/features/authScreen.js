import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
	authScreenPage: "login",
};

export const authScreenSlice = createSlice({
	name: "authScreen",
	initialState,
	reducers: {
		loginScreen: (state, action) => {
			state.authScreenPage = action.payload;
		},
		signupScreen: (state, action) => {
			state.authScreenPage = action.payload;
		},
	},
});

// Create a selector using createSelector to extract the authScreenPage value
export const selectAuthScreen = createSelector(
	(state) => state.authScreen,
	(authScreen) => authScreen.authScreenPage
);
export const { loginScreen, signupScreen } = authScreenSlice.actions;

export default authScreenSlice.reducer;
