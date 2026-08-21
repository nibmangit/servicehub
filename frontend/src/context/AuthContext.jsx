import React, {createContext, useContext, useState, useEffect} from "react";
import { accountApi } from "../services/accountApi";

const AuthContext = createContext()
export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(()=> {
        const initializeAuth = async () =>{
            const token = localStorage.getItem('access_token');
            if(token){
                try{
                    const profile = await accountApi.getProfile();
                    setUser(profile)
                }catch(error){
                    console.error("Faild to fetch user profile", error);
                    logout();
                }
            }
            setLoading(false);
        };
        initializeAuth();
    }, []);

    const login = async (email, password ) =>{
        try{ 

            const data = await accountApi.login({email, password}); 

            const {access, refresh }= data;
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);

            const profileData = await accountApi.getProfile();
            setUser(profileData); 
            return{ success: true};
        }catch(error){
            return{
                success: false,
                error: error.response?.data || "Invalid credentials. Please try again."
            };
        }
    };

    const register = async (userData) =>{
        try{
            await accountApi.register(userData)
            return await login(userData.email, userData.password)
        }catch(error){
            return{
                success:false,
                error: error.response?.data || "Registration faild. Please check your inputs and try again. "
            };
        }
    };

    const logout = () =>{
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        window.location.href = '/login';
    };

    const updateUser = (updatedProfile) => {
    setUser(updatedProfile);
  };

    return(
        <AuthContext.Provider value={{user, login, register, logout, loading, updateUser}}>
            {children}
        </AuthContext.Provider>
    )

};

export const useAuth = () => useContext(AuthContext);