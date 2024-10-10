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
import { useStreamChatClient } from "@/context/StreamChatContext";

const formSchema = z.object({
	title: z.string().min(1, {
		message: "Title is required",
	}),
});
export const TitleForm = ({ initialData, courseId }) => {
	const [isEditing, setIsEditing] = useState(false);
	const toggleEdit = () => setIsEditing((current) => !current);
	const [updateCourse, { isLoading, isError, isSuccess, error }] =
		useUpdateCourseMutation();
	const { streamChatClient } = useStreamChatClient();

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

			const channel = streamChatClient.channel("messaging", courseId);
			console.log(channel);
			const channelData = await channel.query();

			// Update the channel name
			await channel.update({
				name: values.title,
				image: channelData?.data?.image, // Include the existing image URL
			});
			toast.success("Course updated");
			toggleEdit();
			form.reset({ title: "" });
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
				Course title
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<LuPencil className="h-4 w-4 mr-2" />
							Edit title
						</>
					)}
				</Button>
			</div>
			{!isEditing && <p className="text-sm mt-2">{initialData.title}</p>}
			{isEditing && (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4 mt-4"
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											disabled={isSubmitting}
											placeholder="e.g. 'Advanced web development'"
											{...field}
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
