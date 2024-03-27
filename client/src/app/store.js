import authScreenReducer from "@/features/authScreenSlice";
import { configureStore } from "@reduxjs/toolkit"
import { apiSlice } from './api/apiSlice'
import { setupListeners } from "@reduxjs/toolkit/query"
import authReducer from '../features/auth/authSlice'
import confettiReducer from "@/features/confettiSlice"
import streamChatClientReducer from "@/features/streamChatClientSlice";


export const store = configureStore({
	reducer: {
		[apiSlice.reducerPath]: apiSlice.reducer,
		auth: authReducer,
		authScreen: authScreenReducer,
		confetti: confettiReducer,
		streamChat: streamChatClientReducer,

	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(apiSlice.middleware),
	devTools: true,
});

setupListeners(store.dispatch)