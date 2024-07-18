const User = require("../models/UserModel");
const Reply = require("../models/ReplyModel");
const Post = require("../models/PostModel");
const Interaction = require("../models/InteractionModel");
const Tag = require("../models/TagModel");
const assignBadges = require("../utils/assignBadges");
// const mongoose = require('mongoose');

const createPost = async (req, res) => {
	try {
		const userId = req.userId;
		const { title, content, tags, author } = req.body;
		// console.log(req.body);
		if (!author || !title || !content || !tags.length) {
			return res.status(400).json({ message: "Missing required fields" });
		}

		if (userId !== author) {
			return res.status(401).json({ message: "Unauthorized" });
		}

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
		const { postId } = req.params;
		const post = await Post.findById(postId)
			.populate({ path: "tags", model: Tag, select: "_id name" })
			.populate({
				path: "author",
				model: User,
				select: "_id name avatar",
			});
		// console.log(post)
		res.status(200).json(post);
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
};

// Controller method for upvoting a post
const upvotePost = async (req, res) => {
	try {
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
		res.status(200).send({ message: "Post upvoted successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
};

// Controller method for downvoting a post
const downvotePost = async (req, res) => {
	try {
		const { postId, userId, hasupVoted, hasdownVoted, path } = req.body;
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
		res.status(200).send({ message: "Post downvoted successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
};

// Controller method for deleting a post
const deletePost = async (req, res) => {
	try {
		const { postId } = req.params;
		// Remove the post
		await Post.deleteOne({ _id: postId });
		// Remove related replies and interactions
		await Reply.deleteMany({ post: postId });
		await Interaction.deleteMany({ post: postId });

		// Remove the post from tags
		await Tag.updateMany({ posts: postId }, { $pull: { posts: postId } });

		// Find tags with no posts
		const tagsWithNoPosts = await Tag.find({
			posts: { $exists: true, $eq: [] },
		});

		// Delete tags with no posts
		for (const tag of tagsWithNoPosts) {
			await Tag.deleteOne({ _id: tag._id });
		}

		res.status(200).send({ message: "Post deleted successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
};

// Controller method for editing a post
const editPost = async (req, res) => {
	try {
		const userId = req.userId;
		const { postId, title, content } = req.body;
		const post = await Post.findById(postId).populate("tags");
		if (!post) {
			return res.status(404).send({ message: "Post not found" });
		}
		const ownerPost = await Post.findOne({ _id: postId, author: userId });
		if (!ownerPost) {
			return res
				.status(401)
				.send({ message: "You are not the owner of this post" });
		}
		post.title = title;
		post.content = content;
		await post.save();
		res.status(200).send({ message: "Post edited successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
};

// Controller method for getting posts
const getPosts = async (req, res) => {
	try {
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
			case "unreplied":
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
		// awa
		const userId = req.userId;
		const { page = 1, pageSize = 20, searchQuery } = req.query;
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
		const { content, author, post } = req.body;
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
		res.status(201).send({ message: "Reply created successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
};

// Controller method for getting replies
const getReplies = async (req, res) => {
	try {
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
			.populate("author", "_id name avatar")
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
		res.status(200).send({ message: "Reply upvoted successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
};

// Controller method for downvoting an reply
const downvoteReply = async (req, res) => {
	try {
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
		res.status(200).send({ message: "Reply downvoted successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
};

// Controller method for deleting an reply
const deleteReply = async (req, res) => {
	try {
		const { replyId, path } = req.body;
		const reply = await Reply.findById(replyId);
		if (!reply) {
			throw new Error("Reply not found");
		}
		await reply.deleteOne({ _id: replyId });
		await Post.updateMany({ _id: reply.post }, { $pull: { replies: replyId } });
		await Interaction.deleteMany({ reply: replyId });
		res.status(200).send({ message: "Reply deleted successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
};

// Controller method for getting top interacted tags
const getTopInteractedTags = async (req, res) => {
	try {
		const { userId } = req.params;

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Find interactions for the user
		const interactions = await Interaction.find({ user: userId }).populate(
			"tags"
		);

		// Count occurrences of each tag
		const tagCounts = {};
		interactions.forEach((interaction) => {
			interaction.tags.forEach((tag) => {
				const tagId = tag._id.toString();
				if (!tagCounts[tagId]) {
					tagCounts[tagId] = { count: 1, name: tag.name };
				} else {
					tagCounts[tagId].count++;
				}
			});
		});

		// Sort the tag counts in descending order
		const sortedTags = Object.keys(tagCounts).sort(
			(a, b) => tagCounts[b].count - tagCounts[a].count
		);

		// console.log(tagCounts);
		// Extract the top 3 interacted tags
		const topTags = sortedTags
			.slice(0, 3)
			.map((tagId) => ({ _id: tagId, name: tagCounts[tagId].name }));

		res.status(200).json(topTags);
		// const user = await User.findById(userId);
		// if (!user) throw new Error("User not found");

		// // Logic for finding interactions for the user and group by tags...

		// const topInteractedTags = [
		// 	{ _id: "1", name: "Next" },
		// 	{ _id: "2", name: "Prism" },
		// 	{ _id: "3", name: "Docker" },
		// ];
		// res.status(200).json(topInteractedTags);
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
};

// Controller method for getting all tags
const getAllTags = async (req, res) => {
	try {
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
		const { tagId } = req.params;
		const { searchQuery, page = 1, pageSize = 10 } = req.query;
		const skipAmount = (page - 1) * pageSize;
		const tagFilter = { _id: tagId };
		const tag = await Tag.findOne(tagFilter).populate({
			path: "posts",
			model: Post,
			match: searchQuery
				? { title: { $regex: searchQuery, $options: "i" } }
				: {},
			options: {
				sort: { createdAt: -1 },
				skip: skipAmount,
				limit: pageSize + 1,
			},
			populate: [
				{ path: "tags", model: Tag, select: "_id name" },
				{ path: "author", model: User, select: "_id clrekId name avatar" },
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
		// awa
		const { postId, userId } = req.body;
		// console.log("ViewPost", req.body);
		// Update view count for the post

		await Post.findByIdAndUpdate(postId, { $inc: { views: 1 } });

		if (userId) {
			const existingInteraction = await Interaction.findOne({
				user: userId,
				action: "view",
				post: postId,
			});

			if (existingInteraction) {
				// console.log("User has already viewed.");
				return res.status(200).send({ message: "User has already viewed." });
			}

			// Create a new interaction
			await Interaction.create({
				user: userId,
				action: "view",
				post: postId,
			});
		}

		res.status(200).send({ message: "Post viewed successfully." });
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
};

const getUserById = async (req, res) => {
	try {
		const { userId } = req.params;
		const user = await User.findById(userId);
		res.json(user);
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
};

const createUser = async (req, res) => {
	try {
		const newUser = await User.create(req.body);
		res.status(201).json(newUser);
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
};

const updateUser = async (req, res) => {
	try {
		const { clerkId } = req.params;
		const updateData = req.body;
		await User.findOneAndUpdate({ clerkId }, updateData, { new: true });
		revalidatePath(req.path);
		res.sendStatus(204);
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
};

const deleteUser = async (req, res) => {
	try {
		const { clerkId } = req.params;
		const user = await User.findOneAndDelete({ clerkId });
		if (!user) {
			res.status(404).send("User not found");
			return;
		}
		const userPostIds = await Post.find({ author: user._id }).distinct("_id");
		await Post.deleteMany({ author: user._id });
		await User.findByIdAndDelete(user._id);
		res.json(user);
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
};

const getAllUsers = async (req, res) => {
	try {
		const { searchQuery, filter, page = 1, pageSize = 10 } = req.query;
		const skipAmount = (page - 1) * pageSize;
		const query = {};
		if (searchQuery) {
			query.$or = [
				{ name: { $regex: new RegExp(searchQuery, "i") } },
				{ username: { $regex: new RegExp(searchQuery, "i") } },
			];
		}
		let sortOptions = {};
		switch (filter) {
			case "new_users":
				sortOptions = { joinedAt: -1 };
				break;
			case "old_users":
				sortOptions = { joinedAt: 1 };
				break;
			case "top_contributors":
				sortOptions = { reputation: -1 };
				break;
			default:
				break;
		}
		const users = await User.find(query)
			.sort(sortOptions)
			.skip(skipAmount)
			.limit(pageSize);
		const totalUsers = await User.countDocuments(query);
		const isNext = totalUsers > skipAmount + users.length;
		res.json({ users, isNext });
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
};

const toggleSavePost = async (req, res) => {
	try {
		const userId = req.userId;
		const { postId } = req.body;
		const user = await User.findById(userId);
		if (!user) {
			res.status(404).send("User not found");
			return;
		}
		const isPostSaved = user.saved.includes(postId);
		if (isPostSaved) {
			await User.findByIdAndUpdate(
				userId,
				{ $pull: { saved: postId } },
				{ new: true }
			);
			// console.log(testing)
		} else {
			await User.findByIdAndUpdate(
				userId,
				{ $addToSet: { saved: postId } },
				{ new: true }
			);
			// console.log(test)
		}
		// revalidatePath(req.path);
		res.status(200).json({ message: "Post collection updated" });
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
};

const getSavedPosts = async (req, res) => {
	try {
		const { userId } = req;
		const { page = 1, pageSize = 10, filter, searchQuery } = req.query;
		const skipAmount = (page - 1) * pageSize;
		const query = searchQuery
			? { title: { $regex: new RegExp(searchQuery, "i") } }
			: {};
		let sortOptions = {};
		switch (filter) {
			case "most_recent":
				sortOptions = { createdAt: -1 };
				break;
			case "oldest":
				sortOptions = { createdAt: 1 };
				break;
			case "most_voted":
				sortOptions = { upvotes: -1 };
				break;
			case "most_viewed":
				sortOptions = { views: -1 };
				break;
			case "most_replied":
				sortOptions = { replies: -1 };
				break;
			default:
				break;
		}
		const user = await User.findById(userId).populate({
			path: "saved",
			match: query,
			options: {
				sort: sortOptions,
				skip: skipAmount,
				limit: pageSize + 1,
			},
			populate: [
				{ path: "tags", model: Tag, select: "_id name" },
				{ path: "author", model: User, select: "_id  name avatar" },
			],
		});
		const isNext = user.saved.length > pageSize;
		if (!user) {
			throw new Error("User not found");
		}
		const savedPosts = user.saved;
		res.status(200).json({ posts: savedPosts, isNext });
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
}; 


const getUserInfo = async (req, res) => {
	const { user: username_id } = req.params;
	try {
		const user = await User.findOne({
			$or: [{ username: username_id }, { _id: username_id }],
		});
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const totalPosts = await Post.countDocuments({ author: user._id });
		const totalReplies = await Reply.countDocuments({ author: user._id });
		const [postUpvotes] = await Post.aggregate([
			{ $match: { author: user._id } },
			{ $project: { _id: 0, upvotes: { $size: "$upvotes" } } },
			{ $group: { _id: null, totalUpvotes: { $sum: "$upvotes" } } },
		]);
		const [replyUpvotes] = await Reply.aggregate([
			{ $match: { author: user._id } },
			{ $project: { _id: 0, upvotes: { $size: "$upvotes" } } },
			{ $group: { _id: null, totalUpvotes: { $sum: "$upvotes" } } },
		]);
		const [postViews] = await Post.aggregate([
			{ $match: { author: user._id } },
			{ $group: { _id: null, totalViews: { $sum: "$views" } } },
		]);
		const criteria = [
			{ type: "POST_COUNT", count: totalPosts },
			{ type: "REPLY_COUNT", count: totalReplies },
			{ type: "POST_UPVOTES", count: postUpvotes?.totalUpvotes || 0 },
			{ type: "REPLY_UPVOTES", count: replyUpvotes?.totalUpvotes || 0 },
			{ type: "TOTAL_VIEWS", count: postViews?.totalViews || 0 },
		];
		const badgeCounts = assignBadges({ criteria });
		res.status(200).json({
			user,
			totalPosts,
			totalReplies,
			badgeCounts,
			reputation: user.reputation,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Internal server error" });
	}
};

const getUserPosts = async (req, res) => {
	const { userId } = req.params;
	const { page = 1 } = req.body;
	const { pageSize = 10 } = req.query;
	try {
		const skipAmount = (page - 1) * pageSize;
		const totalPosts = await Post.countDocuments({ author: userId });
		const userPosts = await Post.find({ author: userId })
			.sort({ createdAt: -1, views: -1, upvotes: -1 })
			.skip(skipAmount)
			.limit(pageSize)
			.populate("tags", "_id name")
			.populate("author", "_id  name avatar");
		const isNextPosts = totalPosts > skipAmount + userPosts.length;
		res.status(200).json({ totalPosts, posts: userPosts, isNextPosts });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Internal server error" });
	}
};

const getUserReplies = async (req, res) => {
	const { userId } = req.params;
	const { page = 1 } = req.body;
	const { pageSize = 10 } = req.query;
	try {
		const skipAmount = (page - 1) * pageSize;
		const totalReplies = await Reply.countDocuments({ author: userId });
		const userReplies = await Reply.find({ author: userId })
			.sort({ upvotes: -1 })
			.skip(skipAmount)
			.limit(pageSize)
			.populate("post", "_id title")
			.populate("author", "_id name avatar");
		const isNextReply = totalReplies > skipAmount + userReplies.length;
		res.status(200).json({ totalReplies, replies: userReplies, isNextReply });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Internal server error" });
	}
};


const SearchableTypes = ["post", "reply", "user", "tag"];

const globalSearch = async (req, res) => {
    const { query, type } = req.query;
	// console.log(query)
    try {
        const regexQuery = { $regex: query, $options: "i" };
        let results = [];
        const modelsAndTypes = [
            { model: Post, searchField: "title", type: "post" },
            { model: User, searchField: ["name", "username"], type: "user" }, // Include "username" field for user type
            { model: Reply, searchField: "content", type: "reply" },
            { model: Tag, searchField: "name", type: "tag" },
        ];
        const typeLower = type?.toLowerCase();
        if (!typeLower || !SearchableTypes.includes(typeLower)) {
            // SEARCH ACROSS EVERYTHING
            for (const { model, searchField, type } of modelsAndTypes) {
                let queryResults;
                if (Array.isArray(searchField)) {
                    queryResults = await model
                        .find({ $or: searchField.map(field => ({ [field]: regexQuery })) }) // Search across multiple fields
                        .limit(2);
                } else {
                    queryResults = await model
                        .find({ [searchField]: regexQuery })
                        .limit(2);
                }
                results.push(...queryResults.map((item) => ({
                    title: type === "reply"
                        ? `Replies containing ${query}`
                        : type === "user"
                            ? item.name
                            : item[searchField], // Use the searchField as the title
                    type,
                    id: type === "user"
                        ? item._id
                        : type === "reply"
                            ? item.post
                            : item._id,
                    name: type === "user"
                        ? item.name
                        : null, // Include the name of the user found
                })));
            }
        }
        else {
            // SEARCH IN THE SPECIFIED MODEL TYPE
            const modelInfo = modelsAndTypes.find((item) => item.type === type);
            if (!modelInfo) {
                return res.status(400).json({ error: "Invalid search type" });
            }
            let queryResults;
            if (Array.isArray(modelInfo.searchField)) {
                queryResults = await modelInfo.model
                    .find({ $or: modelInfo.searchField.map(field => ({ [field]: regexQuery })) }) // Search across multiple fields
                    .limit(8);
            } else {
                queryResults = await modelInfo.model
                    .find({ [modelInfo.searchField]: regexQuery })
                    .limit(8);
            }
            results = queryResults.map((item) => ({
                title: type === "reply"
                    ? `Replies containing ${query}`
                    : type === "user"
                        ? item.name
                        : item[modelInfo.searchField], // Use the searchField as the title
                type,
                id: type === "user"
                    ? item._id
                    : type === "reply"
                        ? item.post
                        : item._id,
                name: type === "user"
                    ? item.name
                    : null, // Include the name of the user found
            }));
        }
        res.status(200).json(results);
    } catch (error) {
        console.log(`Error fetching global results, ${error}`);
        res.status(500).json({ error: "Internal server error" });
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
	viewPost,
	getUserById,
	createUser,
	updateUser,
	deleteUser,
	getAllUsers,
	toggleSavePost,
	getSavedPosts,
	getUserInfo,
	getUserPosts,
	getUserReplies,globalSearch
};
