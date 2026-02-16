
import { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';

interface CustomersProps {
    activePage?: string;
    onNavigate?: (page: string) => void;
}

export default function Customers({ activePage = 'customers', onNavigate }: CustomersProps) {
    const [selectedCustomerId, setSelectedCustomerId] = useState<number>(1);

    // Mock Data
    const customers = [
        { id: 1, name: 'Ibu Ani', phone: '+62 812 3456 7890', idDisplay: '#88239', tier: 'Gold', points: '2,450', visits: 24, lastVisit: '16 Feb 2023', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaKxwIEXVRgNA2vgEOw3cO6OMP2yAp1FHXM-XE5BEYgrG42UTztFuZrIUcf3Wl4WDG_EDnpofJ9E0ncKlrQNpo5qb6FlYbBqW8TaShsj20J_Tl8lX8g9x7z36aOzMZjfWh97B4w1SV7s9_l9Q4K4EOt3E1E5Wnlcx9Tyavk5-zg5d1RoGkJrD9dG1C-fZYAH4F_111B4bfx9POf3nOeIreNgXcFG2SiUHDlYq1kZjy7uh-SKpJm03PBcZkyXhyxp0pMABVikwqJEE', email: 'ani.santoso@gmail.com', dob: '12 August 1985' },
        { id: 2, name: 'Dian Sastro', phone: '+62 811 9876 5432', idDisplay: '#88240', tier: 'Silver', points: '850', visits: 8, lastVisit: '14 Feb 2023', avatar: null, email: 'dian.s@example.com', dob: '16 March 1982' },
        { id: 3, name: 'Budi Santoso', phone: '+62 813 5555 1234', idDisplay: '#88241', tier: 'Platinum', points: '5,120', visits: 42, lastVisit: '10 Feb 2023', avatar: null, email: 'budi.santoso@example.com', dob: '05 January 1980' },
        { id: 4, name: 'Citra Lestari', phone: '+62 812 9988 7766', idDisplay: '#88242', tier: 'Silver', points: '320', visits: 3, lastVisit: '05 Feb 2023', avatar: null, email: 'citra.l@example.com', dob: '22 November 1995' },
    ];

    const selectedCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];

    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'Gold': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
            case 'Platinum': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
            case 'Silver': return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
            default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
        }
    };

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    return (
        <div className="flex bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 font-display min-h-screen overflow-hidden">
            <MainLayout activePage={activePage} onNavigate={onNavigate}>
                <div className="flex flex-1 overflow-hidden relative z-10">
                    {/* Main Content Area (List) */}
                    <div className="flex-1 flex flex-col min-w-0 bg-white/5 dark:bg-background-dark">
                        {/* Page Header */}
                        <header className="h-20 flex items-center justify-between px-8 bg-white dark:bg-background-dark border-b border-gray-200 dark:border-white/5 shrink-0">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Customers</h1>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Manage client profiles and loyalty status</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative group w-64">
                                    <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                                    <input
                                        className="w-full bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                        placeholder="Search name, phone..."
                                        type="text"
                                    />
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                                    <span className="material-icons-round text-lg">filter_list</span>
                                    Filter
                                </button>
                                <Button variant="primary" icon="add">New Customer</Button>
                            </div>
                        </header>

                        {/* Customer List Header */}
                        <div className="px-8 py-4 grid grid-cols-12 gap-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-gray-200 dark:border-white/5">
                            <div className="col-span-4">Customer</div>
                            <div className="col-span-3">Contact</div>
                            <div className="col-span-2">Tier</div>
                            <div className="col-span-3 text-right">Points / Visits</div>
                        </div>

                        {/* Customer List Items */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                            {customers.map(customer => (
                                <div
                                    key={customer.id}
                                    onClick={() => setSelectedCustomerId(customer.id)}
                                    className={`grid grid-cols-12 gap-4 items-center p-4 rounded-xl cursor-pointer transition-all border ${selectedCustomerId === customer.id ? 'bg-primary/5 border-primary/50 shadow-sm relative z-10' : 'bg-white dark:bg-surface-dark border-gray-200 dark:border-white/5 hover:border-primary/30'}`}
                                >
                                    {/* Customer Info */}
                                    <div className="col-span-4 flex items-center gap-4">
                                        {customer.avatar ? (
                                            <img className={`w-12 h-12 rounded-full object-cover border-2 ${selectedCustomerId === customer.id ? 'border-primary' : 'border-transparent'}`} src={customer.avatar} alt={customer.name} />
                                        ) : (
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-2 ${selectedCustomerId === customer.id ? 'bg-primary text-white border-primary' : 'bg-slate-700 text-slate-300 border-transparent'}`}>
                                                {getInitials(customer.name)}
                                            </div>
                                        )}
                                        <div>
                                            <h3 className={`font-bold ${selectedCustomerId === customer.id ? 'text-primary' : 'text-slate-800 dark:text-white'}`}>{customer.name}</h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">ID: {customer.idDisplay}</p>
                                        </div>
                                    </div>

                                    {/* Contact */}
                                    <div className="col-span-3 text-sm text-slate-600 dark:text-slate-300 font-medium">
                                        {customer.phone}
                                    </div>

                                    {/* Tier */}
                                    <div className="col-span-2">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTierColor(customer.tier)}`}>
                                            {customer.tier === 'Gold' && <span className="material-icons-round text-[10px]">star</span>}
                                            {customer.tier === 'Platinum' && <span className="material-icons-round text-[10px]">diamond</span>}
                                            {customer.tier}
                                        </span>
                                    </div>

                                    {/* Stats */}
                                    <div className="col-span-3 flex items-center justify-end gap-6 text-right">
                                        <div>
                                            <p className="font-bold text-primary">{customer.points}</p>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Points</p>
                                        </div>
                                        <div className="w-px h-8 bg-gray-200 dark:bg-white/10"></div>
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-white">{customer.visits}</p>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Visits</p>
                                        </div>
                                        <div className="hidden xl:block text-xs text-slate-500 ml-2">
                                            {customer.lastVisit}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Pagination Placeholder */}
                            <div className="flex items-center justify-between pt-4 text-sm text-slate-500 dark:text-slate-400 px-2">
                                <span>Showing 1 to 4 of 1,240 customers</span>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Prev</button>
                                    <button className="px-3 py-1 bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Next</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Customer Detail */}
                    <aside className="w-96 bg-white dark:bg-surface-dark border-l border-gray-200 dark:border-white/5 flex flex-col z-20 shadow-xl">
                        {/* Profile Header */}
                        <div className="p-8 flex flex-col items-center text-center border-b border-gray-200 dark:border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-primary/10 to-transparent z-0"></div>
                            <div className="relative z-10 mb-4">
                                {selectedCustomer.avatar ? (
                                    <div className="relative">
                                        <img className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-surface-dark shadow-lg" src={selectedCustomer.avatar} alt={selectedCustomer.name} />
                                        <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-surface-dark rounded-full"></div>
                                    </div>
                                ) : (
                                    <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold bg-slate-700 text-slate-300 border-4 border-white dark:border-surface-dark shadow-lg">
                                        {getInitials(selectedCustomer.name)}
                                    </div>
                                )}
                            </div>
                            <h2 className="relative z-10 text-2xl font-bold text-slate-800 dark:text-white mb-1">{selectedCustomer.name}</h2>
                            <div className="relative z-10 flex items-center gap-2 mb-6">
                                <span className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${getTierColor(selectedCustomer.tier)}`}>
                                    {selectedCustomer.tier === 'Gold' && <span className="material-icons-round text-[10px]">star</span>}
                                    {selectedCustomer.tier} MEMBER
                                </span>
                                <span className="text-xs text-slate-500">Since 2021</span>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4 w-full relative z-10">
                                <div className="bg-gray-50 dark:bg-background-dark p-3 rounded-xl border border-gray-200 dark:border-white/5">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Total Points</p>
                                    <p className="text-xl font-bold text-primary">{selectedCustomer.points}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-background-dark p-3 rounded-xl border border-gray-200 dark:border-white/5">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Avg. Spend</p>
                                    <p className="text-xl font-bold text-slate-800 dark:text-white">$125</p>
                                </div>
                            </div>

                            <div className="flex gap-3 w-full mt-6 relative z-10">
                                <button className="flex-1 py-2.5 bg-primary hover:bg-violet-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2">
                                    <span className="material-icons-round text-base">redeem</span>
                                    Redeem
                                </button>
                                <button className="flex-1 py-2.5 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-slate-700 dark:text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
                                    <span className="material-icons-round text-base">edit</span>
                                    Edit
                                </button>
                            </div>
                        </div>

                        {/* Details Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                            {/* Contact Info */}
                            <section>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Contact Information</h3>
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                                            <span className="material-icons-round text-sm">phone</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-800 dark:text-white">{selectedCustomer.phone}</p>
                                            <p className="text-xs text-slate-500">Mobile • WhatsApp</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                                            <span className="material-icons-round text-sm">email</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-800 dark:text-white">{selectedCustomer.email}</p>
                                            <p className="text-xs text-slate-500">Personal</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                                            <span className="material-icons-round text-sm">cake</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-800 dark:text-white">{selectedCustomer.dob}</p>
                                            <p className="text-xs text-slate-500">Birthday</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Notes */}
                            <section>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Notes</h3>
                                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-500/20 rounded-xl">
                                    <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                                        <span className="material-icons-round text-xs mr-1 align-middle">sticky_note_2</span>
                                        Prefers tea with no sugar. Sensitive scalp, use gentle shampoo.
                                    </p>
                                </div>
                            </section>

                            {/* Recent History */}
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Visit History</h3>
                                    <button className="text-xs text-primary hover:underline">View All</button>
                                </div>
                                <div className="space-y-4">
                                    <div className="relative pl-4 border-l-2 border-gray-200 dark:border-white/10 pb-4 last:pb-0">
                                        <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-white dark:ring-surface-dark"></div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-800 dark:text-white">Potong + Color</h4>
                                                <p className="text-xs text-slate-500">Stylist: Rina • 2h 30m</p>
                                            </div>
                                            <span className="text-xs font-medium text-slate-500 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded">16 Feb</span>
                                        </div>
                                        <div className="mt-2 flex gap-2">
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-green-500/10 text-green-500">Completed</span>
                                            <span className="text-[10px] text-slate-400 py-0.5">+150 pts</span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Bottom Action */}
                        <div className="p-6 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-background-dark/50">
                            <button className="w-full py-3.5 bg-surface-dark dark:bg-background-light text-white dark:text-slate-900 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
                                <span className="material-icons-round">calendar_today</span>
                                Book New Appointment
                            </button>
                        </div>
                    </aside>
                </div>
            </MainLayout>
        </div>
    );
}
