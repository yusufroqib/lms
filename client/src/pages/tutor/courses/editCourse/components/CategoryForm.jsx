"use client";
import * as z from "zod";
// import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Combobox } from "@/components/ui/combobox";
import {
	useGetCoursesQuery,
	useUpdateCategoryMutation,
} from "@/features/courses/coursesApiSlice";
const formSchema = z.object({
	categoryId: z.string().min(1),
});
const CategoryForm = ({ initialData, courseId, options }) => {
	const [isEditing, setIsEditing] = useState(false);
	const toggleEdit = () => setIsEditing((current) => !current);
	const [updateCategory, { isLoading, isError, isSuccess, error }] =
		useUpdateCategoryMutation();
	// const router = useRouter();
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			categoryId: initialData?.categoryId || "",
		},
	});
	const { isSubmitting, isValid } = form.formState;
	const onSubmit = async (values) => {
		try {
			// await axios.patch(`/api/courses/${courseId}`, values);
			await updateCategory({ id: courseId, ...values }).unwrap();
			toast.success("Course updated");
			toggleEdit();
			// router.refresh();
		} catch(error) {
			if (error?.data?.message) {
				toast.error(error.data.message);
			} else {
				toast.error("Something went wrong");
			}
		}
	};
	const selectedOption = options.find(
		(option) => option.value === initialData.categoryId
	);
	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Course category
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<Pencil className="h-4 w-4 mr-2" />
							Edit category
						</>
					)}
				</Button>
			</div>
			{!isEditing && (
				<p
					className={cn(
						"text-sm mt-2",
						!initialData.categoryId && "text-slate-500 italic"
					)}
				>
					{selectedOption?.label || "No category"}
				</p>
			)}
			{isEditing && (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4 mt-4"
					>
						<FormField
							control={form.control}
							name="categoryId"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Combobox options={options} {...field} />
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

export default React.memo(CategoryForm);
