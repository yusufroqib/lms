// import { auth } from "@clerk/nextjs";
// import { redirect } from "next/navigation";
// import { db } from "@/lib/db";
import useAuth from "@/hooks/useAuth";
import { CourseProgress } from "@/components/ui/CourseProgress";
import { CourseSidebarItem } from "./CourseSidebarItem";
import React from "react";

const CourseSidebar = ({ course, progressCount, purchase }) => {
	// console.log(course)
	// console.log("Course: ", course);
	// const { username, isTutor, isAdmin, _id: userId } = useAuth();
	// if (!userId) {
	// 	return redirect("/");
	// }
	// const purchase = await db.purchase.findUnique({
	// 	where: {
	// 		userId_courseId: {
	// 			userId,
	// 			courseId: course.id,
	// 		},
	// 	},
	// });
	if (course) {
		return (
			<div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
				<div className="p-8 flex flex-col border-b">
					<h1 className="font-semibold">{course.title}</h1>
					{purchase && (
						<div className="mt-10">
							<CourseProgress variant="success" value={progressCount} />
						</div>
					)}
				</div>
				<div className="flex flex-col w-full">
					{course.chapters.map((chapter) => (
					<CourseSidebarItem
						key={chapter._id}
						id={chapter._id}
						label={chapter.title}
						isCompleted={!!chapter.userProgress?.isCompleted}
						courseId={course.id}
						isLocked={!chapter.isFree && !purchase}
					/>
				))}
				</div>
			</div>
		);
	}
};

export default React.memo(CourseSidebar)