import { Routes, Route, Navigate } from "react-router-dom";

import AuthPage from "./pages/auth/AuthPage";
import SignUpOTP from "./pages/auth/SignUpOTPPage";
import Dashboard from "./pages/dashboard/DashboardPage";
import RootLayout from "./components/layouts/RootLayout";
import { ROLES } from "../config/roles";
import RequireAuth from "./features/auth/RequireAuth";
import PersistLogin from "./features/auth/PersistLogin";
import Prefetch from "./features/auth/Prefetch";
import CoursesIndex from "./pages/courses/CoursesIndex";
import TutorCourses from "./pages/tutor/courses/TutorCourses";
import CreateCourse from "./pages/tutor/courses/createCourse/CreateCourse";
import EditCourse from "./pages/tutor/courses/editCourse/EditCourse";
import EditChapter from "./pages/tutor/courses/editCourse/editChapter/EditChapter";
import BrowseCourses from "./pages/courses/browseCourses/BrowseCourses";
import CourseInfo from "./pages/courses/courseInfo/CourseInfo";
import StudyPage from "./pages/courses/studyPage/StudyPage";
import StudyIndex from "./pages/courses/studyPage/StudyIndex";
import EnrolledCourses from "./pages/courses/enrolledCourses/EnrolledCourses";
import Feeds from "./pages/community/feeds/Feeds";
import CommunityLayout from "./pages/community/CommunityLayout";
import CreatePost from "./pages/community/posts/createPost/CreatePost";
import PostPage from "./pages/community/posts/viewPost/PostPage";
import MyCollection from "./pages/community/myCollection/MyCollection";
import AllTags from "./pages/community/tags/allTags/AllTags";
import TagPosts from "./pages/community/tags/tagPosts/TagPosts";
import EditPost from "./pages/community/posts/editPost/EditPost";
import Users from "./pages/community/users/allUsers/Users";
import PublicProfile from "./pages/community/users/publicProfile/PublicProfile";
import Messages from "./pages/messages/Messages";
// import EditCourse from "./pages/tutor/course/editCourses/EditCourse";

function App() {
	return (
		<Routes>
			<Route path="/auth" element={<AuthPage />} />
			<Route path="/verify" element={<SignUpOTP />} />
			<Route element={<PersistLogin />}>
				<Route
					element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
				>
					<Route element={<Prefetch />}>
						<Route element={<RootLayout />}>
							<Route path="dashboard" element={<Dashboard />} />
							<Route path="messages" element={<Messages />} />
							<Route path="courses">
								<Route index element={<CoursesIndex />} />
								<Route path="search" element={<BrowseCourses />} />
								<Route path=":courseId/info" element={<CourseInfo />} />
								<Route path="enrolled-courses" element={<EnrolledCourses />} />
							</Route>
							<Route path="tutors">
								<Route path="my-courses" element={<TutorCourses />} />
								<Route path="create-course" element={<CreateCourse />} />
								<Route path="edit-course/:courseId" element={<EditCourse />} />
								<Route
									path="edit-course/:courseId/chapter/:chapterId"
									element={<EditChapter />}
								/>
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
						</Route>
						<Route path="study/:courseId">
							<Route index element={<StudyIndex />} />

							<Route path="chapter/:chapterId" element={<StudyPage />} />
						</Route>
					</Route>
				</Route>
			</Route>
			{/* End Protected Routes */}
		</Routes>
	);
}

export default App;
