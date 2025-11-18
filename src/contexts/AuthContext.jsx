import React, {useState, useContext, useEffect} from 'react'

const AuthContext = React.createContext()

export function AuthProvider({children}){
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(true)
    
    const login = (token) => {
        setToken(token)
    }

    const logout = () => {
        setToken(null)
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
       <AuthContext.Provider value={{token, login, logout, loading}}>{children}</AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)