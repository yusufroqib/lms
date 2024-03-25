import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "@/app/api/apiSlice";

const postsAdapter = createEntityAdapter({});

const initialState = postsAdapter.getInitialState({
	isNext: false, // Add isNext property to initial state
	posts: [],
});

export const postsApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		globalSearch: builder.query({
			query: ({ searchParams }) => `/community/global-search?${searchParams}`,

			transformResponse: (responseData) => {
				// Extract posts and isNext from responseData
				
				return  responseData;
			},
		}),
		getPosts: builder.query({
			query: ({ searchParams }) => `/community/posts/search?${searchParams}`,

			transformResponse: (responseData) => {
				// Extract posts and isNext from responseData
				const { posts, isNext } = responseData;
				// No need to use setAll here
				return { posts, isNext };
			},
			providesTags: (result, error, arg) => {
				if (result?.posts) {
					// Generate tags for each post returned by the query
					return [
						{ type: "Post", id: "LIST" },
						...result?.posts?.map((post) => ({ type: "Post", id: post._id })),
					];
				}
				// If no posts are returned, provide a tag for the entire list
				return [{ type: "Post", id: "LIST" }];
			},
		}),
		getUserPosts: builder.query({
			query: ({userId, page}) => `/community/user-posts/${userId}?page=${page}`,

			transformResponse: (responseData) => {
				// Extract posts and isNext from responseData
				const { posts, isNextPosts, totalPosts } = responseData;
				// No need to use setAll here
				return { posts, isNextPosts, totalPosts };
			},
			providesTags: (result, error, arg) => {
				if (result?.posts) {
					// Generate tags for each post returned by the query
					return [
						{ type: "Post", id: "LIST" },
						...result?.posts?.map((post) => ({ type: "UserPost", id: post._id })),
					];
				}
				// If no posts are returned, provide a tag for the entire list
				return [{ type: "UserPost", id: "LIST" }];
			},
		}),
		getUserReplies: builder.query({
			query: ({userId, page}) => `/community/user-replies/${userId}?page=${page}`,

			transformResponse: (responseData) => {
				// Extract replies and isNext from responseData
				const { replies, isNextReplies, totalReplies } = responseData;
				// No need to use setAll here
				return { replies, isNextReplies, totalReplies };
			},
			providesTags: (result, error, arg) => {
				if (result?.replies) {
					// Generate tags for each post returned by the query
					return [
						{ type: "Reply", id: "LIST" },
						...result?.replies?.map((reply) => ({ type: "UserReply", id: reply._id })),
					];
				}
				// If no replies are returned, provide a tag for the entire list
				return [{ type: "UserReply", id: "LIST" }];
			},
		}),
		getSavedPosts: builder.query({
			query: ({ searchParams }) =>
				`/community/posts/saved-posts?${searchParams}`,

			transformResponse: (responseData) => {
				// Extract posts and isNext from responseData
				const { posts, isNext } = responseData;
				// No need to use setAll here
				return { posts, isNext };
			},
			providesTags: (result, error, arg) => {
				return [{ type: "SavedPost", id: "LIST" }];
			},
		}),
		getAllTags: builder.query({
			query: ({ searchParams }) => `/community/tags/all-tags?${searchParams}`,

			transformResponse: (responseData) => {
				// Extract posts and isNext from responseData
				const { tags, isNext } = responseData;
				// No need to use setAll here
				return { tags, isNext };
			},
			providesTags: (result, error, arg) => {
				return [{ type: "AllTag", id: "LIST" }];
			},
		}),
		getReplies: builder.query({
			query: (searchParams) => `/community/replies/search?${searchParams}`,

			transformResponse: (responseData) => {
				// Extract posts and isNext from responseData
				const { replies, isNext } = responseData;
				// No need to use setAll here
				return { replies, isNext };
			},
			providesTags: (result, error, arg) => {
				if (result?.replies) {
					// Generate tags for each reply returned by the query
					return [
						{ type: "Reply", id: "LIST" },
						...result?.replies?.map((reply) => ({
							type: "Reply",
							id: reply._id,
						})),
					];
				}
				// If no replies are returned, provide a tag for the entire list
				return [{ type: "Reply", id: "LIST" }];
			},
		}),
		createPost: builder.mutation({
			query: (data) => ({
				url: "/community/posts/create-post",
				method: "POST",
				body: { ...data },
			}),
			invalidatesTags: [
				{ type: "Post", id: "LIST" },
				{ type: "Post", id: "HOT_LIST" },
				{ type: "Tag", id: "POPULAR_TAGS" },
				{ type: "UserProfile", id: 'USER' }
				
			],
		}),
		editPost: builder.mutation({
			query: (data) => ({
				url: "/community/posts/edit-post",
				method: "PUT",
				body: { ...data },
			}),
			invalidatesTags: (result, error, { postId }) => [
				// { type: "Post", id: "LIST" },
				{ type: "Post", id: postId },
			],
		}),
		getHotPosts: builder.query({
			query: () => `/community/posts/hot`,
			transformResponse: (responseData) => responseData, // You may need to adjust this based on the response format
			providesTags: (result, error, arg) => [{ type: "Post", id: "HOT_LIST" }],
		}),
		getPopularTags: builder.query({
			query: () => `/community/tags/popular`,
			transformResponse: (responseData) => responseData, // You may need to adjust this based on the response format
			providesTags: (result, error, arg) => [
				{ type: "Tag", id: "POPULAR_TAGS" },
			],
		}),
		getPostById: builder.query({
			query: ({ postId }) => `/community/posts/${postId}`,
			transformResponse: (responseData) => responseData, // You may need to adjust this based on the response format
			providesTags: (result, error, { postId }) => [
				{ type: "Post", id: postId },
			],
		}),
		getTopInteractedTags: builder.query({
			query: ({ userId }) => `/community/users/top-interacted-tags/${userId}`,
			transformResponse: (responseData) => responseData, // You may need to adjust this based on the response format
			providesTags: (result, error, { userId }) => [
				{ type: "TopInteractingTags", id: userId },
			],
		}),
		getPostByTagId: builder.query({
			query: ({ tagId, searchParams }) =>
				`/community/tags/get/${tagId}?${searchParams}`,
			transformResponse: (responseData) => responseData, // You may need to adjust this based on the response format
			providesTags: (result, error, { tagId }) => [
				{ type: "AllTag", id: tagId },
			],
		}),
		createReply: builder.mutation({
			query: (data) => ({
				url: "/community/posts/create-reply",
				method: "POST",
				body: { ...data },
			}),
			invalidatesTags: (result, error, { post }) => [
				{ type: "Reply", id: "LIST" },
				{ type: "UserProfile", id: 'USER' },
				
			],
		}),
		viewPost: builder.mutation({
			query: ({ postId, userId }) => ({
				url: "/community/posts/view",
				method: "POST",
				body: { postId, userId },
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: "Post", id: arg.postId },
				{ type: "Post", id: "HOT_LIST" },
			],
		}),
		upvotePost: builder.mutation({
			query: ({ postId, userId, hasupVoted, hasdownVoted }) => ({
				url: `/community/posts/upvote`,
				method: "POST",
				body: {
					postId,
					userId,
					hasupVoted,
					hasdownVoted,
				},
			}),
			async onQueryStarted(
				{ postId, userId, hasupVoted },
				{ dispatch, queryFulfilled }
			) {
				// Update the cache to reflect the reaction instantly
				const patchResult = dispatch(
					postsApiSlice.util.updateQueryData(
						"getPostById",
						{ postId },
						(draft) => {
							// return console.log(draft)
							if (draft) {
								//find if userId is already upvoted
								if (hasupVoted) {
									const newUpvoteArray = draft.upvotes.filter(
										(upvote) => upvote !== userId
									);
									draft.upvotes = [...newUpvoteArray];
								} else {
									const newDownvoteArray = draft.downvotes.filter(
										(downvote) => downvote !== userId
									);
									draft.downvotes = [...newDownvoteArray];
									draft.upvotes.push(userId);
								}
							}
						}
					)
				);

				try {
					// Wait for the mutation to be fulfilled
					await queryFulfilled;
				} catch {
					// If an error occurs, undo the reaction
					patchResult.undo();
				}
			},
			invalidatesTags: (result, error, arg) => [
				{ type: "Post", id: arg.postId },
			],
		}),
		downvotePost: builder.mutation({
			query: ({ postId, userId, hasupVoted, hasdownVoted }) => ({
				url: `/community/posts/downvote`,
				method: "POST",
				body: {
					postId,
					userId,
					hasupVoted,
					hasdownVoted,
				},
			}),
			async onQueryStarted(
				{ postId, userId, hasdownVoted },
				{ dispatch, queryFulfilled }
			) {
				// Update the cache to reflect the reaction instantly
				const patchResult = dispatch(
					postsApiSlice.util.updateQueryData(
						"getPostById",
						{ postId },
						(draft) => {
							// return console.log(draft)
							if (draft) {
								//find if userId is already upvoted
								if (hasdownVoted) {
									const newDownvoteArray = draft.downvotes.filter(
										(downvote) => downvote !== userId
									);
									draft.downvotes = [...newDownvoteArray];
								} else {
									const newUpvoteArray = draft.upvotes.filter(
										(upvote) => upvote !== userId
									);
									draft.upvotes = [...newUpvoteArray];
									draft.downvotes.push(userId);
								}
							}
						}
					)
				);

				try {
					// Wait for the mutation to be fulfilled
					await queryFulfilled;
				} catch {
					// If an error occurs, undo the reaction
					patchResult.undo();
				}
			},
			invalidatesTags: (result, error, arg) => [
				{ type: "Post", id: arg.postId },
			],
		}),
		upvoteReply: builder.mutation({
			query: ({ replyId, userId, hasupVoted, hasdownVoted }) => ({
				url: "/community/replies/upvote",
				method: "POST",
				body: {
					replyId,
					userId,
					hasupVoted,
					hasdownVoted,
				},
			}),
			invalidatesTags: (result, error, { replyId }) => [
				{ type: "Reply", id: replyId },
			],
		}),
		downvoteReply: builder.mutation({
			query: ({ replyId, userId, hasupVoted, hasdownVoted }) => ({
				url: "/community/replies/downvote",
				method: "POST",
				body: {
					replyId,
					userId,
					hasupVoted,
					hasdownVoted,
				},
			}),
			invalidatesTags: (result, error, { replyId }) => [
				{ type: "Reply", id: replyId },
			],
		}),
		toggleSavePost: builder.mutation({
			query: ({ userId, postId }) => ({
				url: "/community/posts/toggle-save",
				method: "POST",
				body: {
					userId,
					postId,
				},
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: "Post", id: arg.postId },
				{ type: "SavedPost", id: "LIST" },
			],
		}),
		toggleSavePost: builder.mutation({
			query: ({ userId, postId }) => ({
				url: "/community/posts/toggle-save",
				method: "POST",
				body: {
					userId,
					postId,
				},
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: "Post", id: arg.postId },
				{ type: "SavedPost", id: "LIST" },
			],
		}),
		deletePost: builder.mutation({
			query: ({ postId }) => ({
				url: `/community/posts/${postId}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: "Post", id: 'LIST' },
				// { type: "SavedPost", id: "LIST" },
				{ type: "Tag", id: "POPULAR_TAGS" },
				{ type: "Post", id: "HOT_LIST" }
			],
		}),
	}),
});

export const {
	useGlobalSearchQuery,
	useGetPostsQuery,
	useGetUserPostsQuery,
	useGetUserRepliesQuery,
	useGetRepliesQuery,
	useCreatePostMutation,
	useEditPostMutation,
	useGetHotPostsQuery,
	useGetPopularTagsQuery,
	useGetPostByIdQuery,
	useGetTopInteractedTagsQuery,
	useCreateReplyMutation,
	useViewPostMutation,
	useUpvotePostMutation,
	useDownvotePostMutation,
	useUpvoteReplyMutation,
	useDownvoteReplyMutation,
	useToggleSavePostMutation,
	useGetSavedPostsQuery,
	useGetAllTagsQuery,
	useGetPostByTagIdQuery,
	useDeletePostMutation
} = postsApiSlice;
