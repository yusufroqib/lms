import { Button } from "@/components/ui/button";
import { setAuthScreen } from "@/features/authScreenSlice";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const AboutUs = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const handleRegister = () => {
		dispatch(setAuthScreen("signup"));
		navigate("/auth");
	};
	return (
		<div className="flex flex-col items-center justify-center mt-30">
			<div className="w-[80%] text-center">
				<h2 className="text-4xl font-bold">About Us</h2>
				<h5 className="text-2xl mt-10 text-gray-500 font-medium">
					At ScholarSphere, we believe in the transformative power of education.
					Our mission is to create a dynamic and inclusive platform where
					learners can explore a myriad of courses, connect with a supportive
					community, and earn rewards as they advance in their educational
					journey.
				</h5>
			</div>
            <Button onClick={handleRegister} className='px-20 mt-10 text-xl' variant={'orange'}>Join Now</Button>
		</div>
	);
};

export default AboutUs;
