/**
 * v0 by Vercel.
 * @see https://v0.dev/t/lJwnQlHSEBA
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button";
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet";
import { setAuthScreen } from "@/features/authScreenSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const isLogin = localStorage.getItem("isLogin");

	const handleRegister = () => {
		dispatch(setAuthScreen("signup"));
		navigate("/auth");
	};
	const handleLogin = () => {
		dispatch(setAuthScreen("login"));
		navigate("/auth");
	};
	return (
		<header className="flex h-20 sticky top-0 shadow-md z-999 bg-white w-full shrink-0 items-center px-4 md:px-6">
			<Sheet>
				<SheetTrigger asChild>
					<Button className="lg:hidden" size="icon" variant="outline">
						<MenuIcon className="h-6 w-6" />
						<span className="sr-only">Toggle navigation menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent side="left">
					<Link className="mr-6 flex lg:hidden" href="#">
						<img src="/learniverse-full.svg" className="h-15 " alt="logo" />
					</Link>
					{!(isLogin === "true") ? (
						<div className="grid gap-2 py-6">
							{/* <Link href="#"> */}
							<Button onClick={handleLogin} variant={"ghost"}>
								Login
							</Button>
							{/* </Link> */}
							{/* <Link href="#"> */}
							<Button onClick={handleRegister} variant={"orange"}>
								Register
							</Button>
							{/* </Link> */}
						</div>
					) : (
						<div className="py-6 flex justify-center">
							<a href="/dashboard">
								<Button variant={"default"}>Dashboard</Button>
							</a>
						</div>
					)}
				</SheetContent>
			</Sheet>

			<Link className="mr-6  lg:flex" href="#">
				<img src="/learniverse-full.svg" className="h-15 " alt="logo" />
			</Link>

			{!(isLogin === "true") ? (
				<nav className="ml-auto hidden lg:flex gap-6">
					{/* <Link href="#"> */}

					<Button onClick={handleLogin} variant={"ghost"}>
						Login
					</Button>

					<Button onClick={handleRegister} variant={"orange"}>
						Register
					</Button>
					{/* </Link> */}
					{/* <Link
					className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
					href="#"
				>
					About
				</Link>
				<Link
					className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
					href="#"
				>
					Services
				</Link>
				<Link
					className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
					href="#"
				>
					Contact
				</Link> */}
				</nav>
			) : (
				<nav className="ml-auto hidden lg:flex gap-6">
					{/* <div className="grid gap-2 py-6"> */}
					<Link to="/dashboard">
						<Button variant={"default"}>Dashboard</Button>
					</Link>

					{/* </div> */}
				</nav>
			)}
		</header>
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

function MountainIcon(props) {
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
			<path d="m8 3 4 8 5-5 5 15H2L8 3z" />
		</svg>
	);
}
