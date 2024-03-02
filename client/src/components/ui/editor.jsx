import {
	HtmlEditor,
	Image,
	Inject,
	Link,
	QuickToolbar,
	RichTextEditorComponent,
	Toolbar,
} from "@syncfusion/ej2-react-richtexteditor";
// import * as React from 'react';

function Editor({ name, value, setValue }) {
	const toolbarSettings = {
		items: [
			"Bold",
			"Italic",
			"Underline",
			"StrikeThrough",
			"FontName",
			"FontSize",
			"FontColor",
			"BackgroundColor",
			"LowerCase",
			"UpperCase",
			"|",
			"Formats",
			"Alignments",
			"OrderedList",
			"UnorderedList",
			"Outdent",
			"Indent",
			"|",
			"ClearFormat",
			"FullScreen",
			"SourceCode",
			"|",
			"Undo",
			"Redo",
		],
	};


	const handleChange = (e) => {
		setValue(e.value );

		// console.log(name, e.value)
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Tab') {
		  e.preventDefault(); // Prevent default tab behavior
		  const editor = richTextEditorRef.current.getInstance(); // Get a reference to the Syncfusion text editor instance
		  const range = editor.getDocument().getSelection().getRangeAt(0); // Get current selection range
		  const tabNode = document.createTextNode('\t'); // Create a text node with tab character
		  range.insertNode(tabNode); // Insert tab character at the current selection position
		  range.collapse(false); // Collapse range after the inserted tab character
		  e.stopPropagation(); // Stop propagation to prevent other event handlers from handling the event
		}
	  };

	return (
		<RichTextEditorComponent
			className="z-[100] no-tailwindcss-base"
			height={400}
			value={value}
			change={handleChange}
			toolbarSettings={toolbarSettings}
			onKeyDown={handleKeyDown}
		>
			{/* {value} */}
			<Inject services={[Toolbar, HtmlEditor]} />
		</RichTextEditorComponent>
	);
}
export default Editor;
