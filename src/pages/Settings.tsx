
import { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';

interface SettingsProps {
    activePage?: string;
    onNavigate?: (page: string) => void;
}

export default function Settings({ activePage = 'settings', onNavigate }: SettingsProps) {
    const [activeTab, setActiveTab] = useState('Services & Stylists');

    // Mock Data for Services
    const services = [
        {
            category: 'Hair Services',
            items: [
                { name: 'Women’s Cut & Style', duration: '60 min', price: '$85.00' },
                { name: 'Balayage & Toner', duration: '120 min', price: '$210.00' },
                { name: 'Root Touch Up', duration: '90 min', price: '$110.00' },
            ],
            count: 12
        },
        { category: 'Nail Services', items: [], count: 5 },
        { category: 'Body Treatments', items: [], count: 3 }
    ];

    // Mock Data for Stylists
    const stylists = [
        {
            id: 1,
            name: 'Sarah Jenkins',
            email: 'sarah@luxesalon.com',
            role: 'Senior Stylist',
            commission: '45%',
            earnings: '$4,250.00',
            trend: '+12%',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQOZZNcuBAl2DIVig6HbI8TK8XO5x4TDxkoTBODMejKUUDpiZpNs7pYQ8EkN2rSBfds005uTPL_nWELT6_YyLYTihzwWBDtjYAZk01XdRHuEdC-3u9m7qiE3pXkITC-vKDMX9nomRqxlMhDUqQ0zuIRYlmZ3eFL5Axqsw5xMNkCNP8nP-aDhgrh0teA9cPxTEMB131f9jaSyEKzWL9yLQ4fNMtLqZkf7X2IBxatpAMAQB6E8ZCCqygu1TEWzUhi_pMzg3wf4XEj88',
            online: true
        },
        {
            id: 2,
            name: 'Mike Ross',
            email: 'mike@luxesalon.com',
            role: 'Colorist',
            commission: '40%',
            earnings: '$3,800.00',
            trend: '-0.5%',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBejEsnlZi6Iql8k4zlKFVRQbuWf7XUXTXgAQqhl50bFo2QwA2RyMEFOab6HuLRc7ujOw87q24qBYvu9glHoGnsxp8r_o-OhEQsLI03aTLVa6LvbucwSs7PzkOumaEV_Mue8Y3MiiRhbJhAhvPU3eTjh2YmPlhYSfFQ6foCE4357ymJhs0rCiHQbEPQBHQrfyHlGzg2RZ3ZsEan-Y-EFYVKo4diDMEZcdz3ht7OLLZ-35s7ul0AL76wyrHWoT6WB37bTZKs-zCyzHg',
            online: false
        },
        {
            id: 3,
            name: 'Jessica P.',
            email: 'jess@luxesalon.com',
            role: 'Junior Stylist',
            commission: '30%',
            earnings: '$1,240.00',
            trend: '-5%',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5_2x0btsJCWlEFAfsabbScsYbE87-IOvXEa8F7zhugqX0S8hJvJ5f2a_U6IPM9KyLtFHgEBe3pSWwOUhWJ9TPHD7JlyTVS83NTmctY2RAbQ0ot3GOAbxhHzoKKKI6dCW75rIC2ZxEqSJ2NJ0dLyQRbpG5ndSh84WWQcCJ63eYWY_iT5MEWYhbSxW7Cr5JqUu-CBzAnPy9634rDJNvtYAekfgxdBOh9CHSQZvB9uYSA8IkHxzAFZ4JBzE3cHe9PFXdEjYIfGUwU98',
            online: true
        },
        {
            id: 4,
            name: 'David Kim',
            email: 'david@luxesalon.com',
            role: 'Esthetician',
            commission: '35%',
            earnings: '$2,890.00',
            trend: '+8%',
            avatar: null,
            online: false
        }
    ];

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'Senior Stylist': return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
            case 'Colorist': return 'bg-pink-500/10 text-pink-400 border border-pink-500/20';
            case 'Junior Stylist': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
            case 'Esthetician': return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
        }
    };

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    return (
        <div className="flex bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 font-display min-h-screen overflow-hidden">
            <MainLayout activePage={activePage} onNavigate={onNavigate}>
                <div className="flex flex-1 overflow-hidden relative z-10 flex-col bg-white/5 dark:bg-background-dark">
                    {/* Header */}
                    <header className="px-8 py-6 flex-shrink-0 z-10 bg-white/70 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5">
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
                        <div className="flex items-center gap-8 text-sm font-medium">
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
                    <div className="flex-1 overflow-y-auto p-8 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 custom-scrollbar">

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
                                {services.map((category, idx) => (
                                    <div key={idx} className="bg-white dark:bg-[#1e1b2e] rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden">
                                        <div className={`p-4 flex items-center justify-between cursor-pointer ${idx === 0 ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                                            <span className="font-bold text-slate-800 dark:text-white">{category.category}</span>
                                            <span className="text-xs font-medium bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">{category.count} items</span>
                                        </div>
                                        {category.items.length > 0 && (
                                            <div className="border-t border-gray-200 dark:border-white/5">
                                                {category.items.map((item, i) => (
                                                    <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 border-b border-gray-200 dark:border-white/5 last:border-0 transition-colors cursor-pointer group">
                                                        <div>
                                                            <p className="font-medium text-slate-800 dark:text-gray-200 group-hover:text-primary transition-colors">{item.name}</p>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                                <span className="material-icons-round text-[10px]">schedule</span> {item.duration}
                                                            </p>
                                                        </div>
                                                        <span className="font-bold text-slate-800 dark:text-white">{item.price}</span>
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
                                </select>
                            </div>

                            {/* Stylist Table */}
                            <div className="bg-white dark:bg-[#1e1b2e] rounded-xl border border-gray-200 dark:border-white/5 flex-1 overflow-hidden flex flex-col shadow-sm">
                                <div className="overflow-auto custom-scrollbar flex-1">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="sticky top-0 bg-slate-50 dark:bg-[#252038] z-10 text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                                            <tr>
                                                <th className="px-6 py-4">Stylist</th>
                                                <th className="px-6 py-4">Specialty</th>
                                                <th className="px-6 py-4 text-center">Commission</th>
                                                <th className="px-6 py-4 text-right">Monthly Earnings</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-sm">
                                            {stylists.map(stylist => (
                                                <tr key={stylist.id} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative">
                                                                {stylist.avatar ? (
                                                                    <img className="w-10 h-10 rounded-lg object-cover" src={stylist.avatar} alt={stylist.name} />
                                                                ) : (
                                                                    <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                                                                        {getInitials(stylist.name)}
                                                                    </div>
                                                                )}
                                                                {stylist.online && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#1e1b2e] rounded-full"></div>}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-800 dark:text-white">{stylist.name}</p>
                                                                <p className="text-xs text-slate-500 dark:text-slate-400">{stylist.email}</p>
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
                                                            {stylist.commission}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <p className="font-bold text-slate-800 dark:text-white">{stylist.earnings}</p>
                                                        <p className={`text-[10px] ${stylist.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                                            {stylist.trend} vs last month
                                                        </p>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {/* Pagination */}
                                <div className="px-6 py-4 border-t border-gray-200 dark:border-white/5 flex items-center justify-between">
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Showing 4 of 12 stylists</p>
                                    <div className="flex text-xs font-medium gap-4">
                                        <button className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Previous</button>
                                        <button className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Next</button>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#1e1b2e] rounded-xl p-5 border border-white/5 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <span className="material-icons-round">payments</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Commission Payout</p>
                                        <p className="text-2xl font-bold text-white">$12,180.00</p>
                                    </div>
                                </div>
                                <div className="bg-[#1e1b2e] rounded-xl p-5 border border-white/5 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <span className="material-icons-round">category</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Services</p>
                                        <p className="text-2xl font-bold text-white">42 <span className="text-sm font-normal text-slate-500">items</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <footer className="px-8 py-4 text-center text-xs text-slate-500 dark:text-slate-600 border-t border-gray-200 dark:border-white/5">
                        © 2023 LuxePOS System v2.4. All rights reserved.
                    </footer>
                </div>
            </MainLayout>
        </div>
    );
}
