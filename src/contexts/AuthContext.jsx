import React, {useState, useContext, useEffect} from 'react'


const AuthContext = React.createContext()

export function AuthProvider({children}){
    const [token, setToken] = useState(() => localStorage.getItem('token') || null)
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('user')
            return storedUser ? JSON.parse(storedUser) : null
        } catch {
            return null
        }
    });

    
    const login = (token, userData) => {
        setToken(token);
        setUser(userData);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
    }

    const logout = () => {
        setToken(null)
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    useEffect(() => {
        const restoreAuth = async () => {
            try{
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

    return (
       <AuthContext.Provider value={{token, user, login, logout, loading}}>{children}</AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)