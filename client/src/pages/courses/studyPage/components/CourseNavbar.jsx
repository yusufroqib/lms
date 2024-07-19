// import { NavbarRoutes } from "@/components/navbar-routes";
import { CourseMobileSidebar } from "./CourseMobileSidebar";
import { NavbarRoutes } from "./NavbarRoutes";

export const CourseNavbar = ({ course, progressCount, isTutor }) => {
	return (
		<div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
			<CourseMobileSidebar
				course={course}
				progressCount={progressCount}
				isTutor={isTutor}
			/>
			<NavbarRoutes />
		</div>
	);
};
