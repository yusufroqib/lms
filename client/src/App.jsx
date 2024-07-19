import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ROLES } from "../config/roles";
import RequireAuth from "./features/auth/RequireAuth";
import PersistLogin from "./features/auth/PersistLogin";
import Prefetch from "./features/auth/Prefetch";

// Lazy load components
const RootLayout = lazy(() => import("./components/layouts/RootLayout"));
const CommunityLayout = lazy(() => import("./pages/community/CommunityLayout"));
const LiveClassroomLayout = lazy(() =>
	import("./pages/classroom/liveClassroomApp/layout/LiveClassroomLayout")
);
const AuthPage = lazy(() => import("./pages/auth/AuthPage"));
const SignUpOTP = lazy(() => import("./pages/auth/SignUpOTPPage"));
const CoursesIndex = lazy(() => import("./pages/courses/CoursesIndex"));
const TutorCourses = lazy(() => import("./pages/tutor/courses/TutorCourses"));
const CreateCourse = lazy(() =>
	import("./pages/tutor/courses/createCourse/CreateCourse")
);
const EditCourse = lazy(() =>
	import("./pages/tutor/courses/editCourse/EditCourse")
);
const EditChapter = lazy(() =>
	import("./pages/tutor/courses/editCourse/editChapter/EditChapter")
);
const BrowseCourses = lazy(() =>
	import("./pages/courses/browseCourses/BrowseCourses")
);
const CourseInfo = lazy(() => import("./pages/courses/courseInfo/CourseInfo"));
const StudyPage = lazy(() => import("./pages/courses/studyPage/StudyPage"));
const StudyIndex = lazy(() => import("./pages/courses/studyPage/StudyIndex"));
const EnrolledCourses = lazy(() =>
	import("./pages/courses/enrolledCourses/EnrolledCourses")
);
const Feeds = lazy(() => import("./pages/community/feeds/Feeds"));
const CreatePost = lazy(() =>
	import("./pages/community/posts/createPost/CreatePost")
);
const PostPage = lazy(() =>
	import("./pages/community/posts/viewPost/PostPage")
);
const MyCollection = lazy(() =>
	import("./pages/community/myCollection/MyCollection")
);
const AllTags = lazy(() => import("./pages/community/tags/allTags/AllTags"));
const TagPosts = lazy(() => import("./pages/community/tags/tagPosts/TagPosts"));
const EditPost = lazy(() =>
	import("./pages/community/posts/editPost/EditPost")
);
const Users = lazy(() => import("./pages/community/users/allUsers/Users"));
const PublicProfile = lazy(() =>
	import("./pages/community/users/publicProfile/PublicProfile")
);
const Messages = lazy(() => import("./pages/messages/Messages"));
const Classrooms = lazy(() => import("./pages/classroom/Classrooms"));
const Upcoming = lazy(() =>
	import("./pages/classroom/liveClassroomApp/upcoming/Upcoming")
);
const Previous = lazy(() =>
	import("./pages/classroom/liveClassroomApp/previous/Previous")
);
const Ongoing = lazy(() =>
	import("./pages/classroom/liveClassroomApp/ongoing/Ongoing")
);
const ClassroomHome = lazy(() =>
	import("./pages/classroom/liveClassroomApp/classroomHome/classroomHome")
);
const MeetingPage = lazy(() =>
	import("./pages/classroom/liveClassroomApp/meeting/MeetingPage")
);
const StripeOnboardingRefresh = lazy(() =>
	import("./pages/tutor/stripe/StripeOnboardingRefresh")
);
const StripeOnboardingComplete = lazy(() =>
	import("./pages/tutor/stripe/StripeOnboardingComplete")
);
const Withdraw = lazy(() => import("./pages/tutor/withdraw/Withdraw"));
const DashboardPage = lazy(() => import("./pages/dashboard/DashboardPage"));
const ProfilePage = lazy(() => import("./pages/profile/ProfilePage"));
const NotFoundPage = lazy(() => import("./components/NotFoundPage"));

import Home from "./pages/home/Home";
import RequireTutor from "./pages/tutor/ProtectTutor";
import { Loader2 } from "lucide-react";

// Fallback components
const DefaultFallback = () => <div>Loading...</div>;
const LayoutFallback = () => (
	<div className="flex min-h-[80vh] justify-center items-center">
		<Loader2 key="loader" className="mr-2 h-10 w-10 animate-spin" />
	</div>
);
const PageFallback = () => (
	<div className="flex min-h-[80vh] justify-center items-center">
		<Loader2 key="loader" className="mr-2 h-10 w-10 animate-spin" />
	</div>
);

