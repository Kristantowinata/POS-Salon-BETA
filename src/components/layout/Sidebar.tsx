interface SidebarProps {
    activePage: string;
    onNavigate: (page: string) => void;
}

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {

    return (
        <aside className="w-20 lg:w-64 flex-shrink-0 flex flex-col justify-between transition-all duration-300 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark z-20">
            <div>
                {/* Logo Area */}
                <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-gray-200 dark:border-gray-800 cursor-pointer" onClick={() => onNavigate('dashboard')}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30">
                        S
                    </div>
                    <span className="hidden lg:block ml-3 font-bold text-xl tracking-tight text-gray-800 dark:text-white">Sukim<span className="text-primary">Salon</span></span>
                </div>

                {/* Navigation */}
                <nav className="mt-6 px-2 lg:px-4 space-y-2">
                    <button className={`w-full flex items-center px-2 lg:px-4 py-3 rounded-xl transition-all group ${activePage === 'dashboard' ? 'bg-primary/10 text-primary' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-primary'}`} onClick={() => onNavigate('dashboard')}>
                        <span className="material-icons-round text-2xl">dashboard</span>
                        <span className="hidden lg:block ml-3 font-medium">Dashboard</span>
                    </button>

                    <button className={`w-full flex items-center px-2 lg:px-4 py-3 rounded-xl transition-all group relative ${activePage === 'reservations' ? 'bg-primary/10 text-primary' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-primary'}`} onClick={() => onNavigate('reservations')}>
                        <span className="material-icons-round text-2xl">calendar_today</span>
                        <span className="hidden lg:block ml-3 font-medium">Reservations</span>
                        {activePage === 'reservations' && <div className="absolute right-2 w-2 h-2 rounded-full bg-primary lg:hidden"></div>}
                    </button>

                    <button className={`w-full flex items-center px-2 lg:px-4 py-3 rounded-xl transition-all group ${activePage === 'checkout' ? 'bg-primary/10 text-primary' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-primary'}`} onClick={() => onNavigate('checkout')}>
                        <span className="material-icons-round text-2xl">point_of_sale</span>
                        <span className="hidden lg:block ml-3 font-medium">Checkout</span>
                    </button>

                    <button className={`w-full flex items-center px-2 lg:px-4 py-3 rounded-xl transition-all group ${activePage === 'customers' ? 'bg-primary/10 text-primary' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-primary'}`} onClick={() => onNavigate('customers')}>
                        <span className="material-icons-round text-2xl">people</span>
                        <span className="hidden lg:block ml-3 font-medium">Customers</span>
                    </button>

                    <button className={`w-full flex items-center px-2 lg:px-4 py-3 rounded-xl transition-all group ${activePage === 'services' ? 'bg-primary/10 text-primary' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-primary'}`} onClick={() => onNavigate('services')}>
                        <span className="material-icons-round text-2xl">content_cut</span>
                        <span className="hidden lg:block ml-3 font-medium">Services</span>
                    </button>

                    <button className={`w-full flex items-center px-2 lg:px-4 py-3 rounded-xl transition-all group ${activePage === 'inventory' ? 'bg-primary/10 text-primary' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-primary'}`} onClick={() => onNavigate('inventory')}>
                        <span className="material-icons-round text-2xl">inventory_2</span>
                        <span className="hidden lg:block ml-3 font-medium">Inventory</span>
                    </button>
                    <button className={`w-full flex items-center px-2 lg:px-4 py-3 rounded-xl transition-all group ${activePage === 'analytics' ? 'bg-primary/10 text-primary' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-primary'}`} onClick={() => onNavigate('analytics')}>
                        <span className="material-icons-round text-2xl">query_stats</span>
                        <span className="hidden lg:block ml-3 font-medium">Analytics</span>
                    </button>
                </nav>
            </div>

            {/* Bottom Actions */}
            <div className="p-2 lg:p-4 border-t border-gray-200 dark:border-gray-800">
                <button className={`w-full flex items-center px-2 lg:px-4 py-3 rounded-xl transition-all group mb-4 ${activePage === 'settings' ? 'bg-primary/10 text-primary' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-primary'}`} onClick={() => onNavigate('settings')}>
                    <span className="material-icons-round text-2xl">settings</span>
                    <span className="hidden lg:block ml-3 font-medium">Settings</span>
                </button>

                <div className="flex items-center px-2 lg:px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5">
                    <img
                        className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-600"
                        alt="User profile"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQOZZNcuBAl2DIVig6HbI8TK8XO5x4TDxkoTBODMejKUUDpiZpNs7pYQ8EkN2rSBfds005uTPL_nWELT6_YyLYTihzwWBDtjYAZk01XdRHuEdC-3u9m7qiE3pXkITC-vKDMX9nomRqxlMhDUqQ0zuIRYlmZ3eFL5Axqsw5xMNkCNP8nP-aDhgrh0teA9cPxTEMB131f9jaSyEKzWL9yLQ4fNMtLqZkf7X2IBxatpAMAQB6E8ZCCqygu1TEWzUhi_pMzg3wf4XEj88"
                    />
                    <div className="hidden lg:block ml-3 overflow-hidden">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">Sarah Jenkins</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Manager</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
