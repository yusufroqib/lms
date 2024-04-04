// import Image from 'next/image';
import { LogOut } from "lucide-react";

import { Link } from "react-router-dom";
// import { SignedIn, UserButton } from '@clerk/nextjs';
import MobileNav from "./MobileNav";
import { Button } from "@/components/ui/button";
const Navbar = () => {
	return (
		<nav className="flex-between fixed z-50 w-full bg-dark-1 px-6 py-4 lg:px-10">
			<Link to="#" className="flex items-center gap-1">
				<img
					src="/learniverse-icon.svg"
					width={32}
					height={32}
					alt="yoom logo"
					className="max-sm:size-10"
				/>
				<p className="text-[26px] font-extrabold text-white max-sm:hidden">
					LEARNLIVE
				</p>
			</Link>
			<div className="flex-between gap-5">
				{/* <SignedIn>
          <UserButton afterSignOutUrl="/sign-in"/>
        </SignedIn> */}
				<Link to="/classrooms">
					<Button size="sm" variant="destructive">
						<LogOut className="h-4 w-4 mr-2" />
						Exit
					</Button>
				</Link>
				<MobileNav />
			</div>
		</nav>
	);
};
export default Navbar;
