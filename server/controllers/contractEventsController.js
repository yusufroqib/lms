const Course = require("../models/CourseModel");
const User = require("../models/UserModel");
const {
	COURSE_PAYMENT_CA,
	COURSE_PAYMENT_ABI,
} = require("../contracts/coursePayment");
const { ethers, Contract } = require("ethers");
const { CERTIFICATE_ABI, CERTIFICATE_CA } = require("../contracts/certificate");
const Certificate = require("../models/CertificateModel");
const { createStreamChatClient } = require("../utils/createStreamChatClient");
const ClassroomModel = require("../models/ClassroomModel");

require("dotenv").config();

let provider;
let coursePaymentContract;

const setupWebSocketProvider = () => {
	provider = new ethers.WebSocketProvider(
		"wss://alfajores-forno.celo-testnet.org/ws"
	);
	coursePaymentContract = new Contract(
		COURSE_PAYMENT_CA,
		COURSE_PAYMENT_ABI,
		provider
	);
	certificateContract = new Contract(CERTIFICATE_CA, CERTIFICATE_ABI, provider);

	provider.on("error", (error) => {
		console.error("WebSocket Error:", error);
		reconnect();
	});

	// provider.on('connection_error', (error) => {
	//     console.error('WebSocket Connection Error:', error);
	//     reconnect();
	// });

	// provider.on('disconnect', (error) => {
	//     console.log('WebSocket Disconnected:', error);
	//     reconnect();
	// });

	setupEventListeners();
};

const reconnect = () => {
	console.log("Attempting to reconnect...");
	setTimeout(setupWebSocketProvider, 5000); // Wait for 5 seconds before reconnecting
};

const setupEventListeners = () => {
	// TutorRegistered event
	coursePaymentContract.on("TutorRegistered", async (id, walletAddress) => {
		try {
			const user = await User.findOneAndUpdate(
				{ connectedWallets: walletAddress },
				{ $set: { paymentWallet: walletAddress } },
				{ new: true }
			);
			console.log(`Tutor registered: ${id}, ${walletAddress}`);
		} catch (error) {
			console.error("Error updating tutor registration:", error);
		}
	});

	// TutorAddressUpdated event
	coursePaymentContract.on(
		"TutorAddressUpdated",
		async (id, oldAddress, newAddress) => {
			try {
				const user = await User.findOneAndUpdate(
					{ connectedWallets: oldAddress },
					{ $set: { paymentWallet: newAddress } },
					{ new: true }
				);
				console.log(
					`Tutor address updated: ${id}, ${oldAddress} -> ${newAddress}`
				);
			} catch (error) {
				console.error("Error updating tutor address:", error);
			}
		}
	);

	// CoursePurchased event
	coursePaymentContract.on(
		"CoursePurchased",
		async (student, tutorId, amount, courseId, event) => {
			try {
				const user = await User.findOne({ connectedWallets: student });
				const course = await Course.findById(courseId);
				const courseClassroom = await ClassroomModel.findOne({ course: courseId });
				const client = createStreamChatClient();

				if (user && course) {
					const txHash = event.log.transactionHash;

					await User.findByIdAndUpdate(user._id, {
						$push: {
							transactions: {
								type: "purchase",
								paymentMethod: "crypto",
								amount: ethers.formatUnits(amount, 6),
								status: "completed",
								courseId: course._id,
								createdAt: new Date(),
								txHash: txHash,
							},
							enrolledCourses: {
								course: course._id,
								lastStudiedAt: new Date(),
							},
						},
					});

					courseClassroom.students.push(user._id);
					await courseClassroom.save();

					const channel = client.channel("messaging", courseId);
					await channel.addMembers([
						{ user_id: user._id, channel_role: "channel_member" },
					]);

					await Course.findByIdAndUpdate(course._id, {
						$push: {
							purchasedBy: {
								user: user._id,
								amount: ethers.formatUnits(amount, 6),
								date: new Date(),
							},
						},
					});

					console.log(
						`Course purchased: ${student}, ${tutorId}, ${amount}, ${courseId}`
					);
				}
			} catch (error) {
				console.error("Error processing course purchase:", error);
			}
		}
	);

	// TutorWithdrawal event
	coursePaymentContract.on(
		"TutorWithdrawal",
		async (tutorId, amount, event) => {
			console.log({ withdrawal: event.log.transactionHash });
			try {
				const user = await User.findOne({ _id: tutorId });
				if (user) {
					const txHash = event.log.transactionHash;

					await User.findByIdAndUpdate(user._id, {
						$push: {
							transactions: {
								type: "payout",
								paymentMethod: "crypto",
								amount: ethers.formatUnits(amount, 6),
								status: "completed",
								createdAt: new Date(),
								txHash: txHash,
							},
						},
					});
				}
				console.log(`Tutor withdrawal: ${tutorId}, ${amount}`);
			} catch (error) {
				console.error("Error processing tutor withdrawal:", error);
			}
		}
	);
	
	certificateContract.on(
		"CertificateMinted",
		async (NFTId, walletAddress, studentId, courseId, event) => {
			// console.log(NFTId, walletAddress, studentId, courseId, )
			try {
				const txHash = event.log.transactionHash;
				console.log({ txHash });

				// Update or create the certificate
				const cert = await Certificate.findOneAndUpdate(
					{ student: studentId, course: courseId },
					{
						$set: {
							NFTId: Number(NFTId),
							isMinted: true,
							mintedAddress: walletAddress,
							mintedDate: new Date(),
							txHash: txHash,
						},
					},
					{ new: true, upsert: true }
				);

				console.log(cert);
			} catch (error) {
				console.error("Errorminting certificate:", error);
			}
		}
	);

	console.log("Event listeners set up successfully");
};

const CoursePaymentController = {
	initializeWebSocket: () => {
		setupWebSocketProvider();
	},

	// Additional functions to interact with the smart coursePaymentContract can be added here
};

module.exports = CoursePaymentController;
