import { Card } from "@/components/ui/card";
import React from "react";

const ProgressCard = ({cardCN, courseLength, cardText, CardIcon}) => {
	return (
		<Card className={cardCN}>
			<div className="flex items-center justify-between">
				<div>
					<div className="text-xl lg:text-3xl font-bold">{courseLength}</div>
					<div className="text-sm text-gray-500">{cardText}</div>
				</div>
				<CardIcon className="w-8 h-8 max-md:hidden text-blue-500" />
			</div>
			{/* <div className="mt-4 text-xs text-green-500">20% Increase</div> */}
		</Card>
	);
};

export default ProgressCard;
