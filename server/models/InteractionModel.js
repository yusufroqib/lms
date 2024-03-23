const mongoose = require("mongoose");

const { Schema, models, model } = mongoose;
const InteractionSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: "User", required: true },
	action: { type: String, required: true },
	post: { type: Schema.Types.ObjectId, ref: "Post" },
	reply: { type: Schema.Types.ObjectId, ref: "Reply" },
	tags: [
		{
			// Change this line to define tags as an array of ObjectIds
			type: Schema.Types.ObjectId,
			ref: "Tag",
		},
	],
	createdAt: { type: Date, default: Date.now },
});
const Interaction =
	models.Interaction || model("Interaction", InteractionSchema);
module.exports = Interaction;
