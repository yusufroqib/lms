export const COURSE_PAYMENT_CA = "0x3A16cab6f258Ee0385DE64B23Cf3F9E2de838a92";
export const USDC_CA = "0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B";
export const USDC_ABI = [
	{
		constant: true,
		inputs: [{ name: "_owner", type: "address" }],
		name: "balanceOf",
		outputs: [{ name: "balance", type: "uint256" }],
		type: "function",
	},
	{
		constant: false,
		inputs: [
			{ name: "_spender", type: "address" },
			{ name: "_value", type: "uint256" },
		],
		name: "approve",
		outputs: [{ name: "", type: "bool" }],
		type: "function",
	},
	{
		constant: true,
		inputs: [
			{ name: "_owner", type: "address" },
			{ name: "_spender", type: "address" },
		],
		name: "allowance",
		outputs: [{ name: "", type: "uint256" }],
		type: "function",
	},
	{
		constant: false,
		inputs: [
			{ name: "_to", type: "address" },
			{ name: "_value", type: "uint256" },
		],
		name: "transfer",
		outputs: [{ name: "", type: "bool" }],
		type: "function",
	},
	{
		constant: false,
		inputs: [
			{ name: "_from", type: "address" },
			{ name: "_to", type: "address" },
			{ name: "_value", type: "uint256" },
		],
		name: "transferFrom",
		outputs: [{ name: "", type: "bool" }],
		type: "function",
	},
];
export const COURSE_PAYMENT_ABI = [
	{
		inputs: [
			{
				internalType: "address",
				name: "_usdcTokenAddress",
				type: "address",
			},
		],
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "target",
				type: "address",
			},
		],
		name: "AddressEmptyCode",
		type: "error",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "account",
				type: "address",
			},
		],
		name: "AddressInsufficientBalance",
		type: "error",
	},
	{
		inputs: [],
		name: "FailedInnerCall",
		type: "error",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address",
			},
		],
		name: "OwnableInvalidOwner",
		type: "error",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "account",
				type: "address",
			},
		],
		name: "OwnableUnauthorizedAccount",
		type: "error",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address",
			},
		],
		name: "SafeERC20FailedOperation",
		type: "error",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "address",
				name: "student",
				type: "address",
			},
			{
				indexed: false,
				internalType: "string",
				name: "tutorId",
				type: "string",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "string",
				name: "courseId",
				type: "string",
			},
		],
		name: "CoursePurchased",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "previousOwner",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "newOwner",
				type: "address",
			},
		],
		name: "OwnershipTransferred",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "newPercentage",
				type: "uint256",
			},
		],
		name: "PlatformFeeUpdated",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "string",
				name: "id",
				type: "string",
			},
			{
				indexed: false,
				internalType: "address",
				name: "oldAddress",
				type: "address",
			},
			{
				indexed: false,
				internalType: "address",
				name: "newAddress",
				type: "address",
			},
		],
		name: "TutorAddressUpdated",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "string",
				name: "id",
				type: "string",
			},
			{
				indexed: false,
				internalType: "address",
				name: "walletAddress",
				type: "address",
			},
		],
		name: "TutorRegistered",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "string",
				name: "tutorId",
				type: "string",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
		],
		name: "TutorWithdrawal",
		type: "event",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_user",
				type: "address",
			},
			{
				internalType: "uint256",
				name: "_amount",
				type: "uint256",
			},
		],
		name: "checkAllowance",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "emergencyWithdraw",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "getContractBalance",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "getPlatformFee",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "getTotalTutorBalances",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "string",
				name: "_tutorId",
				type: "string",
			},
		],
		name: "getTutorBalance",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "owner",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "platformFeePercentage",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "string",
				name: "_tutorId",
				type: "string",
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
			{
				internalType: "string",
				name: "_courseId",
				type: "string",
			},
		],
		name: "purchaseCourse",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "string",
				name: "_id",
				type: "string",
			},
		],
		name: "registerTutor",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "renounceOwnership",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "newOwner",
				type: "address",
			},
		],
		name: "transferOwnership",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		name: "tutorIds",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "string",
				name: "",
				type: "string",
			},
		],
		name: "tutorsById",
		outputs: [
			{
				internalType: "string",
				name: "id",
				type: "string",
			},
			{
				internalType: "address",
				name: "walletAddress",
				type: "address",
			},
			{
				internalType: "uint256",
				name: "balance",
				type: "uint256",
			},
			{
				internalType: "bool",
				name: "isRegistered",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "newFeePercentage",
				type: "uint256",
			},
		],
		name: "updatePlatformFeePercentage",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "string",
				name: "_id",
				type: "string",
			},
			{
				internalType: "address",
				name: "_newAddress",
				type: "address",
			},
		],
		name: "updateTutorAddress",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "usdcToken",
		outputs: [
			{
				internalType: "contract IERC20",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "string",
				name: "_tutorId",
				type: "string",
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
		],
		name: "withdrawTutorBalance",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
];
