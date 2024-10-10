import { createAuthenticationAdapter } from "@rainbow-me/rainbowkit";
import { SiweMessage } from "siwe";

const authenticationAdapter = createAuthenticationAdapter({
	getNonce: async () => {
		const response = await fetch("http://localhost:3000/nonce");
		const { nonce } = await response.json();
		return nonce;
	},

	createMessage: ({ nonce, address, chainId }) => {
		return new SiweMessage({
			domain: window.location.host,
			address,
			statement:
				"Verify your account. To finish connecting, you must sign this message to verify that you are the owner of this account.",
			uri: window.location.origin,
			version: "1",
			chainId,
			nonce,
		});
	},

	getMessageBody: ({ message }) => {
		return message.prepareMessage();
	},

	verify: async ({ message, signature }) => {
		const response = await fetch("http://localhost:3000/nonce/verify", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ message, signature }),
		});
		console.log(response);
		return response.ok;
	},
});

export default authenticationAdapter;
