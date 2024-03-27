import React, { useState, useRef } from "react";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { ReplySchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
// import { Editor } from "@tinymce/tinymce-react";
// import { useTheme } from "@/context/ThemeProvider";
import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import { createReply } from "@/lib/actions/reply.action";
import RTEditor from "@/components/ui/editor";
import { useCreateReplyMutation } from "@/features/posts/postsApiSlice";
import toast from "react-hot-toast";

const Reply = ({ post, postId, authorId }) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	// const [isSubmittingAI, setSetIsSubmittingAI] = useState(false);
	const [createReply, { isLoading, isError, isSuccess, error }] =
		useCreateReplyMutation();
	// const { mode } = useTheme();
	const editorRef = useRef(null);
	const form = useForm({
		resolver: zodResolver(ReplySchema),
		defaultValues: {
			reply: "",
		},
	});

	const onSubmit = async (values) => {
        console.log(values);
        console.log(editorRef)
        console.log(JSON.parse(postId))
		setIsSubmitting(true);
		try {
			await createReply({
				content: values.reply,
				author: JSON.parse(authorId),
				post: JSON.parse(postId),
			}).unwrap();

			toast.success("Reply added");

			    form.reset();
			if (editorRef.current) {
                editorRef.current.setData('');
                console.log(editorRef.current.getData())
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div>
            <div className="border-light-2 border-b mt-1"></div>
			<div className="flex flex-col justify-between gap-5 my-3 sm:flex-row sm:items-center sm:gap-2">
				<h4 className="paragraph-semibold text-dark400_light800">
					Write your reply here
				</h4>

			</div>

			<Form {...form}>
				<form
					className="mt-6 flex w-full flex-col gap-10"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<FormField
						control={form.control}
						name="reply"
						render={({ field }) => (
							<FormItem className="flex w-full flex-col gap-3">
								<FormControl className="mt-3.5">
									<RTEditor
										field={field}
										editorRef={editorRef}
									/>

								</FormControl>
								<FormMessage className="text-red-500" />
							</FormItem>
						)}
					/>

					<div className="flex justify-end">
						<Button
							type="submit"
							className="primary-gradient w-fit text-white"
							disabled={isSubmitting}
						>
							{isSubmitting ? "Submitting..." : "Submit"}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};
export default Reply;
