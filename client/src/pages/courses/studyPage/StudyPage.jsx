import React from "react";
import { CourseNavbar } from "./components/CourseNavbar";
import { CourseSidebar } from "./components/CourseSidebar";

const StudyPage = () => {
	return (
		<div className="h-full">
			<div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
				<CourseNavbar course={course} progressCount={progressCount} />
			</div>
			<div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
				<CourseSidebar course={course} progressCount={progressCount} />
			</div>
			<main className="md:pl-80 pt-[80px] h-full">{children}</main>
		</div>
	);
};

export default StudyPage;
