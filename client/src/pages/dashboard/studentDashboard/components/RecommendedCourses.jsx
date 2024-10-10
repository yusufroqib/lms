import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import CourseCard from "@/pages/courses/browseCourses/components/CourseCard";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const RecommendedCourses = ({ items }) => {

	return (
		<div className="max-w-full space-y-6">
			<h3 className="text-xl font-bold"> Recommended Courses</h3>
			<Carousel className="w-full ">
				<CarouselContent className="-ml-1">
					{items.map((item) => (
						<CarouselItem
							key={item?.id}
							className="pl-3 pr-3 basis-[90%] sm:basis-[70%] md:basis-1/2 lg:basis-1/3"
						>
							<Link to={`/courses/${item?.id}/info`} key={item?.id}>
								<CourseCard
									id={item?.id}
									title={item?.title}
									tutor={item?.tutor}
									imageUrl={item?.courseImage}
									chaptersLength={item?.chapters?.length}
									price={item?.price}
									progress={item?.progress}
									category={item?.category?.name}
									reviews={item?.reviews}
									averageRating={item?.averageRating}
								/>
							</Link>
						</CarouselItem>
					))}
				</CarouselContent>
				{/* <CarouselPrevious />
				<CarouselNext /> */}
				<div className="flex gap-2 mt-10  justify-end">
					<CarouselPrevious className="static h-10 w-10"/>
						
					<CarouselNext className="static h-10 w-10 "/>
						
				</div>
			</Carousel>

			<div className="flex justify-end">
				<Link to={"/courses/search"}>
					<Button className="flex gap-3">
						View all courses <ArrowRight />
					</Button>
				</Link>
			</div>
		</div>
	);
};

export default RecommendedCourses;
