import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { invoke } from '@tauri-apps/api/tauri';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([]);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [errors]);

    useEffect(() => {
        const checkLogin = async () => {
            const storedUser = Cookies.get('user');
            if (!storedUser) {
                setLoggedIn(false);
                setLoading(false);
                return;
            }
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setLoggedIn(true);
                setLoading(false);
            } catch (error) {
                setLoggedIn(false);
                setLoading(false);
            }
        };
        checkLogin();
    }, []);

    const handleLogin = async (credentials) => {
        try {
            const response = await invoke('login', {
                user: credentials,
            });
            if (response) {
                delete response.usu_password;
                Cookies.set('user', JSON.stringify(response));
                setUser(response);
                setLoggedIn(true);
            } else {
                setErrors(['Invalid credentials']);
            }
        } catch (error) {
            setErrors(['Login failed']);
        }
    };

    const handleLogout = () => {
        Cookies.remove('user');
        setUser(null);
        setLoggedIn(false);
    };

    return (
        <UserContext.Provider value={{ user, loggedIn, loading, errors, handleLogin, handleLogout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser debe ser usado dentro de UserProvider");
    }
    return context;
};

export default UserContext;
