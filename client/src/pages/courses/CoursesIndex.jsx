// import { Button } from "@material-tailwind/react";
import { Button } from "@/components/ui/button";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const CoursesIndex = () => {
    const navigate = useNavigate()
	return ( 
		<>
			{/* <div className="h-full w-full "> */}
			{/* <div className="flex w-full justify-between">
				<p>Test</p>
				<p>Test</p>
			</div> */}
			<div className=" h-full flex-col flex w-full justify-center items-center">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-12 ">
					<Link to='/courses/enrolled-courses' className=" bg-slate-800 transition-all ease-in md:hover:bg-slate-700 md:hover:scale-110 duration-300 cursor-pointer  h-80 w-80 rounded-xl flex justify-center items-center">
						<h2 className="text-whiten text-3xl text-center">
							Enrolled Courses
						</h2>
					</Link>
					<Link to='/courses/search' className=" bg-slate-800 shadow-card-2 transition-all ease-in md:hover:bg-slate-700 md:hover:scale-110 duration-300 cursor-pointer  h-80 w-80 rounded-xl flex justify-center items-center">
						<h2 className="text-whiten text-3xl text-center">
							Browse Courses Catalog
						</h2>
					</Link>
				</div>
				{/* <Button onClick={() => navigate('/tutors/my-courses')} className="mt-12 py-3 text-2xl bg-primary transition-all duration-400 hover:bg-slate-800 rounded-lg ">
					Tutor's Page
				</Button> */}
			</div>
		
		</>
	);
};

export default React.memo(CoursesIndex)
