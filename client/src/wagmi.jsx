import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
	getDefaultConfig,
	RainbowKitAuthenticationProvider,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import {
	arbitrumSepolia,
	celo,
	celoAlfajores,
	liskSepolia,
} from "wagmi/chains";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAuthenticationAdapter } from "@rainbow-me/rainbowkit";
import { SiweMessage } from "siwe";
import useAuth from "./hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import {
	selectWalletAuthStatus,
	setAddInfoDialogOpen,
	setWalletAuthStatus,
} from "./features/auth/authSlice";
import {
	useHandleVerifyWalletMutation,
	useRefreshMutation,
} from "./features/auth/authApiSlice";
import toast from "react-hot-toast";
import { AuthCheck } from "./features/auth/AuthCheck";

const config = getDefaultConfig({
	appName: "Learniverse",
	projectId: "044601f65212332475a09bc14ceb3c34",
	chains: [celoAlfajores, celo, arbitrumSepolia, liskSepolia],
});

const queryClient = new QueryClient();
const baseUrl = import.meta.env.VITE_SERVER_BASE_URL;

export const WagmiConfigProvider = ({ children }) => {
	// const [open, setOpen] = useState(false);
	const { _id: userId } = useAuth();
	const [status, setStatus] = useState("unauthenticated");
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [handleVerifyWallet] = useHandleVerifyWalletMutation();
	const walletAuthStatus = useSelector(selectWalletAuthStatus);
	const location = useLocation();
	const [refresh] = useRefreshMutation();
	console.log(walletAuthStatus);

	// useEffect(() => {
	// 	if (!connectedWallets.includes(address)) {
	// 		setStatus("unauthenticated");
	// 	}
	// 	//  else if (userId) {
	// 	// 	setStatus("authenticated");
	// 	// }
	// }, [userId]);

	const handleVerify = async ({ message, signature }) => {
		try {
			const response = await handleVerifyWallet({
				message,
				signature,
				userId,
			}).unwrap();
			
			if (response.requireAdditionalInfo) {
				dispatch(setWalletAuthStatus({ walletAuthStatus: "authenticated" }));
				// setStatus("authenticated");
				dispatch(setAddInfoDialogOpen({ addInfoDialogOpen: true }));
			} else {
				dispatch(setWalletAuthStatus({ walletAuthStatus: "authenticated" }));
				if (location.pathname.includes("auth")) {
					navigate("/dashboard");
				}
				// await refresh().unwrap();
			}
		} catch (error) {
			// setStatus("unauthenticated");
			dispatch(setWalletAuthStatus({ walletAuthStatus: "unauthenticated" }));

			toast.error(error?.data?.error ?? "Failed to sign message");
			console.log(error);
		}
	};

	const authenticationAdapter = createAuthenticationAdapter({
		getNonce: async () => {
			const response = await fetch(`${baseUrl}/nonce`);
			const { nonce } = await response.json();
			return nonce;
		},
		createMessage: ({ nonce, address, chainId }) => {
			return new SiweMessage({
				domain: window.location.host,
				address,
				statement:
					"Verify your account. To finish connecting to Learniverse, you must sign this message to verify that you are the owner of this account.",
				uri: window.location.origin,
				version: "1",
				chainId,
				nonce,
			});
		},
		getMessageBody: ({ message }) => {
			return message.prepareMessage();
		},
		verify: handleVerify,
		signOut: async () => {
			setStatus("unauthenticated");
		},
	});

	return (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<RainbowKitAuthenticationProvider
					adapter={authenticationAdapter}
					status={walletAuthStatus}
					// enabled={false}
				>
					<RainbowKitProvider
						appInfo={{
							appName: "Learniverse",
						}}
					>
						<AuthCheck walletAuthStatus={walletAuthStatus} />
						{children}
					</RainbowKitProvider>
				</RainbowKitAuthenticationProvider>
			</QueryClientProvider>
		</WagmiProvider>
	);
};
