
const mongoose = require("mongoose");

const { Schema, models, model } = mongoose
const PostSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    views: { type: Number, default: 0 },
    upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    author: { type: Schema.Types.ObjectId, ref: "User" },
    replies: [{ type: Schema.Types.ObjectId, ref: "Reply" }],
    createdAt: { type: Date, default: Date.now },
});
const Post = models.Post || model("Post", PostSchema);
module.exports = Post;
