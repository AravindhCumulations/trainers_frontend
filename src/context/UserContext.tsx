"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getCurrentUserName, getCurrentUserRole, getCurrentUserMail } from '@/lib/utils/auth.utils';

type User = {
    name: string;
    email: string;
    role: 'guest' | 'Trainer' | 'user_role';
    profilePic: string;
    isLoggedIn: boolean;
};

type UserContextType = {
    user: User;
    setUser: (user: User) => void;
    resetUser: () => void;
    setProfilePic: (profilePic: string) => void;
};

const defaultUser: User = {
    name: '',
    email: '',
    role: 'guest',
    profilePic: '',
    isLoggedIn: false,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>(defaultUser);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize user state from localStorage on mount
    useEffect(() => {
        const initializeUser = () => {

            const name = getCurrentUserName();
            const email = getCurrentUserMail();
            const role = getCurrentUserRole();



            if (name && email && role) {
                const userData = {
                    name,
                    email,
                    role: role as 'guest' | 'Trainer' | 'user_role',
                    profilePic: '',
                    isLoggedIn: true
                };

                setUser(userData);
            } else {

                setUser(defaultUser);
            }
            setIsInitialized(true);
        };

        // Wait for window to be available (client-side)
        if (typeof window !== 'undefined') {
            initializeUser();
        }
    }, []);

    const resetUser = () => {

        setUser(defaultUser);
    };

    const setProfilePic = (profilePic: string) => {
        setUser(prevUser => ({
            ...prevUser,
            profilePic
        }));
    };

    // Log whenever user state changes
    useEffect(() => {
        if (isInitialized) {

        }
    }, [user, isInitialized]);

    return (
        <UserContext.Provider value={{ user, setUser, resetUser, setProfilePic }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
} 