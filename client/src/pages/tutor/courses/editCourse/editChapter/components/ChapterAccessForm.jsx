"use client";
import * as z from "zod";
// import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useUpdateChapterMutation } from "@/features/courses/coursesApiSlice";
const formSchema = z.object({
	isFree: z.boolean().default(false),
});
export const ChapterAccessForm = ({
	initialData,
	courseId,
	chapterId,
	coursePrice,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const toggleEdit = () => setIsEditing((current) => !current);
	const [updateChapter, { isLoading, isError, isSuccess, error }] =
		useUpdateChapterMutation();
	// const router = useRouter();
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			isFree: !!initialData.isFree,
		},
	});
	const { isSubmitting, isValid } = form.formState;
	const onSubmit = async (values) => {
		try {
			await updateChapter({
				courseId: courseId,
				chapterId: chapterId,
				...values,
			}).unwrap();

			toast.success("Course updated successfully");
			toggleEdit();
			// router.refresh();
		} catch (error) {
			console.log(error);
			toast.error("Something went wrong");
		}
	};
	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Chapter access
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<Pencil className="h-4 w-4 mr-2" />
							Edit access
						</>
					)}
				</Button>
			</div>
			{!isEditing && (
				<p
					className={cn(
						"text-sm mt-2",
						!initialData.isFree && "text-slate-500 italic"
					)}
				>
					{initialData.isFree ? (
						<>This chapter is free to access.</>
					) : (
						<>This chapter is not free.</>
					)}
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
							name="isFree"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
									<FormControl>
										<Checkbox
											checked={field.value}
											disabled={coursePrice ? false : true}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormDescription>
											Check this box if you want to make this chapter free for
											preview
										</FormDescription>
									</div>
								</FormItem>
							)}
						/>
						{!coursePrice && (
							<div className="text-xs text-muted-foreground mt-4">
								Kindly set price for this course to enable the checkbox
							</div>
						)}
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
