"use client";
import ReactConfetti from "react-confetti";
import { useDispatch, useSelector } from "react-redux";
import { closeConfetti, selectConfettiIsOpen } from "@/features/confettiSlice";

export const ConfettiProvider = () => {
	// const confetti = useConfettiStore();
	const confettiIsOpen = useSelector(selectConfettiIsOpen);
	const dispatch = useDispatch();

	if (!confettiIsOpen) return null;
	return (
		<ReactConfetti
			className="pointer-events-none  z-[100] "
			numberOfPieces={500}
			recycle={false}
			onConfettiComplete={() => {
				// confetti.onClose();
				dispatch(closeConfetti());
			}}
		/>
	);
};
