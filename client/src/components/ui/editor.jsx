import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build";

// import {
// 	HtmlEditor,
// 	Image,
// 	Inject,
// 	Link,
// 	QuickToolbar,
// 	RichTextEditorComponent,
// 	Toolbar,
// } from "@syncfusion/ej2-react-richtexteditor";
import React from "react";
// import * as React from 'react';

function RTEditor({ name, value, setValue, field }) {
	
	// const toolbarSettings = {
	// 	items: [
	// 		"Bold",
	// 		"Italic",
	// 		"Underline",
	// 		"StrikeThrough",
	// 		"FontName",
	// 		"FontSize",
	// 		"FontColor",
	// 		"BackgroundColor",
	// 		"LowerCase",
	// 		"UpperCase",
	// 		"|",
	// 		"Formats",
	// 		"Alignments",
	// 		"OrderedList",
	// 		"UnorderedList",
	// 		"Outdent",
	// 		"Indent",
	// 		"|",
	// 		"Image",
	// 		"CreateLink",
	// 		"InsertCode",
	// 		"|",
	// 		"ClearFormat",
	// 		"FullScreen",
	// 		"SourceCode",
	// 		"|",
	// 		"Undo",
	// 		"Redo",
	// 	],
	// };

	// const insertImageSettings = {
	// 	saveUrl: "https://ej2.syncfusion.com/services/api/uploadbox/Save",
	// 	removeUrl: "https://ej2.syncfusion.com/services/api/uploadbox/Remove",
	// };

	const handleChange = (event, editor) => {
		const data = editor.getData();
		console.log(data)
		// setValue(data);

		field.onChange(data);

		// console.log(name, e.value)
	};

	const handleKeyDown = (e) => {
		if (e.key === "Tab") {
			e.preventDefault(); // Prevent default tab behavior
			const editor = richTextEditorRef.current.getInstance(); // Get a reference to the Syncfusion text editor instance
			const range = editor.getDocument().getSelection().getRangeAt(0); // Get current selection range
			const tabNode = document.createTextNode("\t"); // Create a text node with tab character
			range.insertNode(tabNode); // Insert tab character at the current selection position
			range.collapse(false); // Collapse range after the inserted tab character
			e.stopPropagation(); // Stop propagation to prevent other event handlers from handling the event
		}
	};

	return (

		<CKEditor
		// className='prose'
		editor={Editor}
		data={value}
		// onReady={(editor) => {
		// 	// You can store the "editor" and use when it is needed.
		// 	console.log("Editor is ready to use!", editor);
		// }}
		onChange={(event, editor) => {
			const data = editor.getData();
			console.log(data)
			// setValue(data);

			field.onChange(data);

			console.log("Editor change:", editor, event);
			
		}}
		// onBlur={(event, editor) => {
		// 	console.log("Blur.", editor);
		// }}
		// onFocus={(event, editor) => {
		// 	console.log("Focus.", editor);
		// }}
	/>
		// <RichTextEditorComponent
		// 	className="z-[100] relative w-auto no-tailwindcss-base"
		// 	// height={400}
		// 	value={value}
		// 	placeholder={`What you'll learn, Requirements, Description, Who is this course for, etc `}
		// 	change={handleChange}
		// 	toolbarSettings={toolbarSettings}
		// 	onKeyDown={handleKeyDown}
		// 	insertImageSettings={insertImageSettings}
		// >
		// 	{/* {value} */}
		// 	<Inject services={[Toolbar, Image, Link, HtmlEditor, QuickToolbar]} />
		// </RichTextEditorComponent>


	);
}
export default React.memo(RTEditor)
