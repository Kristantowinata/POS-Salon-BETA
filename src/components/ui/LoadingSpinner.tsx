interface LoadingSpinnerProps {
    message?: string;
    className?: string;
}

export default function LoadingSpinner({ message = 'Loading...', className = '' }: LoadingSpinnerProps) {
    return (
        <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mb-3" />
            <span className="text-sm text-slate-400 font-medium">{message}</span>
        </div>
    );
}
