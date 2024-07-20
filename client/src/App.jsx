import Feeds from "./pages/community/feeds/Feeds";
import Home from "./pages/home/Home";
import NotFoundPage from "./components/NotFoundPage";
import Ongoing from "./pages/classroom/liveClassroomApp/ongoing/Ongoing";
import Previous from "./pages/classroom/liveClassroomApp/previous/Previous";
import React, { lazy, Suspense } from "react";
import RequireAuth from "./features/auth/RequireAuth";
import RequireTutor from "./pages/tutor/ProtectTutor";
import { ROLES } from "../config/roles";
import { Routes, Route } from "react-router-dom";
import SuspenseWrapper from "./components/layouts/SuspenseWrapper";
import Upcoming from "./pages/classroom/liveClassroomApp/upcoming/Upcoming";
import Withdraw from "./pages/tutor/withdraw/Withdraw";
import RootLayout from "./components/layouts/RootLayout";

// Lazy imports (constants)
const AllTags = lazy(() => import("./pages/community/tags/allTags/AllTags"));
const AuthPage = lazy(() => import("./pages/auth/AuthPage"));
const BrowseCourses = lazy(() =>
	import("./pages/courses/browseCourses/BrowseCourses")
);
const ClassroomHome = lazy(() =>
	import("./pages/classroom/liveClassroomApp/classroomHome/classroomHome")
);
const Classrooms = lazy(() => import("./pages/classroom/Classrooms"));
const CommunityLayout = lazy(() => import("./pages/community/CommunityLayout"));
const CourseInfo = lazy(() => import("./pages/courses/courseInfo/CourseInfo"));
const CoursesIndex = lazy(() => import("./pages/courses/CoursesIndex"));
const CreateCourse = lazy(() =>
	import("./pages/tutor/courses/createCourse/CreateCourse")
);
const CreatePost = lazy(() =>
	import("./pages/community/posts/createPost/CreatePost")
);
const DashboardPage = lazy(() => import("./pages/dashboard/DashboardPage"));
const EditChapter = lazy(() =>
	import("./pages/tutor/courses/editCourse/editChapter/EditChapter")
);
const EditCourse = lazy(() =>
	import("./pages/tutor/courses/editCourse/EditCourse")
);
const EditPost = lazy(() =>
	import("./pages/community/posts/editPost/EditPost")
);
const EnrolledCourses = lazy(() =>
	import("./pages/courses/enrolledCourses/EnrolledCourses")
);
const LiveClassroomLayout = lazy(() =>
	import("./pages/classroom/liveClassroomApp/layout/LiveClassroomLayout")
);
const MeetingPage = lazy(() =>
	import("./pages/classroom/liveClassroomApp/meeting/MeetingPage")
);
const Messages = lazy(() => import("./pages/messages/Messages"));
const MyCollection = lazy(() =>
	import("./pages/community/myCollection/MyCollection")
);
const PersistLogin = lazy(() => import("./features/auth/PersistLogin"));
const PostPage = lazy(() =>
	import("./pages/community/posts/viewPost/PostPage")
);
const Prefetch = lazy(() => import("./features/auth/Prefetch"));
const ProfilePage = lazy(() => import("./pages/profile/ProfilePage"));
const PublicProfile = lazy(() =>
	import("./pages/community/users/publicProfile/PublicProfile")
);
// const RootLayout = lazy(() => import("./components/layouts/RootLayout"));
const SignUpOTP = lazy(() => import("./pages/auth/SignUpOTPPage"));
const StripeOnboardingComplete = lazy(() =>
	import("./pages/tutor/stripe/StripeOnboardingComplete")
);
const StripeOnboardingRefresh = lazy(() =>
	import("./pages/tutor/stripe/StripeOnboardingRefresh")
);
const StudyIndex = lazy(() => import("./pages/courses/studyPage/StudyIndex"));
const StudyPage = lazy(() => import("./pages/courses/studyPage/StudyPage"));
const TagPosts = lazy(() => import("./pages/community/tags/tagPosts/TagPosts"));
const TutorCourses = lazy(() => import("./pages/tutor/courses/TutorCourses"));
const Users = lazy(() => import("./pages/community/users/allUsers/Users"));

function App() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route element={<SuspenseWrapper />}>
				<Route path="/auth" element={<AuthPage />} />
				<Route path="/verify" element={<SignUpOTP />} />
			</Route>
			<Route element={<PersistLogin />}>
				<Route
					element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
				>
					<Route element={<Prefetch />}>
						<Route element={<RootLayout />}>
							<Route element={<SuspenseWrapper />}>
								<Route path="dashboard" element={<DashboardPage />} />
								<Route path="profile" element={<ProfilePage />} />
								<Route path="messages" element={<Messages />} />
								<Route path="courses">
									<Route index element={<CoursesIndex />} />
									<Route path="search" element={<BrowseCourses />} />
									<Route path=":courseId/info" element={<CourseInfo />} />
									<Route
										path="enrolled-courses"
										element={<EnrolledCourses />}
									/>
								</Route>
								<Route
									path="tutors"
									element={<RequireTutor allowedRoles={[ROLES.Tutor]} />}
								>
									<Route path="my-courses" element={<TutorCourses />} />
									<Route path="create-course" element={<CreateCourse />} />
									<Route
										path="edit-course/:courseId"
										element={<EditCourse />}
									/>
									<Route
										path="edit-course/:courseId/chapter/:chapterId"
										element={<EditChapter />}
									/>
									<Route
										path="stripe-connect/refresh"
										element={<StripeOnboardingRefresh />}
									/>
									<Route
										path="stripe-connect/complete"
										element={<StripeOnboardingComplete />}
									/>
									<Route path="withdraw" element={<Withdraw />} />
								</Route>
								<Route path="community" element={<CommunityLayout />}>
									<Route path="feeds" element={<Feeds />} />
									<Route path="my-collection" element={<MyCollection />} />
									<Route path="all-tags" element={<AllTags />} />
									<Route path="users" element={<Users />} />
									<Route path="profile/:user" element={<PublicProfile />} />
									<Route path="tags/:tagId" element={<TagPosts />} />
									<Route path="posts">
										<Route path="create-post" element={<CreatePost />} />
										<Route path=":postId" element={<PostPage />} />
										<Route path="edit-post/:postId" element={<EditPost />} />
									</Route>
								</Route>
								<Route path="classrooms">
									<Route index element={<Classrooms />} />
									<Route element={<LiveClassroomLayout />}>
										<Route path=":classroomId">
											<Route index element={<ClassroomHome />} />
											<Route path="ongoing" element={<Ongoing />} />
											<Route path="upcoming" element={<Upcoming />} />
											<Route path="previous" element={<Previous />} />
											<Route path="meeting">
												<Route path=":callId" element={<MeetingPage />} />
											</Route>
										</Route>
									</Route>
								</Route>
							</Route>
						</Route>
						<Route path="study/:courseId">
							<Route element={<SuspenseWrapper />}>
								<Route index element={<StudyIndex />} />
								<Route path="chapter/:chapterId" element={<StudyPage />} />
							</Route>
						</Route>
					</Route>
				</Route>
			</Route>
			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	);
}

export default App;
