import React, { useRef, useState } from "react";
// import { Editor } from "@tinymce/tinymce-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PostsSchema } from "@/lib/validations";
import { Badge } from "@/components/ui/badge";
// import Image from "next/image";
// import { createPost, editPost } from "@/lib/actions/post.action";
import { useNavigate } from "react-router-dom";
// import Editor from "@/components/ui/editor";
import { useCreatePostMutation, useEditPostMutation } from "@/features/posts/postsApiSlice";
import toast from "react-hot-toast";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import Editor from "ckeditor5-custom-build";
import RTEditor from "@/components/ui/editor";


const Post = ({ type, mongoUserId, postDetails }) => {
	// const editorRef = useRef(null);
	const [createPost, { isLoading, isError, isSuccess, error }] =
		useCreatePostMutation();
	const [editPost] =
	useEditPostMutation();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const navigate = useNavigate();
	const [value, setValue] = useState(postDetails?.content);
	const groupedTags = postDetails?.tags?.map((tag) => tag.name);
	const editorRef = useRef(null);
	// console.log(postDetails?.title)


	const form = useForm({
		resolver: zodResolver(PostsSchema),
		defaultValues: {
			// title: parsedPostDetails?.title || "",
			title: postDetails?.title || "",
			explanation: postDetails?.content || "",
			tags: groupedTags || [],
		},
	});

	async function onSubmit(values) {
		setIsSubmitting(true);
		try {
			if (type === "Edit") {
				await editPost({
					postId: postDetails._id,
					title: values.title,
					content: values.explanation,
				}).unwrap()
				toast.success("Post updated successfully");
				navigate(`/community/posts/${postDetails._id}`);
			} else {
				await createPost({
					title: values.title,
					content: values.explanation,
					tags: values.tags,
					author: mongoUserId,
					path: window.location.pathname,
				}).unwrap();
				toast.success("Post created successfully");

				navigate("/community/feeds");
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsSubmitting(false);
		}
	}

	const handleInputKeyDown = (e, field) => {
		if (e.key === "Enter" && field.name === "tags") {
			e.preventDefault();
			const tagInput = e.target;
			const tagValue = tagInput.value.trim();
			if (tagValue !== "") {
				if (tagValue.length > 15) {
					return form.setError("tags", {
						type: "required",
						message: "Tag must be less than 15 characters.",
					});
				}
				if (!field.value.includes(tagValue)) {
					form.setValue("tags", [...field.value, tagValue]);
					tagInput.value = "";
					form.clearErrors("tags");
				}
			} else {
				form.trigger();
			}
		}
	};

	const handleTagRemove = (tag, field) => {
		const newTags = field.value.filter((t) => t !== tag);
		form.setValue("tags", newTags);
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex  flex-col gap-10"
			>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem className="flex w-full flex-col">
							<FormLabel className="paragraph-semibold text-dark400_light800">
								Post Title <span className="text-primary-500">*</span>
							</FormLabel>
							<FormControl className="mt-3.5">
								<Input
									className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
									{...field}
								/>
							</FormControl>
							<FormDescription className="body-regular mt-2.5 text-light-500">
								Be specific and imagine you&apos;re making a post to another
								person.
							</FormDescription>
							<FormMessage className="text-red-500" />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="explanation"
					render={({ field }) => (
						<FormItem className="flex w-full flex-col gap-3">
							<FormLabel className="paragraph-semibold text-dark400_light800">
								Detailed explanation of your problem{" "}
								<span className="text-primary-500">*</span>
							</FormLabel>
							<FormControl className="mt-3.5">
							

								<RTEditor
									value={postDetails?.content}
									field={field}
									editorRef={editorRef}
								
								/>

							
							</FormControl>
							<FormDescription className="body-regular mt-2.5 text-light-500">
								Introduce the problem and expand on what you put in the title.
								Minimum 20 characters.
							</FormDescription>
							<FormMessage className="text-red-500" />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="tags"
					render={({ field }) => (
						<FormItem className="flex w-full flex-col">
							<FormLabel className="paragraph-semibold text-dark400_light800">
								Tags <span className="text-primary-500">*</span>
							</FormLabel>
							<FormControl className="mt-3.5">
								<>
									<Input
										disabled={type === "Edit"}
										className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
										placeholder="Add tags..."
										onKeyDown={(e) => handleInputKeyDown(e, field)}
									/>

									{field.value.length > 0 && (
										<div className="flex-start mt-2.5 gap-2.5">
											{field.value.map((tag) => (
												<Badge
													key={tag}
													className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize"
													onClick={() =>
														type !== "Edit"
															? handleTagRemove(tag, field)
															: () => {}
													}
												>
													{tag}
													{type !== "Edit" && (
														<img
															src="/assets/icons/close.svg"
															alt="Close icon"
															width={12}
															height={12}
															className="cursor-pointer object-contain invert-0 dark:invert"
														/>
													)}
												</Badge>
											))}
										</div>
									)}
								</>
							</FormControl>
							<FormDescription className="body-regular mt-2.5 text-light-500">
								Add up to 3 tags to describe what your post is about. You need
								to press enter to add a tag.
							</FormDescription>
							<FormMessage className="text-red-500" />
						</FormItem>
					)}
				/>
				<Button
					type="submit"
					className="primary-gradient w-fit !text-light-900"
					disabled={isSubmitting}
				>
					{isSubmitting ? (
						<>{type === "Edit" ? "Editing..." : "Posting..."}</>
					) : (
						<>{type === "Edit" ? "Edit Post" : "Create a Post"}</>
					)}
				</Button>{" "}
			</form>
		</Form>
	);
};

export default Post;
