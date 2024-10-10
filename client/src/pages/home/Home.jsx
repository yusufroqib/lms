// import React from "react";
// import Navbar from "./components/Navbar";
// import HeroSection from "./components/HeroSection";
// import Content from "./components/Content";
// import AboutUs from "./components/AboutUs";
// import Testimonials from "./components/Testimonials";
// import Footer from "./components/Footer";

// const Home = () => {
// 	return (
// 		<div>
// 			<Navbar />
// 			<main className="bg-[#F6F6F6]">
// 				<HeroSection />
//                 <Content/>
//                 <AboutUs/>
//                 <Testimonials/>
//                 <Footer/>
// 			</main>
// 		</div>
// 	);
// };

// export default Home;

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useDispatch } from "react-redux";
import { setAuthScreen } from "@/features/authScreenSlice";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import CustomConnectButton from "@/components/CustomConnectButton";

export default function Home() {
	const dispatch = useDispatch();
	const isLogin = localStorage.getItem("isLogin");
	

	const handleRegister = () => {
		dispatch(setAuthScreen("signup"));
		// navigate("/auth");
	};

	return (
		<div className="flex flex-col min-h-[100dvh] bg-gray-200 ">
			<Navbar />

			<main className="flex-1 ">
				<section className="bg-muted py-10 md:py-12 lg:py-20">
					<div className="container grid md:grid-cols-2 gap-8 items-center mx-auto">
						<div className="space-y-4 max-md:text-center">
							<h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-800">
								Empower Your Learning Community
							</h1>
							<p className="text-gray-800 text-lg lg:text-xl xl:text-2xl">
								Discover a comprehensive LMS platform that fosters engagement,
								collaboration, and personalized learning experiences.
							</p>
							<div className=" gap-4 max-md:mx-auto">
								{!(isLogin === "true") ? (
									<Link to="/auth" onClick={handleRegister}>
										<Button
											variant="success"
											size="lg"
											className={"lg:h-14 text-lg lg:text-xl"}
											// className="text-primary hover:bg-primary-foreground/90"
										>
											Get Started
										</Button>
									</Link>
								) : (
									<nav className=" max-md:mx-auto gap-6">
										{/* <div className="grid gap-2 py-6"> */}
										<a href="/dashboard">
											<Button
												size="lg"
												className={"lg:h-14 text-lg lg:text-xl"}
												variant={"default"}
											>
												Dashboard
											</Button>
										</a>
									</nav>
								)}
								{/* <Button
									variant="outline"
									className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10"
								>
									Learn More
								</Button> */}
							</div>
						</div>
						<img
							src="/unlock-knowledge.svg"
							width="700"
							height="400"
							alt="Hero"
							className="mx-auto "
						/>
					</div>
				</section>
				<section className="py-12 md:py-24 lg:py-32">
					<div className="container mx-auto">
						<div className="max-w-3xl mx-auto text-center space-y-4">
							{/* <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Community</div> */}
							<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
								Engage Your Learners
							</h2>
							<p className="text-muted-foreground md:text-xl">
								Foster a vibrant learning community with interactive forums,
								discussions, and user-generated content.
							</p>
						</div>
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
							<Card>
								<CardContent className="flex flex-col items-center justify-center gap-4 p-8">
									<UsersIcon className="h-12 w-12 text-blue-500" />
									<h3 className="text-xl font-bold">Community Forums</h3>
									<p className="text-muted-foreground text-center">
										Empower learners to connect, share knowledge, and
										collaborate through interactive forums.
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardContent className="flex flex-col items-center justify-center gap-4 p-8">
									<PenToolIcon className="h-12 w-12 text-blue-500" />
									<h3 className="text-xl font-bold">
										Unlock Knowledge, Master Skills
									</h3>
									<p className="text-muted-foreground text-center">
										Discover a diverse range of courses from top tutors and
										enjoy a seamless learning experience with our user-friendly
										platform.
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardContent className="flex flex-col items-center justify-center gap-4 p-8">
									<MessageSquareIcon className="h-12 w-12 text-blue-500" />
									<h3 className="text-xl font-bold">Discussions</h3>
									<p className="text-muted-foreground text-center">
										Enable learners to engage in meaningful discussions,
										exchange ideas, and deepen their understanding.
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>
				<section className="bg-muted py-12 md:py-24 lg:py-32">
					<div className="container mx-auto">
						<div className="max-w-3xl mx-auto text-center space-y-4">
							{/* <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Live Classes</div> */}
							<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
								Interactive Live Classrooms
							</h2>
							<p className="text-muted-foreground md:text-xl">
								Engage your learners with live, interactive webinars and virtual
								classrooms, enabling real-time collaboration and learning.
							</p>
						</div>
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
							<Card>
								<CardContent className="flex flex-col items-center justify-center gap-4 p-8">
									<VideoIcon className="h-12 w-12 text-blue-500" />
									<h3 className="text-xl font-bold">Live Webinars</h3>
									<p className="text-muted-foreground text-center">
										Host engaging live webinars with interactive features like
										Q&A, polls, and screen sharing.
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardContent className="flex flex-col items-center justify-center gap-4 p-8">
									<PencilIcon className="h-12 w-12 text-blue-500" />
									<h3 className="text-xl font-bold">Virtual Classrooms</h3>
									<p className="text-muted-foreground text-center">
										Bring your lessons to life with virtual classrooms that
										enable real-time collaboration and engagement.
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardContent className="flex flex-col items-center justify-center gap-4 p-8">
									<CalendarIcon className="h-12 w-12 text-blue-500" />
									<h3 className="text-xl font-bold">Scheduling</h3>
									<p className="text-muted-foreground text-center">
										Easily schedule and manage live sessions, ensuring your
										learners can access the content they need.
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>
				<section className="py-12 md:py-24 lg:py-32">
					<div className="container mx-auto">
						<div className="max-w-3xl mx-auto text-center space-y-4">
							{/* <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Messaging</div> */}
							<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
								Seamless Communication
							</h2>
							<p className="text-muted-foreground md:text-xl">
								Facilitate effective communication and collaboration among
								learners, instructors, and administrators through a robust
								messaging system.
							</p>
						</div>
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
							<Card>
								<CardContent className="flex flex-col items-center justify-center gap-4 p-8">
									<MessageCircleIcon className="h-12 w-12 text-blue-500" />
									<h3 className="text-xl font-bold">Group Messaging</h3>
									<p className="text-muted-foreground text-center">
										Enable learners and instructors to communicate in dedicated
										group channels for effective collaboration.
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardContent className="flex flex-col items-center justify-center gap-4 p-8">
									<MailIcon className="h-12 w-12 text-blue-500" />
									<h3 className="text-xl font-bold">Announcements</h3>
									<p className="text-muted-foreground text-center">
										Easily share important updates, announcements, and
										information with your entire learning community.
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardContent className="flex flex-col items-center justify-center gap-4 p-8">
									<PaperclipIcon className="h-12 w-12 text-blue-500" />
									<h3 className="text-xl font-bold">File Sharing</h3>
									<p className="text-muted-foreground text-center">
										Empower learners and instructors to seamlessly share files,
										documents, and resources within the platform.
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>
			</main>
			<footer className="bg-muted py-6 md:py-8">
				<div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
					<div className="flex items-center gap-2">
						<img
							className="w-60 "
							src="/learniverse-full.svg"
							alt="learniverse-full"
						/>
					</div>
					<nav className="flex items-center gap-4 md:gap-6">
						<Link
							to="#"
							className="text-sm font-medium hover:underline underline-offset-4"
						>
							Terms of Service
						</Link>
						<Link
							to="#"
							className="text-sm font-medium hover:underline underline-offset-4"
						>
							Privacy Policy
						</Link>
						<Link
							to="#"
							className="text-sm font-medium hover:underline underline-offset-4"
						>
							Contact Us
						</Link>
					</nav>
					<p className="text-xs text-muted-foreground">
						&copy; 2024 Learniverse. All rights reserved.
					</p>
				</div>
			</footer>
		</div>
	);
}

function CalendarIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M8 2v4" />
			<path d="M16 2v4" />
			<rect width="18" height="18" x="3" y="4" rx="2" />
			<path d="M3 10h18" />
		</svg>
	);
}

function CloudyIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M17.5 21H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
			<path d="M22 10a3 3 0 0 0-3-3h-2.207a5.502 5.502 0 0 0-10.702.5" />
		</svg>
	);
}

function MailIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<rect width="20" height="16" x="2" y="4" rx="2" />
			<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
		</svg>
	);
}

function MenuIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<line x1="4" x2="20" y1="12" y2="12" />
			<line x1="4" x2="20" y1="6" y2="6" />
			<line x1="4" x2="20" y1="18" y2="18" />
		</svg>
	);
}

function MessageCircleIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
		</svg>
	);
}

function MessageSquareIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
		</svg>
	);
}

function PaperclipIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
		</svg>
	);
}

function PenToolIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z" />
			<path d="m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18" />
			<path d="m2.3 2.3 7.286 7.286" />
			<circle cx="11" cy="11" r="2" />
		</svg>
	);
}

function PencilIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
			<path d="m15 5 4 4" />
		</svg>
	);
}

function UsersIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
			<circle cx="9" cy="7" r="4" />
			<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
			<path d="M16 3.13a4 4 0 0 1 0 7.75" />
		</svg>
	);
}

function VideoIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
			<rect x="2" y="6" width="14" height="12" rx="2" />
		</svg>
	);
}

function XIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M18 6 6 18" />
			<path d="m6 6 12 12" />
		</svg>
	);
}
