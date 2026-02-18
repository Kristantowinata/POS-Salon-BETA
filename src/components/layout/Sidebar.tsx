import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const activePage = location.pathname.replace('/', '') || 'dashboard';

    const handleNav = (page: string) => {
        navigate(`/${page}`);
        onClose?.();
    };

    const navItem = (page: string, icon: string, label: string) => (
        <button
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all group ${activePage === page ? 'bg-primary/10 text-primary' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-primary'}`}
            onClick={() => handleNav(page)}
        >
            <span className="material-icons-round text-2xl">{icon}</span>
            <span className="ml-3 font-medium">{label}</span>
        </button>
    );

    const sidebarContent = (
        <>
            <div>
                {/* Logo Area */}
                <div className="h-20 flex items-center px-6 border-b border-gray-200 dark:border-gray-800 cursor-pointer" onClick={() => handleNav('dashboard')}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30 flex-shrink-0">
                        S
                    </div>
                    <span className="ml-3 font-bold text-xl tracking-tight text-gray-800 dark:text-white">Sukim<span className="text-primary">Salon</span></span>
                </div>

                {/* Navigation */}
                <nav className="mt-6 px-4 space-y-1">
                    {navItem('dashboard', 'dashboard', 'Dashboard')}
                    {navItem('reservations', 'calendar_today', 'Reservations')}
                    {navItem('checkout', 'point_of_sale', 'Checkout')}
                    {navItem('customers', 'people', 'Customers')}
                    {navItem('services', 'content_cut', 'Services')}
                    {navItem('inventory', 'inventory_2', 'Inventory')}
                    {navItem('analytics', 'query_stats', 'Analytics')}
                </nav>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <button
                    className={`w-full flex items-center px-4 py-3 rounded-xl transition-all group mb-2 ${activePage === 'settings' ? 'bg-primary/10 text-primary' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-primary'}`}
                    onClick={() => handleNav('settings')}
                >
                    <span className="material-icons-round text-2xl">settings</span>
                    <span className="ml-3 font-medium">Settings</span>
                </button>

                <div className="flex items-center px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5">
                    <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                        {user?.full_name?.charAt(0)?.toUpperCase() ?? 'U'}
                    </div>
                    <div className="ml-3 overflow-hidden flex items-center justify-between flex-1">
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{user?.full_name ?? 'User'}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">{user?.role ?? 'Staff'}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="ml-2 p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
                            title="Logout"
                        >
                            <span className="material-icons-round text-lg">logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <>
            {/* Desktop sidebar — icon-only on md, full on lg */}
            <aside className="hidden md:flex w-20 lg:w-64 flex-shrink-0 flex-col justify-between transition-all duration-300 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark z-20">
                {/* On md (icon-only), hide labels */}
                <div className="lg:hidden flex flex-col justify-between h-full">
                    <div>
                        <div className="h-20 flex items-center justify-center border-b border-gray-200 dark:border-gray-800 cursor-pointer" onClick={() => navigate('/dashboard')}>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30">
                                S
                            </div>
                        </div>
                        <nav className="mt-6 px-2 space-y-1">
                            {[
                                ['dashboard', 'dashboard'],
                                ['reservations', 'calendar_today'],
                                ['checkout', 'point_of_sale'],
                                ['customers', 'people'],
                                ['services', 'content_cut'],
                                ['inventory', 'inventory_2'],
                                ['analytics', 'query_stats'],
                            ].map(([page, icon]) => (
                                <button
                                    key={page}
                                    className={`w-full flex items-center justify-center p-3 rounded-xl transition-all ${activePage === page ? 'bg-primary/10 text-primary' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-primary'}`}
                                    onClick={() => navigate(`/${page}`)}
                                    title={page.charAt(0).toUpperCase() + page.slice(1)}
                                >
                                    <span className="material-icons-round text-2xl">{icon}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                    <div className="p-2 border-t border-gray-200 dark:border-gray-800">
                        <button
                            className={`w-full flex items-center justify-center p-3 rounded-xl transition-all mb-2 ${activePage === 'settings' ? 'bg-primary/10 text-primary' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-primary'}`}
                            onClick={() => navigate('/settings')}
                            title="Settings"
                        >
                            <span className="material-icons-round text-2xl">settings</span>
                        </button>
                        <div className="flex items-center justify-center p-2">
                            <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-primary font-bold text-sm">
                                {user?.full_name?.charAt(0)?.toUpperCase() ?? 'U'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* On lg, show full sidebar */}
                <div className="hidden lg:flex flex-col justify-between h-full">
                    {sidebarContent}
                </div>
            </aside>

            {/* Mobile sidebar — overlay */}
            {isOpen && (
                <>
                    <div className="sidebar-backdrop md:hidden" onClick={onClose} />
                    <aside className="sidebar-mobile md:hidden flex flex-col justify-between bg-white dark:bg-surface-dark shadow-2xl">
                        {sidebarContent}
                    </aside>
                </>
            )}
        </>
    );
}
