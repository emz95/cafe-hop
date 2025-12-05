import React, {useState, useContext, useEffect} from 'react'

/**
 * AuthContext - Manages user authentication state across the entire app
 * Provides login/logout functions and persists auth data in localStorage
 * This allows any component to access user info without prop drilling
 */
const AuthContext = React.createContext()

export function AuthProvider({children}){
    // Store JWT token for API requests
    const [token, setToken] = useState(() => localStorage.getItem('token') || null)
    const [loading, setLoading] = useState(true)
    // Store user data (id, username, email, etc.)
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('user')
            return storedUser ? JSON.parse(storedUser) : null
        } catch {
            return null
        }
    });

    
    // Called after successful login - saves auth data to state and localStorage
    const login = (token, userData) => {
        setToken(token);
        setUser(userData);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
    }

    // Clears all auth data from state and localStorage
    const logout = () => {
        setToken(null)
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    // On app load, try to restore authentication from refresh token
    useEffect(() => {
        const restoreAuth = async () => {
            try{
                // Check if user has a valid refresh token (stored in httpOnly cookie)
                const res = await fetch("http://localhost:3000/api/users/refresh", {
                    method: "POST",
                    credentials: "include",
                } )

                if(res.ok) {
                    const data = await res.json()
                    setToken(data.token)
                } 
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
        restoreAuth()
    }, [])

    // Provide auth state and functions to all child components
    return (
       <AuthContext.Provider value={{token, user, login, logout, loading}}>{children}</AuthContext.Provider>
    )
}

// Custom hook to easily access auth context in any component
export const useAuth = () => useContext(AuthContext)