import { useSelector } from 'react-redux'
import jwtDecode from 'jwt-decode'
import { selectCurrentToken } from '@/features/auth/authSlice'

const useAuth = () => {
    const token = useSelector(selectCurrentToken)
    let isTutor = false
    let isAdmin = false
    let status = "Student"

    if (token) {
        const decoded = jwtDecode(token)
        const { username, roles } = decoded.UserInfo

        isManager = roles.includes('Tutor')
        isAdmin = roles.includes('Admin')

        if (isManager) status = "Manager"
        if (isAdmin) status = "Admin"

        return { username, roles, status, isTutor, isAdmin }
    }

    return { username: '', roles: [], isTutor, isAdmin, status }
}
export default useAuth