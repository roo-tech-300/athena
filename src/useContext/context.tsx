import { createContext, useEffect, useState, useContext } from "react";
import type { ReactNode } from "react";
import { useGetUser, useGetUserById } from "../hooks/useUser";

export type User = {
    id: string;
    email: string;
    name: string;
    title?: string;
}

export type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { data: authUser, isLoading: isAuthLoading } = useGetUser();

    // Always call hooks at the top level
    const { data: dbUser, isLoading: isDbLoading } = useGetUserById(authUser?.$id);

    useEffect(() => {
        if (!isAuthLoading && !isDbLoading) {
            if (dbUser) {
                setUser({
                    id: dbUser.$id,
                    email: dbUser.email,
                    name: dbUser.name,
                    title: dbUser.title,
                } as User);
            } else {
                setUser(null);
            }
            setIsLoading(false);
        }
    }, [dbUser, isAuthLoading, isDbLoading]);

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            setUser,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

