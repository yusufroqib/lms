import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "@/app/api/apiSlice";

const usersAdapter = createEntityAdapter({});
const myInfoAdapter = createEntityAdapter({});

const initialState = usersAdapter.getInitialState();
const myInitialState = myInfoAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getMyDetails: builder.query({
			query: () => ({
				url: "/users/me",
				validateStatus: (response, result) => {
					return response.status === 200 && !result.isError;
				},
			}),
			transformResponse: (responseData) => {
				// console.log(responseData)
				const loggedUser = responseData.user;
				loggedUser.id = loggedUser._id;
				// console.log(loggedUser)

				return myInfoAdapter.addOne(myInitialState, loggedUser);
			},
			providesTags: (result, error, arg) => [{ type: "MyInfo", id: "ME" }],
		}),
		getAllUsers: builder.query({
			query: ({ searchParams }) => `/community/users/all-users?${searchParams}`,

			transformResponse: (responseData) => {
				// Extract users and isNext from responseData
				const { users, isNext } = responseData;
				// No need to use setAll here
				return { users, isNext };
			},
			providesTags: (result, error, arg) => {
				if (result?.users) {
					// Generate tags for each user returned by the query
					return [
						{ type: "User", id: "LIST" },
						...result?.users?.map((user) => ({ type: "User", id: user._id })),
					];
				}
				// If no users are returned, provide a tag for the entire list
				return [{ type: "User", id: "LIST" }];
			},
		}),

		updateUser: builder.mutation({
			query: (initialUserData) => ({
				url: "/users",
				method: "PATCH",
				body: {
					...initialUserData,
				},
			}),
			invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
		}),
		deleteUser: builder.mutation({
			query: ({ id }) => ({
				url: `/users`,
				method: "DELETE",
				body: { id },
			}),
			invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
		}),
		getUserById: builder.query({
			query: (userId) => `/community/users/${userId}`,
			transformResponse: (responseData) => responseData, // You may need to adjust this based on the response format
			providesTags: (result, error, userId) => [{ type: "UserID", id: userId }],
		}),
		getUserInfo: builder.query({
			query: (user) => `/community/users/profile/${user}`,
			transformResponse: (responseData) => responseData, // You may need to adjust this based on the response format
			providesTags: (result, error, user) => [
				{ type: "UserProfile", id: 'USER' },
			],
		}),
	}),
});

export const {
	useGetMyDetailsQuery,
	useGetAllUsersQuery,
	useAddNewUserMutation,
	useUpdateUserMutation,
	useDeleteUserMutation,
	useGetUserByIdQuery,
	useGetUserInfoQuery
} = usersApiSlice;

// // returns the query result object
// export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

// // creates memoized selector
// const selectUsersData = createSelector(
// 	selectUsersResult,
// 	(usersResult) => usersResult.data // normalized state object with ids & entities
// );

// //getSelectors creates these selectors and we rename them with aliases using destructuring
// export const {
// 	selectAll: selectAllUsers,
// 	selectById: selectUserById,
// 	selectIds: selectUserIds,
// 	// Pass in a selector that returns the users slice of state
// } = usersAdapter.getSelectors(
// 	(state) => selectUsersData(state) ?? initialState
// );
