const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
	firebaseUrl: {
		type: String,
		required: true,
	},
	tokenURI: {
		type: String,
	},
	student: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	course: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Course",
		required: true,
	},
	certificateId: {
		type: String,
		unique: true,
		required: true,
	},
	isUploadedToIPFS: {
		type: Boolean,
		default: false,
	},
	isMinted: {
		type: Boolean,
		default: false,
	},
	NFTId: {
		type: Number,
	},
    txHash: {
		type: String,
	},
	mintedAddress: {
		type: String,
	},
	mintedDate: {
		type: Date,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Certificate", certificateSchema);
