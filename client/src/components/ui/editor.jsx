import React, { Suspense } from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

const Editor = ({ onChange, value }) => {
	// const ReactQuill = React.lazy(() => import("react-quill"));

	return (
		<div className="bg-white">
			{/* <Suspense fallback={<div>Loading...</div>}> */}
				<ReactQuill
					theme="snow"
					modules={Editor.modules}
					formats={Editor.formats}
					value={value}
					onChange={onChange}
				/>
			{/* </Suspense> */}
		</div>
	);
};

Editor.modules = {
	toolbar: [
		[{ header: "1" }, { header: "2" }, { font: [] }],
		[{ size: [] }],
		["bold", "italic", "underline", "strike", "blockquote"],
		[
			{ list: "ordered" },
			{ list: "bullet" },
			{ indent: "-1" },
			{ indent: "+1" },
		],
    [{ 'align': [] }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'color': [] }],          // dropdown with defaults from theme
		["link", "image", "video"],
		["clean"],
	],
	clipboard: {
		matchVisual: false,
	},
};

Editor.formats = [
	"header",
	"font",
	"size",
	"bold",
  'color',
  'align',
  'script',
	"italic",
	"underline",
	"strike",
	"blockquote",
	"list",
	"bullet",
	"indent",
	"link",
	"image",
	"video",
];

export default Editor;
