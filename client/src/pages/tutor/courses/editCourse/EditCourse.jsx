import { Navigate, useNavigate, useParams } from "react-router-dom";
import React, { useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import {
	useGetCourseCategoriesQuery,
	useGetTutorCoursesQuery,
} from "@/features/courses/coursesApiSlice";
import { Banner } from "@/components/ui/banner";
import { Actions } from "./components/Actions";
import { IconBadge } from "@/components/ui/icon-badge";
import { LuLayoutDashboard } from "react-icons/lu";
import { TitleForm } from "./components/TitleForm";
import { DescriptionForm } from "./components/DescriptionForm";
import { ImageForm } from "./components/ImageForm";
import CategoryForm from "./components/CategoryForm";
import toast from "react-hot-toast";
import { CircleDollarSign, File, ListChecks, Loader2 } from "lucide-react";
import { PriceForm } from "./components/PriceForm";
import { ChaptersForm } from "./components/ChaptersForm";
import { PreviewVideoForm } from "./components/PreviewVideo";
// import { DescriptionForm } from "./components/DescForm";

const EditCourse = () => {
	const { courseId } = useParams();
	const navigate = useNavigate();
	const { username, isTutor, isAdmin, _id } = useAuth();
	const { course, isLoading, isFetching, isSuccess, isError } =
		useGetTutorCoursesQuery("tutorCourses", {
			selectFromResult: ({
				data,
				isLoading,
				isSuccess,
				isFetching,
				isError,
				error,
			}) => ({
				course: data?.entities[courseId],
				isLoading,
				isSuccess,
				isFetching,
				error,
				isError,
			}),
		});

	const { data } = useGetCourseCategoriesQuery("courseCategories");

	// console.log(categories)

	// console.log(import.meta.env.VITE_FIREBASE_API_KEY)
	// console.log(isSuccess);
	let requiredFields;
	// useEffect(() => {}, []);
	if (isError) {
		toast.error("Something went wrong");
		navigate("/tutors/my-courses");
	}

	if (isSuccess && course) {
		requiredFields = [
			course.title,
			course.description,
			course.courseImage,
			course.previewVideoUrl,
			// course.price,
			course.categoryId,
			course.chapters?.some((chapter) => chapter.isPublished),
		];
	}
	const totalFields = requiredFields?.length;
	const completedFields = requiredFields?.filter(Boolean).length;
	const completionText = `(${completedFields}/${totalFields})`;
	const isComplete = requiredFields?.every(Boolean);

	if (isLoading) {
		return (
			<div className="flex min-h-[80vh] justify-center items-center">
				<Loader2 key="loader" className="mr-2 h-10 w-10 animate-spin" />{" "}
			</div>
		);
	} else if (isSuccess && !course) {
		return <Navigate to={"/dashboard"} />;
	} else if (isSuccess && course?.tutor !== _id) {
		return <Navigate to={"/dashboard"} />;
	}
	// return <div>{isSuccess && JSON.stringify(course)}</div>;

	if (isSuccess && course && data) {
		const categories = data?.ids.map((id) => data.entities[id]);
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
								Complete all required fields {completionText}
							</span>
						</div>
						<Actions
							title={course.title}
							courseImage={course.courseImage}
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
							<CategoryForm
								initialData={course}
								courseId={course.id}
								options={categories.map((category) => ({
									label: category.name,
									value: category.id,
								}))}
							/>
							<DescriptionForm initialData={course} courseId={course.id} />
							<ImageForm initialData={course} courseId={course.id} />
						</div>

						<div className="space-y-6">
							<div>
								<div className="flex items-center gap-x-2">
									<IconBadge icon={ListChecks} />
									<h2 className="text-xl">Course chapters</h2>
								</div>
								<ChaptersForm initialData={course} courseId={course.id} />
							</div>
							<div>
								<div className="flex items-center gap-x-2">
									<IconBadge icon={CircleDollarSign} />
									<h2 className="text-xl">Sell your course</h2>
								</div>
								<PriceForm initialData={course} courseId={course.id} />
							</div>
							<PreviewVideoForm initialData={course} courseId={course.id} />
						</div>
					</div>
				</div>
			</>
		);
	}
};

export default EditCourse;
