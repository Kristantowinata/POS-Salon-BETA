interface ErrorAlertProps {
    message?: string;
    onRetry?: () => void;
    className?: string;
}

export default function ErrorAlert({
    message = 'Failed to load data.',
    onRetry,
    className = '',
}: ErrorAlertProps) {
    return (
        <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-3">
                <span className="material-icons-round text-red-400 text-2xl">error_outline</span>
            </div>
            <p className="text-sm text-slate-400 mb-4">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-4 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-2"
                >
                    <span className="material-icons-round text-sm">refresh</span>
                    Retry
                </button>
            )}
        </div>
    );
}
