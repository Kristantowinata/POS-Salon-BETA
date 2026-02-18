
import { useState } from 'react';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';
import { useServices } from '../hooks/useServices';
import { useStylists } from '../hooks/useStylists';

export default function Reservations() {
    const { data: services, isLoading: servicesLoading, isError: servicesError, refetch: refetchServices } = useServices();
    const { data: stylists, isLoading: stylistsLoading, isError: stylistsError, refetch: refetchStylists } = useStylists();
    const [showWalkinMobile, setShowWalkinMobile] = useState(false);

    const isLoading = servicesLoading || stylistsLoading;
    const isError = servicesError || stylistsError;

    const availableStylists = stylists?.filter(s => s.is_available) ?? [];
    return (
        <>
            <div className="flex flex-1 overflow-hidden relative z-10">
                {/* Top Header & Main Workspace */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Top Header */}
                    <header className="h-20 bg-white/5 border-b border-white/5 flex items-center justify-between px-4 md:px-8 shrink-0 backdrop-blur-sm pl-14 md:pl-4">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Reservations</h1>
                            <p className="text-sm text-slate-400">Manage bookings & check-ins</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                                <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                                <span className="text-xs font-medium text-green-500">Salon Open</span>
                            </div>
                            <button className="relative p-2 text-slate-400 hover:text-primary hover:bg-white/5 rounded-full transition-colors">
                                <span className="material-icons-round">notifications</span>
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-surface-dark"></span>
                            </button>
                        </div>
                    </header>

                    {/* Content Area */}
                    <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
                        {isLoading && <LoadingSpinner message="Loading reservations data..." />}
                        {isError && !isLoading && (
                            <ErrorAlert
                                message="Failed to load reservations data."
                                onRetry={() => { refetchServices(); refetchStylists(); }}
                            />
                        )}

                        {!isLoading && !isError && (<>
                            {/* Search & Filters */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                                {/* Date Tabs */}
                                <div className="bg-surface-dark p-1 rounded-lg inline-flex border border-white/5">
                                    <button className="px-6 py-2 bg-primary text-white shadow-lg shadow-primary/30 rounded-lg text-sm font-semibold transition-all">
                                        Today
                                    </button>
                                    <button className="px-6 py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg text-sm font-medium transition-all">
                                        Tomorrow
                                    </button>
                                    <button className="px-6 py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg text-sm font-medium transition-all">
                                        This Week
                                    </button>
                                </div>
                                {/* Search Bar */}
                                <div className="relative w-full md:w-96 group">
                                    <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                                    <input
                                        className="w-full bg-surface-dark border border-white/5 text-white text-sm rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-sm placeholder-slate-500"
                                        placeholder="Search customer name or phone..."
                                        type="text"
                                    />
                                </div>
                            </div>

                            {/* Stats Overview */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
                                {[
                                    { icon: 'event', label: 'Total Bookings', value: '24', color: 'text-primary', bg: 'bg-primary/20' },
                                    { icon: 'check_circle', label: 'Checked In', value: '8', color: 'text-green-500', bg: 'bg-green-500/20' },
                                    { icon: 'schedule', label: 'Pending', value: '12', color: 'text-orange-500', bg: 'bg-orange-500/20' },
                                    { icon: 'person_add', label: 'Walk-ins', value: '4', color: 'text-pink-500', bg: 'bg-pink-500/20' },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-surface-dark p-4 rounded-xl border border-white/5 flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                                            <span className="material-icons-round text-xl">{stat.icon}</span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
                                            <p className="text-lg font-bold text-white">{stat.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Timeline / Cards */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 ml-1">Upcoming Appointments</h3>

                                {/* Card 1 */}
                                <div className="bg-surface-dark rounded-xl p-5 border-l-4 border-l-primary border-y border-r border-white/5 hover:border-r-primary/30 transition-all flex flex-col md:flex-row md:items-center gap-6 relative group">
                                    <div className="flex flex-col items-center justify-center min-w-[80px] border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-6">
                                        <span className="text-2xl font-bold text-primary">10:00</span>
                                        <span className="text-xs text-slate-500 uppercase font-semibold">AM</span>
                                    </div>
                                    <div className="flex-1 flex items-start gap-4">
                                        <img className="w-12 h-12 rounded-full object-cover border-2 border-surface-dark shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxoH1hvtbEh8S_NbK3e66zEUb1A3dRnzVvsn0uKULGsr81INz_-w0uSRfBxr_WVIbij8x16hBHYJPo4UoymXfBcQy4po55os7ZlmT7P0nPzZFzUG8RA_XNzyBGm1SweSua4i33EbfoZNMd9GuH_XNyU1J33806TgLrJDT5TmYNVUncyaSE18QZtaCZVzPBURvW8MsgW8q_6WHrcWHVJuuz0XsCU3llWnASLsJdEqaFILe4qWlwFS8gb7ncAu6XA3EtorovpY1Sf_M" alt="User" />
                                        <div>
                                            <h3 className="text-lg font-bold text-white">Ibu Ani Susanti</h3>
                                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                                <span className="text-sm text-slate-400 flex items-center gap-1">
                                                    <span className="material-icons-round text-base">content_cut</span> Potong + Coloring
                                                </span>
                                                <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                                <span className="text-sm text-slate-400 flex items-center gap-1">
                                                    <span className="material-icons-round text-base">face</span> Stylist: <span className="text-primary font-medium">Dewi</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4 md:static md:top-auto md:right-auto">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">Pending</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2 md:mt-0 w-full md:w-auto">
                                        <Button variant="success" size="sm" icon="check_circle">Check-in</Button>
                                        <Button variant="ghost" size="sm" icon="edit" className="!p-2" />
                                        <Button variant="ghost" size="sm" icon="block" className="!p-2 hover:text-red-400" />
                                    </div>
                                </div>

                                {/* Card 2 */}
                                <div className="bg-surface-dark rounded-xl p-5 border border-white/5 hover:border-primary/30 transition-all flex flex-col md:flex-row md:items-center gap-6 relative">
                                    <div className="flex flex-col items-center justify-center min-w-[80px] border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-6 opacity-80">
                                        <span className="text-2xl font-bold text-slate-300">11:30</span>
                                        <span className="text-xs text-slate-500 uppercase font-semibold">AM</span>
                                    </div>
                                    <div className="flex-1 flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">B</div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">Budi Santoso</h3>
                                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                                <span className="text-sm text-slate-400 flex items-center gap-1"><span className="material-icons-round text-base">spa</span> Creambath</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                                <span className="text-sm text-slate-400 flex items-center gap-1">Stylist: <span className="text-primary font-medium">Rina</span></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4 md:static md:top-auto md:right-auto">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">Confirmed</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2 md:mt-0 w-full md:w-auto">
                                        <Button variant="success" size="sm" icon="check_circle">Check-in</Button>
                                        <Button variant="ghost" size="sm" icon="edit" className="!p-2" />
                                    </div>
                                </div>

                                {/* Card 3 */}
                                <div className="bg-surface-dark rounded-xl p-5 border border-white/5 hover:border-primary/30 transition-all flex flex-col md:flex-row md:items-center gap-6 relative">
                                    <div className="flex flex-col items-center justify-center min-w-[80px] border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-6 opacity-80">
                                        <span className="text-2xl font-bold text-slate-300">13:00</span>
                                        <span className="text-xs text-slate-500 uppercase font-semibold">PM</span>
                                    </div>
                                    <div className="flex-1 flex items-start gap-4">
                                        <img className="w-12 h-12 rounded-full object-cover border-2 border-surface-dark shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQaJ40GZOr3KnupSgt3IeLiFQj8m5rnwz3InyiNG2b1JpWRJNXvT-1A1Qw09Dp-9-anKAZAotM5fqlrL5JlMV46hnjNYTyoMHAo378njsTlyHI4ZhvMnHDDevgyBpZxr9I1Myj_GVyVRXwquXJGyHR4oasG0_HcVDPlJHkE1jzhix4wiQpg5PxXgjTFjywdxeScfsPOQtdwonOB0QxAiZMlkb48MVsKNO5sEeHTdLacop8CG3yGtJ19DlyocLsEombRndMBXOGQvU" alt="User" />
                                        <div>
                                            <h3 className="text-lg font-bold text-white">Alex Wijaya</h3>
                                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                                <span className="text-sm text-slate-400 flex items-center gap-1"><span className="material-icons-round text-base">content_cut</span> Men's Cut</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                                <span className="text-sm text-slate-400 flex items-center gap-1">Stylist: <span className="text-primary font-medium">Bambang</span></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4 md:static md:top-auto md:right-auto">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">Late (10m)</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2 md:mt-0 w-full md:w-auto">
                                        <Button variant="success" size="sm" icon="check_circle">Check-in</Button>
                                        <Button variant="ghost" size="sm" icon="edit" className="!p-2" />
                                    </div>
                                </div>

                            </div>
                        </>)}
                    </main>
                </div>

                {/* Mobile FAB for Quick Walk-in */}
                <button
                    className="xl:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-white shadow-xl shadow-primary/30 flex items-center justify-center hover:bg-violet-600 active:scale-95 transition-all"
                    onClick={() => setShowWalkinMobile(!showWalkinMobile)}
                    aria-label="Quick Walk-in"
                >
                    <span className="material-icons-round text-2xl">{showWalkinMobile ? 'close' : 'flash_on'}</span>
                </button>

                {/* Mobile Walk-in Overlay */}
                {showWalkinMobile && (
                    <div className="xl:hidden fixed inset-0 z-40 flex items-end justify-center">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowWalkinMobile(false)} />
                        <div className="relative bg-surface-dark w-full max-w-md rounded-t-2xl p-6 animate-slide-up shadow-2xl max-h-[85vh] overflow-y-auto">
                            <div className="flex items-center gap-3 text-primary mb-4">
                                <span className="material-icons-round">flash_on</span>
                                <h2 className="text-xl font-bold text-white">Quick Walk-in</h2>
                            </div>
                            <form className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Customer Name</label>
                                    <div className="relative">
                                        <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">person</span>
                                        <input className="w-full bg-background-dark border border-white/10 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder-slate-600" placeholder="Enter guest name" type="text" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Phone Number</label>
                                    <div className="relative">
                                        <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">smartphone</span>
                                        <input className="w-full bg-background-dark border border-white/10 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder-slate-600" placeholder="+62 8..." type="tel" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Service</label>
                                    <select className="w-full bg-background-dark border border-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all appearance-none">
                                        <option>Select Service...</option>
                                        {services?.map(svc => (
                                            <option key={svc.id} value={svc.id}>{svc.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Preferred Stylist</label>
                                    <select className="w-full bg-background-dark border border-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all appearance-none">
                                        <option>Any Stylist</option>
                                        {stylists?.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <button type="button" className="w-full bg-primary hover:bg-violet-600 text-white font-bold py-4 rounded-xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 text-lg">
                                    <span>Start Order</span>
                                    <span className="material-icons-round">arrow_forward</span>
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Right Panel: Quick Walk-in Form */}
                <aside className="w-96 bg-surface-dark border-l border-white/5 flex-col z-20 shadow-2xl shadow-black/50 hidden xl:flex">
                    <div className="p-6 border-b border-white/5 bg-gradient-to-r from-primary/10 to-transparent">
                        <div className="flex items-center gap-3 text-primary mb-2">
                            <span className="material-icons-round">flash_on</span>
                            <span className="text-xs font-bold uppercase tracking-widest">Fast Action</span>
                        </div>
                        <h2 className="text-xl font-bold text-white">Quick Walk-in</h2>
                        <p className="text-sm text-slate-400 mt-1">Process immediate customers.</p>
                    </div>

                    <div className="p-6 flex-1 overflow-y-auto">
                        <form className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Customer Name</label>
                                <div className="relative">
                                    <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">person</span>
                                    <input className="w-full bg-background-dark border border-white/10 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder-slate-600" placeholder="Enter guest name" type="text" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Phone Number</label>
                                <div className="relative">
                                    <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">smartphone</span>
                                    <input className="w-full bg-background-dark border border-white/10 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder-slate-600" placeholder="+62 8..." type="tel" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Service</label>
                                <div className="relative">
                                    <select className="w-full bg-background-dark border border-white/10 text-white rounded-lg pl-4 pr-10 py-3 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all appearance-none cursor-pointer">
                                        <option>Select Service...</option>
                                        {services?.map(svc => (
                                            <option key={svc.id} value={svc.id}>{svc.name}</option>
                                        ))}
                                    </select>
                                    <span className="material-icons-round absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">expand_more</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Preferred Stylist</label>
                                <div className="relative">
                                    <select className="w-full bg-background-dark border border-white/10 text-white rounded-lg pl-4 pr-10 py-3 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all appearance-none cursor-pointer">
                                        <option>Any Stylist</option>
                                        {stylists?.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                    <span className="material-icons-round absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">expand_more</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span> {availableStylists.length} Stylists Available
                                </p>
                            </div>

                            <div className="pt-4">
                                <button className="w-full bg-primary hover:bg-violet-600 text-white font-bold py-4 rounded-xl shadow-xl shadow-primary/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-lg">
                                    <span>Start Order</span>
                                    <span className="material-icons-round">arrow_forward</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Helper image at bottom */}
                    <div className="mt-auto relative h-48 w-full overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark to-transparent z-10"></div>
                        {/* Placeholder gradient instead of external image to avoid loading issues if link breaks */}
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-purple-900/20"></div>
                        <div className="absolute bottom-6 left-6 right-6 z-20">
                            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                                <span>Queue Load</span>
                                <span>Low</span>
                            </div>
                            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-green-500 h-full w-[30%] rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </>
    );
}
