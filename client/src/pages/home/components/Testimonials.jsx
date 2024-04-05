import { Button } from "@/components/ui/button";
import React from "react";

const Testimonials = () => {
	return (
		<div className="flex flex-col items-center justify-center mt-30">
			<div className="w-[80%] text-center">
				<h2 className="text-4xl font-bold">Testimonials</h2>
			</div>
			<div className="grid grid-cols-2 gap-6 mt-9 px-20">
				<div
					className="bg-contain bg-no-repeat p-7 w-full h-[350px] flex flex-col justify-center items-center "
					style={{ backgroundImage: `url(/testimonials-bg.svg)` }}
				>
					<p className="mt-20">
						Nam sollicitudin dignissim nunc, cursus ullamcorper eros vulputate
						sed. Vestibulum sit amet tortor sit amet libero lobortis semper at
						et odio. In eu tellus tellus t Pellentesque ullamcorper aliquet
						ultrices.
					</p>
					<div className="w-full mt-7">
						<h5 className="font-bold ">John Doe</h5>
					</div>
					<div className="w-full mt-1">
						<h5>CEO of company.com</h5>
					</div>
				</div>
				<div
					className="bg-contain bg-no-repeat p-7 w-full h-[350px] flex flex-col justify-center items-center "
					style={{ backgroundImage: `url(/testimonials-bg.svg)` }}
				>
					<p className="mt-20">
						Nam sollicitudin dignissim nunc, cursus ullamcorper eros vulputate
						sed. Vestibulum sit amet tortor sit amet libero lobortis semper at
						et odio. In eu tellus tellus t Pellentesque ullamcorper aliquet
						ultrices.
					</p>
					<div className="w-full mt-7">
						<h5 className="font-bold ">John Doe</h5>
					</div>
					<div className="w-full mt-1">
						<h5>CEO of company.com</h5>
					</div>
				</div>
				<div></div>
			</div>
			
		</div>
	);
};

export default Testimonials;
