import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CourseSidebar from "./CourseSidebar";
import useAuth from "@/hooks/useAuth";
export const CourseMobileSidebar = ({ course, progressCount, isTutor }) => {
	const { username, isAdmin, _id } = useAuth();
	const isPurchased = course.purchasedBy.some((item) => item.user === _id);
	// console.log('couressssssss', course)

	return (
		<Sheet>
			<SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
				<Menu />
			</SheetTrigger>
			<SheetContent side="left" className="p-0 bg-white w-72">
				<CourseSidebar
					course={course}
					progressCount={progressCount}
					purchase={isPurchased}
					isTutor={isTutor}
				/>
			</SheetContent>
		</Sheet>
	);
};
