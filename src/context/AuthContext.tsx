import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authClient } from '../services/auth.client';
import type { AuthUser } from '../lib/types';

interface AuthContextType {
    user: AuthUser | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Restore session on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('auth_user');
        const savedToken = localStorage.getItem('auth_token');

        if (savedUser && savedToken) {
            try {
                setUser(JSON.parse(savedUser));
            } catch {
                localStorage.removeItem('auth_user');
                localStorage.removeItem('auth_token');
            }
        }
        setIsLoading(false);
    }, []);

    // Listen for auto-logout events (from apiFetch on 401)
    useEffect(() => {
        const handleLogout = () => {
            setUser(null);
        };
        window.addEventListener('auth:logout', handleLogout);
        return () => window.removeEventListener('auth:logout', handleLogout);
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        try {
            const result = await authClient.login(email, password);
            localStorage.setItem('auth_token', result.session.access_token);
            localStorage.setItem('auth_user', JSON.stringify(result.user));
            setUser(result.user);
            return { success: true };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Login failed';
            return { success: false, error: message };
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await authClient.logout();
        } catch {
            // Logout even if API call fails
        }
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoggedIn: !!user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
