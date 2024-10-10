import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
export const NavbarRoutes = () => {
	return (
		<>
			<div className="flex gap-x-2 ml-auto">
				<Link to="/courses/search">
					<Button size="sm" variant="ghost">
						<LogOut className="h-4 w-4 mr-2" />
						Exit
					</Button>
				</Link>
			</div>
		</>
	);
};
