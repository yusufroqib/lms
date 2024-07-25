const Course = require("../models/CourseModel");
const User = require("../models/UserModel");
const {
    COURSE_PAYMENT_CA,
    COURSE_PAYMENT_ABI,
} = require("../contracts/coursePayment");
const { ethers, Contract } = require("ethers");

require("dotenv").config();

const contractABI = COURSE_PAYMENT_ABI;
const contractAddress = COURSE_PAYMENT_CA;

let provider;
let contract;

const setupWebSocketProvider = () => {
    provider = new ethers.WebSocketProvider('wss://alfajores-forno.celo-testnet.org/ws');
    contract = new Contract(contractAddress, contractABI, provider);

    provider.on('error', (error) => {
        console.error('WebSocket Error:', error);
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
    console.log('Attempting to reconnect...');
    setTimeout(setupWebSocketProvider, 5000); // Wait for 5 seconds before reconnecting
};

const setupEventListeners = () => {
    // TutorRegistered event
    contract.on("TutorRegistered", async (id, walletAddress) => {
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
    contract.on("TutorAddressUpdated", async (id, oldAddress, newAddress) => {
        try {
            const user = await User.findOneAndUpdate(
                { connectedWallets: oldAddress },
                { $set: { paymentWallet: newAddress } },
                { new: true }
            );
            console.log(`Tutor address updated: ${id}, ${oldAddress} -> ${newAddress}`);
        } catch (error) {
            console.error("Error updating tutor address:", error);
        }
    });

    // CoursePurchased event
    contract.on("CoursePurchased", async (student, tutorId, amount, courseId, event) => {
        try {
            const user = await User.findOne({ connectedWallets: student });
            const course = await Course.findById(courseId);

            if (user && course) {
                const txHash = event.transactionHash;

                await User.findByIdAndUpdate(user._id, {
                    $push: {
                        transactions: {
                            type: "purchase",
                            paymentMethod: "crypto",
                            amount: ethers.formatUnits(amount, 6),
                            status: "completed",
                            courseId: course._id,
                            createdAt: new Date(),
                            txHash: txHash
                        },
                        enrolledCourses: {
                            course: course._id,
                            lastStudiedAt: new Date(),
                        },
                    },
                });

                await Course.findByIdAndUpdate(course._id, {
                    $push: {
                        purchasedBy: {
                            user: user._id,
                            amount: ethers.formatUnits(amount, 6),
                            date: new Date(),
                        },
                    },
                });

                console.log(`Course purchased: ${student}, ${tutorId}, ${amount}, ${courseId}`);
            }
        } catch (error) {
            console.error("Error processing course purchase:", error);
        }
    });

    // TutorWithdrawal event
    contract.on("TutorWithdrawal", async (tutorId, amount, event) => {
        try {
            const user = await User.findOne({ _id: tutorId });
            if (user) {
                const txHash = event.transactionHash;

                await User.findByIdAndUpdate(user._id, {
                    $push: {
                        transactions: {
                            type: "payout",
                            paymentMethod: "crypto",
                            amount: ethers.formatUnits(amount, 6),
                            status: "completed",
                            createdAt: new Date(),
                            txHash: txHash
                        },
                    },
                });
            }
            console.log(`Tutor withdrawal: ${tutorId}, ${amount}`);
        } catch (error) {
            console.error("Error processing tutor withdrawal:", error);
        }
    });

    console.log("Event listeners set up successfully");
};

const CoursePaymentController = {
    initializeWebSocket: () => {
        setupWebSocketProvider();
    },

    // Additional functions to interact with the smart contract can be added here
};

module.exports = CoursePaymentController;