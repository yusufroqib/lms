// // import Sidebar from "./sidebar";

// // function RootLayout({ children }) {
// //   return (
// //     <div className="flex gap-5">
// //       <Sidebar />
// //       <main className="max-w-5xl flex-1 mx-auto py-4">{children}</main>
// //     </div>
// //   );
// // }

// // export default RootLayout;

// import { Outlet } from "react-router-dom";
// import Sidebar from "./sidebar";
// import Navbar from "./navbar/Navbar";

// function RootLayout() {
// 	return (
// 		<div className="flex">
// 			<Sidebar />
// 			<div className=" flex-1 mx-auto">
//         <Navbar/>
//         <main className="px-10 bg-gray-50py-4 ">

// 				<Outlet /> {/* Render nested child routes */}
//         </main>
// 			</div>
// 		</div>
// 	);
// }

// export default RootLayout;


import React, { useState } from 'react';
import Header from '../layouts/Header/index';
import Sidebar from './Sidebar/index';
import { Outlet } from 'react-router-dom';

const RootLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (<div className="dark:bg-boxdark-2 dark:text-bodydark">
    {/* <!-- ===== Page Wrapper Start ===== --> */}
    <div className="flex h-screen overflow-hidden">
      {/* <!-- ===== Sidebar Start ===== --> */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
      {/* <!-- ===== Sidebar End ===== --> */}

      {/* <!-- ===== Content Area Start ===== --> */}
      <div className="relative flex flex-1 flex-col min-h-screen overflow-y-auto overflow-x-hidden">
        {/* <!-- ===== Header Start ===== --> */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
        {/* <!-- ===== Header End ===== --> */}

        {/* <!-- ===== Main Content Start ===== --> */}
        <main className='flex flex-1'>
          <div className="mx-auto flex-grow max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {/* {children} */}
          			<Outlet /> {/* Render nested child routes */}

          </div>
        </main>
        {/* <!-- ===== Main Content End ===== --> */}
      </div>
      {/* <!-- ===== Content Area End ===== --> */}
    </div>
    {/* <!-- ===== Page Wrapper End ===== --> */}
  </div>);
};

export default RootLayout;
