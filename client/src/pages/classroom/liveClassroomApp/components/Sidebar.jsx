import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { sidebarLinks } from "./constants";
import { cn } from "@/lib/utils";

const Sidebar = () => {
	const location = useLocation();
	const { classroomId } = useParams();
	const [pathname, setPathname] = useState(location.pathname);

	useEffect(() => {
		setPathname(location.pathname);
	}, [location]);

	return (
		<section className="sticky left-0 top-0 flex h-screen w-fit flex-col justify-between bg-dark-1 p-6 pt-28 text-white max-sm:hidden lg:w-[264px]">
			<div className="flex flex-1 flex-col gap-6">
				{sidebarLinks.map((item) => {
					let isActive = false;
					if (item.label === "Home") {
						isActive =
							pathname === `/classrooms/${classroomId}` ||
							pathname === `/classrooms/${classroomId}/`;
					} else {
						isActive =
							pathname === `/classrooms/${classroomId}/${item.route}` ||
							pathname.startsWith(`/classrooms/${classroomId}/${item.route}`);
					}

					return (
						<Link
							to={`/classrooms/${classroomId}/${item.route}`}
							key={item.label}
							className={cn(
								"flex gap-4 items-center p-4 rounded-lg justify-start",
								{
									"bg-blue-1": isActive,
								}
							)}
						>
							<img src={item.imgURL} alt={item.label} width={24} height={24} />
							<p className="text-lg font-semibold max-lg:hidden">
								{item.label}
							</p>
						</Link>
					);
				})}
			</div>
		</section>
	);
};

export default Sidebar;
