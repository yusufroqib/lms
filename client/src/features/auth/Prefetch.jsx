import { store } from '@/app/store'; 
// import { notesApiSlice } from '../notes/notesApiSlice'
// import { usersApiSlice } from '../users/usersApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { usersApiSlice } from '../users/usersApiSlice';
import { coursesApiSlice } from '../courses/coursesApiSlice';

const Prefetch = () => {

    useEffect(() => {
        // store.dispatch(notesApiSlice.util.prefetch('getNotes', 'notesList', { force: true }))
        // store.dispatch(usersApiSlice.util.prefetch('getMyDetails', 'myDetails', { force: true }))
        // store.dispatch(coursesApiSlice.util.prefetch('getTutorCourses', 'tutorCoursesList', { force: true }))
    }, [])

    return <Outlet />
}
export default Prefetch
 