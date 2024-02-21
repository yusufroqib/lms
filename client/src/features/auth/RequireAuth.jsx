import useAuth from "@/hooks/useAuth"
import { useLocation, Navigate, Outlet } from "react-router-dom"

const RequireAuth = ({ allowedRoles }) => {
    const location = useLocation()
    const { roles } = useAuth()

    const content = (
        roles.some(role => allowedRoles.includes(role))
            ? <Outlet />
            : <Navigate to="/auth" state={{ from: location }} replace />
    )

    return content
}
export default RequireAuth