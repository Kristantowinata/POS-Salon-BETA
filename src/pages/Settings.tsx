
import { useState } from 'react';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';
import { useServices } from '../hooks/useServices';
import { useStylists } from '../hooks/useStylists';
import { formatRupiah, formatDuration, getInitials } from '../lib/format';
import type { Service } from '../lib/types';

interface SettingsProps {
    defaultTab?: string;
}

export default function Settings({ defaultTab = 'General' }: SettingsProps) {
    const [activeTab, setActiveTab] = useState(defaultTab);
    const { data: services, isLoading: servicesLoading, isError: servicesError, refetch: refetchServices } = useServices();
    const { data: stylists, isLoading: stylistsLoading, isError: stylistsError, refetch: refetchStylists } = useStylists();

    // Group services by category
    const servicesByCategory = (() => {
        if (!services) return [];
        const map = new Map<string, { name: string; items: Service[] }>();
        for (const svc of services) {
            const catName = svc.service_categories?.name ?? 'Lainnya';
            if (!map.has(catName)) map.set(catName, { name: catName, items: [] });
            map.get(catName)!.items.push(svc);
        }
        return Array.from(map.values());
    })();

    const getRoleColor = (role: string) => {
        switch (role.toLowerCase()) {
            case 'senior stylist': return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
            case 'colorist': return 'bg-pink-500/10 text-pink-400 border border-pink-500/20';
            case 'junior stylist': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
            case 'nail artist': return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
        }
    };

    const totalCommission = stylists
        ? stylists.reduce((sum, s) => sum + (s.commission_rate ?? 0), 0) / stylists.length
        : 0;

    const isLoading = servicesLoading || stylistsLoading;
    const isError = servicesError || stylistsError;

    return (
        <div className="flex flex-1 overflow-hidden relative z-10 flex-col bg-white/5 dark:bg-background-dark">
            {/* Header */}
            <header className="px-4 md:px-8 py-6 flex-shrink-0 z-10 bg-white/70 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5 pl-14 md:pl-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-1">
                            <span>Settings</span>
                            <span className="material-icons-round text-xs">chevron_right</span>
                            <span className="text-primary font-medium">Services & Team</span>
                        </div>
                        <h2 className="text-2xl font-bold dark:text-white">Configuration</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-sm font-medium hover:bg-white dark:hover:bg-white/5 transition-colors dark:text-white">
                            <span className="material-icons-round text-lg">cloud_download</span>
                            Export Data
                        </button>
                        <Button variant="primary" icon="save">Save Changes</Button>
                    </div>
                </div>
                {/* Tabs */}
                <div className="flex items-center gap-4 md:gap-8 text-sm font-medium overflow-x-auto whitespace-nowrap pb-px -mb-px">
                    {['General', 'Services & Stylists', 'Taxes & Fees', 'Hardware'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 border-b-2 transition-colors ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </header>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pt-6 custom-scrollbar">
                {isLoading ? (
                    <LoadingSpinner message="Loading settings data..." />
                ) : isError ? (
                    <ErrorAlert
                        message="Failed to load settings data."
                        onRetry={() => { refetchServices(); refetchStylists(); }}
                    />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Column: Service Catalog */}
                        <div className="lg:col-span-4 flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <span className="material-icons-round text-primary">spa</span>
                                    Service Catalog
                                </h3>
                                <button className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-1">
                                    <span className="material-icons-round text-sm">add</span> New Service
                                </button>
                            </div>

                            <div className="relative">
                                <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                                <input className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#1e1b2e] border border-gray-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-500 dark:text-white" placeholder="Search services..." type="text" />
                            </div>

                            <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2">
                                {servicesByCategory.map((category, idx) => (
                                    <div key={category.name} className="bg-white dark:bg-[#1e1b2e] rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden">
                                        <div className={`p-4 flex items-center justify-between cursor-pointer ${idx === 0 ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                                            <span className="font-bold text-slate-800 dark:text-white">{category.name}</span>
                                            <span className="text-xs font-medium bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">{category.items.length} items</span>
                                        </div>
                                        {idx === 0 && category.items.length > 0 && (
                                            <div className="border-t border-gray-200 dark:border-white/5">
                                                {category.items.slice(0, 3).map((item, i) => (
                                                    <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 border-b border-gray-200 dark:border-white/5 last:border-0 transition-colors cursor-pointer group">
                                                        <div>
                                                            <p className="font-medium text-slate-800 dark:text-gray-200 group-hover:text-primary transition-colors">{item.name}</p>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                                <span className="material-icons-round text-[10px]">schedule</span> {formatDuration(item.duration_minutes)}
                                                            </p>
                                                        </div>
                                                        <span className="font-bold text-slate-800 dark:text-white">{formatRupiah(item.price)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column: Stylists & Commission */}
                        <div className="lg:col-span-8 flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <span className="material-icons-round text-primary">groups</span>
                                    Stylists & Commission
                                </h3>
                                <button className="text-xs font-bold text-white bg-primary px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1 shadow-lg shadow-primary/25">
                                    <span className="material-icons-round text-sm">person_add</span> New Stylist
                                </button>
                            </div>

                            <div className="flex gap-4">
                                <div className="relative flex-1">
                                    <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                                    <input className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#1e1b2e] border border-gray-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-500 dark:text-white" placeholder="Search team member..." type="text" />
                                </div>
                                <select className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#1e1b2e] border border-gray-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer dark:text-white min-w-[150px]">
                                    <option>All Roles</option>
                                    <option>Senior Stylist</option>
                                    <option>Junior Stylist</option>
                                    <option>Colorist</option>
                                    <option>Nail Artist</option>
                                </select>
                            </div>

                            {/* Stylist Table */}
                            <div className="bg-white dark:bg-[#1e1b2e] rounded-xl border border-gray-200 dark:border-white/5 flex-1 overflow-hidden flex flex-col shadow-sm">
                                {stylists && (
                                    <>
                                        <div className="overflow-auto custom-scrollbar flex-1">
                                            <table className="w-full text-left border-collapse min-w-[600px]">
                                                <thead className="sticky top-0 bg-slate-50 dark:bg-[#252038] z-10 text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                                                    <tr>
                                                        <th className="px-6 py-4">Stylist</th>
                                                        <th className="px-6 py-4">Specialty</th>
                                                        <th className="px-6 py-4 text-center">Commission</th>
                                                        <th className="px-6 py-4 text-right">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-sm">
                                                    {stylists.map(stylist => (
                                                        <tr key={stylist.id} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="relative">
                                                                        {stylist.avatar_url ? (
                                                                            <img className="w-10 h-10 rounded-lg object-cover" src={stylist.avatar_url} alt={stylist.name} />
                                                                        ) : (
                                                                            <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                                                                                {getInitials(stylist.name)}
                                                                            </div>
                                                                        )}
                                                                        {stylist.is_available && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#1e1b2e] rounded-full"></div>}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-bold text-slate-800 dark:text-white">{stylist.name}</p>
                                                                        <p className="text-xs text-slate-500 dark:text-slate-400">{stylist.email || '—'}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium ${getRoleColor(stylist.role)}`}>
                                                                    {stylist.role}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-center">
                                                                <span className="font-bold text-slate-800 dark:text-white border border-gray-200 dark:border-white/10 px-3 py-1 rounded-lg">
                                                                    {stylist.commission_rate}%
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${stylist.is_available ? 'bg-green-500/10 text-green-500' : 'bg-slate-500/10 text-slate-400'}`}>
                                                                    <span className={`w-1.5 h-1.5 rounded-full ${stylist.is_available ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                                                                    {stylist.is_available ? 'Available' : 'Offline'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        {/* Pagination */}
                                        <div className="px-6 py-4 border-t border-gray-200 dark:border-white/5 flex items-center justify-between">
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Showing {stylists.length} stylists</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Bottom Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#1e1b2e] rounded-xl p-5 border border-white/5 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <span className="material-icons-round">payments</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Avg Commission Rate</p>
                                        <p className="text-2xl font-bold text-white">{Math.round(totalCommission)}%</p>
                                    </div>
                                </div>
                                <div className="bg-[#1e1b2e] rounded-xl p-5 border border-white/5 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <span className="material-icons-round">category</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Services</p>
                                        <p className="text-2xl font-bold text-white">{services?.length ?? 0} <span className="text-sm font-normal text-slate-500">items</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <footer className="px-8 py-4 text-center text-xs text-slate-500 dark:text-slate-600 border-t border-gray-200 dark:border-white/5">
                © 2026 SukimSalon POS v1.0. All rights reserved.
            </footer>
        </div>
    );
}
