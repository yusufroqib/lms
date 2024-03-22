
const mongoose = require("mongoose");

const { Schema, models, model } = mongoose

const TagSchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }], // Assuming it references "Post" schema
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }], // Assuming it references "User" schema
    createdOn: { type: Date, default: Date.now },
});
const Tag = models.Tag || model("Tag", TagSchema);
module.exports = Tag;
