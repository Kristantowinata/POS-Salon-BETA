
import { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';

interface CheckoutProps {
    onBack?: () => void;
    onProceed?: () => void;
    activePage?: string;
    onNavigate?: (page: string) => void;
}

export default function Checkout({ onBack, onProceed, activePage = 'checkout', onNavigate }: CheckoutProps) {
    const [activeTab, setActiveTab] = useState('Services');

    const services = [
        { id: 1, name: 'Potong Rambut Ladies', desc: 'Includes wash, cut, and basic blow dry styling.', price: 'Rp 150.000', duration: '45m', icon: 'content_cut', category: 'Hair Services' },
        { id: 2, name: 'Hair Coloring (Full)', desc: 'Full head coloring with premium Loreal products.', price: 'Rp 850.000', duration: '120m', icon: 'palette', category: 'Hair Services', selected: true },
        { id: 3, name: 'Creambath Traditional', desc: 'Relaxing head massage with natural ingredients.', price: 'Rp 200.000', duration: '60m', icon: 'spa', category: 'Hair Services' },
        { id: 4, name: 'Blow Dry Styling', desc: 'Standard blow dry for medium length hair.', price: 'Rp 120.000', duration: '30m', icon: 'face', category: 'Hair Services' },
        { id: 5, name: 'Manicure Gel', desc: 'Cleaning, shaping, and gel polish application.', price: 'Rp 250.000', duration: '60m', icon: 'brush', category: 'Nail & Spa' },
        { id: 6, name: 'Pedicure Spa', desc: 'Complete foot care with scrub and massage.', price: 'Rp 300.000', duration: '75m', icon: 'foot_bones', category: 'Nail & Spa' },
    ];

    return (
        <MainLayout activePage={activePage} onNavigate={onNavigate}>
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-100 selection:bg-primary selection:text-white relative">

                {/* Top Header / Action Bar */}
                <header className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-white/5 bg-white/70 dark:bg-surface-dark/95 backdrop-blur-md z-20 shrink-0">
                    <div className="flex items-center gap-6">
                        {/* Back Button (Optional if Sidebar is present, but checking if user wants to keep it) */}
                        {/* 
                        <button onClick={onBack} className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/5 transition-colors">
                            <span className="material-icons-round">arrow_back</span>
                        </button> 
                        */}

                        {/* Customer Info */}
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-800 flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20 overflow-hidden">
                                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaKxwIEXVRgNA2vgEOw3cO6OMP2yAp1FHXM-XE5BEYgrG42UTztFuZrIUcf3Wl4WDG_EDnpofJ9E0ncKlrQNpo5qb6FlYbBqW8TaShsj20J_Tl8lX8g9x7z36aOzMZjfWh97B4w1SV7s9_l9Q4K4EOt3E1E5Wnlcx9Tyavk5-zg5d1RoGkJrD9dG1C-fZYAH4F_111B4bfx9POf3nOeIreNgXcFG2SiUHDlYq1kZjy7uh-SKpJm03PBcZkyXhyxp0pMABVikwqJEE" alt="Customer" />
                            </div>
                            <div>
                                <h2 className="text-sm text-slate-500 dark:text-slate-400 font-medium">Customer</h2>
                                <p className="font-bold text-slate-800 dark:text-white text-lg leading-tight">Ibu Ani</p>
                            </div>
                        </div>

                        <div className="h-8 w-px bg-gray-200 dark:bg-white/10 mx-2"></div>

                        {/* Stylist Info */}
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-primary">
                                <span className="material-icons-round">content_cut</span>
                            </div>
                            <div>
                                <h2 className="text-sm text-slate-500 dark:text-slate-400 font-medium">Stylist</h2>
                                <p className="font-semibold text-slate-800 dark:text-white leading-tight">Dewi Santoso</p>
                            </div>
                        </div>
                    </div>

                    {/* Timer & Actions */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 px-4 py-2 rounded-lg border border-gray-200 dark:border-white/5">
                            <span className="material-icons-round text-primary text-sm">timer</span>
                            <span className="font-mono text-xl font-bold tracking-wider text-slate-700 dark:text-white">00:45:12</span>
                        </div>
                        <button className="px-4 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-500/20">
                            Cancel
                        </button>
                        <button className="px-4 py-2 rounded-lg text-sm font-medium text-amber-500 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-500/10 transition-colors border border-transparent hover:border-amber-200 dark:hover:border-amber-500/20">
                            Hold Order
                        </button>
                    </div>
                </header>

                {/* Main Workspace */}
                <main className="flex-1 flex overflow-hidden">
                    {/* Left Panel: Catalog */}
                    <section className="flex-1 flex flex-col min-w-0 bg-gray-50/50 dark:bg-background-dark/50">
                        {/* Catalog Header: Search & Tabs */}
                        <div className="p-6 pb-2">
                            <div className="flex gap-4 mb-6">
                                <div className="relative flex-1 group">
                                    <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                                    <input className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/5 rounded-xl py-3 pl-12 pr-4 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm" placeholder="Search services or products..." type="text" />
                                </div>
                                <button className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/5 p-3 rounded-xl text-slate-400 hover:text-primary hover:border-primary/50 transition-colors shadow-sm">
                                    <span className="material-icons-round">tune</span>
                                </button>
                            </div>
                            {/* Tabs */}
                            <div className="flex gap-2 p-1 bg-white dark:bg-surface-dark rounded-xl w-fit border border-gray-200 dark:border-white/5 shadow-sm">
                                {['Services', 'Products', 'Packages'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Catalog Grid */}
                        <div className="flex-1 overflow-y-auto p-6 pt-2 custom-scrollbar">
                            {/* Category: Hair Services */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                        <span className="w-1 h-6 bg-primary rounded-full"></span>
                                        Hair Services
                                    </h3>
                                    <button className="text-xs text-primary font-medium hover:underline">View All</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {services.filter(s => s.category === 'Hair Services').map(service => (
                                        <div key={service.id} className={`p-4 rounded-xl group cursor-pointer relative overflow-hidden transition-all border ${service.selected ? 'bg-primary/5 border-primary/50 ring-1 ring-primary/50' : 'bg-white dark:bg-surface-dark/50 border-gray-200 dark:border-white/5 hover:border-primary/30'} shadow-sm hover:shadow-md`}>
                                            <div className={`absolute top-0 right-0 p-3 transition-opacity ${service.selected ? '' : 'opacity-0 group-hover:opacity-100'}`}>
                                                <div className={`text-white p-1 rounded-lg shadow-lg ${service.selected ? 'bg-primary' : 'bg-primary'}`}>
                                                    <span className="material-icons-round text-sm block">{service.selected ? 'check' : 'add'}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-slate-400 dark:text-slate-300">
                                                    <span className="material-icons-round">{service.icon}</span>
                                                </div>
                                                <span className="text-xs font-medium text-slate-500 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded">{service.duration}</span>
                                            </div>
                                            <h4 className={`font-bold mb-1 transition-colors ${service.selected ? 'text-primary' : 'text-slate-800 dark:text-white group-hover:text-primary'}`}>{service.name}</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">{service.desc}</p>
                                            <p className="text-lg font-bold text-slate-800 dark:text-white">{service.price}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Category: Nail & Spa */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                        <span className="w-1 h-6 bg-pink-500 rounded-full"></span>
                                        Nail & Spa
                                    </h3>
                                    <button className="text-xs text-primary font-medium hover:underline">View All</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {services.filter(s => s.category === 'Nail & Spa').map(service => (
                                        <div key={service.id} className="bg-white dark:bg-surface-dark/50 p-4 rounded-xl group cursor-pointer relative overflow-hidden transition-all border border-gray-200 dark:border-white/5 hover:border-primary/30 shadow-sm hover:shadow-md">
                                            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="bg-primary text-white p-1 rounded-lg shadow-lg">
                                                    <span className="material-icons-round text-sm block">add</span>
                                                </div>
                                            </div>
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-slate-400 dark:text-slate-300">
                                                    <span className="material-icons-round">{service.icon}</span>
                                                </div>
                                                <span className="text-xs font-medium text-slate-500 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded">{service.duration}</span>
                                            </div>
                                            <h4 className="font-bold text-slate-800 dark:text-white mb-1 group-hover:text-primary transition-colors">{service.name}</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">{service.desc}</p>
                                            <p className="text-lg font-bold text-slate-800 dark:text-white">{service.price}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Right Panel: Cart */}
                    <aside className="w-[420px] bg-white dark:bg-surface-dark border-l border-gray-200 dark:border-white/5 flex flex-col shadow-2xl z-10 h-full">
                        {/* Cart Header */}
                        <div className="p-6 border-b border-gray-200 dark:border-white/5 bg-white dark:bg-surface-dark">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Current Order</h2>
                                <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded font-bold">#ORD-2849</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <span className="material-icons-round text-base">calendar_today</span>
                                <span>Today, Oct 24</span>
                            </div>
                        </div>

                        {/* Cart Items List */}
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
                            {/* Cart Item 1 */}
                            <div className="group bg-gray-50 dark:bg-background-dark/40 border border-gray-200 dark:border-white/5 hover:border-primary/30 p-3 rounded-xl transition-all relative">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-slate-800 dark:text-white text-sm">Hair Coloring (Full)</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Dewi Santoso</p>
                                    </div>
                                    <p className="font-bold text-slate-800 dark:text-white">Rp 850.000</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <button className="text-xs text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="material-icons-round text-sm">delete</span> Remove
                                    </button>
                                    <div className="flex items-center bg-gray-200 dark:bg-white/5 rounded-lg p-1">
                                        <button className="h-6 w-6 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded hover:bg-white/20">
                                            <span className="material-icons-round text-sm">remove</span>
                                        </button>
                                        <span className="w-8 text-center text-sm font-bold text-slate-800 dark:text-white">1</span>
                                        <button className="h-6 w-6 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded hover:bg-white/20">
                                            <span className="material-icons-round text-sm">add</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Cart Item 2 */}
                            <div className="group bg-gray-50 dark:bg-background-dark/40 border border-gray-200 dark:border-white/5 hover:border-primary/30 p-3 rounded-xl transition-all relative">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-slate-800 dark:text-white text-sm">Loreal Shampoo 300ml</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Product</p>
                                    </div>
                                    <p className="font-bold text-slate-800 dark:text-white">Rp 120.000</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <button className="text-xs text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="material-icons-round text-sm">delete</span> Remove
                                    </button>
                                    <div className="flex items-center bg-gray-200 dark:bg-white/5 rounded-lg p-1">
                                        <button className="h-6 w-6 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded hover:bg-white/20">
                                            <span className="material-icons-round text-sm">remove</span>
                                        </button>
                                        <span className="w-8 text-center text-sm font-bold text-slate-800 dark:text-white">1</span>
                                        <button className="h-6 w-6 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded hover:bg-white/20">
                                            <span className="material-icons-round text-sm">add</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Cart Item 3 */}
                            <div className="group bg-gray-50 dark:bg-background-dark/40 border border-gray-200 dark:border-white/5 hover:border-primary/30 p-3 rounded-xl transition-all relative">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-slate-800 dark:text-white text-sm">Extra Vitamin</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Add-on</p>
                                    </div>
                                    <p className="font-bold text-slate-800 dark:text-white">Rp 50.000</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <button className="text-xs text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="material-icons-round text-sm">delete</span> Remove
                                    </button>
                                    <div className="flex items-center bg-gray-200 dark:bg-white/5 rounded-lg p-1">
                                        <button className="h-6 w-6 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded hover:bg-white/20">
                                            <span className="material-icons-round text-sm">remove</span>
                                        </button>
                                        <span className="w-8 text-center text-sm font-bold text-slate-800 dark:text-white">2</span>
                                        <button className="h-6 w-6 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded hover:bg-white/20">
                                            <span className="material-icons-round text-sm">add</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cart Footer */}
                        <div className="p-6 bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-white/5 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_-5px_20px_rgba(0,0,0,0.3)] mt-auto">
                            {/* Calculation Rows */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                                    <span>Subtotal</span>
                                    <span className="text-slate-800 dark:text-white font-medium">Rp 1.070.000</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                                    <span>Tax (11%)</span>
                                    <span className="text-slate-800 dark:text-white font-medium">Rp 117.700</span>
                                </div>
                                <div className="flex justify-between text-sm text-green-500 dark:text-green-400 cursor-pointer hover:text-green-600 dark:hover:text-green-300">
                                    <span className="flex items-center gap-1 border-b border-dashed border-green-500/50 pb-0.5">
                                        Discount <span className="material-icons-round text-xs">edit</span>
                                    </span>
                                    <span>- Rp 0</span>
                                </div>
                                <div className="h-px bg-gray-200 dark:bg-white/10 my-2"></div>
                                <div className="flex justify-between items-end">
                                    <span className="text-slate-600 dark:text-slate-300 font-medium">Total</span>
                                    <span className="text-2xl font-bold text-slate-800 dark:text-white">Rp 1.187.700</span>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <button onClick={onProceed} className="w-full bg-primary hover:bg-violet-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-between group transition-all transform hover:-translate-y-0.5">
                                <span>Checkout</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-white/50 font-normal">|</span>
                                    <span className="text-white/90 group-hover:text-white">Rp 1.187.700</span>
                                    <span className="material-icons-round ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </div>
                            </button>
                        </div>
                    </aside>
                </main>
            </div>
        </MainLayout>
    );
}
