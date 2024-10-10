import { apiSlice } from "../../app/api/apiSlice";
import { logOut, setCredentials } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		signUp: builder.mutation({
			query: (credentials) => ({
				url: "/auth/signup",
				method: "POST",
				body: { ...credentials },
			}),
		}),
		addInfo: builder.mutation({
			query: (credentials) => ({
				url: "/auth/additional-info",
				method: "POST",
				body: { ...credentials },
			}),
		}),
		verifySignUpOTP: builder.mutation({
			query: (credentials) => ({
				url: "/auth/activate-account",
				method: "POST",
				body: { ...credentials },
			}),
		}),
        verifyDeviceOTP: builder.mutation({
			query: (credentials) => ({
				url: "/auth/verify-device",
				method: "POST",
				body: { ...credentials },
			}),
		}),
		handleVerifyWallet: builder.mutation({
			query: (credentials) => ({
				url: "/nonce/verify",
				method: "POST",
				body: { ...credentials },
			}),
		}),
		login: builder.mutation({
			query: (credentials) => ({
				url: "/auth/login",
				method: "POST",
				body: { ...credentials },
			}),
			keepUnusedDataFor: Infinity,
		}),
		sendLogout: builder.mutation({
			query: () => ({
				url: "/auth/logout",
				method: "POST",
			}),
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					console.log(data);
					dispatch(logOut());
					setTimeout(() => {
						dispatch(apiSlice.util.resetApiState());
					}, 1000);
				} catch (err) {
					console.log(err);
				}
			},
		}),
		refresh: builder.mutation({
			query: () => ({
				url: "/refresh",
				method: "GET",
			}),
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					// console.log(data)
					const { accessToken } = data;
					dispatch(setCredentials({ accessToken }));
				} catch (err) {
					console.log(err);
				}
			},
		}),
	}),
});

export const {
	useSignUpMutation,
	useAddInfoMutation,
    useHandleVerifyWalletMutation,
	useVerifySignUpOTPMutation,
    useVerifyDeviceOTPMutation,
	useLoginMutation,
	useSendLogoutMutation,
	useRefreshMutation,
} = authApiSlice;
