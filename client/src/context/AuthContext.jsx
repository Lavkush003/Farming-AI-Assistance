import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const normalizeUser = (userData) => {
        if (!userData) return null;

        return {
            ...userData,
            id: userData.id || userData.uid || userData.email,
            name: userData.name || userData.displayName || userData.email,
        };
    };

    useEffect(() => {
        // Check local storage for user on initial load
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(normalizeUser(JSON.parse(storedUser)));
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        const normalizedUser = normalizeUser(userData);
        setUser(normalizedUser);
        localStorage.setItem("user", JSON.stringify(normalizedUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
