import { CourseProgress } from "@/components/ui/CourseProgress";
import { CourseSidebarItem } from "./CourseSidebarItem";
import React from "react";

const CourseSidebar = ({ course, progressCount, purchase, isTutor }) => {
	const publishedChapters =
		course?.chapters?.filter((chapter) => chapter.isPublished) || [];

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
					{publishedChapters.map((chapter) => (
						<CourseSidebarItem
							isTutor={isTutor}
							purchase={purchase}
							key={chapter._id}
							id={chapter._id}
							label={chapter.title}
							isCompleted={!!chapter.userProgress?.isCompleted}
							courseId={course.id}
							isLocked={!chapter.isFree && !purchase && !isTutor }
						/>
					))}
				</div>
			</div>
		);
	}
};

export default React.memo(CourseSidebar);
