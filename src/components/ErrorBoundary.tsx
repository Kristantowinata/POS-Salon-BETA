import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('[ErrorBoundary]', error, info.componentStack);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-8">
                    <div className="max-w-md w-full text-center">
                        <div className="w-20 h-20 mx-auto rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                            <span className="material-icons-round text-red-400 text-4xl">error_outline</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                            Something went wrong
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                            An unexpected error occurred. Please try again or contact support if the problem persists.
                        </p>
                        {this.state.error && (
                            <details className="text-left mb-6 p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                                <summary className="text-xs text-red-400 font-medium cursor-pointer">
                                    Error Details
                                </summary>
                                <pre className="text-xs text-gray-500 dark:text-gray-400 mt-2 whitespace-pre-wrap break-all">
                                    {this.state.error.message}
                                </pre>
                            </details>
                        )}
                        <div className="flex items-center justify-center gap-3">
                            <button
                                onClick={this.handleRetry}
                                className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all flex items-center gap-2"
                            >
                                <span className="material-icons-round text-sm">refresh</span>
                                Try Again
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-3 border border-gray-200 dark:border-white/10 rounded-xl font-bold text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                            >
                                Reload Page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
