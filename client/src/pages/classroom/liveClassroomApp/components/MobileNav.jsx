import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { sidebarLinks } from "./constants";
import { cn } from "@/lib/utils";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTrigger,
} from "@/components/ui/sheet";

const MobileNav = () => {
	const location = useLocation();
	const { classroomId } = useParams();
	const [pathname, setPathname] = useState(location.pathname);

	useEffect(() => {
		setPathname(location.pathname);
	}, [location]);

	return (
		<section className="w-full max-w-[264px]">
			<Sheet classname={"text-white"}>
				<SheetTrigger asChild>
					<img
						src="/icons/hamburger.svg"
						width={36}
						height={36}
						alt="hamburger icon"
						className="cursor-pointer sm:hidden"
					/>
				</SheetTrigger>
				<SheetContent side="left" className="border-none bg-dark-1">
					<Link to="#" className="flex items-center gap-1">
						<img
							src="/learniverse-icon.svg"
							width={32}
							height={32}
							alt="learniverse logo"
						/>
						<p className="text-[26px] font-extrabold text-white">LEARNLIVE</p>
					</Link>
					<div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
						<SheetClose asChild>
							<section className="flex h-full flex-col gap-6 pt-16 text-white">
								{sidebarLinks.map((item) => {
									let isActive = false;
									if (item.label === "Home") {
										isActive =
											pathname === `/classrooms/${classroomId}` ||
											pathname === `/classrooms/${classroomId}/`;
									} else {
										isActive =
											pathname === `/classrooms/${classroomId}/${item.route}` ||
											pathname.startsWith(
												`/classrooms/${classroomId}/${item.route}`
											);
									}
									return (
										<SheetClose asChild key={item.route}>
											<Link
												to={`/classrooms/${classroomId}/${item.route}`}
												className={cn(
													"flex gap-4 items-center p-4 rounded-lg w-full max-w-60",
													{
														"bg-blue-1": isActive,
													}
												)}
											>
												<img
													src={item.imgURL}
													alt={item.label}
													width={20}
													height={20}
												/>
												<p className="font-semibold">{item.label}</p>
											</Link>
										</SheetClose>
									);
								})}
							</section>
						</SheetClose>
					</div>
				</SheetContent>
			</Sheet>
		</section>
	);
};

export default MobileNav;
