import { Link } from "react-router-dom";
import CourseCard from "./CourseCard";

export const CoursesList = ({ items }) => {
	return (
		<div className="py-2">
			<div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
				{items.map((item) => (
					<Link to={`/courses/${item.id}/info`} key={item?.id}>
						<CourseCard
							id={item.id}
							title={item.title}
							tutor={item.tutor}
							imageUrl={item.courseImage}
							chaptersLength={item.chapters.length}
							price={item.price}
							progress={item.progress}
							category={item?.category?.name}
							reviews={item.reviews}
							averageRating={item.averageRating}
						/>
					</Link>
				))}
			</div>
			{items.length === 0 && (
				<div className="text-center text-sm text-muted-foreground mt-10">
					No courses found
				</div>
			)}
		</div>
	);
};
