import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import DOMPurify from "dompurify";
import { useForm } from "react-hook-form";
import { useUpdateCourseMutation } from "@/features/courses/coursesApiSlice";


export const DescriptionForm = ({ initialData, courseId }) => {
	const [editorState, setEditorState] = useState(null);

	const [updateCourse, { isLoading, isError, isSuccess, error }] =
		useUpdateCourseMutation();

	const {
		handleSubmit,
		formState: { isSubmitting, isValid },
	} = useForm();

	useEffect(() => {
		if (initialData.description) {
			const contentState = ContentState.createFromText(initialData.description);
			setEditorState(EditorState.createWithContent(contentState));
		} else {
			setEditorState(EditorState.createEmpty());
		}
	}, [initialData]);

	const onEditorStateChange = (newEditorState) => {
		setEditorState(newEditorState);
	};

	const onSubmit = async (values) => {
		try {
			const htmlContent = draftToHtml(
				convertToRaw(editorState.getCurrentContent())
			);
			const sanitizedHTML = DOMPurify.sanitize(htmlContent);

			await updateCourse({ id: courseId, description: sanitizedHTML }).unwrap();
			toast.success("Course updated");
			// You can add any further actions after submission here
		} catch (error) {
			toast.error("Something went wrong");
		}
	};

	return (<>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
				<div className="form-control">
					<label htmlFor="description" className="label">
						Description
					</label>
					<div className="editor-wrapper">
						{editorState && (
							 <Editor
                             editorState={editorState}
                             toolbarClassName="toolbarClassName"
                             wrapperClassName="wrapperClassName"
                             editorClassName="editorClassName"
                             onEditorStateChange={onEditorStateChange}
                             mention={{
                               separator: " ",
                               trigger: "@",
                               suggestions: [
                                 { text: "APPLE", value: "apple" },
                                 { text: "BANANA", value: "banana", url: "banana" },
                                 { text: "CHERRY", value: "cherry", url: "cherry" },
                                 { text: "DURIAN", value: "durian", url: "durian" },
                                 { text: "EGGFRUIT", value: "eggfruit", url: "eggfruit" },
                                 { text: "FIG", value: "fig", url: "fig" },
                                 { text: "GRAPEFRUIT", value: "grapefruit", url: "grapefruit" },
                                 { text: "HONEYDEW", value: "honeydew", url: "honeydew" }
                               ]
                             }}
                           />
						)}
					</div>
				</div>
				<div className="form-actions">
					<Button disabled={!isValid || isSubmitting} type="submit">
						Save
					</Button>
				</div>
			</form>
            </>
	);
};

// export default DescriptionForm;

// import * as z from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
// 	Form,
// 	FormControl,
// 	FormField,
// 	FormItem,
// 	FormMessage,
// } from "@/components/ui/form";
// import { Button } from "@/components/ui/button";

// import React, { useState } from 'react';
// import { Editor } from 'react-draft-wysiwyg';
// import { EditorState, convertToRaw } from 'draft-js';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import draftToHtml from 'draftjs-to-html';
// import DOMPurify from 'dompurify';
// // import axios from 'axios';
// import { useForm } from 'react-hook-form';
// import { useUpdateCourseMutation } from '@/features/courses/coursesApiSlice';

// const formSchema = z.object({
//   description: z.string().min(1, {
//     message: 'Description is required',
//   }),
// });

// export const DescriptionForm = ({ initialData, courseId }) => {
//   const [editorState, setEditorState] = useState(
//     initialData.description
//       ? EditorState.createWithContent(initialData.description)
//       : EditorState.createEmpty()
//   );

//   const [updateCourse, { isLoading, isError, isSuccess, error }] =
// 		useUpdateCourseMutation();
// 	// const router = useRouter();

//   const { handleSubmit, formState: { isSubmitting, isValid } } = useForm({
//     resolver: zodResolver(formSchema),
//   });

//   const onEditorStateChange = (newEditorState) => {
//     setEditorState(newEditorState);
//   };

//   const onSubmit = async (values) => {
//     try {
//         // console.log(values);
//         const htmlContent = draftToHtml(convertToRaw(editorState.getCurrentContent()));
//         const sanitizedHTML = DOMPurify.sanitize(htmlContent);

//         await updateCourse({ id: courseId, description: sanitizedHTML }).unwrap();
//         // await axios.patch(`/api/courses/${courseId}`, values);
//         toast.success("Course updated");
//         toggleEdit();
//         // router.refresh();
//     } catch {
//         toast.error("Something went wrong");
//     }
// };

//   return (
//     <Form >
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
//         <div className="form-control">
//           <label htmlFor="description" className="label">Description</label>
//           <div className="editor-wrapper">
//             <Editor
//               editorState={editorState}
//               onEditorStateChange={onEditorStateChange}
//               toolbarClassName="toolbarClassName"
//               wrapperClassName="wrapperClassName"
//               editorClassName="editorClassName"
//             />
//           </div>
//         </div>
//         <div className="form-actions">
//           <Button disabled={!isValid || isSubmitting} type="submit">
//             Save
//           </Button>
//         </div>
//       </form>
//     </Form>
//   );
// };
