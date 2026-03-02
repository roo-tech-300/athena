import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useGetUser, useGetUserById } from "../hooks/useUser";
import { useLogoutAccount } from "../hooks/useAuth";

export type User = {
    id: string;
    email: string;
    name: string;
    title?: string;
};

export type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const {
        data: authUser,
        isLoading: isAuthLoading,
    } = useGetUser();

    const {
        data: dbUser,
        isLoading: isDbLoading,
    } = useGetUserById(authUser?.$id)

    const {
        mutateAsync: logOutFn,
    } = useLogoutAccount();

    const isAuthenticated = !!authUser;

    const isLoading =
        isAuthLoading || (isAuthenticated && isDbLoading);

    const user: User | null =
        isAuthenticated && dbUser
            ? {
                  id: dbUser.$id,
                  email: dbUser.email,
                  name: dbUser.name,
                  title: dbUser.title,
              }
            : null;

    const logout = async () => {
       try {
            await logOutFn();
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isLoading,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};