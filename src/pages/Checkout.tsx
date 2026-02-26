
import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';
import { useServices } from '../hooks/useServices';
import { useCheckout } from '../hooks/useCheckout';
import { useStylists } from '../hooks/useStylists';
import { useCustomers } from '../hooks/useCustomers';
import { useReservation } from '../hooks/useReservations';
import { formatRupiah, formatDuration } from '../lib/format';
import type { Service } from '../lib/types';

interface CartItem {
    id: string;
    name: string;
    type: 'service' | 'product';
    price: number;
    quantity: number;
    duration?: number;
    stylist?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
    'Potong & Styling': 'bg-primary',
    'Coloring': 'bg-pink-500',
    'Perawatan Rambut': 'bg-teal-500',
    'Nail & Spa': 'bg-orange-500',
};

// Simple Customer Search Modal Component (Inline for now)
function CustomerSearchModal({ onClose, onSelect }: { onClose: () => void, onSelect: (customer: any) => void }) {
    const [search, setSearch] = useState('');
    // Fix: Pass object params
    const { data: customers, isLoading } = useCustomers({ page: 1, search });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-surface-dark w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10 flex flex-col max-h-[80vh]">
                <div className="p-4 border-b border-gray-200 dark:border-white/5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Select Customer</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
                        <span className="material-icons-round text-slate-500">close</span>
                    </button>
                </div>
                <div className="p-4 border-b border-gray-200 dark:border-white/5">
                    <div className="relative">
                        <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input
                            autoFocus
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or phone..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                    {isLoading ? (
                        <div className="flex justify-center p-4"><LoadingSpinner message="Searching..." /></div>
                    ) : (
                        <div className="space-y-1">
                            <button
                                onClick={() => onSelect(null)} // Walk-in
                                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors text-left group"
                            >
                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center text-slate-500">
                                    <span className="material-icons-round">person_off</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors">Walk-in Customer</h4>
                                    <p className="text-xs text-slate-500">No profile</p>
                                </div>
                            </button>
                            {/* Fix: Map directly over customers array */}
                            {customers?.map((c: any) => (
                                <button
                                    key={c.id}
                                    onClick={() => onSelect(c)}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors text-left group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {c.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors">{c.name}</h4>
                                        <p className="text-xs text-slate-500">{c.phone || c.email || 'No contact info'}</p>
                                    </div>
                                    {c.loyalty_tier && (
                                        <span className="ml-auto text-[10px] font-bold uppercase px-2 py-1 bg-primary/10 text-primary rounded border border-primary/20">
                                            {c.loyalty_tier}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Stylist Selector Logic
function StylistSelector({
    selectedId,
    onChange,
    stylists
}: {
    selectedId?: string,
    onChange: (id?: string) => void,
    stylists: any[]
}) {
    // find selected stylist name
    const selectedStylist = stylists.find(s => s.id === selectedId);

    return (
        <div className="relative group/stylist">
            <select
                value={selectedId || ''}
                onChange={(e) => onChange(e.target.value || undefined)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            >
                <option value="">Any Stylist</option>
                {stylists.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                ))}
            </select>
            <div className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 group-hover/stylist:border-primary/30 transition-colors">
                <span className="material-icons-round text-[14px] text-slate-400">content_cut</span>
                <span className={`font-medium ${selectedStylist ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}>
                    {selectedStylist ? selectedStylist.name.split(' ')[0] : 'Any Stylist'}
                </span>
                <span className="material-icons-round text-[14px] text-slate-400 ml-auto">arrow_drop_down</span>
            </div>
        </div>
    );
}

export default function Checkout() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const reservationId = searchParams.get('reservationId');
    const isFromReservation = !!reservationId;

    const [activeTab, setActiveTab] = useState('Services');
    const { data: services, isLoading, isError, refetch } = useServices();
    const { data: stylistsList } = useStylists();
    const [cartOpen, setCartOpen] = useState(false);
    const checkoutMutation = useCheckout();

    // Reservation auto-sync
    const { data: reservationData, isLoading: reservationLoading } = useReservation(reservationId ?? '');
    const [synced, setSynced] = useState(false);

    // Customer State
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [isCustomerModalOpen, setCustomerModalOpen] = useState(false);

    // Cart state (local, not persisted)
    const [cart, setCart] = useState<CartItem[]>([]);

    // Auto-populate cart from reservation when data arrives
    useEffect(() => {
        if (reservationData && !synced && services) {
            // Set customer
            if (reservationData.customers) {
                setSelectedCustomer(reservationData.customers);
            }

            // Populate cart from reservation_services
            const resServices = reservationData.reservation_services ?? [];
            const cartItems: CartItem[] = resServices
                .filter(rs => rs.services)
                .map(rs => ({
                    id: rs.services.id,
                    name: rs.services.name,
                    type: 'service' as const,
                    price: rs.services.price,
                    quantity: 1,
                    duration: rs.services.duration_minutes,
                    stylist: reservationData.stylist_id ?? undefined,
                }));

            if (cartItems.length > 0) {
                setCart(cartItems);
            }
            setSynced(true);
        }
    }, [reservationData, synced, services]);

    // Group services by category
    const servicesByCategory = useMemo(() => {
        if (!services) return [];
        const categoryMap = new Map<string, Service[]>();
        for (const svc of services) {
            const catName = svc.service_categories?.name ?? 'Lainnya';
            if (!categoryMap.has(catName)) categoryMap.set(catName, []);
            categoryMap.get(catName)!.push(svc);
        }
        return Array.from(categoryMap.entries());
    }, [services]);

    const addToCart = (svc: Service) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === svc.id);
            if (existing) {
                return prev.map(item => item.id === svc.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            // Default: no specific stylist assigned
            return [...prev, { id: svc.id, name: svc.name, type: 'service', price: svc.price, quantity: 1, duration: svc.duration_minutes, stylist: undefined }];
        });
    };

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id !== id) return item;
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : item;
        }));
    };

    const updateItemStylist = (id: string, stylistId?: string) => {
        setCart(prev => prev.map(item => item.id === id ? { ...item, stylist: stylistId } : item));
    };

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.11);
    const total = subtotal + tax;

    const isInCart = (id: string) => cart.some(item => item.id === id);

    const handleCheckout = async () => {
        if (cart.length === 0) return;

        try {
            const result = await checkoutMutation.mutateAsync({
                idempotency_key: crypto.randomUUID(),
                items: cart.map(item => ({
                    item_type: item.type === 'service' ? 'service' : 'product',
                    service_id: item.type === 'service' ? item.id : undefined,
                    product_id: item.type === 'product' ? item.id : undefined,
                    name: item.name,
                    unit_price: item.price,
                    quantity: item.quantity,
                    stylist_id: item.stylist,
                })),
                discount_type: 'flat',
                discount_amount: 0,
                customer_id: selectedCustomer?.id,
                reservation_id: reservationId ?? undefined,
            });

            navigate('/payment', { state: { orderId: result.id } });
        } catch (error) {
            console.error('Checkout failed:', error);
            alert('Failed to process checkout. Please try again.');
        }
    };

    // Show loading state while fetching reservation data
    if (isFromReservation && reservationLoading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-background-light dark:bg-background-dark">
                <LoadingSpinner message="Loading reservation data..." />
            </div>
        );
    }

    return (
        <>
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-100 selection:bg-primary selection:text-white relative">

                {/* Sync Banner */}
                {isFromReservation && synced && (
                    <div className="bg-primary/10 border-b border-primary/20 px-4 py-2 flex items-center gap-2 text-sm shrink-0">
                        <span className="material-icons-round text-primary text-base">sync</span>
                        <span className="text-primary font-medium">Order synced from reservation</span>
                        <span className="text-slate-400">— {cart.length} services pre-loaded. You can still add or remove items.</span>
                    </div>
                )}

                {/* Top Header / Action Bar */}
                <header className="h-auto md:h-16 flex flex-wrap items-center justify-between px-4 md:px-6 py-3 md:py-0 gap-3 border-b border-gray-200 dark:border-white/5 bg-white/70 dark:bg-surface-dark/95 backdrop-blur-md z-20 shrink-0 pl-14 md:pl-6">
                    <div className="flex items-center gap-6">
                        {/* Customer Info */}
                        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => !isFromReservation && setCustomerModalOpen(true)}>
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-800 flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20 relative">
                                {selectedCustomer ? (
                                    <span>{selectedCustomer.name.charAt(0).toUpperCase()}</span>
                                ) : (
                                    <span className="material-icons-round text-lg">person</span>
                                )}
                                {!isFromReservation && (
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-surface-dark rounded-full flex items-center justify-center shadow-sm">
                                        <span className="material-icons-round text-primary text-xs">edit</span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <h2 className="text-sm text-slate-500 dark:text-slate-400 font-medium">Customer</h2>
                                <p className="font-bold text-slate-800 dark:text-white text-lg leading-tight truncate max-w-[150px]">
                                    {selectedCustomer ? selectedCustomer.name : 'Walk-in'}
                                </p>
                            </div>
                            {isFromReservation && (
                                <span className="material-icons-round text-xs text-slate-500 ml-1" title="Locked — from reservation">lock</span>
                            )}
                        </div>

                        <div className="h-8 w-px bg-gray-200 dark:bg-white/10 mx-2"></div>

                        {/* Stylist Info */}
                        {/* Stylist Info removed from header - moved to per-item */}
                    </div>

                    {/* Timer & Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 px-4 py-2 rounded-lg border border-gray-200 dark:border-white/5">
                            <span className="material-icons-round text-primary text-sm">timer</span>
                            <span className="font-mono text-xl font-bold tracking-wider text-slate-700 dark:text-white">00:00:00</span>
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
                <main className="flex-1 flex overflow-hidden relative">
                    {/* Left Panel: Catalog */}
                    <section className="flex-1 flex flex-col min-w-0 bg-gray-50/50 dark:bg-background-dark/50">
                        {/* Catalog Header: Search & Tabs */}
                        <div className="p-4 md:p-6 pb-2">
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
                            {isLoading && <LoadingSpinner message="Loading services..." />}
                            {isError && <ErrorAlert message="Failed to load services." onRetry={() => refetch()} />}

                            {servicesByCategory.map(([categoryName, categoryServices]) => (
                                <div key={categoryName} className="mb-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                            <span className={`w-1 h-6 ${CATEGORY_COLORS[categoryName] ?? 'bg-primary'} rounded-full`}></span>
                                            {categoryName}
                                        </h3>
                                        <span className="text-xs text-slate-500 font-medium">{categoryServices.length} items</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {categoryServices.map(service => {
                                            const selected = isInCart(service.id);
                                            return (
                                                <div
                                                    key={service.id}
                                                    onClick={() => addToCart(service)}
                                                    className={`p-4 rounded-xl group cursor-pointer relative overflow-hidden transition-all border ${selected ? 'bg-primary/5 border-primary/50 ring-1 ring-primary/50' : 'bg-white dark:bg-surface-dark/50 border-gray-200 dark:border-white/5 hover:border-primary/30'} shadow-sm hover:shadow-md`}
                                                >
                                                    <div className={`absolute top-0 right-0 p-3 transition-opacity ${selected ? '' : 'opacity-0 group-hover:opacity-100'}`}>
                                                        <div className="bg-primary text-white p-1 rounded-lg shadow-lg">
                                                            <span className="material-icons-round text-sm block">{selected ? 'check' : 'add'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-slate-400 dark:text-slate-300">
                                                            <span className="material-icons-round">{service.icon || 'spa'}</span>
                                                        </div>
                                                        <span className="text-xs font-medium text-slate-500 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded">{formatDuration(service.duration_minutes)}</span>
                                                    </div>
                                                    <h4 className={`font-bold mb-1 transition-colors ${selected ? 'text-primary' : 'text-slate-800 dark:text-white group-hover:text-primary'}`}>{service.name}</h4>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">{service.description || ''}</p>
                                                    <p className="text-lg font-bold text-slate-800 dark:text-white">{formatRupiah(service.price)}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Desktop Cart Panel */}
                    <aside className="w-[420px] bg-white dark:bg-surface-dark border-l border-gray-200 dark:border-white/5 flex-col shadow-2xl z-10 h-full hidden lg:flex">
                        {/* Cart Header */}
                        <div className="p-6 border-b border-gray-200 dark:border-white/5 bg-white dark:bg-surface-dark">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Current Order</h2>
                                <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded font-bold">{cart.length} items</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <span className="material-icons-round text-base">calendar_today</span>
                                <span>{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
                            </div>
                        </div>

                        {/* Cart Items List */}
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
                            {cart.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                                    <span className="material-icons-round text-4xl mb-2">shopping_cart</span>
                                    <p className="text-sm">No items in order</p>
                                </div>
                            )}
                            {cart.map(item => (
                                <div key={item.id} className="group bg-gray-50 dark:bg-background-dark/40 border border-gray-200 dark:border-white/5 hover:border-primary/30 p-3 rounded-xl transition-all relative">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-bold text-slate-800 dark:text-white text-sm">{item.name}</h4>
                                            {/* Stylist Selector for this item */}
                                            <div className="mt-1">
                                                <StylistSelector
                                                    selectedId={item.stylist}
                                                    onChange={(id) => updateItemStylist(item.id, id)}
                                                    stylists={stylistsList || []}
                                                />
                                            </div>
                                        </div>
                                        <p className="font-bold text-slate-800 dark:text-white">{formatRupiah(item.price * item.quantity)}</p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="material-icons-round text-sm">delete</span> Remove
                                        </button>
                                        <div className="flex items-center bg-gray-200 dark:bg-white/5 rounded-lg p-1">
                                            <button onClick={() => updateQuantity(item.id, -1)} className="h-6 w-6 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded hover:bg-white/20">
                                                <span className="material-icons-round text-sm">remove</span>
                                            </button>
                                            <span className="w-8 text-center text-sm font-bold text-slate-800 dark:text-white">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="h-6 w-6 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded hover:bg-white/20">
                                                <span className="material-icons-round text-sm">add</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Cart Footer */}
                        <div className="p-6 bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-white/5 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_-5px_20px_rgba(0,0,0,0.3)] mt-auto">
                            {/* Calculation Rows */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                                    <span>Subtotal</span>
                                    <span className="text-slate-800 dark:text-white font-medium">{formatRupiah(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                                    <span>Tax (11%)</span>
                                    <span className="text-slate-800 dark:text-white font-medium">{formatRupiah(tax)}</span>
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
                                    <span className="text-2xl font-bold text-slate-800 dark:text-white">{formatRupiah(total)}</span>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <button
                                onClick={handleCheckout}
                                disabled={cart.length === 0 || checkoutMutation.isPending}
                                className={`w-full bg-primary hover:bg-violet-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-between group transition-all transform hover:-translate-y-0.5 ${checkoutMutation.isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                <span>{checkoutMutation.isPending ? 'Processing...' : 'Checkout'}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-white/50 font-normal">|</span>
                                    <span className="text-white/90 group-hover:text-white">{formatRupiah(total)}</span>
                                    <span className="material-icons-round ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </div>
                            </button>
                        </div>
                    </aside>

                    {/* Mobile Cart FAB */}
                    <button
                        className="lg:hidden fixed bottom-6 right-6 z-50 h-14 px-5 rounded-full bg-primary text-white shadow-xl shadow-primary/30 flex items-center gap-2 hover:bg-violet-600 active:scale-95 transition-all"
                        onClick={() => setCartOpen(true)}
                    >
                        <span className="material-icons-round">shopping_cart</span>
                        {cart.length > 0 && (
                            <span className="bg-white text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{cart.length}</span>
                        )}
                        {cart.length > 0 && (
                            <span className="font-bold text-sm">{formatRupiah(total)}</span>
                        )}
                    </button>

                    {/* Mobile Cart Overlay */}
                    {cartOpen && (
                        <div className="lg:hidden fixed inset-0 z-50 flex flex-col">
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
                            <div className="relative mt-auto bg-white dark:bg-surface-dark rounded-t-2xl shadow-2xl animate-slide-up flex flex-col max-h-[90vh]">
                                {/* Mobile Cart Header */}
                                <div className="p-4 border-b border-gray-200 dark:border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Current Order</h2>
                                        <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded font-bold">{cart.length}</span>
                                    </div>
                                    <button onClick={() => setCartOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                                        <span className="material-icons-round text-slate-500">close</span>
                                    </button>
                                </div>

                                {/* Mobile Cart Items */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                                    {cart.length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                                            <span className="material-icons-round text-4xl mb-2">shopping_cart</span>
                                            <p className="text-sm">No items in order</p>
                                        </div>
                                    )}
                                    {cart.map(item => (
                                        <div key={item.id} className="bg-gray-50 dark:bg-background-dark/40 border border-gray-200 dark:border-white/5 p-3 rounded-xl">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="font-bold text-slate-800 dark:text-white text-sm">{item.name}</h4>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.stylist ?? item.type}</p>
                                                </div>
                                                <p className="font-bold text-slate-800 dark:text-white">{formatRupiah(item.price * item.quantity)}</p>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-500 flex items-center gap-1">
                                                    <span className="material-icons-round text-sm">delete</span> Remove
                                                </button>
                                                <div className="flex items-center bg-gray-200 dark:bg-white/5 rounded-lg p-1">
                                                    <button onClick={() => updateQuantity(item.id, -1)} className="h-7 w-7 flex items-center justify-center text-slate-500 rounded hover:bg-white/20">
                                                        <span className="material-icons-round text-sm">remove</span>
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-bold text-slate-800 dark:text-white">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)} className="h-7 w-7 flex items-center justify-center text-slate-500 rounded hover:bg-white/20">
                                                        <span className="material-icons-round text-sm">add</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Mobile Cart Footer */}
                                <div className="p-4 border-t border-gray-200 dark:border-white/5 bg-white dark:bg-surface-dark">
                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-sm text-slate-500"><span>Subtotal</span><span className="text-slate-800 dark:text-white font-medium">{formatRupiah(subtotal)}</span></div>
                                        <div className="flex justify-between text-sm text-slate-500"><span>Tax (11%)</span><span className="text-slate-800 dark:text-white font-medium">{formatRupiah(tax)}</span></div>
                                        <div className="h-px bg-gray-200 dark:bg-white/10"></div>
                                        <div className="flex justify-between items-end"><span className="text-slate-600 dark:text-slate-300 font-medium">Total</span><span className="text-xl font-bold text-slate-800 dark:text-white">{formatRupiah(total)}</span></div>
                                    </div>
                                    <button
                                        onClick={handleCheckout}
                                        disabled={cart.length === 0 || checkoutMutation.isPending}
                                        className={`w-full bg-primary hover:bg-violet-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all ${checkoutMutation.isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        <span>{checkoutMutation.isPending ? 'Processing...' : 'Checkout'}</span>
                                        <span className="material-icons-round">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Customer Search Modal */}
            {isCustomerModalOpen && (
                <CustomerSearchModal
                    onClose={() => setCustomerModalOpen(false)}
                    onSelect={(c) => {
                        setSelectedCustomer(c);
                        setCustomerModalOpen(false);
                    }}
                />
            )}
        </>
    );
}
