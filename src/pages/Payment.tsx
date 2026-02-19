import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOrder } from '../hooks/useOrders';
import { usePayOrder } from '../hooks/usePayOrder';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';
import { formatRupiah } from '../lib/format';

export default function Payment() {
    const navigate = useNavigate();
    const location = useLocation();
    const orderId = location.state?.orderId;

    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'qris' | 'debit'>('cash');
    const [cashReceived, setCashReceived] = useState('');
    const [notes, setNotes] = useState('');

    const { data: order, isLoading: isOrderLoading, isError: isOrderError } = useOrder(orderId);
    const payOrderMutation = usePayOrder();

    // Helper to format number to currency string
    const formatCurrency = (num: number) => num.toLocaleString('id-ID');

    // Helper to parse currency string to number (handles dots)
    const parseCurrency = (str: string) => parseInt(str.replace(/\./g, ''), 10) || 0;

    const handleCashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, ''); // Remove non-digits
        if (rawValue === '') {
            setCashReceived('');
            return;
        }
        const numValue = parseInt(rawValue, 10);
        setCashReceived(formatCurrency(numValue));
    };

    // Initialize cashReceived with total amount when order loads
    useEffect(() => {
        if (order) {
            setCashReceived(formatCurrency(order.total));
        }
    }, [order]);

    if (!orderId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background-light dark:bg-background-dark text-slate-800 dark:text-white">
                <ErrorAlert message="No order specified. Please return to checkout." onRetry={() => navigate('/checkout')} />
            </div>
        );
    }

    if (isOrderLoading) return <LoadingSpinner message="Loading order details..." />;
    if (isOrderError || !order) return <ErrorAlert message="Failed to load order." onRetry={() => navigate('/checkout')} />;

    const totalAmount = order.total;
    const cashValue = parseCurrency(cashReceived);
    const changeDue = Math.max(0, cashValue - totalAmount);

    const handlePayment = async () => {
        try {
            await payOrderMutation.mutateAsync({
                order_id: order.id,
                idempotency_key: crypto.randomUUID(),
                method: paymentMethod,
                amount_paid: paymentMethod === 'cash' ? cashValue : totalAmount,
                notes: notes,
            });
            // Navigation handled by hook/onSuccess or manually here if needed
            // But hook usually handles Midtrans or query invalidation. 
            // If Midtrans, popup opens. If Cash, we might want to navigate to summary or dashboard.
            // For now, let's assume hook outcome handles it or user stays on page.
            // Actually, for cash successful payment, we should navigate back to dashboard or receipt page.
            if (paymentMethod === 'cash') {
                navigate('/dashboard'); // or receipt
            }
        } catch (error) {
            console.error('Payment failed:', error);
            // Error managed by mutation state usually, or show alert
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 font-display min-h-screen flex flex-col antialiased selection:bg-primary selection:text-white">
            {/* Top Navigation / Header */}
            <header className="w-full bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/checkout')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-slate-500 dark:text-slate-400">
                        <span className="material-icons-round">arrow_back</span>
                    </button>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Payment</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Order #{order.order_number} • <span className="text-primary font-medium">{order.customers?.name || 'Walk-in'}</span></p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 rounded-full border border-green-500/20">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-xs font-semibold text-green-500">System Online</span>
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
                                {['cash', 'card', 'qris', 'debit'].map((method) => (
                                    <button
                                        key={method}
                                        onClick={() => setPaymentMethod(method as any)}
                                        className={`group relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer ${paymentMethod === method ? 'border-primary bg-primary/10' : 'border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 hover:border-primary/50'}`}
                                    >
                                        {paymentMethod === method && (
                                            <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                                <span className="material-icons-round text-white text-[10px] font-bold">check</span>
                                            </div>
                                        )}
                                        <span className={`material-icons-round text-3xl mb-2 ${paymentMethod === method ? 'text-primary' : 'text-slate-400 group-hover:text-primary transition-colors'}`}>
                                            {method === 'cash' ? 'local_atm' : method === 'card' ? 'credit_card' : method === 'qris' ? 'qr_code_scanner' : 'account_balance_wallet'}
                                        </span>
                                        <span className={`text-sm font-semibold capitalize ${paymentMethod === method ? 'text-primary' : 'text-slate-600 dark:text-slate-400 group-hover:text-primary'}`}>{method}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Input Fields (Only for Cash) */}
                            {paymentMethod === 'cash' && (
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
                                                onChange={handleCashChange}
                                            />
                                        </div>
                                        <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
                                            <button onClick={() => setCashReceived(formatCurrency(totalAmount))} className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 dark:bg-white/5 hover:bg-primary hover:text-white transition-colors text-slate-600 dark:text-slate-300">Exact</button>
                                            <button onClick={() => setCashReceived(formatCurrency(Math.ceil(totalAmount / 50000) * 50000))} className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 dark:bg-white/5 hover:bg-primary hover:text-white transition-colors text-slate-600 dark:text-slate-300">Next 50k</button>
                                            <button onClick={() => setCashReceived(formatCurrency(Math.ceil(totalAmount / 100000) * 100000))} className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 dark:bg-white/5 hover:bg-primary hover:text-white transition-colors text-slate-600 dark:text-slate-300">Next 100k</button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">Change Due</label>
                                        <div className="w-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-500/30 rounded-lg py-4 px-4 flex items-center justify-between">
                                            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xl">{formatRupiah(changeDue)}</span>
                                            <span className="material-icons-round text-emerald-500">check_circle_outline</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Customer Notes */}
                        <section className="flex-1 bg-white dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-gray-200 dark:border-white/5">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Order Notes</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full h-full min-h-[100px] bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-lg p-4 text-sm text-slate-900 dark:text-slate-300 focus:ring-1 focus:ring-primary focus:border-primary resize-none placeholder-slate-500 dark:placeholder-slate-600 outline-none"
                                placeholder="Add optional notes about the payment..."
                            ></textarea>
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
                                    <span>{order.customers?.name || 'Walk-in'}</span>
                                    {order.customers?.loyalty_tier && (
                                        <>
                                            <span className="mx-1">•</span>
                                            <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-bold uppercase">{order.customers.loyalty_tier} MEMBER</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Item List */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                                {order.order_items?.map((item: any) => (
                                    <div key={item.id} className="flex justify-between items-start group">
                                        <div className="flex gap-3">
                                            <div className="w-10 h-10 rounded bg-gray-100 dark:bg-background-dark flex items-center justify-center text-slate-400">
                                                <span className="material-icons-round text-xl">{item.item_type === 'service' ? 'content_cut' : 'inventory_2'}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</h4>
                                                <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <span className="font-medium text-slate-700 dark:text-slate-300">{formatRupiah(item.subtotal)}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Totals Section */}
                            <div className="bg-gray-50 dark:bg-[#1a1625] p-6 space-y-3 border-t border-gray-200 dark:border-white/5">
                                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                                    <span>Subtotal</span>
                                    <span className="font-medium">{formatRupiah(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                                    <span>Tax</span>
                                    <span className="font-medium">{formatRupiah(order.tax_amount)}</span>
                                </div>
                                {order.discount_amount > 0 && (
                                    <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400">
                                        <span className="flex items-center gap-1"><span className="material-icons-round text-sm">verified</span> Discount</span>
                                        <span className="font-medium">- {formatRupiah(order.discount_amount)}</span>
                                    </div>
                                )}
                                <div className="h-px bg-gray-200 dark:bg-white/10 my-2"></div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-slate-500 dark:text-slate-400 font-medium pb-1">Total Payment</span>
                                    <span className="text-3xl font-extrabold text-primary">{formatRupiah(order.total)}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="p-6 bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-white/5 space-y-4">
                                {/* Primary Button */}
                                <button
                                    onClick={handlePayment}
                                    disabled={payOrderMutation.isPending || (paymentMethod === 'cash' && cashValue < totalAmount)}
                                    className={`w-full bg-primary hover:bg-primary/90 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer ${payOrderMutation.isPending || (paymentMethod === 'cash' && cashValue < totalAmount) ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    <span>{payOrderMutation.isPending ? 'Processing...' : 'Process Payment'}</span>
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
