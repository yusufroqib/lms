import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
	name: "auth",
	initialState: {
		token: null,
		addInfoDialogOpen: false,
		walletAuthStatus: "unauthenticated",
	},
	reducers: {
		setCredentials: (state, action) => {
			const { accessToken } = action.payload;
			state.token = accessToken;
		},
		setActivationToken: (state, action) => {
			const { activationToken } = action.payload;
			state.activationToken = activationToken;
			// console.log(activationToken)
		},
		setSignUpEmail: (state, action) => {
			const { signUpEmail } = action.payload;
			state.signUpEmail = signUpEmail;
			// console.log(activationToken)
		},
		setAddInfoDialogOpen: (state, action) => {
			const { addInfoDialogOpen } = action.payload;
			state.addInfoDialogOpen = addInfoDialogOpen;
			// console.log(activationToken)
		},

		setWalletAuthStatus: (state, action) => {
			const { walletAuthStatus } = action.payload;
			state.walletAuthStatus = walletAuthStatus;
		},

		logOut: (state, action) => {
			state.token = null;
		},
		setLoggedUser: (state, action) => {
			// console.log(action)
			const { loggedUser } = action.payload;
			state.loggedUser = loggedUser;
			//   console.log(user)
		},
	},
});

export const {
	setCredentials,
	logOut,
	setActivationToken,
	setWalletAuthStatus,
	setUser,
	setLoggedUser,
	setSignUpEmail,
	setAddInfoDialogOpen,
} = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state) => state.auth.token;
export const selectAddInfoDialogOpen = (state) => state.auth.addInfoDialogOpen;
export const selectWalletAuthStatus = (state) => state.auth.walletAuthStatus;
export const selectCurrentActivationToken = (state) =>
	state.auth.activationToken;
export const selectCurrentSignUpEmail = (state) => state.auth.signUpEmail;
