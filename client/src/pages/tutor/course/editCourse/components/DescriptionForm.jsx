import { LuPencil } from "react-icons/lu";
import { useState } from "react";
import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { Button } from "@/components/ui/button";
import { useUpdateCourseMutation } from "@/features/courses/coursesApiSlice";
import { cn } from "@/lib/utils";
import Editor from "@/components/ui/editor";
import Preview from "@/components/ui/preview";

export const DescriptionForm = ({ initialData, courseId }) => {
	const [isEditing, setIsEditing] = useState(false);
	const toggleEdit = () => setIsEditing((current) => !current);
	const [updateCourse, { isLoading, isError, isSuccess, error }] =
		useUpdateCourseMutation();
	const [value, setValue] = useState(initialData.description);
	const [isSubmitting, setIsSubmitting] = useState(false);
	// const router = useRouter();

	// const form = useForm({
	// 	resolver: zodResolver(formSchema),
	// 	defaultValues: initialData,
	// });

	// const {
	// 	handleSubmit,
	// 	control,
	// 	formState: { errors, isSubmitting, isValid },
	// 	setValue,
	// 	register,
	// } = useForm({
	// 	resolver: zodResolver(formSchema),
	// });

	// const { isSubmitting, isValid } = form.formState;

	const handleSubmit = async (e) => {
		e.preventDefault();
		const sanitizedContent = DOMPurify.sanitize(value);

		try {
			setIsSubmitting(true);
			await updateCourse({
				id: courseId,
				description: sanitizedContent,
			});
			toast.success("Course updated successfully");
			setIsEditing(false);
			setIsSubmitting(false);
			// router.refresh();
		} catch (error) {
			console.log(error);
		} finally {
			setIsSubmitting(false);
		}
	};
	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Course description
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<LuPencil className="h-4 w-4 mr-2" />
							Edit description
						</>
					)}
				</Button>
			</div>
			{!isEditing && (
				<div
					className={cn(
						"text-sm mt-2 no-tailwindcss-base max-h-50 overflow-y-hidden",
						!initialData.description && "text-slate-500 italic"
					)}
				>
					{!initialData.description && "No description"}
					{initialData.description && parse(initialData.description)}
				</div>
			)}
			{isEditing && (
				<Form>
					<form onSubmit={handleSubmit} className="space-y-4 mt-4">
						<Editor
							name="description"
							value={initialData.description}
							setValue={setValue}
						/>

						<div className="flex items-center gap-x-2">
							<Button disabled={!value || isSubmitting} type="submit">
								Save
							</Button>
						</div>
					</form>
				</Form>
			)}
		</div>
	);
};
