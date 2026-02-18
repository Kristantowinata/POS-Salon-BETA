interface EmptyStateProps {
    icon?: string;
    title?: string;
    message?: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

export default function EmptyState({
    icon = 'inbox',
    title = 'No data found',
    message = 'There are no items to display yet.',
    actionLabel,
    onAction,
    className = '',
}: EmptyStateProps) {
    return (
        <div className={`flex flex-col items-center justify-center py-20 ${className}`}>
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4">
                <span className="material-icons-round text-3xl text-gray-400 dark:text-gray-500">{icon}</span>
            </div>
            <h4 className="text-base font-bold text-gray-700 dark:text-gray-300 mb-1">{title}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">{message}</p>
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="mt-5 px-5 py-2.5 bg-primary/10 text-primary text-sm font-semibold rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-2"
                >
                    <span className="material-icons-round text-sm">add</span>
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
