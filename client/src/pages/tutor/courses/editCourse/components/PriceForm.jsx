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
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/format";
import { useUpdateCourseMutation } from "@/features/courses/coursesApiSlice";
const formSchema = z.object({
	price: z.coerce.number(),
});
export const PriceForm = ({ initialData, courseId }) => {
	const [isEditing, setIsEditing] = useState(false);
	const toggleEdit = () => setIsEditing((current) => !current);
	const [updateCourse, { isLoading, isError, isSuccess, error }] =
		useUpdateCourseMutation();
	// const router = useRouter();
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			price: initialData?.price || undefined,
		},
	});
	const { isSubmitting, isValid } = form.formState;
	const onSubmit = async (values) => {
		try {
			console.log(values);
			await updateCourse({ id: courseId, ...values }).unwrap();
			toast.success("Course updated");
			toggleEdit();
			// router.refresh();
		} catch (error) {
			if (error?.data?.message) {
				toast.error(error.data.message);
			} else {
				toast.error("Something went wrong");
			}
		}
	};
	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Course price
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<Pencil className="h-4 w-4 mr-2" />
							Edit price
						</>
					)}
				</Button>
			</div>
			{!isEditing && (
				<p
					className={cn(
						"text-sm mt-2",
						!initialData.price && "text-slate-500 italic"
					)}
				>
					{initialData.price ? formatPrice(initialData.price) : "Free"}
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
							name="price"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											type="number"
											step="0.01"
											disabled={isSubmitting}
											placeholder="Set a price for your course"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="text-xs text-muted-foreground mt-4">
							To make this course free, kindly set price as <strong>0</strong>
						</div>
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
