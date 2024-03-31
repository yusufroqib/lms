import React from 'react'
import { Link } from 'react-router-dom'
import ClassroomCards from './components/ClassroomCards'

const Classrooms = () => {
  return (
    <div>
    <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 p-6 gap-4">
        {/* {items.map((item) => ( */}
            <Link to={`/courses/id`}>
                <ClassroomCards/>
                {/* <CourseCard
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
                /> */}
            </Link>
        {/* ))} */}
    </div>
    {/* {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
            No courses found
        </div>
    )} */}
</div>
  )
}

export default Classrooms