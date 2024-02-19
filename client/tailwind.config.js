import withMT from "@material-tailwind/react/utils/withMT";
/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

export default withMT({
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				//just add this below and your all other tailwind colors willwork
				...colors,
			},
		},
	},
	plugins: [],
});
