
import React, { useState } from 'react';
import Sidebar from './Sidebar';

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-100 font-display min-h-screen flex overflow-hidden selection:bg-primary selection:text-white">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Subtle ambient glow */}
                <div className="absolute top-0 left-0 w-full h-96 bg-primary/5 blur-[100px] pointer-events-none z-0"></div>

                {/* Mobile hamburger button */}
                <button
                    className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-all active:scale-95"
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Open menu"
                >
                    <span className="material-icons-round text-gray-700 dark:text-white">menu</span>
                </button>

                {children}
            </main>
        </div>
    );
}
