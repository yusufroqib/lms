import { useState } from 'react';
import { useWatchContractEvent } from 'wagmi';
import { formatUnits } from 'viem';

// Assuming CONTRACT_ADDRESS and CONTRACT_ABI are defined elsewhere
const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS';
const CONTRACT_ABI = ['hhyfg']; // Ensure this includes all the event signatures

export function useCoursePaymentEvents(address) {
  const [tutorRegistrations, setTutorRegistrations] = useState([]);
  const [addressUpdates, setAddressUpdates] = useState([]);
  const [latestPurchase, setLatestPurchase] = useState(null);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [feeUpdates, setFeeUpdates] = useState([]);

  // Watch TutorRegistered event
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'TutorRegistered',
    onLogs: (logs) => {
      logs.forEach((log) => {
        const [id, walletAddress] = log.args;
        const registration = { id, walletAddress, transactionHash: log.transactionHash, blockNumber: log.blockNumber };
        setTutorRegistrations((prev) => [...prev, registration]);
      });
    },
  });

  // Watch TutorAddressUpdated event
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'TutorAddressUpdated',
    onLogs: (logs) => {
      logs.forEach((log) => {
        const [id, oldAddress, newAddress] = log.args;
        const update = { id, oldAddress, newAddress, transactionHash: log.transactionHash, blockNumber: log.blockNumber };
        setAddressUpdates((prev) => [...prev, update]);
      });
    },
  });

  // Watch CoursePurchased event
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'CoursePurchased',
    onLogs: (logs) => {
      logs.forEach((log) => {
        const [student, tutorId, amount, courseId] = log.args;
        const newPurchase = {
          student,
          tutorId,
          amount: formatUnits(amount, 6),
          courseId,
          transactionHash: log.transactionHash,
          blockNumber: log.blockNumber,
        };
        setPurchaseHistory(prev => [...prev, newPurchase]);
        setLatestPurchase(newPurchase);
      });
    },
  });

  // Watch TutorWithdrawal event
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'TutorWithdrawal',
    onLogs: (logs) => {
      logs.forEach((log) => {
        const [tutorId, amount] = log.args;
        const withdrawal = { tutorId, amount: formatUnits(amount, 6), transactionHash: log.transactionHash, blockNumber: log.blockNumber };
        setWithdrawals((prev) => [...prev, withdrawal]);
      });
    },
  });

  // Watch PlatformFeeUpdated event
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'PlatformFeeUpdated',
    onLogs: (logs) => {
      logs.forEach((log) => {
        const [newPercentage] = log.args;
        const feeUpdate = { newPercentage, transactionHash: log.transactionHash, blockNumber: log.blockNumber };
        setFeeUpdates((prev) => [...prev, feeUpdate]);
      });
    },
  });

  return { tutorRegistrations, addressUpdates, latestPurchase, purchaseHistory, withdrawals, feeUpdates };
}