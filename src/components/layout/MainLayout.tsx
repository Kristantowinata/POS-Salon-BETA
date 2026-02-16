
import React from 'react';
import Sidebar from './Sidebar';

interface MainLayoutProps {
    children: React.ReactNode;
    activePage?: string;
    onNavigate?: (page: string) => void;
}

export default function MainLayout({ children, activePage = 'dashboard', onNavigate = () => { } }: MainLayoutProps) {
    return (
        <div className="bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-100 font-display min-h-screen flex overflow-hidden selection:bg-primary selection:text-white">
            <Sidebar activePage={activePage} onNavigate={onNavigate} />
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Subtle ambient glow */}
                <div className="absolute top-0 left-0 w-full h-96 bg-primary/5 blur-[100px] pointer-events-none z-0"></div>

                {children}
            </main>
        </div>
    );
}
