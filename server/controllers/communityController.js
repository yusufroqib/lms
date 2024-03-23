const User = require("../models/userModel");
const Reply = require("../models/ReplyModel");
const Post = require("../models/PostModel");
const Interaction = require("../models/InteractionModel");
const Tag = require("../models/TagModel");
const mongoose = require('mongoose');


const createPost = async (req, res) => {
    try {
        const { title, content, tags, author } = req.body;
        console.log(req.body);

        const post = await Post.create({ title, content, author });

        const tagIds = [];
        for (const tag of tags) {
            // Use findOneAndUpdate with upsert: true and new: true
            let existingTag = await Tag.findOneAndUpdate(
                { name: tag }, // Filter to find the tag by name
                { $push: { posts: post._id } }, // Update to add the post ID to the tag's posts array
                { upsert: true, new: true } // Options to create a new tag if it doesn't exist
            );
            tagIds.push(existingTag._id.toString());
        }

        // Update the Post document with tagIds
        await Post.findByIdAndUpdate(post._id, {
            $push: { tags: { $each: tagIds } },
        });

        await Interaction.create({
            user: author,
            post: post._id,
            action: "create_post",
            tags: tagIds,
        });

        await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });

        res.status(201).json({ message: "Post created successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
};

// Controller method for getting a post by ID
const getPostById = async (req, res) => {
	try {
		// connectToDatabase();
		const { postId } = req.params;
		const post = await Post.findById(postId)
			.populate({ path: "tags", model: Tag, select: "_id name" })
			.populate({
				path: "author",
				model: User,
				select: "_id clerkId name picture",
			});
		res.status(200).json(post);
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
};

// Controller method for upvoting a post
const upvotePost = async (req, res) => {
	try {
		// connectToDatabase();
		const { postId, userId, hasupVoted, hasdownVoted, path } = req.body;
		let updateQuery = {};
		if (hasupVoted) {
			updateQuery = { $pull: { upvotes: userId } };
		} else if (hasdownVoted) {
			updateQuery = {
				$pull: { downvotes: userId },
				$push: { upvotes: userId },
			};
		} else {
			updateQuery = { $addToSet: { upvotes: userId } };
		}
		const post = await Post.findByIdAndUpdate(postId, updateQuery, {
			new: true,
		});
		if (!post) {
			throw new Error("Post not found");
		}
		await User.findByIdAndUpdate(userId, {
			$inc: { reputation: hasupVoted ? -1 : 1 },
		});
		await User.findByIdAndUpdate(post.author, {
			$inc: { reputation: hasupVoted ? -10 : 10 },
		});
		res.status(200).send("Post upvoted successfully");
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
};

// Controller method for downvoting a post
const downvotePost = async (req, res) => {
	try {
		// connectToDatabase();
		const { postId, userId, hasupVoted, hasdownVoted, path } = req.body;
		let updateQuery = {};
		if (hasdownVoted) {
			updateQuery = { $pull: { downvote: userId } };
		} else if (hasupVoted) {
			updateQuery = {
				$pull: { upvotes: userId },
				$push: { downvotes: userId },
			};
		} else {
			updateQuery = { $addToSet: { downvotes: userId } };
		}
		const post = await Post.findByIdAndUpdate(postId, updateQuery, {
			new: true,
		});
		if (!post) {
			throw new Error("Post not found");
		}
		await User.findByIdAndUpdate(userId, {
			$inc: { reputation: hasdownVoted ? -2 : 2 },
		});
		await User.findByIdAndUpdate(post.author, {
			$inc: { reputation: hasdownVoted ? -10 : 10 },
		});
		res.status(200).send("Post downvoted successfully");
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
};

// Controller method for deleting a post
const deletePost = async (req, res) => {
	try {
		// connectToDatabase();
		const { postId, path } = req.body;
		await Post.deleteOne({ _id: postId });
		await Reply.deleteMany({ post: postId });
		await Interaction.deleteMany({ post: postId });
		await Tag.updateMany(
			{ posts: postId },
			{ $pull: { posts: postId } }
		);
		res.status(200).send("Post deleted successfully");
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
};

// Controller method for editing a post
const editPost = async (req, res) => {
	try {
		// connectToDatabase();
		const { postId, title, content, path } = req.body;
		const post = await Post.findById(postId).populate("tags");
		if (!post) {
			throw new Error("Post not found");
		}
		post.title = title;
		post.content = content;
		await post.save();
		res.status(200).send("Post edited successfully");
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
};

// Controller method for getting posts
const getPosts = async (req, res) => {
	try {
		// connectToDatabase();
		const { searchQuery, filter, page = 1, pageSize = 20 } = req.query;
		const skipAmount = (page - 1) * pageSize;
		const query = {};
		if (searchQuery) {
			query.$or = [
				{ title: { $regex: new RegExp(searchQuery, "i") } },
				{ content: { $regex: new RegExp(searchQuery, "i") } },
			];
		}
		let sortOptions = {};
		switch (filter) {
			case "newest":
				sortOptions = { createdAt: -1 };
				break;
			case "frequent":
				sortOptions = { views: -1 };
				break;
			case "unreplyed":
				query.replies = { $size: 0 };
				break;
			default:
				break;
		}
		const posts = await Post.find(query)
			.populate({ path: "tags", model: Tag })
			.populate({ path: "author", model: User })
			.skip(skipAmount)
			.limit(pageSize)
			.sort(sortOptions);
		const totalPosts = await Post.countDocuments(query);
		const isNext = totalPosts > skipAmount + posts.length;
		res.status(200).json({ posts, isNext });
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
};

// Controller method for getting hot posts
const getHotPosts = async (req, res) => {
	try {
		// connectToDatabase();
		const hotPosts = await Post.find({})
			.sort({ views: -1, upvotes: -1 })
			.limit(5);
		res.status(200).json(hotPosts);
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
};

// Controller method for getting recommended posts
const getRecommendedPosts = async (req, res) => {
	try {
		// await connectToDatabase();
        const userId = req.userId
		const {  page = 1, pageSize = 20, searchQuery } = req.query;
		const user = await User.findById(userId);
		if (!user) {
			throw new Error("User not found");
		}
		const skipAmount = (page - 1) * pageSize;
		const userInteractions = await Interaction.find({ user: user._id })
			.populate("tags")
			.exec();
		const userTags = userInteractions.reduce((tags, interaction) => {
			if (interaction.tags) {
				tags = tags.concat(interaction.tags);
			}
			return tags;
		}, []);
		const distinctUserTagIds = [...new Set(userTags.map((tag) => tag._id))];
		const query = {
			$and: [
				{ tags: { $in: distinctUserTagIds } },
				{ author: { $ne: user._id } },
			],
		};
		if (searchQuery) {
			query.$or = [
				{ title: { $regex: searchQuery, $options: "i" } },
				{ content: { $regex: searchQuery, $options: "i" } },
			];
		}
		const totalPosts = await Post.countDocuments(query);
		const recommendedPosts = await Post.find(query)
			.populate({
				path: "tags",
				model: Tag,
			})
			.populate({
				path: "author",
				model: User,
			})
			.skip(skipAmount)
			.limit(pageSize);
		const isNext = totalPosts > skipAmount + recommendedPosts.length;
		res.status(200).json({ posts: recommendedPosts, isNext });
	} catch (error) {
		console.error("Error getting recommended posts:", error);
		res.status(500).send("Internal server error");
	}
};

// Controller method for creating an reply
const createReply = async (req, res) => {
	try {
		// connectToDatabase();
		const { content, author, post, path } = req.body;
		const newReply = await Reply.create({ content, author, post });
		const postObject = await Post.findByIdAndUpdate(post, {
			$push: { replies: newReply._id },
		});
		await Interaction.create({
			user: author,
			action: "reply",
			post,
			reply: newReply._id,
			tags: postObject.tags,
		});
		await User.findByIdAndUpdate(author, { $inc: { reputation: 10 } });
		res.status(201).send("Reply created successfully");
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
};

// Controller method for getting replies
const getReplies = async (req, res) => {
	try {
		// connectToDatabase();
		const { postId, sortBy } = req.query;
		let sortOptions = {};
		switch (sortBy) {
			case "highestUpvotes":
				sortOptions = { upvotes: -1 };
				break;
			case "lowestUpvotes":
				sortOptions = { upvotes: 1 };
				break;
			case "recent":
				sortOptions = { createdAt: -1 };
				break;
			case "old":
				sortOptions = { createdAt: 1 };
				break;
			default:
				break;
		}
		const replies = await Reply.find({ post: postId })
			.populate("author", "_id clerkId name picture")
			.sort(sortOptions);
		res.status(200).json({ replies });
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
};

// Controller method for upvoting an reply
const upvoteReply = async (req, res) => {
	try {
		// connectToDatabase();
		const { replyId, userId, hasupVoted, hasdownVoted, path } = req.body;
		let updateQuery = {};
		if (hasupVoted) {
			updateQuery = { $pull: { upvotes: userId } };
		} else if (hasdownVoted) {
			updateQuery = {
				$pull: { downvotes: userId },
				$push: { upvotes: userId },
			};
		} else {
			updateQuery = { $addToSet: { upvotes: userId } };
		}
		const reply = await Reply.findByIdAndUpdate(replyId, updateQuery, {
			new: true,
		});
		if (!reply) {
			throw new Error("Reply not found");
		}
		await User.findByIdAndUpdate(userId, {
			$inc: { reputation: hasupVoted ? -2 : 2 },
		});
		await User.findByIdAndUpdate(reply.author, {
			$inc: { reputation: hasupVoted ? -10 : 10 },
		});
		res.status(200).send("Reply upvoted successfully");
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
};

// Controller method for downvoting an reply
const downvoteReply = async (req, res) => {
	try {
		// connectToDatabase();
		const { replyId, userId, hasupVoted, hasdownVoted, path } = req.body;
		let updateQuery = {};
		if (hasdownVoted) {
			updateQuery = { $pull: { downvotes: userId } };
		} else if (hasupVoted) {
			updateQuery = {
				$pull: { upvotes: userId },
				$push: { downvotes: userId },
			};
		} else {
			updateQuery = { $addToSet: { downvotes: userId } };
		}
		const reply = await Reply.findByIdAndUpdate(replyId, updateQuery, {
			new: true,
		});
		if (!reply) {
			throw new Error("Reply not found");
		}
		await User.findByIdAndUpdate(userId, {
			$inc: { reputation: hasdownVoted ? -2 : 2 },
		});
		await User.findByIdAndUpdate(reply.author, {
			$inc: { reputation: hasdownVoted ? -10 : 10 },
		});
		res.status(200).send("Reply downvoted successfully");
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
};

// Controller method for deleting an reply
const deleteReply = async (req, res) => {
	try {
		// connectToDatabase();
		const { replyId, path } = req.body;
		const reply = await Reply.findById(replyId);
		if (!reply) {
			throw new Error("Reply not found");
		}
		await reply.deleteOne({ _id: replyId });
		await Post.updateMany({ _id: reply.post }, { $pull: { replies: replyId } });
		await Interaction.deleteMany({ reply: replyId });
		res.status(200).send("Reply deleted successfully");
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
};




// Controller method for getting top interacted tags
const getTopInteractedTags = async (req, res) => {
    try {
        // connectToDatabase();
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        // Logic for finding interactions for the user and group by tags...

        const topInteractedTags = [
            { _id: "1", name: "Next" },
            { _id: "2", name: "Prism" },
            { _id: "3", name: "Docker" },
        ];
        res.status(200).json(topInteractedTags);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
};

// Controller method for getting all tags
const getAllTags = async (req, res) => {
    try {
        // connectToDatabase();
        const { searchQuery, filter, page = 1, pageSize = 10 } = req.query;
        const skipAmount = (page - 1) * pageSize;
        const query = {};
        if (searchQuery) {
            query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }];
        }
        let sortOptions = {};
        switch (filter) {
            case "popular":
                sortOptions = { posts: -1 };
                break;
            case "recent":
                sortOptions = { createdAt: -1 };
                break;
            case "name":
                sortOptions = { name: 1 };
                break;
            case "old":
                sortOptions = { createdAt: 1 };
                break;
            default:
                break;
        }
        const tags = await Tag.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize);
        const totalTags = await Tag.countDocuments(query);
        const isNext = totalTags > skipAmount + tags.length;
        res.status(200).json({ tags, isNext });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
};

// Controller method for getting posts by tag ID
const getPostByTagId = async (req, res) => {
    try {
        // connectToDatabase();
        const { tagId, searchQuery, page = 1, pageSize = 10 } = req.params;
        const skipAmount = (page - 1) * pageSize;
        const tagFilter = { _id: tagId };
        const tag = await Tag.findOne(tagFilter).populate({
            path: "posts",
            model: Post,
            match: searchQuery ? { title: { $regex: searchQuery, $options: "i" } } : {},
            options: {
                sort: { createdAt: -1 },
                skip: skipAmount,
                limit: pageSize + 1,
            },
            populate: [
                { path: "tags", model: Tag, select: "_id name" },
                { path: "author", model: User, select: "_id clrekId name picture" },
            ],
        });
        const isNext = tag.posts.length > pageSize;
        if (!tag) {
            throw new Error("Tag not found");
        }
        const posts = tag.posts;
        res.status(200).json({ tagTitle: tag.name, posts, isNext });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
};

// Controller method for getting top popular tags
const getTopPopularTags = async (req, res) => {
    try {
        // connectToDatabase();
        const popularTags = await Tag.aggregate([
            { $project: { name: 1, numberOfPosts: { $size: "$posts" } } },
            { $sort: { numberOfPosts: -1 } },
            { $limit: 5 },
        ]);
        res.status(200).json(popularTags);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
};

// Controller method for viewing a post
const viewPost = async (req, res) => {
    try {
        // await connectToDatabase();
        const { postId, userId } = req.params;
        // Update view count for the post
        await Post.findByIdAndUpdate(postId, { $inc: { views: 1 } });

        if (userId) {
            const existingInteraction = await Interaction.findOne({
                user: userId,
                action: "view",
                post: postId,
            });

            if (existingInteraction) {
                console.log("User has already viewed.");
                return res.status(200).send("User has already viewed.");
            }

            // Create a new interaction
            await Interaction.create({
                user: userId,
                action: "view",
                post: postId,
            });
        }

        res.status(200).send("Post viewed successfully.");
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
};

module.exports = {
    createReply,
    getReplies,
    upvoteReply,
    downvoteReply,
    deleteReply,
	getPosts,
	createPost,
	getPostById,
	upvotePost,
	downvotePost,
	deletePost,
	editPost,
	getHotPosts,
	getRecommendedPosts,
    getTopInteractedTags,
    getAllTags,
    getPostByTagId,
    getTopPopularTags,
    viewPost
};