function App() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route
				path="/auth"
				element={
					<Suspense fallback={<PageFallback />}>
						<AuthPage />
					</Suspense>
				}
			/>
			<Route
				path="/verify"
				element={
					<Suspense fallback={<PageFallback />}>
						<SignUpOTP />
					</Suspense>
				}
			/>
			<Route element={<PersistLogin />}>
				<Route
					element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
				>
					<Route element={<Prefetch />}>
						<Route
							element={
								<Suspense fallback={<LayoutFallback />}>
									<RootLayout />
								</Suspense>
							}
						>
							<Route
								path="dashboard"
								element={
									<Suspense fallback={<PageFallback />}>
										<DashboardPage />
									</Suspense>
								}
							/>
							<Route
								path="profile"
								element={
									<Suspense fallback={<PageFallback />}>
										<ProfilePage />
									</Suspense>
								}
							/>
							<Route
								path="messages"
								element={
									<Suspense fallback={<PageFallback />}>
										<Messages />
									</Suspense>
								}
							/>
							<Route path="courses">
								<Route
									index
									element={
										<Suspense fallback={<PageFallback />}>
											<CoursesIndex />
										</Suspense>
									}
								/>
								<Route
									path="search"
									element={
										<Suspense fallback={<PageFallback />}>
											<BrowseCourses />
										</Suspense>
									}
								/>
								<Route
									path=":courseId/info"
									element={
										<Suspense fallback={<PageFallback />}>
											<CourseInfo />
										</Suspense>
									}
								/>
								<Route
									path="enrolled-courses"
									element={
										<Suspense fallback={<PageFallback />}>
											<EnrolledCourses />
										</Suspense>
									}
								/>
							</Route>
							<Route
								path="tutors"
								element={<RequireTutor allowedRoles={[ROLES.Tutor]} />}
							>
								<Route
									path="my-courses"
									element={
										<Suspense fallback={<PageFallback />}>
											<TutorCourses />
										</Suspense>
									}
								/>
								<Route
									path="create-course"
									element={
										<Suspense fallback={<PageFallback />}>
											<CreateCourse />
										</Suspense>
									}
								/>
								<Route
									path="edit-course/:courseId"
									element={
										<Suspense fallback={<PageFallback />}>
											<EditCourse />
										</Suspense>
									}
								/>
								<Route
									path="edit-course/:courseId/chapter/:chapterId"
									element={
										<Suspense fallback={<PageFallback />}>
											<EditChapter />
										</Suspense>
									}
								/>
								<Route
									path="stripe-connect/refresh"
									element={
										<Suspense fallback={<PageFallback />}>
											<StripeOnboardingRefresh />
										</Suspense>
									}
								/>
								<Route
									path="stripe-connect/complete"
									element={
										<Suspense fallback={<PageFallback />}>
											<StripeOnboardingComplete />
										</Suspense>
									}
								/>
								<Route
									path="withdraw"
									element={
										<Suspense fallback={<PageFallback />}>
											<Withdraw />
										</Suspense>
									}
								/>
							</Route>
							<Route
								path="community"
								element={
									<Suspense fallback={<LayoutFallback />}>
										<CommunityLayout />
									</Suspense>
								}
							>
								<Route
									path="feeds"
									element={
										<Suspense fallback={<PageFallback />}>
											<Feeds />
										</Suspense>
									}
								/>
								<Route
									path="my-collection"
									element={
										<Suspense fallback={<PageFallback />}>
											<MyCollection />
										</Suspense>
									}
								/>
								<Route
									path="all-tags"
									element={
										<Suspense fallback={<PageFallback />}>
											<AllTags />
										</Suspense>
									}
								/>
								<Route
									path="users"
									element={
										<Suspense fallback={<PageFallback />}>
											<Users />
										</Suspense>
									}
								/>
								<Route
									path="profile/:user"
									element={
										<Suspense fallback={<PageFallback />}>
											<PublicProfile />
										</Suspense>
									}
								/>
								<Route
									path="tags/:tagId"
									element={
										<Suspense fallback={<PageFallback />}>
											<TagPosts />
										</Suspense>
									}
								/>
								<Route path="posts">
									<Route
										path="create-post"
										element={
											<Suspense fallback={<PageFallback />}>
												<CreatePost />
											</Suspense>
										}
									/>
									<Route
										path=":postId"
										element={
											<Suspense fallback={<PageFallback />}>
												<PostPage />
											</Suspense>
										}
									/>
									<Route
										path="edit-post/:postId"
										element={
											<Suspense fallback={<PageFallback />}>
												<EditPost />
											</Suspense>
										}
									/>
								</Route>
							</Route>
							<Route path="classrooms">
								<Route
									index
									element={
										<Suspense fallback={<PageFallback />}>
											<Classrooms />
										</Suspense>
									}
								/>
								<Route
									element={
										<Suspense fallback={<LayoutFallback />}>
											<LiveClassroomLayout />
										</Suspense>
									}
								>
									<Route path=":classroomId">
										<Route
											index
											element={
												<Suspense fallback={<PageFallback />}>
													<ClassroomHome />
												</Suspense>
											}
										/>
										<Route
											path="ongoing"
											element={
												<Suspense fallback={<PageFallback />}>
													<Ongoing />
												</Suspense>
											}
										/>
										<Route
											path="upcoming"
											element={
												<Suspense fallback={<PageFallback />}>
													<Upcoming />
												</Suspense>
											}
										/>
										<Route
											path="previous"
											element={
												<Suspense fallback={<PageFallback />}>
													<Previous />
												</Suspense>
											}
										/>
										<Route path="meeting">
											<Route
												path=":callId"
												element={
													<Suspense fallback={<PageFallback />}>
														<MeetingPage />
													</Suspense>
												}
											/>
										</Route>
									</Route>
								</Route>
							</Route>
						</Route>
						<Route path="study/:courseId">
							<Route
								index
								element={
									<Suspense fallback={<PageFallback />}>
										<StudyIndex />
									</Suspense>
								}
							/>
							<Route
								path="chapter/:chapterId"
								element={
									<Suspense fallback={<PageFallback />}>
										<StudyPage />
									</Suspense>
								}
							/>
						</Route>
					</Route>
				</Route>
			</Route>
			<Route
				path="*"
				element={
					<Suspense fallback={<PageFallback />}>
						<NotFoundPage />
					</Suspense>
				}
			/>
		</Routes>
	);
}

export default App;
