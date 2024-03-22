"use client";
import {
	FcEngineering,
	FcMindMap,
	FcMultipleCameras,
	FcReading,
	FcSalesPerformance,
	FcSportsMode,
} from "react-icons/fc";
import  {CategoryItem}  from "./CategoryItem";
import {  FaRobot, FaLaptopCode  } from "react-icons/fa";
import { IoLanguage } from "react-icons/io5";
import { HiOutlinePaintBrush } from "react-icons/hi2";


const iconMap = {
	"Programming & Development": FaLaptopCode ,
	"Business & Entrepreneurship": FcSalesPerformance,
	"Design & Multimedia": FcMultipleCameras,
	"Language Learning": IoLanguage,
	"Health & Fitness": FcSportsMode,
	"Personal Development": FcMindMap,
	"Academic Subjects": FcReading,
	"Technology & IT": FaRobot,
	"Arts & Crafts": HiOutlinePaintBrush,
	"Science & Engineering": FcEngineering,
};

export const Categories = ({ items }) => {


	return (
		<div className="flex items-center gap-x-2 overflow-x-auto overflow-y-hidden mostly-customized-scrollbar  pb-2">
			{items.map((item) => (
				<CategoryItem
					key={item._id}
					label={item.name}
                    description={item.description}
					icon={iconMap[item.name]}
					value={item._id}
				/>
			))}
		</div>
	);
};
