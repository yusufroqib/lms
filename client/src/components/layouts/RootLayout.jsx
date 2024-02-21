// import Sidebar from "./sidebar";

// function RootLayout({ children }) {
//   return (
//     <div className="flex gap-5">
//       <Sidebar />
//       <main className="max-w-5xl flex-1 mx-auto py-4">{children}</main>
//     </div>
//   );
// }

// export default RootLayout;

import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";

function RootLayout() {
	return (
		<div className="flex ">
			<Sidebar />
			<div className="bg-blue-gray-500 flex-1 mx-auto">
				<div className="bg-red-500 h-16">ddsdfdffd</div>
        <main className="px-10  py-4 ">

				<Outlet /> {/* Render nested child routes */}
        </main>
			</div>
		</div>
	);
}

export default RootLayout;
