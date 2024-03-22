const mongoose = require("mongoose");

const { Schema } = mongoose;

const stripeCustomerSchema = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: "User" },
	stripeCustomerId: { type: String, unique: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now, index: true },
});

const StripeCustomer = mongoose.model("StripeCustomer", stripeCustomerSchema);

module.exports = StripeCustomer;
