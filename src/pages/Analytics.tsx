
import MainLayout from '../components/layout/MainLayout';

interface AnalyticsProps {
    activePage?: string;
    onNavigate?: (page: string) => void;
}

export default function Analytics({ activePage = 'analytics', onNavigate }: AnalyticsProps) {
    return (
        <MainLayout activePage={activePage} onNavigate={onNavigate}>
            <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-white/5 dark:bg-background-dark">
                {/* Top Navigation / Header */}
                <header className="w-full px-8 py-6 flex justify-between items-center bg-white/70 dark:bg-surface-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
                            <span className="material-icons-round">query_stats</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Business Analytics</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Track your salon's performance</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Period Picker */}
                        <div className="relative">
                            <button className="flex items-center gap-3 px-5 py-2.5 bg-gray-100 dark:bg-[#2a243d] rounded-lg text-sm font-semibold hover:bg-gray-200 dark:hover:bg-primary/20 transition-colors border border-transparent dark:border-white/10 group dark:text-white">
                                <span className="material-icons-round text-primary text-xl">calendar_today</span>
                                <span>February 2026</span>
                                <span className="material-icons-round text-gray-400 group-hover:text-primary transition-colors">expand_more</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="flex-grow p-8 w-full space-y-8 overflow-y-auto custom-scrollbar pb-24">
                    {/* KPI Cards Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Revenue Card */}
                        <div className="bg-[#1f1a2e]/70 backdrop-blur-md border border-primary/10 p-6 rounded-xl flex flex-col justify-between h-40 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-primary/10"></div>
                            <div className="flex justify-between items-start z-10">
                                <div>
                                    <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Revenue</p>
                                    <h2 className="text-4xl font-bold text-white mt-2">$42,500</h2>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <span className="material-icons-round">attach_money</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-auto z-10">
                                <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-bold flex items-center gap-1">
                                    <span className="material-icons-round text-sm">trending_up</span> 12.5%
                                </span>
                                <span className="text-xs text-gray-500">vs last month</span>
                            </div>
                        </div>
                        {/* Transactions Card */}
                        <div className="bg-[#1f1a2e]/70 backdrop-blur-md border border-primary/10 p-6 rounded-xl flex flex-col justify-between h-40 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-blue-500/10"></div>
                            <div className="flex justify-between items-start z-10">
                                <div>
                                    <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Transactions</p>
                                    <h2 className="text-4xl font-bold text-white mt-2">340</h2>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                    <span className="material-icons-round">receipt_long</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-auto z-10">
                                <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-bold flex items-center gap-1">
                                    <span className="material-icons-round text-sm">trending_up</span> 5.2%
                                </span>
                                <span className="text-xs text-gray-500">vs last month</span>
                            </div>
                        </div>
                        {/* Net Profit Card */}
                        <div className="bg-[#1f1a2e]/70 backdrop-blur-md border border-primary/10 p-6 rounded-xl flex flex-col justify-between h-40 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-32 bg-pink-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-pink-500/10"></div>
                            <div className="flex justify-between items-start z-10">
                                <div>
                                    <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Net Profit</p>
                                    <h2 className="text-4xl font-bold text-white mt-2">$18,200</h2>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400">
                                    <span className="material-icons-round">account_balance_wallet</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-auto z-10">
                                <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-bold flex items-center gap-1">
                                    <span className="material-icons-round text-sm">trending_down</span> 2.1%
                                </span>
                                <span className="text-xs text-gray-500">vs last month</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Chart Section: Daily Income */}
                    <div className="bg-[#1f1a2e]/70 backdrop-blur-md border border-white/5 p-8 rounded-xl">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Daily Income Overview</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Income breakdown per day for February</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 rounded bg-[#2a243d] hover:bg-primary/20 text-xs text-gray-300 hover:text-white transition-colors">Week 1</button>
                                <button className="px-3 py-1 rounded bg-[#2a243d] hover:bg-primary/20 text-xs text-gray-300 hover:text-white transition-colors">Week 2</button>
                                <button className="px-3 py-1 rounded bg-primary text-xs text-white shadow-lg shadow-primary/25 transition-colors">Full Month</button>
                            </div>
                        </div>
                        {/* CSS-only Bar Chart */}
                        <div className="relative h-64 w-full flex items-end gap-2 md:gap-4 justify-between select-none">
                            {/* Y-axis lines (background) */}
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 z-0">
                                <div className="w-full border-t border-gray-500 border-dashed"></div>
                                <div className="w-full border-t border-gray-500 border-dashed"></div>
                                <div className="w-full border-t border-gray-500 border-dashed"></div>
                                <div className="w-full border-t border-gray-500 border-dashed"></div>
                                <div className="w-full border-t border-gray-500"></div>
                            </div>

                            {/* Data Bars */}
                            {[
                                { day: '01', h: '40%', val: '$1,200', highlight: false },
                                { day: '03', h: '65%', val: '$2,150', highlight: false },
                                { day: '05', h: '45%', val: '$1,500', highlight: false },
                                { day: '07', h: '80%', val: '$3,200', highlight: true },
                                { day: '09', h: '30%', val: '$900', highlight: false },
                                { day: '11', h: '55%', val: '$1,800', highlight: false },
                                { day: '13', h: '90%', val: '$3,800', highlight: false },
                                { day: '15', h: '70%', val: '$2,500', highlight: false },
                                { day: '17', h: '45%', val: '$1,600', highlight: false },
                                { day: '19', h: '75%', val: '$2,900', highlight: false },
                                { day: '21', h: '95%', val: '$4,100', highlight: false },
                                { day: '23', h: '60%', val: '$2,200', highlight: false },
                                { day: '25', h: '50%', val: '$1,850', highlight: false },
                                { day: '27', h: '20%', val: 'N/A', highlight: false, disabled: true },
                            ].map((item, i) => (
                                <div key={i} className="w-full mx-1 group relative flex flex-col justify-end items-center h-full">
                                    <div
                                        className={`w-full max-w-[24px] rounded-t-sm transition-all cursor-pointer ${item.disabled ? 'bg-gradient-to-t from-gray-700 to-gray-600 opacity-50 cursor-not-allowed' : 'bg-gradient-to-t from-primary/60 to-primary hover:bg-white'}`}
                                        style={{ height: item.h }}
                                    ></div>
                                    <span className={`absolute -bottom-6 text-[10px] ${item.highlight ? 'text-primary font-bold' : 'text-gray-500'}`}>{item.day}</span>
                                    {!item.disabled && (
                                        <div className="absolute bottom-full mb-2 bg-[#1f1a2e] px-3 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 z-20 pointer-events-none shadow-lg">
                                            {item.val}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Grid Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Top Services */}
                        <div className="bg-[#1f1a2e]/70 backdrop-blur-md border border-primary/10 p-6 rounded-xl flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-white">Top Services</h3>
                                <a className="text-xs text-primary hover:text-white transition-colors" href="#">View All</a>
                            </div>
                            <div className="space-y-5 flex-1">
                                {[
                                    { name: 'Balayage & Tone', pct: '42%', color: 'bg-primary' },
                                    { name: "Men's Executive Cut", pct: '28%', color: 'bg-teal-400' },
                                    { name: 'Gel Manicure', pct: '15%', color: 'bg-orange-400' },
                                    { name: 'Deep Conditioning', pct: '15%', color: 'bg-blue-400' },
                                ].map((svc, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-200">{svc.name}</span>
                                            <span className="font-bold text-white">{svc.pct}</span>
                                        </div>
                                        <div className="h-2 bg-[#2a243d] rounded-full overflow-hidden">
                                            <div className={`h-full ${svc.color} rounded-full`} style={{ width: svc.pct }}></div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">128 bookings • $18,400</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Peak Traffic Hours Heatmap */}
                        <div className="bg-[#1f1a2e]/70 backdrop-blur-md border border-primary/10 p-6 rounded-xl flex flex-col">
                            <h3 className="text-lg font-bold text-white mb-6">Peak Traffic Hours</h3>
                            <div className="flex-1 flex flex-col justify-center">
                                <div className="grid grid-cols-4 gap-2 mb-4">
                                    {/* Legend */}
                                    <div className="col-span-4 flex justify-end gap-3 text-[10px] text-gray-400 mb-2">
                                        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#2a243d]"></span> Low</div>
                                        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary/40"></span> Med</div>
                                        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary"></span> High</div>
                                    </div>
                                    {/* Headers */}
                                    {['Mrn', 'Aft', 'Eve', 'Late'].map(h => <div key={h} className="text-center text-xs text-gray-500">{h}</div>)}

                                    {/* Rows */}
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => {
                                        // Mock patterns
                                        const patterns = [
                                            ['bg-[#2a243d]', 'bg-primary/40', 'bg-[#2a243d]'], // Mon
                                            ['bg-[#2a243d]', 'bg-primary/40', 'bg-primary/20'], // Tue
                                            ['bg-primary/20', 'bg-primary', 'bg-primary/60'], // Wed
                                            ['bg-primary/40', 'bg-primary', 'bg-primary'], // Thu
                                            ['bg-primary', 'bg-primary', 'bg-primary/80']  // Fri
                                        ];
                                        const p = patterns[i];
                                        return (
                                            <>
                                                <div className="text-xs text-gray-400 py-2 flex items-center">{day}</div>
                                                <div className={`h-8 rounded ${p[0]}`}></div>
                                                <div className={`h-8 rounded ${p[1]}`}></div>
                                                <div className={`h-8 rounded ${p[2]}`}></div>
                                            </>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Stylist Commissions */}
                        <div className="bg-[#1f1a2e]/70 backdrop-blur-md border border-primary/10 p-6 rounded-xl flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-white">Stylist Commissions</h3>
                                <button className="w-8 h-8 rounded-full bg-[#2a243d] flex items-center justify-center hover:bg-primary/20 hover:text-white transition-colors">
                                    <span className="material-icons-round text-sm text-gray-400">more_horiz</span>
                                </button>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { name: 'Sarah Jenkins', val: '$2,450', pct: '85%', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTuwalJSq_rry0GRNqTgSrUIDb0G00j7ge8HSgDrRkPgGhBpi07MgLrQx8pZOt7vieEIzEt0RlQRS0LzPBRAZa2AHRaCyH0-oCvaTq9oDBJWSLd-hJpZK70lktiolW32E03WNvh6wdttxlLaUWQRRoLuT49Oev2a5ifpAlqD_CR6wPLtqpM1TzZSrcsX-Te9Hdt23xfbCgSRamB-3LmoIBKme6By5nVL1VV0Y25dcK7CmOEVnkjWo0vKM6hpq_ZCrmJ1pMJYG805c' },
                                    { name: 'Mike Ross', val: '$1,820', pct: '62%', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5AJe3QO4NIsrX3NcvjuusSFXpoqKiAqc95SMSR0vhBW692JnOyTL-gIqjDIetdDhN_-lHUCwEVG4P3aN-FHwaxOULtKCXmiY9CiviPntTSWcx4oktW9UqDmZgi8o7exrGNm9N0ONpLkHw4yCooyKbsbKq-IVBu3LQLsiW11869KQLuA5rCAuYwPRMJTZlQTq4xflolznV6pdfJoz__oaYqggE8JigGMCFe26CYQTypauP1p3P0LjhpD5u5E0sMjWJT5brrM_R6HA' },
                                    { name: 'Emily Chen', val: '$1,250', pct: '45%', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyR9ordQxUg2fgALLgMRyhPys0TaGmP5FeqS7HvEZjTEL2qeOiaSMYET13nqeya1OvA4w7MPNRgJeZLfCB5c5Iqf-W_zeImBFfZ1nmFBsT7GbfV7VdCSL8bh6QL8G894eKjaqj1qzOWYhDc3QllLl3dECi5OG4dL57dCGLBDGd2kb8CwSCPNDhGfTDTzvjAZM5KXvsA5JhZVp9ybj0HVRsMJPXey5vvTpR5Grh9ScG0noPYTcyJnlB25Swr6qK8LwVXIPfoQGmGug' },
                                    { name: 'John Doe', val: '$980', pct: '30%', initials: 'JD' },
                                ].map((s, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        {s.img ? (
                                            <img className="w-10 h-10 rounded-full object-cover border border-white/10" src={s.img} alt={s.name} />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-[#2a243d] flex items-center justify-center text-xs font-bold text-gray-400 border border-white/10">{s.initials}</div>
                                        )}
                                        <div className="flex-1">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-white font-medium">{s.name}</span>
                                                <span className="text-gray-400">{s.val}</span>
                                            </div>
                                            <div className="h-1.5 bg-[#2a243d] rounded-full overflow-hidden w-full">
                                                <div className="h-full bg-gradient-to-r from-primary to-purple-300 rounded-full" style={{ width: s.pct }}></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>

                {/* Bottom Action Bar (Fixed) */}
                <div className="absolute bottom-6 left-0 right-0 z-40 px-8 flex justify-center pointer-events-none">
                    <div className="bg-[#2a243d] border border-white/10 backdrop-blur-md px-6 py-3 rounded-2xl shadow-2xl flex gap-4 pointer-events-auto">
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-primary/20">
                            <span className="material-icons-round text-sm">picture_as_pdf</span>
                            Export PDF
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-semibold transition-colors border border-white/5">
                            <span className="material-icons-round text-sm">table_view</span>
                            Export Excel
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-semibold transition-colors border border-white/5">
                            <span className="material-icons-round text-sm">print</span>
                            Print
                        </button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
