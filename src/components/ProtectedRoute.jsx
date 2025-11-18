import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export function ProtectedRoute() {
    const {token} = useAuth()
    const {loading} = useAuth()

    if(loading) {
        return <div>loading</div>
    }
    if (!token) {
        return <Navigate to='/login'/>
    }
    return <Outlet/>
}

