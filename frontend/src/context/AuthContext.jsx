import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/authApi";
import { profileApi } from "../api/profileApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            fetchUser();
        }else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async () => {
        try {
            const data = await profileApi.getProfile();
            setUser(data);
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
            logout();
        } finally {
            setLoading(false);
        }

    };

        const login = async (credentials) => {
            try {
                const data = await authApi.login(credentials);
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                await fetchUser();
            } catch (error) {
                console.error('Login failed:', error);
                throw error;
            }
        };

        const register = async (userData) => {
             const data = await authApi.register(userData);
             return data;
        };

        const logout = () => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setUser(null);
        }; 


    return (
        <AuthContext.Provider value={{ user, setUser,  loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
 
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};