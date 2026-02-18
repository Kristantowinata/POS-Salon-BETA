/**
 * Lightweight toast notification store — no external dependencies.
 * Uses a simple event-emitter pattern for reactivity.
 */

export interface Toast {
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
    duration?: number;
}

type Listener = (toasts: Toast[]) => void;

let toasts: Toast[] = [];
const listeners = new Set<Listener>();
let counter = 0;

function emit() {
    listeners.forEach(fn => fn([...toasts]));
}

export function showToast(opts: Omit<Toast, 'id'>) {
    const id = `toast-${++counter}`;
    const duration = opts.duration ?? 3500;
    const toast: Toast = { ...opts, id };

    toasts = [...toasts, toast];
    emit();

    if (duration > 0) {
        setTimeout(() => dismissToast(id), duration);
    }
}

export function dismissToast(id: string) {
    toasts = toasts.filter(t => t.id !== id);
    emit();
}

export function subscribeToasts(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export function getToasts(): Toast[] {
    return [...toasts];
}
