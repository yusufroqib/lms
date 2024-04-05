import React from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Content from "./components/Content";
import AboutUs from "./components/AboutUs";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";

const Home = () => {
	return (
		<div>
			<Navbar />
			<main className="bg-[#F6F6F6]">
				<HeroSection />
                <Content/>
                <AboutUs/>
                <Testimonials/>
                <Footer/>
			</main>
		</div>
	);
};

export default Home;
