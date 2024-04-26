import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LuPencil } from "react-icons/lu";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
// import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { Button } from "@/components/ui/button";
import { useUpdateCourseMutation } from "@/features/courses/coursesApiSlice";
import { cn } from "@/lib/utils";
import RTEditor from "@/components/ui/editor";

const formSchema = z.object({
	description: z.string().min(1),
});
export const DescriptionForm = ({ initialData, courseId }) => {
	const [isEditing, setIsEditing] = useState(false);
	const toggleEdit = () => setIsEditing((current) => !current);
	const editorRef = useRef(null)
	const [updateCourse, { isLoading, isError, isSuccess, error }] =
		useUpdateCourseMutation();
	// const [value, setValue] = useState(initialData.description);
	// const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			description: initialData?.description || "",
		},
	});
	const { isSubmitting, isValid } = form.formState;

	const onSubmit = async (values) => {
		try {
			// setIsSubmitting(true);
			await updateCourse({
				id: courseId,
				...values,
			}).unwrap();
			toast.success("Course updated successfully");
			setIsEditing(false);
			// setIsSubmitting(false);
			// router.refresh();
		} catch (error) {
			toast.error("Something went wrong");
		} finally {
			// setIsSubmitting(false);
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
				// <Form>
				// 	<form onSubmit={handleSubmit} className="space-y-4 mt-4">
				// 		<RTEditor
				// 			name="description"
				// 			value={initialData.description}
				// 			// setValue={setValue}
				// 		/>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4 mt-4"
					>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<RTEditor
											value={initialData.description}
											field={field}
											editorRef={editorRef}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex items-center gap-x-2">
							<Button disabled={!isValid || isSubmitting} type="submit">
								Save
							</Button>
						</div>
					</form>
				</Form>
			)}
		</div>
	);
};
