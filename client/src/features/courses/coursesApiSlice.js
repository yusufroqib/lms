import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "@/app/api/apiSlice";

const coursesAdapter = createEntityAdapter({});
const tutorCoursesAdapter = createEntityAdapter({});

const initialState = coursesAdapter.getInitialState();
const tutorInitialState = tutorCoursesAdapter.getInitialState();

export const coursesApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getCourses: builder.query({
			query: () => ({
				url: "/courses",
				validateStatus: (response, result) => {
					return response.status === 200 && !result.isError;
				},
			}),
			transformResponse: (responseData) => {
				const allCourses = responseData.map((course) => {
					course.id = course._id;
					return course;
				});
				return coursesAdapter.setAll(initialState, allCourses);
			},
			providesTags: (result, error, arg) => {
				if (result?.ids) {
					return [
						{ type: "Course", id: "LIST" },
						...result.ids.map((id) => ({ type: "Course", id })),
					];
				} else return [{ type: "Course", id: "LIST" }];
			},
		}),
		getTutorCourses: builder.query({
			query: () => ({
				url: `/tutors/all-courses`,
				validateStatus: (response, result) => {
					return response.status === 200 && !result.isError;
				},
			}),
			transformResponse: (responseData) => {
				console.log(responseData);
				const tutorCourses = responseData.map((course) => {
					course.id = course._id;
					return course;
				});
				return tutorCoursesAdapter.setAll(tutorInitialState, tutorCourses);
			},

			providesTags: (result, error, arg) => {
				if (result?.ids) {
					return [
						{ type: "TutorCourse", id: "LIST" },
						...result.ids.map((id) => ({ type: "TutorCourse", id })),
					];
				} else return [{ type: "TutorCourse", id: "LIST" }];
			},
		}),
		createCourseTitle: builder.mutation({
			query: (data) => ({
				url: "/tutors/create-title",
				method: "POST",
				body: { ...data },
			}),
			invalidatesTags: [{ type: "TutorCourse", id: "LIST" }],
		}),
	}),
});

export const {
	useGetCoursesQuery,
	useGetTutorCoursesQuery,
	useCreateCourseTitleMutation,
} = coursesApiSlice;

// export const selectallCoursesResult = coursesApiSlice.endpoints.getCourses.select();
// export const selectTutorCoursesResult = coursesApiSlice.endpoints.getTutorCourses.select()

// // creates memoized selector
// const selecAllCoursesData = createSelector(
// 	selectallCoursesResult,
// 	(coursesResult) => coursesResult.data // normalized state object with ids & entities
// );

// const selecAllTutorCoursesData = createSelector(
// 	selectTutorCoursesResult,
// 	(tutorCoursesResult) => tutorCoursesResult.data // normalized state object with ids & entities
// );

// //getSelectors creates these selectors and we rename them with aliases using destructuring
// export const {
// 	selectAll: selectAllUsers,
// 	selectById: selectUserById,
// 	selectIds: selectUserIds,
// 	// Pass in a selector that returns the users slice of state
// } = coursesAdapter.getSelectors(
// 	(state) => selecAllCoursesData(state) ?? initialState
// );

// export const {
//     selectAll: selectAllTutorCourses,
//     selectById: selectTutorCourseById,
//     selectIds: selectTutorCourseIds,
// } = tutorCoursesAdapter.getSelectors(
//     (state) => selecAllTutorCoursesData(state) ?? tutorInitialState
// )
