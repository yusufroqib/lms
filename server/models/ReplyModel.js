
const mongoose = require("mongoose");

const { Schema, models, model } = mongoose
const ReplySchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    content: { type: String, required: true },
    upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
});
const Reply = models.Reply || model("Reply", ReplySchema);
module.exports = Reply;
