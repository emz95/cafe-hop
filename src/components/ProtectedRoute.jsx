import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export function ProtectedRoute({children}) {
    const {token} = useAuth()
    if (!token) {
        return <Navigate to='/login'/>
    }
    return children
}

