import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "@/app/api/apiSlice";

const coursesAdapter = createEntityAdapter({});
const tutorCoursesAdapter = createEntityAdapter({});
const courseCategoriesAdapter = createEntityAdapter({});
const enrolledCoursesAdapter = createEntityAdapter({});
const studyTimeSummaryAdapter = createEntityAdapter({});

const initialState = coursesAdapter.getInitialState();
const tutorInitialState = tutorCoursesAdapter.getInitialState();
const enrolledInitialState = enrolledCoursesAdapter.getInitialState();
const courseCategoriesInitialState = courseCategoriesAdapter.getInitialState();
const studyTimeSummaryInitialState = studyTimeSummaryAdapter.getInitialState();

export const coursesApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getCourses: builder.query({
			query: ({ searchParams }) => {
				// console.log("searchQuery", searchParams);
				return {
					url: `/courses/search?${searchParams}`,
					validateStatus: (response, result) => {
						return response.status === 200 && !result.isError;
					},
				};
			},
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
		getCourseCategories: builder.query({
			query: () => ({
				url: "/tutors/course-categories",
				validateStatus: (response, result) => {
					return response.status === 200 && !result.isError;
				},
			}),
			transformResponse: (responseData) => {
				const allCategories = responseData.map((category) => {
					category.id = category._id;
					return category;
				});
				return courseCategoriesAdapter.setAll(
					courseCategoriesInitialState,
					allCategories
				);
			},
		}),
		getCourseReviews: builder.query({
			query: ({courseId, page}) => ({
				url: `/courses/${courseId}/reviews?page=${page}`,
				validateStatus: (response, result) => {
					return response.status === 200 && !result.isError;
				},
			}),
			transformResponse: (responseData) => {
				return responseData;
			},
		}),
		addCourseReview: builder.mutation({
			query: ({courseId, ...userReview}) => ({
				url: `/courses/${courseId}/reviews`,
				method: "POST",
				body: userReview,
				validateStatus: (response, result) => {
					return response.status === 200 && !result.isError;
				},
			}),
			transformResponse: (responseData) => {
				return responseData;
			},
			invalidatesTags: ["Course"],
		}),
		
		getTutorCourses: builder.query({
			query: () => ({
				url: `/tutors/all-courses`,
				validateStatus: (response, result) => {
					return response.status === 200 && !result.isError;
				},
			}),
			transformResponse: (responseData) => {
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
		getTutorStats: builder.query({
			query: () => ({
				url: `/tutors/stats`,
				validateStatus: (response, result) => {
					return response.status === 200 && !result.isError;
				},
			}),
			transformResponse: (responseData) => {
				return responseData;
			},
		}),
		getTutorTopCourses: builder.query({
			query: () => ({
				url: `/tutors/top-courses`,
				validateStatus: (response, result) => {
					return response.status === 200 && !result.isError;
				},
			}),
			transformResponse: (responseData) => {
				return responseData;
			},
		}),

		// get courses that the user is enrolled in
		getEnrolledCourses: builder.query({
			query: () => ({
				url: `/courses/all-enrolled`,
				validateStatus: (response, result) => {
					return response.status === 200 && !result.isError;
				},
			}),
			transformResponse: (responseData) => {
				const enrolledCourses = responseData.enrolledCourses.map((course) => {
					course.id = course._id;
					return course;
				});
				return enrolledCoursesAdapter.setAll(
					enrolledInitialState,
					enrolledCourses
				);
			},

			providesTags: (result, error, arg) => {
				if (result?.ids) {
					return [
						{ type: "EnrolledCourse", id: "LIST" },
						...result.ids.map((id) => ({ type: "EnrolledCourse", id })),
					];
				} else return [{ type: "EnrolledCourse", id: "LIST" }];
			},
		}),
		getTutorEarnings: builder.query({
			query: ({ startDate, endDate }) => ({
				url: `/tutors/earnings?startDate=${startDate}&endDate=${endDate}`,
				// params: { startDate, endDate, groupBy },
				validateStatus: (response, result) => {
					return response.status === 200 && !result.isError;
				},
			}),

			transformResponse: (responseData) => {
				return responseData
				
			},			
		}),
		getTutorCoursesSold: builder.query({
			query: () => ({
				url: `/tutors/course-transactions`,
				// params: { startDate, endDate, groupBy },
				validateStatus: (response, result) => {
					return response.status === 200 && !result.isError;
				},
			}),

			transformResponse: (responseData) => {
				return responseData
				
			},

		}),
		getStudyTime: builder.query({
			query: ({ startDate, endDate, groupBy }) => ({
				url: `/courses/study-time?startDate=${startDate}&endDate=${endDate}&groupBy=${groupBy}`,
				// params: { startDate, endDate, groupBy },
				validateStatus: (response, result) => {
					return response.status === 200 && !result.isError;
				},
			}),

			transformResponse: (responseData) => {
				return responseData
				// console.log(responseData)
				// const summary = responseData.map((item) => {
				// 	item.id = item._id;
				// 	return item;
				// });
				// // console.log(summary);
				// return studyTimeSummaryAdapter.setAll(
				// 	studyTimeSummaryInitialState,
				// 	summary
				// );
			},

			providesTags: (result, error, arg) => {
				if (result?.ids) {
					return [
						{ type: "StudyTimeSummary", id: "LIST" },
						...result.ids.map((id) => ({ type: "StudyTimeSummary", id })),
					];
				} else return [{ type: "StudyTimeSummary", id: "LIST" }];
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
		updateCourse: builder.mutation({
			query: ({ id, ...data }) => ({
				url: `/tutors/edit-course/${id}`,
				method: "PUT",
				body: { ...data },
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: "TutorCourse", id: arg.id },
				{ type: "Course", id: "LIST" },
			],
			onQueryStarted: (arg, { dispatch, queryFulfilled }) => {
				const patchResult = dispatch(
					coursesApiSlice.util.updateQueryData(
						"getCourses",
						"allTutorCourses",
						(draft) => {
							const course = draft.entities[arg.id];
							if (course) {
								Object.assign(course, arg.data);
							}
						}
					)
				);
				return queryFulfilled.catch(() => patchResult); // reset the query if the patch fails
			},
		}),
		deleteCourse: builder.mutation({
			query: ({ id }) => ({
				url: `/tutors/edit-course/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: "TutorCourse", id: arg.id },
				{ type: "Course", id: "LIST" },
			],
		}),
		updateCategory: builder.mutation({
			query: ({ id, ...data }) => ({
				url: `/tutors/edit-course/${id}/category`,
				method: "PUT",
				body: { ...data },
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: "TutorCourse", id: arg.id },
				{ type: "Course", id: "LIST" },
			],
		}),
		toggleCoursePublish: builder.mutation({
			query: ({ id }) => ({
				url: `/tutors/edit-course/${id}/toggle-publish`,
				method: "PUT",
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: "TutorCourse", id: arg.id },
				{ type: "Course", id: "LIST" },
			],
		}),
		createChapter: builder.mutation({
			query: ({ id, ...data }) => ({
				url: `/tutors/edit-course/${id}/create-chapter`,
				method: "PUT",
				body: { ...data },
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: "TutorCourse", id: arg.id },
			],
		}),
		reorderChapters: builder.mutation({
			query: ({ id, ...data }) => ({
				url: `/tutors/edit-course/${id}/reorder-chapters`,
				method: "PUT",
				body: { ...data },
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: "TutorCourse", id: arg.id },
			],
		}),
		updateChapter: builder.mutation({
			query: ({ courseId, chapterId, ...data }) => ({
				url: `/tutors/edit-course/${courseId}/chapter/${chapterId}`,
				method: "PUT",
				body: { ...data },
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: "TutorCourse", id: arg.courseId },
			],
		}),
		toggleChapterPublish: builder.mutation({
			query: ({ courseId, chapterId }) => ({
				url: `/tutors/edit-course/${courseId}/chapter/${chapterId}/toggle-publish`,
				method: "PUT",
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: "TutorCourse", id: arg.courseId },
				{ type: "Course", id: "LIST" },
			],
		}),
		deleteChapter: builder.mutation({
			query: ({ courseId, chapterId }) => ({
				url: `/tutors/edit-course/${courseId}/chapter/${chapterId}`,
				method: "DELETE",
				// body: { ...data },
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: "TutorCourse", id: arg.courseId },
				{ type: "Course", id: "LIST" },
			],
		}),

		updateChapterAttachment: builder.mutation({
			query: ({ courseId, chapterId, ...data }) => ({
				url: `/tutors/edit-course/${courseId}/chapter/${chapterId}/attachment`,
				method: "PUT",
				body: { ...data },
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: "TutorCourse", id: arg.courseId },
			],
		}),
		deleteChapterAttachment: builder.mutation({
			query: ({ courseId, chapterId, ...data }) => ({
				url: `/tutors/edit-course/${courseId}/chapter/${chapterId}/attachment`,
				method: "DELETE",
				body: { ...data },
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: "TutorCourse", id: arg.courseId },
			],
		}),
		purchaseCourse: builder.mutation({
			query: ({ courseId }) => ({
				url: `/courses/${courseId}/purchase`,
				method: "POST",
			}),
			invalidatesTags: [{ type: "Course", id: "LIST" }],
		}),

		recordStudyTime: builder.mutation({
			query: ({ courseId, duration }) => ({
				url: `/courses/study-time`,
				method: "POST",
				body: {
					courseId,
					duration,
				},
			}),
			invalidatesTags: [{ type: "Course", id: "LIST" }],
		}),
		updateChapterProgress: builder.mutation({
			query: ({ courseId, chapterId }) => ({
				url: `/courses/${courseId}/chapter/${chapterId}/progress`,
				method: "PUT",
			}),
			invalidatesTags: [{ type: "EnrolledCourse", id: "LIST" }],
		}),
	}),
});

export const {
	useGetCoursesQuery,
	useGetCourseCategoriesQuery,
	useGetTutorCoursesQuery,
	useGetCourseReviewsQuery,
	useAddCourseReviewMutation,
	useGetTutorEarningsQuery,
	useGetStudyTimeQuery,
	useGetTutorStatsQuery,
	useGetTutorTopCoursesQuery,
	useGetTutorCoursesSoldQuery,
	useGetEnrolledCoursesQuery,
	useCreateCourseTitleMutation,
	useUpdateCourseMutation,
	useDeleteCourseMutation,
	useUpdateCategoryMutation,
	useToggleChapterPublishMutation,
	useCreateChapterMutation,
	useReorderChaptersMutation,
	useUpdateChapterMutation,
	useDeleteChapterMutation,
	useUpdateChapterAttachmentMutation,
	useDeleteChapterAttachmentMutation,
	useToggleCoursePublishMutation,
	usePurchaseCourseMutation,
	useUpdateChapterProgressMutation,
	useRecordStudyTimeMutation,
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
