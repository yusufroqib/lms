import { useCallback } from "react";
import {
	useReadContract,
	useWriteContract,
	useAccount,
	useSwitchChain,
} from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import toast from "react-hot-toast";
import useAuth from "./useAuth";
import truncateWalletAddress from "@/lib/truncateWalletAddress";
import { CERTIFICATE_ABI, CERTIFICATE_CA } from "@/contracts/certificate";

const CORRECT_CHAIN_ID = parseInt(import.meta.env.VITE_CHAIN_ID, 10);

export function useCertificate() {
	const { address, isConnected, chain } = useAccount();
	const { openConnectModal } = useConnectModal();
	const { switchChain } = useSwitchChain();
	const { paymentWallet } = useAuth();

	const truncateAddress = truncateWalletAddress(paymentWallet);

	const checkConnectionAndChain = useCallback(async () => {
		if (!isConnected) {
			toast.error("Please connect your wallet.");
			openConnectModal?.();
			return false;
		}
		if (paymentWallet && paymentWallet !== address) {
			toast.error(`Please connect the correct wallet ${truncateAddress}.`);
			return false;
		}
		if (chain?.id !== CORRECT_CHAIN_ID) {
			toast.error("Switching to the correct network...");
			try {
				switchChain({ chainId: CORRECT_CHAIN_ID });
				return false;
			} catch (error) {
				console.error("Failed to switch network:", error);
				toast.error("Failed to switch network. Please switch manually.");
				return false;
			}
		}
		return true;
	}, [
		isConnected,
		openConnectModal,
		chain,
		switchChain,
		paymentWallet,
		address,
	]);

	const wrapWithConnectionAndChainCheck = useCallback(
		(writeFunction) => {
			return async (...args) => {
				if (await checkConnectionAndChain()) {
					return writeFunction(...args);
				}
			};
		},
		[checkConnectionAndChain]
	);

	const {
		writeContract: mintCertificateRaw,
		data: mintCertificateHash,
		isPending: isMintCertificatePending,
		error: mintCertificateError,
	} = useWriteContract();

	const mintCertificate = wrapWithConnectionAndChainCheck(
		(studentId, courseId, tokenURI) =>
			mintCertificateRaw({
				address: CERTIFICATE_CA,
				abi: CERTIFICATE_ABI,
				functionName: "mintCertificate",
				args: [studentId, courseId, tokenURI],
			})
	);

	const getStudentCertificate = useCallback((studentId, courseId) => {
		return useReadContract({
			address: CERTIFICATE_CA,
			abi: CERTIFICATE_ABI,
			functionName: "studentCertificates",
			args: [studentId, courseId],
		});
	}, []);

	const getTokenURI = useCallback((tokenId) => {
		return useReadContract({
			address: CERTIFICATE_CA,
			abi: CERTIFICATE_ABI,
			functionName: "tokenURI",
			args: [tokenId],
		});
	}, []);

	return {
		mintCertificate,
		mintCertificateHash,
		isMintCertificatePending,
		mintCertificateError:
			mintCertificateError?.cause?.code === 4001
				? "User denied transaction signature."
				: mintCertificateError?.cause?.reason,
		getStudentCertificate,
        getTokenURI
	};
}
