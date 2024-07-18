import React from "react";
import ContentCard from "./ContentCard";

const Content = () => {
	return (
		<div>
			<div className="text-center">
				<h2 className="text-5xl font-bold">Main Features</h2>
			</div>
			<div className="flex flex-col mt-10 gap-30">
				<div className="grid grid-cols-7 gap-2 px-30">
					<div className="col-span-3">
						<img src="/Mediamodifier-Design.svg" alt="unlock knowledge" />
					</div>
					<div className="col-end-8 col-span-4">
						<ContentCard />
					</div>
				</div>
				<div className="grid grid-cols-7 gap-2 px-30">
					<div className=" col-span-4">
						<ContentCard />
					</div>
					<div className=" col-end-8 col-span-3">
						<img className="ml-auto" src="/earn-reward.svg" alt="earn reward" />
					</div>
				</div>
				<div className="grid grid-cols-7 gap-2 px-30">
					<div className="col-span-3">
						<img src="/connect-community.svg" alt="unlock knowledge" />
					</div>
					<div className="col-end-8 col-span-4">
						<ContentCard />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Content;
