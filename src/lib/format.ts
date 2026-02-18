/**
 * Formatting utilities for SukimSalon POS.
 */

/** Format a number as Indonesian Rupiah, e.g. 150000 → "Rp 150.000" */
export function formatRupiah(amount: number): string {
    return `Rp ${amount.toLocaleString('id-ID')}`;
}

/** Format minutes as human-readable duration, e.g. 90 → "1h 30m", 45 → "45m" */
export function formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/** Get initials from a full name, e.g. "Ibu Ani Susanti" → "IA" */
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
}
