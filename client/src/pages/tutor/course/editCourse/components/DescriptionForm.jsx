"use client";
import * as z from "zod";
// import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// import { Pencil } from "lucide-react";
import { LuPencil } from "react-icons/lu";
import { useState } from "react";
import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUpdateCourseMutation } from "@/features/courses/coursesApiSlice";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import Editor from "@/components/ui/editor";
import Preview from "@/components/ui/preview";

const formSchema = z.object({
	description: z.string().min(1, {
		message: "Description is required",
	}),
});
export const DescriptionForm = ({ initialData, courseId }) => {
	const [isEditing, setIsEditing] = useState(false);
	const toggleEdit = () => setIsEditing((current) => !current);
	const [updateCourse, { isLoading, isError, isSuccess, error }] =
		useUpdateCourseMutation();
	// const router = useRouter();
	
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: initialData,
	});

	const { isSubmitting, isValid } = form.formState;

	const onSubmit = async (values) => {
		try {
			// console.log(values);
			await updateCourse({ id: courseId, ...values }).unwrap();
			// await axios.patch(`/api/courses/${courseId}`, values);
			toast.success("Course updated");
			toggleEdit();
			// router.refresh();
		} catch {
			toast.error("Something went wrong");
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
						"text-sm mt-2",
						!initialData.description && "text-slate-500 italic"
					)}
				>
					{!initialData.description && "No description"}
					{initialData.description && (
						<Preview value={initialData.description} />
					)}
				</div>
			)}
			{isEditing && (
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
										<Editor {...field} />

										{/* <Textarea disabled={isSubmitting} placeholder="e.g. 'This course is about...'" {...field}/> */}
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