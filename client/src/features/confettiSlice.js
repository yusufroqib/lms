import { createSelector, createSlice } from "@reduxjs/toolkit";

const confettiSlice = createSlice({
	name: "confetti",
	initialState: {
		isOpen: false,
	},
	reducers: {
		openConfetti: (state) => {
			state.isOpen = true;
		},
		closeConfetti: (state) => {
			state.isOpen = false;
		},
	},
});

export const { openConfetti, closeConfetti } = confettiSlice.actions;

export const selectConfettiIsOpen = createSelector(
	(state) => state.confetti,
	(confetti) => confetti.isOpen
);
export default confettiSlice.reducer;
