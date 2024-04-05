import React from "react";

const HeroSection = () => {
	return (
		<div
			className="bg-cover bg-no-repeat pb-60 bg-[left_top_-14rem]"
			style={{ backgroundImage: `url(/hero-bg.svg)` }}
		>
			<div className="grid grid-cols-2">
				<div className="flex flex-col mt-20">
					<div className="ml-44 flex flex-col gap-8">
						<h2 className="text-5xl font-bold ">
							Learn and Earn on Your Schedule
						</h2>{" "}
						<h4 className="text-3xl font-medium text-gray-500">
							Join our community of tutors and students, engage in courses, and
							earn rewards as you progress.
						</h4>
					</div>
				</div>
				<div className="mt-10 ml-auto justify-end">
					<img src="/hero-image.svg" alt="classroom" />
				</div>
			</div>
			<div className="flex justify-center items mt-10 center" >
				<p className="text-xl italic font-medium text-gray-500 w-[50%]">
					“Make your 'L' in Learn the cornerstone of your journey, and let it
					seamlessly intertwine with 'Earn'—transforming education into a
					rewarding adventure!”
				</p>
			</div>
		</div>
	);
};

export default HeroSection;
