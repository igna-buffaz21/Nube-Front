import React, {createContext} from "react";
import type { AuthContextType } from "@/interfaces/auth.interface";
import { useContext, useEffect, useState } from "react";
import type { UserPayload } from "@/interfaces/jwt.interface";
import { decodeToken, getUserFromStorage, removeToken, setToken } from "./jwt";


export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider(props: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserPayload | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(function () {
        const currentUser = getUserFromStorage();
        if (currentUser) {
            setUser(currentUser);
        }
        setLoading(false); // ✅ Ya terminó de cargar
    }, []);

    function login(token: string) {
        setToken(token);
        const decoded = decodeToken(token);
        if (decoded) {
          setUser(decoded);
        }
    }

    function logout() {
        removeToken();
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
        {props.children}
      </AuthContext.Provider>
    )
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth debe usarse dentro de un <AuthProvider>");
    }
    return context;
}