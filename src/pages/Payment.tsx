
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Payment() {
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('cash'); // cash, card, qris, debit
    const [cashReceived, setCashReceived] = useState('450.000');

    // Mock data calculations
    const totalAmount = 417600;

    // Helper to parse currency string to number
    const parseCurrency = (str: string) => parseInt(str.replace(/\./g, '')) || 0;

    // Helper to format number to currency string
    const formatCurrency = (num: number) => num.toLocaleString('id-ID');

    const cashValue = parseCurrency(cashReceived);
    const changeDue = Math.max(0, cashValue - totalAmount);

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 font-display min-h-screen flex flex-col antialiased selection:bg-primary selection:text-white">
            {/* Top Navigation / Header */}
            <header className="w-full bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/checkout')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-slate-500 dark:text-slate-400">
                        <span className="material-icons-round">arrow_back</span>
                    </button>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Checkout</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Order #SAL-8823 • <span className="text-primary font-medium">Walk-in Customer</span></p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 rounded-full border border-green-500/20">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-xs font-semibold text-green-500">System Online</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <img className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBejEsnlZi6Iql8k4zlKFVRQbuWf7XUXTXgAQqhl50bFo2QwA2RyMEFOab6HuLRc7ujOw87q24qBYvu9glHoGnsxp8r_o-OhEQsLI03aTLVa6LvbucwSs7PzkOumaEV_Mue8Y3MiiRhbJhAhvPU3eTjh2YmPlhYSfFQ6foCE4357ymJhs0rCiHQbEPQBHQrfyHlGzg2RZ3ZsEan-Y-EFYVKo4diDMEZcdz3ht7OLLZ-35s7ul0AL76wyrHWoT6WB37bTZKs-zCyzHg" alt="Cashier Profile" />
                        <div className="hidden md:block">
                            <p className="text-sm font-semibold leading-tight text-slate-900 dark:text-white">Alex M.</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Cashier</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                    {/* Left Column: Payment Methods & Input */}
                    <div className="lg:col-span-7 flex flex-col gap-6">
                        {/* Payment Method Section */}
                        <section className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-gray-200 dark:border-white/5">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                                <span className="material-icons-round text-primary">payments</span>
                                Payment Method
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                {/* Method: Cash */}
                                <button
                                    onClick={() => setPaymentMethod('cash')}
                                    className={`group relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer ${paymentMethod === 'cash' ? 'border-primary bg-primary/10' : 'border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 hover:border-primary/50'}`}
                                >
                                    {paymentMethod === 'cash' && (
                                        <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                            <span className="material-icons-round text-white text-[10px] font-bold">check</span>
                                        </div>
                                    )}
                                    <span className={`material-icons-round text-3xl mb-2 ${paymentMethod === 'cash' ? 'text-primary' : 'text-slate-400 group-hover:text-primary transition-colors'}`}>local_atm</span>
                                    <span className={`text-sm font-semibold ${paymentMethod === 'cash' ? 'text-primary' : 'text-slate-600 dark:text-slate-400 group-hover:text-primary'}`}>Cash</span>
                                </button>

                                {/* Method: Card */}
                                <button
                                    onClick={() => setPaymentMethod('card')}
                                    className={`group relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer ${paymentMethod === 'card' ? 'border-primary bg-primary/10' : 'border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 hover:border-primary/50'}`}
                                >
                                    {paymentMethod === 'card' && (
                                        <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                            <span className="material-icons-round text-white text-[10px] font-bold">check</span>
                                        </div>
                                    )}
                                    <span className={`material-icons-round text-3xl mb-2 ${paymentMethod === 'card' ? 'text-primary' : 'text-slate-400 group-hover:text-primary transition-colors'}`}>credit_card</span>
                                    <span className={`text-sm font-semibold ${paymentMethod === 'card' ? 'text-primary' : 'text-slate-600 dark:text-slate-400 group-hover:text-primary'}`}>Card</span>
                                </button>

                                {/* Method: QRIS */}
                                <button
                                    onClick={() => setPaymentMethod('qris')}
                                    className={`group relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer ${paymentMethod === 'qris' ? 'border-primary bg-primary/10' : 'border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 hover:border-primary/50'}`}
                                >
                                    {paymentMethod === 'qris' && (
                                        <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                            <span className="material-icons-round text-white text-[10px] font-bold">check</span>
                                        </div>
                                    )}
                                    <span className={`material-icons-round text-3xl mb-2 ${paymentMethod === 'qris' ? 'text-primary' : 'text-slate-400 group-hover:text-primary transition-colors'}`}>qr_code_scanner</span>
                                    <span className={`text-sm font-semibold ${paymentMethod === 'qris' ? 'text-primary' : 'text-slate-600 dark:text-slate-400 group-hover:text-primary'}`}>QRIS</span>
                                </button>

                                {/* Method: Debit */}
                                <button
                                    onClick={() => setPaymentMethod('debit')}
                                    className={`group relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer ${paymentMethod === 'debit' ? 'border-primary bg-primary/10' : 'border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 hover:border-primary/50'}`}
                                >
                                    {paymentMethod === 'debit' && (
                                        <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                            <span className="material-icons-round text-white text-[10px] font-bold">check</span>
                                        </div>
                                    )}
                                    <span className={`material-icons-round text-3xl mb-2 ${paymentMethod === 'debit' ? 'text-primary' : 'text-slate-400 group-hover:text-primary transition-colors'}`}>account_balance_wallet</span>
                                    <span className={`text-sm font-semibold ${paymentMethod === 'debit' ? 'text-primary' : 'text-slate-600 dark:text-slate-400 group-hover:text-primary'}`}>Debit</span>
                                </button>
                            </div>

                            {/* Input Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative">
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Cash Received</label>
                                    <div className="relative group">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">Rp</span>
                                        <input
                                            className="w-full bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-lg py-4 pl-12 pr-4 text-xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-inner placeholder-slate-500 outline-none"
                                            placeholder="0"
                                            type="text"
                                            value={cashReceived}
                                            onChange={(e) => setCashReceived(e.target.value)}
                                        />
                                    </div>
                                    {/* Quick amount suggestions */}
                                    <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
                                        <button onClick={() => setCashReceived(formatCurrency(totalAmount))} className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 dark:bg-white/5 hover:bg-primary hover:text-white transition-colors text-slate-600 dark:text-slate-300">Exact</button>
                                        <button onClick={() => setCashReceived('420.000')} className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 dark:bg-white/5 hover:bg-primary hover:text-white transition-colors text-slate-600 dark:text-slate-300">Rp 420.000</button>
                                        <button onClick={() => setCashReceived('450.000')} className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 dark:bg-white/5 hover:bg-primary hover:text-white transition-colors text-slate-600 dark:text-slate-300">Rp 450.000</button>
                                        <button onClick={() => setCashReceived('500.000')} className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 dark:bg-white/5 hover:bg-primary hover:text-white transition-colors text-slate-600 dark:text-slate-300">Rp 500.000</button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">Change Due</label>
                                    <div className="w-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-500/30 rounded-lg py-4 px-4 flex items-center justify-between">
                                        <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xl">Rp {formatCurrency(changeDue)}</span>
                                        <span className="material-icons-round text-emerald-500">check_circle_outline</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                                        <span className="material-icons-round text-base">info</span>
                                        System auto-calculates change
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Customer Notes */}
                        <section className="flex-1 bg-white dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-gray-200 dark:border-white/5">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Order Notes</label>
                            <textarea className="w-full h-full min-h-[100px] bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-lg p-4 text-sm text-slate-900 dark:text-slate-300 focus:ring-1 focus:ring-primary focus:border-primary resize-none placeholder-slate-500 dark:placeholder-slate-600 outline-none" placeholder="Add optional notes about the payment or customer feedback..."></textarea>
                        </section>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5 flex flex-col h-full">
                        <div className="bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-gray-200 dark:border-white/5 flex flex-col h-full overflow-hidden relative">
                            {/* Decorative top border */}
                            <div className="h-1 w-full bg-gradient-to-r from-primary to-purple-400"></div>
                            <div className="p-6 border-b border-gray-200 dark:border-white/5">
                                <h2 className="text-lg font-bold mb-1 text-slate-900 dark:text-white">Order Summary</h2>
                                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                    <span className="material-icons-round text-base">person</span>
                                    <span>Sarah Jenkins</span>
                                    <span className="mx-1">•</span>
                                    <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-bold">VIP MEMBER</span>
                                </div>
                            </div>

                            {/* Item List */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                                {/* Item 1 */}
                                <div className="flex justify-between items-start group">
                                    <div className="flex gap-3">
                                        <div className="w-10 h-10 rounded bg-gray-100 dark:bg-background-dark flex items-center justify-center text-slate-400">
                                            <span className="material-icons-round text-xl">content_cut</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-800 dark:text-slate-200">Signature Haircut</h4>
                                            <p className="text-xs text-slate-500">Stylist: Alex M.</p>
                                        </div>
                                    </div>
                                    <span className="font-medium text-slate-700 dark:text-slate-300">Rp 250.000</span>
                                </div>
                                {/* Item 2 */}
                                <div className="flex justify-between items-start group">
                                    <div className="flex gap-3">
                                        <div className="w-10 h-10 rounded bg-gray-100 dark:bg-background-dark flex items-center justify-center text-slate-400">
                                            <span className="material-icons-round text-xl">spa</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-800 dark:text-slate-200">Hair Spa Treatment</h4>
                                            <p className="text-xs text-slate-500">Duration: 45 min</p>
                                        </div>
                                    </div>
                                    <span className="font-medium text-slate-700 dark:text-slate-300">Rp 150.000</span>
                                </div>
                                {/* Item 3 */}
                                <div className="flex justify-between items-start group">
                                    <div className="flex gap-3">
                                        <div className="w-10 h-10 rounded bg-gray-100 dark:bg-background-dark flex items-center justify-center text-slate-400">
                                            <span className="material-icons-round text-xl">inventory_2</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-800 dark:text-slate-200">Moroccan Oil Serum</h4>
                                            <p className="text-xs text-slate-500">Product</p>
                                        </div>
                                    </div>
                                    <span className="font-medium text-slate-700 dark:text-slate-300">Rp 64.000</span>
                                </div>
                            </div>

                            {/* Totals Section */}
                            <div className="bg-gray-50 dark:bg-[#1a1625] p-6 space-y-3 border-t border-gray-200 dark:border-white/5">
                                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                                    <span>Subtotal (3 items)</span>
                                    <span className="font-medium">Rp 464.000</span>
                                </div>
                                <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400">
                                    <span className="flex items-center gap-1"><span className="material-icons-round text-sm">verified</span> Member Discount (10%)</span>
                                    <span className="font-medium">- Rp 46.400</span>
                                </div>
                                <div className="h-px bg-gray-200 dark:bg-white/10 my-2"></div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-slate-500 dark:text-slate-400 font-medium pb-1">Total Payment</span>
                                    <span className="text-3xl font-extrabold text-primary">Rp 417.600</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="p-6 bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-white/5 space-y-4">
                                {/* Secondary Actions Row */}
                                <div className="grid grid-cols-3 gap-3">
                                    <button className="flex flex-col items-center justify-center gap-1 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-primary/10 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
                                        <span className="material-icons-round">print</span>
                                        <span className="text-[10px] font-bold uppercase tracking-wide">Receipt</span>
                                    </button>
                                    <button className="flex flex-col items-center justify-center gap-1 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-green-500/10 text-slate-500 dark:text-slate-400 hover:text-green-500 transition-colors">
                                        <span className="material-icons-round">whatsapp</span>
                                        <span className="text-[10px] font-bold uppercase tracking-wide">WhatsApp</span>
                                    </button>
                                    <button className="flex flex-col items-center justify-center gap-1 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-blue-500/10 text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors">
                                        <span className="material-icons-round">email</span>
                                        <span className="text-[10px] font-bold uppercase tracking-wide">Email</span>
                                    </button>
                                </div>
                                {/* Primary Button */}
                                <button onClick={() => navigate('/dashboard')} className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer">
                                    <span>Process Payment</span>
                                    <span className="material-icons-round group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Quick Help Widget */}
            <div className="fixed bottom-6 right-6 hidden xl:block">
                <button className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 text-slate-400 hover:text-primary hover:border-primary p-3 rounded-full shadow-lg transition-all" title="Keyboard Shortcuts">
                    <span className="material-icons-round">keyboard</span>
                </button>
            </div>
        </div>
    );
}
