import { useEffect, useState } from 'react';
import { subscribeToasts, dismissToast, getToasts, type Toast } from '../../lib/toast';

const ICON_MAP: Record<Toast['type'], string> = {
    success: 'check_circle',
    error: 'error',
    info: 'info',
};

const COLOR_MAP: Record<Toast['type'], string> = {
    success: 'bg-green-500/10 border-green-500/20 text-green-400',
    error: 'bg-red-500/10 border-red-500/20 text-red-400',
    info: 'bg-primary/10 border-primary/20 text-primary',
};

const ICON_COLOR_MAP: Record<Toast['type'], string> = {
    success: 'text-green-400',
    error: 'text-red-400',
    info: 'text-primary',
};

export default function ToastContainer() {
    const [toasts, setToasts] = useState<Toast[]>(getToasts);

    useEffect(() => {
        return subscribeToasts(setToasts);
    }, []);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none max-w-sm w-full">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl animate-slide-in-right ${COLOR_MAP[toast.type]}`}
                >
                    <span className={`material-icons-round text-xl flex-shrink-0 mt-0.5 ${ICON_COLOR_MAP[toast.type]}`}>
                        {ICON_MAP[toast.type]}
                    </span>
                    <p className="text-sm font-medium text-gray-800 dark:text-white flex-1">{toast.message}</p>
                    <button
                        onClick={() => dismissToast(toast.id)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors flex-shrink-0"
                    >
                        <span className="material-icons-round text-sm">close</span>
                    </button>
                </div>
            ))}
        </div>
    );
}
