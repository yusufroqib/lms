import { useCallback } from 'react';
import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { ethers } from 'ethers';

const COURSE_PAYMENT_ADDRESS = 'YOUR_COURSE_PAYMENT_CONTRACT_ADDRESS';
const COURSE_PAYMENT_ABI = ["bnghj"]; // Your CoursePayment contract ABI here

export function useCoursePayment() {
  // Register Tutor
  const { config: registerConfig } = usePrepareContractWrite({
    address: COURSE_PAYMENT_ADDRESS,
    abi: COURSE_PAYMENT_ABI,
    functionName: 'registerTutor',
  });
  const { write: registerTutor } = useContractWrite(registerConfig);

  // Update Tutor Address
  const { config: updateAddressConfig } = usePrepareContractWrite({
    address: COURSE_PAYMENT_ADDRESS,
    abi: COURSE_PAYMENT_ABI,
    functionName: 'updateTutorAddress',
  });
  const { write: updateTutorAddress } = useContractWrite(updateAddressConfig);

  // Withdraw Tutor Balance
  const { config: withdrawConfig } = usePrepareContractWrite({
    address: COURSE_PAYMENT_ADDRESS,
    abi: COURSE_PAYMENT_ABI,
    functionName: 'withdrawTutorBalance',
  });
  const { write: withdrawTutorBalance } = useContractWrite(withdrawConfig);

  // Purchase Course
  const { config: purchaseConfig } = usePrepareContractWrite({
    address: COURSE_PAYMENT_ADDRESS,
    abi: COURSE_PAYMENT_ABI,
    functionName: 'purchaseCourse',
  });
  const {data: purchaseData, write: purchaseCourse } = useContractWrite(purchaseConfig);
  const { isLoading: isPurchaseProcessing, isSuccess: isPurchaseComplete } = useWaitForTransaction({
    hash: purchaseData?.hash,
  })

  // Get Tutor Balance
  const getTutorBalance = useCallback((tutorId) => {
    return useContractRead({
      address: COURSE_PAYMENT_ADDRESS,
      abi: COURSE_PAYMENT_ABI,
      functionName: 'getTutorBalance',
      args: [tutorId],
    });
  }, []);

  // Get Total Tutor Balances
  const { data: totalTutorBalances, isError: isTotalBalancesError, isLoading: isTotalBalancesLoading } = useContractRead({
    address: COURSE_PAYMENT_ADDRESS,
    abi: COURSE_PAYMENT_ABI,
    functionName: 'getTotalTutorBalances',
  });

  // Get Platform Fee
  const { data: platformFee, isError: isPlatformFeeError, isLoading: isPlatformFeeLoading } = useContractRead({
    address: COURSE_PAYMENT_ADDRESS,
    abi: COURSE_PAYMENT_ABI,
    functionName: 'getPlatformFee',
  });

  // Format balances
  const formattedTotalTutorBalances = totalTutorBalances ? ethers.utils.formatUnits(totalTutorBalances, 6) : '0';
  const formattedPlatformFee = platformFee ? ethers.utils.formatUnits(platformFee, 6) : '0';

  return {
    registerTutor: (tutorId) => registerTutor?.({ args: [tutorId] }),
    updateTutorAddress: (tutorId) => updateTutorAddress?.({ args: [tutorId] }),
    withdrawTutorBalance: (tutorId, amount) => withdrawTutorBalance?.({ args: [tutorId, ethers.utils.parseUnits(amount, 6)] }),
    purchaseCourse: (tutorId, amount, courseId) => purchaseCourse?.({ args: [tutorId, ethers.utils.parseUnits(amount, 6), courseId] }),
    getTutorBalance,
    totalTutorBalances: formattedTotalTutorBalances,
    platformFee: formattedPlatformFee,
    isPurchaseLoading,
    isPurchaseProcessing,
    isPurchaseComplete,
    isTotalBalancesError,
    isTotalBalancesLoading,
    isPlatformFeeError,
    isPlatformFeeLoading,
  };
}