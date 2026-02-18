
import StatCard from '../components/ui/StatCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';
import { useAuth } from '../context/AuthContext';
import { useStylists } from '../hooks/useStylists';
import { useProducts } from '../hooks/useInventory';
import { getInitials } from '../lib/format';

export default function Dashboard() {
    const { user } = useAuth();
    const { data: stylists, isLoading: stylistsLoading, isError: stylistsError, refetch: refetchStylists } = useStylists();
    const { data: products, isLoading: productsLoading, isError: productsError, refetch: refetchProducts } = useProducts();

    const isLoading = stylistsLoading || productsLoading;
    const isError = stylistsError || productsError;

    const lowStockCount = products?.filter(p => p.stock_qty <= p.min_stock_qty).length ?? 0;
    return (
        <>
            {/* Top Header */}
            <header className="h-20 flex items-center justify-between px-4 md:px-8 z-10 pl-14 md:pl-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h1>
                    <p className="text-sm text-gray-400">Welcome back, {user?.full_name?.split(' ')[0] ?? 'User'}</p>
                </div>
                <div className="flex items-center gap-6">
                    {/* Clock */}
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-dark border border-white/5 text-primary font-mono font-semibold">
                        <span className="material-icons-round text-lg">schedule</span>
                        <span>14:35 PM</span>
                    </div>
                    {/* Search */}
                    <div className="relative w-64 hidden md:block">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-icons-round text-gray-500">search</span>
                        <input
                            className="w-full bg-surface-dark border border-white/5 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 placeholder-gray-600"
                            placeholder="Search booking or client..."
                            type="text"
                        />
                    </div>
                    {/* Notifications */}
                    <button className="relative p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                        <span className="material-icons-round">notifications</span>
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background-dark"></span>
                    </button>
                </div>
            </header>

            {/* Scrollable Dashboard Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 pt-2 z-10 space-y-6">

                {isLoading && <LoadingSpinner message="Loading dashboard data..." />}
                {isError && !isLoading && (
                    <ErrorAlert
                        message="Failed to load dashboard data."
                        onRetry={() => { refetchStylists(); refetchProducts(); }}
                    />
                )}

                {!isLoading && !isError && (<>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Daily Revenue"
                            value="Rp 12,500,000"
                            subtitle="vs Rp 11,100,000 yesterday"
                            icon="payments"
                            trend="+12.5%"
                            color="primary"
                        />
                        <StatCard
                            title="Customers"
                            value="34 Total"
                            subtitle="24 Walk-ins / 10 Booked"
                            icon="groups"
                            trend="+4"
                            color="blue"
                        />
                        <StatCard
                            title="Services Done"
                            value="45"
                            icon="spa"
                            color="purple"
                        >
                            <div className="w-full bg-gray-700 h-1.5 rounded-full mt-3 overflow-hidden">
                                <div className="bg-primary h-hull rounded-full" style={{ width: '75%' }}></div>
                            </div>
                        </StatCard>

                        {/* Custom Card for Low Stock (using StatCard structure manually for pulse) */}
                        <div className="glass-panel p-5 rounded-xl flex flex-col justify-between h-32 relative overflow-hidden group border-red-500/20">
                            <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="material-icons-round text-6xl text-red-400">warning</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-400">Low Stock Alert</span>
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">{lowStockCount} Items</h3>
                                <p className="text-xs text-red-400 mt-1">Needs immediate reorder</p>
                            </div>
                        </div>
                    </div>

                    {/* Middle Section: Queue & Top Services */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-96">

                        {/* Current Queue Table */}
                        <div className="lg:col-span-2 glass-panel rounded-xl p-6 flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <span className="material-icons-round text-primary">queue</span>
                                    Current Queue
                                </h3>
                                <button className="text-xs text-primary hover:text-white transition-colors font-semibold">View All</button>
                            </div>
                            <div className="overflow-auto flex-1 pr-2 -mx-2 px-2">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-xs text-gray-500 border-b border-white/5">
                                            <th className="pb-3 font-medium pl-2">Customer</th>
                                            <th className="pb-3 font-medium">Service</th>
                                            <th className="pb-3 font-medium">Stylist</th>
                                            <th className="pb-3 font-medium text-right pr-2">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {[
                                            { name: 'Ibu Ani', initials: 'IA', color: 'from-pink-500 to-orange-400', service: 'Full Coloring', stylist: 'Jessica', status: 'Processing', statusColor: 'bg-primary/20 text-primary border-primary/20' },
                                            { name: 'Pak Budi', initials: 'PB', color: 'from-blue-500 to-teal-400', service: "Men's Cut", stylist: 'Michael', status: 'Waiting (5m)', statusColor: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
                                            { name: 'Siti L.', initials: 'SL', color: 'from-purple-500 to-indigo-400', service: 'Creambath SPA', stylist: 'Dina', status: 'Processing', statusColor: 'bg-primary/20 text-primary border-primary/20' },
                                            { name: 'Rina Rose', initials: 'RR', color: 'from-green-500 to-emerald-400', service: 'Manicure', stylist: 'Sarah', status: 'Waiting (2m)', statusColor: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
                                        ].map((item, index) => (
                                            <tr key={index} className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                                                <td className="py-4 pl-2 font-medium text-white">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-xs font-bold text-white`}>{item.initials}</div>
                                                        {item.name}
                                                    </div>
                                                </td>
                                                <td className="py-4 text-gray-300">{item.service}</td>
                                                <td className="py-4 text-gray-400">{item.stylist}</td>
                                                <td className="py-4 text-right pr-2">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${item.statusColor}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Top Services Chart */}
                        <div className="glass-panel rounded-xl p-6 flex flex-col h-full">
                            <h3 className="text-lg font-bold text-white mb-6">Top Services</h3>
                            <div className="flex-1 flex flex-col justify-center space-y-6">
                                {[
                                    { name: 'Haircut & Styling', val: '42%', width: '42%', opacity: '100' },
                                    { name: 'Hair Coloring', val: '28%', width: '28%', opacity: '80' },
                                    { name: 'Creambath', val: '18%', width: '18%', opacity: '60' },
                                    { name: 'Manicure/Pedicure', val: '12%', width: '12%', opacity: '40' },
                                ].map((svc, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-300">{svc.name}</span>
                                            <span className="text-white font-bold">{svc.val}</span>
                                        </div>
                                        <div className="w-full bg-gray-800 rounded-full h-2">
                                            <div
                                                className={`bg-gradient-to-r from-primary to-purple-400 h-2 rounded-full opacity-${svc.opacity}`}
                                                style={{ width: svc.width }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
                        {/* Stylist Status Grid */}
                        <div className="lg:col-span-2 glass-panel rounded-xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-white">Stylist Availability</h3>
                                <div className="flex gap-4 text-xs">
                                    <span className="flex items-center gap-1 text-gray-400"><span className="w-2 h-2 rounded-full bg-green-500"></span> Available</span>
                                    <span className="flex items-center gap-1 text-gray-400"><span className="w-2 h-2 rounded-full bg-red-500"></span> Busy</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {stylists ? stylists.map((stylist) => (
                                    <div key={stylist.id} className="bg-white/5 rounded-lg p-3 flex items-center gap-3 border border-white/5 hover:border-primary/30 transition-colors cursor-pointer">
                                        <div className="relative">
                                            {stylist.avatar_url ? (
                                                <img className="w-10 h-10 rounded-full object-cover" src={stylist.avatar_url} alt={stylist.name} />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">{getInitials(stylist.name)}</div>
                                            )}
                                            <span className={`absolute bottom-0 right-0 w-3 h-3 ${stylist.is_available ? 'bg-green-500' : 'bg-red-500'} border-2 border-background-dark rounded-full`}></span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">{stylist.name}</p>
                                            <p className={`text-xs truncate ${stylist.is_available ? 'text-gray-500' : 'text-primary'}`}>{stylist.role}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-sm text-slate-500 col-span-4">Loading stylists...</p>
                                )}
                            </div>
                        </div>

                        {/* Peak Hours Chart */}
                        <div className="glass-panel rounded-xl p-6 flex flex-col">
                            <h3 className="text-lg font-bold text-white mb-4">Peak Hours (Today)</h3>
                            <div className="flex-1 flex items-end justify-between gap-2 h-32 px-2">
                                {[
                                    { time: '10am', height: '30%', active: false },
                                    { time: '11am', height: '45%', active: false },
                                    { time: '12pm', height: '80%', active: true },
                                    { time: '1pm', height: '60%', active: false },
                                    { time: '2pm', height: '40%', active: false },
                                    { time: '3pm', height: '55%', active: false },
                                ].map((bar, i) => (
                                    <div key={i} className="w-full bg-white/5 rounded-t-sm relative group flex justify-center" style={{ height: bar.height }}>
                                        <div className="absolute -top-6 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">{bar.time}</div>
                                        <div className={`w-full mx-1 rounded-t-sm h-full transition-colors ${bar.active ? 'bg-primary shadow-[0_0_15px_rgba(139,92,246,0.5)]' : 'bg-primary/30 group-hover:bg-primary/50'}`}></div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-500 mt-2 px-2">
                                <span>10am</span>
                                <span>12pm</span>
                            </div>
                        </div>
                    </div>
                </>)}
            </div>
        </>
    );
}
