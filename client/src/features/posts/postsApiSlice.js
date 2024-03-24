import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "@/app/api/apiSlice";

const postsAdapter = createEntityAdapter({});

const initialState = postsAdapter.getInitialState({
	isNext: false, // Add isNext property to initial state
	posts: [],
});

export const postsApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
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
						...result.posts.map((post) => ({ type: "Post", id: post._id })),
					];
				}
				// If no posts are returned, provide a tag for the entire list
				return [{ type: "Post", id: "LIST" }];
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
						...result.replies.map((reply) => ({
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
			invalidatesTags: [{ type: "Post", id: "LIST" }],
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
				{ type: "Tag", id: "POPULAR_LIST" },
			],
		}),
		getPostById: builder.query({
			query: ({ postId }) => `/community/posts/${postId}`,
			transformResponse: (responseData) => responseData, // You may need to adjust this based on the response format
			providesTags: (result, error, { postId }) => [
				{ type: "Post", id: postId },
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
			],
        }),
	}),
});

export const {
	useGetPostsQuery,
	useGetRepliesQuery,
	useCreatePostMutation,
	useGetHotPostsQuery,
	useGetPopularTagsQuery,
	useGetPostByIdQuery,
	useCreateReplyMutation,
	useViewPostMutation,
} = postsApiSlice;
