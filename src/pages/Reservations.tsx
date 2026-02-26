
import { useState, useMemo, useCallback } from 'react';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';
import EmptyState from '../components/ui/EmptyState';
import { useServices } from '../hooks/useServices';
import { useStylists } from '../hooks/useStylists';
import {
    useReservations,
    useCreateWalkIn,
    useCheckInReservation,
    useUpdateReservation,
    useCancelReservation,
} from '../hooks/useReservations';
import { showToast } from '../lib/toast';
import type { Reservation, ReservationStatus } from '../lib/types';

// ─── Helpers ─────────────────────────────────────────────────────────

function getDateRange(tab: 'today' | 'tomorrow' | 'week'): string | undefined {
    const now = new Date();
    if (tab === 'today') {
        return now.toISOString().slice(0, 10);
    }
    if (tab === 'tomorrow') {
        const d = new Date(now);
        d.setDate(d.getDate() + 1);
        return d.toISOString().slice(0, 10);
    }
    // 'week' — no date filter, backend returns all upcoming
    return undefined;
}

function formatTime(iso: string): { time: string; period: string } {
    const d = new Date(iso);
    const h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, '0');
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return { time: `${h12}:${m}`, period };
}

function getStatusBadge(status: ReservationStatus) {
    const map: Record<ReservationStatus, { label: string; cls: string }> = {
        pending: { label: 'Pending', cls: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
        confirmed: { label: 'Confirmed', cls: 'bg-green-500/10 text-green-400 border-green-500/20' },
        checked_in: { label: 'Checked In', cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
        completed: { label: 'Completed', cls: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
        cancelled: { label: 'Cancelled', cls: 'bg-red-500/10 text-red-400 border-red-500/20' },
        no_show: { label: 'No Show', cls: 'bg-red-500/10 text-red-400 border-red-500/20' },
    };
    return map[status] ?? map.pending;
}

function getInitials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

const INITIAL_WALKIN = { name: '', phone: '', serviceId: '', stylistId: '' };

// ─── Component ───────────────────────────────────────────────────────

export default function Reservations() {
    // ── Data fetching ──
    const { data: services, isLoading: servicesLoading, isError: servicesError, refetch: refetchServices } = useServices();
    const { data: stylists, isLoading: stylistsLoading, isError: stylistsError, refetch: refetchStylists } = useStylists();

    // ── Filters ──
    const [dateTab, setDateTab] = useState<'today' | 'tomorrow' | 'week'>('today');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchDebounced, setSearchDebounced] = useState('');

    // Debounce search
    const handleSearchChange = useCallback((value: string) => {
        setSearchQuery(value);
        const timer = setTimeout(() => setSearchDebounced(value), 400);
        return () => clearTimeout(timer);
    }, []);

    const dateParam = getDateRange(dateTab);
    const {
        data: reservationsData,
        isLoading: reservationsLoading,
        isError: reservationsError,
        refetch: refetchReservations,
    } = useReservations({
        date: dateParam,
        search: searchDebounced || undefined,
    });

    // The list API returns { items, total, page, limit }
    const reservations: Reservation[] = reservationsData?.items ?? [];

    // ── Mutations ──
    const walkInMutation = useCreateWalkIn();
    const checkInMutation = useCheckInReservation();
    const updateMutation = useUpdateReservation();
    const cancelMutation = useCancelReservation();

    // ── Walk-in form state ──
    const [walkinForm, setWalkinForm] = useState(INITIAL_WALKIN);
    const [showWalkinMobile, setShowWalkinMobile] = useState(false);

    // ── Edit modal state ──
    const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
    const [editForm, setEditForm] = useState({ stylistId: '', notes: '' });

    // ── Cancel confirm state ──
    const [cancellingId, setCancellingId] = useState<string | null>(null);

    const availableStylists = stylists?.filter(s => s.is_available) ?? [];

    const isLoading = servicesLoading || stylistsLoading || reservationsLoading;
    const isError = servicesError || stylistsError || reservationsError;

    // ── Stats (computed from real data) ──
    const stats = useMemo(() => {
        const all = reservations;
        return {
            total: all.length,
            checkedIn: all.filter(r => r.status === 'checked_in').length,
            pending: all.filter(r => r.status === 'pending' || r.status === 'confirmed').length,
            walkIns: all.filter(r => r.type === 'walk_in').length,
        };
    }, [reservations]);

    // ── Handlers ──

    const handleWalkInSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!walkinForm.name.trim()) {
            showToast({ type: 'error', message: 'Customer name is required.' });
            return;
        }
        if (!walkinForm.serviceId) {
            showToast({ type: 'error', message: 'Please select a service.' });
            return;
        }

        walkInMutation.mutate(
            {
                customer_name: walkinForm.name.trim(),
                customer_phone: walkinForm.phone.trim() || undefined,
                stylist_id: walkinForm.stylistId || undefined,
                service_ids: [walkinForm.serviceId],
            },
            {
                onSuccess: () => {
                    showToast({ type: 'success', message: `Walk-in for ${walkinForm.name} created!` });
                    setWalkinForm(INITIAL_WALKIN);
                    setShowWalkinMobile(false);
                },
                onError: (err) => {
                    showToast({ type: 'error', message: err instanceof Error ? err.message : 'Failed to create walk-in.' });
                },
            },
        );
    };

    const handleCheckIn = (reservation: Reservation) => {
        checkInMutation.mutate(reservation.id, {
            onSuccess: () => {
                showToast({ type: 'success', message: `${reservation.customers?.name ?? 'Customer'} checked in!` });
            },
            onError: (err) => {
                showToast({ type: 'error', message: err instanceof Error ? err.message : 'Check-in failed.' });
            },
        });
    };

    const handleEditOpen = (reservation: Reservation) => {
        setEditingReservation(reservation);
        setEditForm({
            stylistId: reservation.stylist_id ?? '',
            notes: reservation.notes ?? '',
        });
    };

    const handleEditSave = () => {
        if (!editingReservation) return;
        updateMutation.mutate(
            {
                id: editingReservation.id,
                data: {
                    stylist_id: editForm.stylistId || undefined,
                    notes: editForm.notes || undefined,
                    version: editingReservation.version,
                },
            },
            {
                onSuccess: () => {
                    showToast({ type: 'success', message: 'Reservation updated!' });
                    setEditingReservation(null);
                },
                onError: (err) => {
                    showToast({ type: 'error', message: err instanceof Error ? err.message : 'Update failed.' });
                },
            },
        );
    };

    const handleCancelConfirm = () => {
        const res = reservations.find(r => r.id === cancellingId);
        if (!cancellingId || !res) return;
        cancelMutation.mutate(
            { id: cancellingId, version: res.version },
            {
                onSuccess: () => {
                    showToast({ type: 'success', message: 'Reservation cancelled.' });
                    setCancellingId(null);
                },
                onError: (err) => {
                    showToast({ type: 'error', message: err instanceof Error ? err.message : 'Cancel failed.' });
                    setCancellingId(null);
                },
            },
        );
    };

    // Filter out cancelled/completed for the "upcoming" view
    const visibleReservations = reservations.filter(
        r => r.status !== 'cancelled' && r.status !== 'completed' && r.status !== 'no_show',
    );

    // ── Walk-in form (shared between desktop & mobile) ──
    const renderWalkInForm = (isMobile = false) => (
        <form className="space-y-5" onSubmit={handleWalkInSubmit}>
            <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Customer Name</label>
                <div className="relative">
                    <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">person</span>
                    <input
                        className="w-full bg-background-dark border border-white/10 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder-slate-600"
                        placeholder="Enter guest name"
                        type="text"
                        value={walkinForm.name}
                        onChange={e => setWalkinForm(f => ({ ...f, name: e.target.value }))}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Phone Number</label>
                <div className="relative">
                    <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">smartphone</span>
                    <input
                        className="w-full bg-background-dark border border-white/10 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder-slate-600"
                        placeholder="+62 8..."
                        type="tel"
                        value={walkinForm.phone}
                        onChange={e => setWalkinForm(f => ({ ...f, phone: e.target.value }))}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Service</label>
                <div className="relative">
                    <select
                        className="w-full bg-background-dark border border-white/10 text-white rounded-lg pl-4 pr-10 py-3 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all appearance-none cursor-pointer"
                        value={walkinForm.serviceId}
                        onChange={e => setWalkinForm(f => ({ ...f, serviceId: e.target.value }))}
                    >
                        <option value="">Select Service...</option>
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
                    <select
                        className="w-full bg-background-dark border border-white/10 text-white rounded-lg pl-4 pr-10 py-3 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all appearance-none cursor-pointer"
                        value={walkinForm.stylistId}
                        onChange={e => setWalkinForm(f => ({ ...f, stylistId: e.target.value }))}
                    >
                        <option value="">Any Stylist</option>
                        {stylists?.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                    <span className="material-icons-round absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">expand_more</span>
                </div>
                {!isMobile && (
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span> {availableStylists.length} Stylists Available
                    </p>
                )}
            </div>
            <div className={isMobile ? '' : 'pt-4'}>
                <button
                    type="submit"
                    disabled={walkInMutation.isPending}
                    className="w-full bg-primary hover:bg-violet-600 text-white font-bold py-4 rounded-xl shadow-xl shadow-primary/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {walkInMutation.isPending ? (
                        <>
                            <span className="material-icons-round animate-spin text-xl">progress_activity</span>
                            <span>Processing...</span>
                        </>
                    ) : (
                        <>
                            <span>Start Order</span>
                            <span className="material-icons-round">arrow_forward</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );

    // ── Appointment card renderer ──
    const renderAppointmentCard = (reservation: Reservation) => {
        const { time, period } = formatTime(reservation.scheduled_at);
        const badge = getStatusBadge(reservation.status);
        const customerName = reservation.customers?.name ?? 'Unknown';
        const avatarUrl = reservation.customers?.avatar_url;
        const stylistName = reservation.stylists?.name;
        const serviceNames = reservation.reservation_services
            ?.map(rs => rs.services?.name)
            .filter(Boolean)
            .join(' + ') || (reservation.type === 'walk_in' ? 'Walk-in' : 'Service');
        const isCheckedIn = reservation.status === 'checked_in';
        const canCheckIn = reservation.status === 'pending' || reservation.status === 'confirmed';

        return (
            <div
                key={reservation.id}
                className={`bg-surface-dark rounded-xl p-5 border-y border-r border-white/5 hover:border-r-primary/30 transition-all flex flex-col md:flex-row md:items-center gap-6 relative group ${isCheckedIn ? 'border-l-4 border-l-blue-500' : 'border-l-4 border-l-primary'
                    }`}
            >
                {/* Time */}
                <div className="flex flex-col items-center justify-center min-w-[80px] border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-6">
                    <span className={`text-2xl font-bold ${isCheckedIn ? 'text-blue-400' : 'text-primary'}`}>{time}</span>
                    <span className="text-xs text-slate-500 uppercase font-semibold">{period}</span>
                </div>

                {/* Customer info */}
                <div className="flex-1 flex items-start gap-4">
                    {avatarUrl ? (
                        <img className="w-12 h-12 rounded-full object-cover border-2 border-surface-dark shadow-sm" src={avatarUrl} alt={customerName} />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            {getInitials(customerName)}
                        </div>
                    )}
                    <div>
                        <h3 className="text-lg font-bold text-white">{customerName}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="text-sm text-slate-400 flex items-center gap-1">
                                <span className="material-icons-round text-base">content_cut</span> {serviceNames}
                            </span>
                            {stylistName && (
                                <>
                                    <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                    <span className="text-sm text-slate-400 flex items-center gap-1">
                                        <span className="material-icons-round text-base">face</span> Stylist: <span className="text-primary font-medium">{stylistName}</span>
                                    </span>
                                </>
                            )}
                            {reservation.type === 'walk_in' && (
                                <>
                                    <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                    <span className="text-xs px-2 py-0.5 bg-pink-500/10 text-pink-400 rounded-full border border-pink-500/20 font-medium">Walk-in</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Status badge */}
                <div className="absolute top-4 right-4 md:static md:top-auto md:right-auto">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.cls}`}>
                        {badge.label}
                    </span>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 mt-2 md:mt-0 w-full md:w-auto">
                    {canCheckIn && (
                        <Button
                            variant="success"
                            size="sm"
                            icon="check_circle"
                            onClick={() => handleCheckIn(reservation)}
                            disabled={checkInMutation.isPending}
                        >
                            Check-in
                        </Button>
                    )}
                    {isCheckedIn && (
                        <span className="text-xs text-blue-400 flex items-center gap-1 font-medium">
                            <span className="material-icons-round text-sm">check_circle</span> In Service
                        </span>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        icon="edit"
                        className="!p-2"
                        onClick={() => handleEditOpen(reservation)}
                    />
                    {!isCheckedIn && (
                        <Button
                            variant="ghost"
                            size="sm"
                            icon="block"
                            className="!p-2 hover:text-red-400"
                            onClick={() => setCancellingId(reservation.id)}
                        />
                    )}
                </div>
            </div>
        );
    };

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
                                onRetry={() => { refetchServices(); refetchStylists(); refetchReservations(); }}
                            />
                        )}

                        {!isLoading && !isError && (<>
                            {/* Search & Filters */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                                {/* Date Tabs */}
                                <div className="bg-surface-dark p-1 rounded-lg inline-flex border border-white/5">
                                    {(['today', 'tomorrow', 'week'] as const).map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => setDateTab(tab)}
                                            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${dateTab === tab
                                                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            {tab === 'today' ? 'Today' : tab === 'tomorrow' ? 'Tomorrow' : 'This Week'}
                                        </button>
                                    ))}
                                </div>
                                {/* Search Bar */}
                                <div className="relative w-full md:w-96 group">
                                    <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                                    <input
                                        className="w-full bg-surface-dark border border-white/5 text-white text-sm rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-sm placeholder-slate-500"
                                        placeholder="Search customer name or phone..."
                                        type="text"
                                        value={searchQuery}
                                        onChange={e => handleSearchChange(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Stats Overview */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
                                {[
                                    { icon: 'event', label: 'Total Bookings', value: String(stats.total), color: 'text-primary', bg: 'bg-primary/20' },
                                    { icon: 'check_circle', label: 'Checked In', value: String(stats.checkedIn), color: 'text-green-500', bg: 'bg-green-500/20' },
                                    { icon: 'schedule', label: 'Pending', value: String(stats.pending), color: 'text-orange-500', bg: 'bg-orange-500/20' },
                                    { icon: 'person_add', label: 'Walk-ins', value: String(stats.walkIns), color: 'text-pink-500', bg: 'bg-pink-500/20' },
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

                            {/* Appointments List */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 ml-1">Upcoming Appointments</h3>

                                {visibleReservations.length === 0 ? (
                                    <EmptyState
                                        icon="event_available"
                                        title="No appointments found"
                                        message={searchQuery ? 'No results match your search. Try a different keyword.' : 'No upcoming appointments for this period. Use Quick Walk-in to add one!'}
                                    />
                                ) : (
                                    visibleReservations.map(renderAppointmentCard)
                                )}
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
                            {renderWalkInForm(true)}
                        </div>
                    </div>
                )}

                {/* Right Panel: Quick Walk-in Form (Desktop) */}
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
                        {renderWalkInForm(false)}
                    </div>

                    {/* Queue load indicator */}
                    <div className="mt-auto relative h-48 w-full overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark to-transparent z-10"></div>
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-purple-900/20"></div>
                        <div className="absolute bottom-6 left-6 right-6 z-20">
                            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                                <span>Queue Load</span>
                                <span>{stats.checkedIn <= 3 ? 'Low' : stats.checkedIn <= 6 ? 'Medium' : 'High'}</span>
                            </div>
                            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all ${stats.checkedIn <= 3 ? 'bg-green-500' : stats.checkedIn <= 6 ? 'bg-orange-500' : 'bg-red-500'}`}
                                    style={{ width: `${Math.min(stats.checkedIn * 10, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {/* ─── Edit Modal ─── */}
            {editingReservation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditingReservation(null)} />
                    <div className="relative bg-surface-dark rounded-2xl p-6 w-full max-w-md shadow-2xl border border-white/10 animate-scale-in">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Edit Reservation</h2>
                            <button onClick={() => setEditingReservation(null)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors">
                                <span className="material-icons-round">close</span>
                            </button>
                        </div>
                        <div className="space-y-5">
                            <div className="bg-white/5 rounded-lg p-3 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-white font-bold">
                                    {getInitials(editingReservation.customers?.name ?? 'U')}
                                </div>
                                <div>
                                    <p className="text-white font-semibold">{editingReservation.customers?.name ?? 'Unknown'}</p>
                                    <p className="text-xs text-slate-400">{new Date(editingReservation.scheduled_at).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Assign Stylist</label>
                                <select
                                    className="w-full bg-background-dark border border-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all appearance-none"
                                    value={editForm.stylistId}
                                    onChange={e => setEditForm(f => ({ ...f, stylistId: e.target.value }))}
                                >
                                    <option value="">Any Stylist</option>
                                    {stylists?.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Notes</label>
                                <textarea
                                    className="w-full bg-background-dark border border-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder-slate-600 resize-none"
                                    rows={3}
                                    placeholder="Add notes..."
                                    value={editForm.notes}
                                    onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))}
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button variant="ghost" className="flex-1" onClick={() => setEditingReservation(null)}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    className="flex-1"
                                    onClick={handleEditSave}
                                    disabled={updateMutation.isPending}
                                >
                                    {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Cancel Confirmation Modal ─── */}
            {cancellingId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCancellingId(null)} />
                    <div className="relative bg-surface-dark rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-white/10 animate-scale-in">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                                <span className="material-icons-round text-3xl text-red-400">warning</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Cancel Reservation?</h3>
                            <p className="text-sm text-slate-400 mb-6">This action cannot be undone. The customer will be notified about the cancellation.</p>
                            <div className="flex gap-3 w-full">
                                <Button variant="ghost" className="flex-1" onClick={() => setCancellingId(null)}>
                                    Keep It
                                </Button>
                                <Button
                                    variant="danger"
                                    className="flex-1"
                                    onClick={handleCancelConfirm}
                                    disabled={cancelMutation.isPending}
                                >
                                    {cancelMutation.isPending ? 'Cancelling...' : 'Yes, Cancel'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
