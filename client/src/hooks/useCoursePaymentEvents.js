import { useState, useEffect } from 'react';
import { useContractEvent } from 'wagmi';
import { ethers } from 'ethers';

// Assuming CONTRACT_ADDRESS and CONTRACT_ABI are defined elsewhere
const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS';
const CONTRACT_ABI = ['hhyfg']; // Ensure this includes all the event signatures

export function useCoursePaymentEvents(address) {
  const [tutorRegistrations, setTutorRegistrations] = useState([]);
  const [addressUpdates, setAddressUpdates] = useState([]);
  const [latestPurchase, setLatestPurchase] = useState(null)
  const [purchaseHistory, setPurchaseHistory] = useState([])

  const [withdrawals, setWithdrawals] = useState([]);
  const [feeUpdates, setFeeUpdates] = useState([]);

//   useEffect(() => {
//     // Cleanup function to unsubscribe from the event listeners when the component unmounts
//     return () => {
//       // Assuming wagmi provides a way to unsubscribe, otherwise you might need to manage this differently
//     };
//   }, []);

  // Listen to TutorRegistered event
  useContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'TutorRegistered',
    listener: (id, walletAddress, event) => {
      const registration = { id, walletAddress, transactionHash: event.transactionHash, blockNumber: event.blockNumber };
      setTutorRegistrations((prev) => [...prev, registration]);
    },
  });

  // Listen to TutorAddressUpdated event
  useContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'TutorAddressUpdated',
    listener: (id, oldAddress, newAddress, event) => {
      const update = { id, oldAddress, newAddress, transactionHash: event.transactionHash, blockNumber: event.blockNumber };
      setAddressUpdates((prev) => [...prev, update]);
    },
  });

  // Listen to CoursePurchased event
  useContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'CoursePurchased',
    listener(student, tutorId, amount, courseId, event) {
      const newPurchase = {
        student,
        tutorId,
        amount: ethers.utils.formatUnits(amount, 6),
        courseId,
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber,
      }
      setPurchaseHistory(prev => [...prev, newPurchase])
      setLatestPurchase(newPurchase)
    },
  })

  // Listen to TutorWithdrawal event
  useContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'TutorWithdrawal',
    listener: (tutorId, amount, event) => {
      const withdrawal = { tutorId, amount: ethers.utils.formatUnits(amount, 6), transactionHash: event.transactionHash, blockNumber: event.blockNumber };
      setWithdrawals((prev) => [...prev, withdrawal]);
    },
  });

  // Listen to PlatformFeeUpdated event
  useContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'PlatformFeeUpdated',
    listener: (newPercentage, event) => {
      const feeUpdate = { newPercentage, transactionHash: event.transactionHash, blockNumber: event.blockNumber };
      setFeeUpdates((prev) => [...prev, feeUpdate]);
    },
  });

  return { tutorRegistrations, addressUpdates, latestPurchase,purchaseHistory , withdrawals, feeUpdates };
}
