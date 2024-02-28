import { Navigate, useParams } from "react-router-dom";
import React, { useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { useGetTutorCoursesQuery } from "@/features/courses/coursesApiSlice";
import { Banner } from "@/components/ui/banner";
import { Actions } from "./components/Actions";
import { IconBadge } from "@/components/ui/icon-badge";
import { LuLayoutDashboard } from "react-icons/lu";
import { TitleForm } from "./components/TitleForm";
import { DescriptionForm } from "./components/DescriptionForm";


const EditCourse = () => {
	const { courseId } = useParams();
	const { username, isTutor, isAdmin, _id } = useAuth();
	const { course, isLoading, isFetching, isSuccess } = useGetTutorCoursesQuery(
		"tutorCourses",
		{
			selectFromResult: ({ data, isLoading, isSuccess, isFetching }) => ({
				course: data?.entities[courseId],
				isLoading,
				isSuccess,
				isFetching,
			}),
		}
	);

	// console.log(import.meta.env.VITE_FIREBASE_API_KEY)

	console.log(isFetching);
	// console.log(isSuccess);
	let requiredFields;
	// useEffect(() => {}, []);
	if (isSuccess) {
		requiredFields = [
			course.title,
			course.description,
			course.imageUrl,
			course.price,
			course.categoryId,
			course.chapters?.some((chapter) => chapter.isPublished),
		];
	}
	const totalFields = requiredFields?.length;
	const completedFields = requiredFields?.filter(Boolean).length;
	const completionText = `(${completedFields}/${totalFields})`;
	const isComplete = requiredFields?.every(Boolean);

	if (isLoading) {
		return <p>Loading Tutor Course</p>;
	} else if (isSuccess && !course) {
		return <Navigate to={"/dashboard"} />;
	} else if (isSuccess && course?.tutor !== _id) {
		return <Navigate to={"/dashboard"} />;
	}
	// return <div>{isSuccess && JSON.stringify(course)}</div>;

	if (isSuccess && course) {
		return (
			<>
				{!course.isPublished && (
					<Banner label="This course is unpublished. It will not be visible to the students." />
				)}
				<div className="p-6">
					<div className="flex items-center justify-between">
						<div className="flex flex-col gap-y-2">
							<h1 className="text-2xl font-medium">Course setup</h1>
							<span className="text-sm text-slate-700">
								Complete all fields {completionText}
							</span>
						</div>
						<Actions
							disabled={!isComplete}
							courseId={courseId}
							isPublished={course.isPublished}
						/>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
						<div>
							<div className="flex items-center gap-x-2">
								<IconBadge icon={LuLayoutDashboard} />
								<h2 className="text-xl">Customize your course</h2>
							</div>
							 <TitleForm initialData={course} courseId={course.id} />
							<DescriptionForm initialData={course} courseId={course.id} />
							{/*<ImageForm initialData={course} courseId={course.id} />
							<CategoryForm
								initialData={course}
								courseId={course.id}
								options={categories.map((category) => ({
									label: category.name,
									value: category.id,
								}))}
							/> */}
						</div>
						{/* <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks}/>
                <h2 className="text-xl">
                  Course chapters
                </h2>
              </div>
              <ChaptersForm initialData={course} courseId={course.id}/>
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign}/>
                <h2 className="text-xl">
                  Sell your course
                </h2>
              </div>
              <PriceForm initialData={course} courseId={course.id}/>
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File}/>
                <h2 className="text-xl">
                  Resources & Attachments
                </h2>
              </div>
              <AttachmentForm initialData={course} courseId={course.id}/>
            </div>
          </div> */}
					</div>
				</div>
			</>
		);
	}
};

export default EditCourse;
