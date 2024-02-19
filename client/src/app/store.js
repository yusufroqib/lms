import authScreenReducer from "@/features/authScreen";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
	reducer: {
		authScreen: authScreenReducer,
	},
	devTools: true,
});
