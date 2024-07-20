import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

const SuspenseWrapper = ({ children }) => (
	<Suspense
		fallback={
			<div className="flex min-h-[80vh] justify-center items-center">
				<Loader2 key="loader" className="mr-2 h-10 w-10 animate-spin" />
			</div>
		}
	>
		<Outlet />{" "}
	</Suspense>
);

export default SuspenseWrapper;
