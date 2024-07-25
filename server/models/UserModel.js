const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		username: {
			type: String,
			// required: true,
			unique: true,
		},
		name: String,
		email: {
			type: String,
			required: true,
			unique: true,
		},
		googleId: String,
		password: {
			type: String,
			select: false, // Excludes the password field from query results
			// required: true,
		},
		bio: String,
		avatar: String,
		followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
		following: [{ type: Schema.Types.ObjectId, ref: "User" }],
		stripeAccountId: String,
		stripeOnboardingComplete: { type: Boolean, default: false },
		transactions: [
			{
				type: {
					type: String,
					enum: ["purchase", "payout", "balanceTransfer"],
				},
				paymentMethod: {
					type: String,
					enum: ["card", "crypto"],
				},
				amount: Number,
				status: String,
				courseId: { type: Schema.Types.ObjectId, ref: "Course" },
				stripeTransactionId: String,
				txHash: String,
				createdAt: { type: Date, default: Date.now },
			},
		],
		roles: {
			Student: {
				type: String,
				default: "Student",
			},
			Tutor: String,
			Admin: String,
		},
		connectedWallets: { type: [String], default: [] },
		paymentWallet: String,
		reputation: { type: Number, default: 0 },
		saved: [{ type: Schema.Types.ObjectId, ref: "Post" }],
		enrolledCourses: [
			{
				course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
				lastStudiedAt: { type: Date, default: null },
			},
		],
		createdCourses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
		refreshToken: [String],
		points: [
			{
				description: String,
				amount: Number,
				date: Date,
			},
		],
		badges: [{ type: Schema.Types.ObjectId, ref: "Badge" }],
		devices: [
			{
				fingerprint: String,
				userAgent: String,
				browser: String,
				os: String,
				lastIP: String,
				location: String,
				lastUsed: Date,
				isVerified: Boolean,
				createdAt: { type: Date, default: Date.now },
				// expiresAt: { type: Date, default: () => new Date(+new Date() + 2*60*1000) } // 30 days from now
				expiresAt: {
					type: Date,
					default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000),
				}, // 30 days from now
			},
		],
		joinedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("User", userSchema);
