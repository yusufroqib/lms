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
					return result.posts.map((post) => ({ type: "Post", id: post.id }));
				}
				// If no posts are returned, provide a tag for the entire list
				return [{ type: "Post", id: "LIST" }];
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
	}),
});

export const { useGetPostsQuery, useCreatePostMutation  } = postsApiSlice;
