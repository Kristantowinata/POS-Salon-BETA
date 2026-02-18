
import { useState } from 'react';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';
import { useCustomers } from '../hooks/useCustomers';
import { formatRupiah, getInitials } from '../lib/format';
import type { Customer } from '../lib/types';

export default function Customers() {
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
    const { data: customers, isLoading, isError, refetch } = useCustomers();

    const selectedCustomer: Customer | undefined =
        customers?.find(c => c.id === selectedCustomerId) ?? customers?.[0];

    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'gold': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
            case 'platinum': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
            case 'silver': return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
            case 'bronze': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
            default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
        }
    };

    const tierLabel = (tier: string) => tier.charAt(0).toUpperCase() + tier.slice(1);

    const tierIcon = (tier: string) => {
        switch (tier) {
            case 'gold': return 'star';
            case 'platinum': return 'diamond';
            default: return null;
        }
    };

    const formatDate = (iso: string) => {
        try {
            return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        } catch {
            return iso;
        }
    };

    return (
        <>
            <div className="flex flex-1 overflow-hidden relative z-10">
                {/* Main Content Area (List) */}
                <div className="flex-1 flex flex-col min-w-0 bg-white/5 dark:bg-background-dark">
                    {/* Page Header */}
                    <header className="min-h-20 flex flex-col md:flex-row md:items-center justify-between gap-3 px-4 md:px-8 py-4 bg-white dark:bg-background-dark border-b border-gray-200 dark:border-white/5 shrink-0 pl-14 md:pl-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Customers</h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Manage client profiles and loyalty status</p>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="relative group w-full md:w-64">
                                <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                                <input
                                    className="w-full bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                    placeholder="Search name, phone..."
                                    type="text"
                                />
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                                <span className="material-icons-round text-lg">filter_list</span>
                                <span className="hidden sm:inline">Filter</span>
                            </button>
                            <Button variant="primary" icon="add">New Customer</Button>
                        </div>
                    </header>

                    {/* Customer List Header */}
                    <div className="hidden md:grid px-4 md:px-8 py-4 grid-cols-12 gap-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-gray-200 dark:border-white/5">
                        <div className="col-span-4">Customer</div>
                        <div className="col-span-3">Contact</div>
                        <div className="col-span-2">Tier</div>
                        <div className="col-span-3 text-right">Points / Visits</div>
                    </div>

                    {/* Customer List Items */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                        {isLoading && <LoadingSpinner message="Loading customers..." />}
                        {isError && <ErrorAlert message="Failed to load customers." onRetry={() => refetch()} />}

                        {customers?.map(customer => (
                            <div
                                key={customer.id}
                                onClick={() => setSelectedCustomerId(customer.id)}
                                className={`flex flex-col md:grid md:grid-cols-12 gap-2 md:gap-4 items-start md:items-center p-4 rounded-xl cursor-pointer transition-all border ${(selectedCustomer?.id === customer.id) ? 'bg-primary/5 border-primary/50 shadow-sm relative z-10' : 'bg-white dark:bg-surface-dark border-gray-200 dark:border-white/5 hover:border-primary/30'}`}
                            >
                                {/* Customer Info */}
                                <div className="md:col-span-4 flex items-center gap-4">
                                    {customer.avatar_url ? (
                                        <img className={`w-12 h-12 rounded-full object-cover border-2 ${(selectedCustomer?.id === customer.id) ? 'border-primary' : 'border-transparent'}`} src={customer.avatar_url} alt={customer.name} />
                                    ) : (
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-2 ${(selectedCustomer?.id === customer.id) ? 'bg-primary text-white border-primary' : 'bg-slate-700 text-slate-300 border-transparent'}`}>
                                            {getInitials(customer.name)}
                                        </div>
                                    )}
                                    <div>
                                        <h3 className={`font-bold ${(selectedCustomer?.id === customer.id) ? 'text-primary' : 'text-slate-800 dark:text-white'}`}>{customer.name}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">ID: #{customer.display_id}</p>
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="hidden md:block md:col-span-3 text-sm text-slate-600 dark:text-slate-300 font-medium">
                                    {customer.phone || '—'}
                                </div>

                                {/* Tier */}
                                <div className="hidden md:block md:col-span-2">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTierColor(customer.loyalty_tier)}`}>
                                        {tierIcon(customer.loyalty_tier) && <span className="material-icons-round text-[10px]">{tierIcon(customer.loyalty_tier)}</span>}
                                        {tierLabel(customer.loyalty_tier)}
                                    </span>
                                </div>

                                {/* Stats */}
                                <div className="hidden md:flex md:col-span-3 items-center justify-end gap-6 text-right">
                                    <div>
                                        <p className="font-bold text-primary">{customer.loyalty_points.toLocaleString('id-ID')}</p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wide">Points</p>
                                    </div>
                                    <div className="w-px h-8 bg-gray-200 dark:bg-white/10"></div>
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-white">{customer.total_visits}</p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wide">Visits</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        {customers && customers.length > 0 && (
                            <div className="flex items-center justify-between pt-4 text-sm text-slate-500 dark:text-slate-400 px-2">
                                <span>Showing {customers.length} customers</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Customer Detail */}
                <aside className="w-96 bg-white dark:bg-surface-dark border-l border-gray-200 dark:border-white/5 flex-col z-20 shadow-xl hidden lg:flex">
                    {!selectedCustomer ? (
                        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                            Select a customer to view details
                        </div>
                    ) : (
                        <>
                            {/* Profile Header */}
                            <div className="p-8 flex flex-col items-center text-center border-b border-gray-200 dark:border-white/5 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-primary/10 to-transparent z-0"></div>
                                <div className="relative z-10 mb-4">
                                    {selectedCustomer.avatar_url ? (
                                        <div className="relative">
                                            <img className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-surface-dark shadow-lg" src={selectedCustomer.avatar_url} alt={selectedCustomer.name} />
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
                                    <span className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${getTierColor(selectedCustomer.loyalty_tier)}`}>
                                        {tierIcon(selectedCustomer.loyalty_tier) && <span className="material-icons-round text-[10px]">{tierIcon(selectedCustomer.loyalty_tier)}</span>}
                                        {tierLabel(selectedCustomer.loyalty_tier)} MEMBER
                                    </span>
                                    <span className="text-xs text-slate-500">Since {new Date(selectedCustomer.member_since).getFullYear()}</span>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-4 w-full relative z-10">
                                    <div className="bg-gray-50 dark:bg-background-dark p-3 rounded-xl border border-gray-200 dark:border-white/5">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Total Points</p>
                                        <p className="text-xl font-bold text-primary">{selectedCustomer.loyalty_points.toLocaleString('id-ID')}</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-background-dark p-3 rounded-xl border border-gray-200 dark:border-white/5">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Total Spent</p>
                                        <p className="text-xl font-bold text-slate-800 dark:text-white">{formatRupiah(selectedCustomer.total_spent)}</p>
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
                                                <p className="text-sm font-bold text-slate-800 dark:text-white">{selectedCustomer.phone || '—'}</p>
                                                <p className="text-xs text-slate-500">Mobile • WhatsApp</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                                                <span className="material-icons-round text-sm">email</span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-slate-800 dark:text-white">{selectedCustomer.email || '—'}</p>
                                                <p className="text-xs text-slate-500">Personal</p>
                                            </div>
                                        </div>
                                        {selectedCustomer.date_of_birth && (
                                            <div className="flex gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                                                    <span className="material-icons-round text-sm">cake</span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-slate-800 dark:text-white">{formatDate(selectedCustomer.date_of_birth)}</p>
                                                    <p className="text-xs text-slate-500">Birthday</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                {/* Recent History */}
                                <section>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Visit History</h3>
                                        <button className="text-xs text-primary hover:underline">View All</button>
                                    </div>
                                    <div className="text-sm text-slate-400 py-4 text-center">
                                        {selectedCustomer.total_visits > 0
                                            ? `${selectedCustomer.total_visits} visits on record`
                                            : 'No visits yet'}
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
                        </>
                    )}
                </aside>
            </div>
        </>
    );
}
