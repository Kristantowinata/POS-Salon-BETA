
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const { login } = useAuth();
    const [email, setEmail] = useState('demo@sukimsalon.com');
    const [password, setPassword] = useState('password');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const result = await login(email, password);

        if (!result.success) {
            setError(result.error ?? 'Login failed. Check your credentials.');
            setIsSubmitting(false);
        }
        // On success, AuthContext updates → App re-renders to dashboard
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex items-center justify-center p-4 overflow-x-hidden relative font-sans">
            <div className="fixed inset-0 z-0 bg-pattern mesh-gradient"></div>
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>

            <div className="relative z-10 w-full max-w-[480px]">
                <div className="glass-card rounded-xl p-8 md:p-12 flex flex-col items-center">
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/20 mb-4 border border-primary/30">
                            <span className="material-icons-round text-primary text-4xl">content_cut</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">SukimSalon</h1>
                        <p className="text-slate-400 text-sm font-medium">Elevated management for premium salons</p>
                    </div>

                    {error && (
                        <div className="w-full mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-3">
                            <span className="material-icons-round text-red-400 text-lg">error_outline</span>
                            <span className="text-red-300 text-sm">{error}</span>
                        </div>
                    )}

                    <form className="w-full space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300 ml-1">Email Address</label>
                            <div className="relative">
                                <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl">mail</span>
                                <input
                                    className="w-full bg-[#1f1b27]/50 border border-[#423b54] rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 outline-none"
                                    placeholder="name@sukim-salon.com"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300 ml-1">Password</label>
                            <div className="relative">
                                <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl">lock</span>
                                <input
                                    className="w-full bg-[#1f1b27]/50 border border-[#423b54] rounded-xl py-4 pl-12 pr-12 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 outline-none"
                                    placeholder="••••••••"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isSubmitting}
                                    required
                                />
                                <button
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary transition-colors"
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <span className="material-icons-round text-xl">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input className="w-5 h-5 rounded border-[#423b54] bg-transparent text-primary focus:ring-primary/20 focus:ring-offset-0 transition-all cursor-pointer accent-primary" type="checkbox" />
                                <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">Remember me</span>
                            </label>
                            <a className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors" href="#">Forgot Password?</a>
                        </div>

                        <button
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <span>Login to Dashboard</span>
                                    <span className="material-icons-round text-lg">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="w-full flex items-center gap-4 my-8">
                        <div className="h-px grow bg-[#423b54]"></div>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Or continue with</span>
                        <div className="h-px grow bg-[#423b54]"></div>
                    </div>

                    <div className="w-full grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-[#423b54] bg-[#1f1b27]/30 hover:bg-[#1f1b27]/60 transition-all text-slate-200 text-sm font-semibold">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"></path>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"></path>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor"></path>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"></path>
                            </svg>
                            Google
                        </button>
                        <button className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-[#423b54] bg-[#1f1b27]/30 hover:bg-[#1f1b27]/60 transition-all text-slate-200 text-sm font-semibold">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M17.05 20.28c-.96.95-2.44.88-3.41-.14l-1.64-1.74-1.64 1.74c-.97 1.02-2.45 1.09-3.41.14l-.13-.13c-1-.99-1.01-2.63-.03-3.64l1.83-1.89-1.83-1.89c-.98-1.01-.97-2.65.03-3.64l.13-.13c.96-.95 2.44-.88 3.41.14l1.64 1.74 1.64-1.74c.97-1.02 2.45-1.09 3.41-.14l.13.13c1 .99 1.01 2.63.03 3.64l-1.83 1.89 1.83 1.89c.98 1.01.97 2.65-.03 3.64l-.13.13zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"></path>
                            </svg>
                            Apple
                        </button>
                    </div>

                    <div className="mt-8 flex justify-center gap-6 text-slate-500 text-xs font-semibold uppercase tracking-widest">
                        <a className="hover:text-slate-300 transition-colors" href="#">Privacy Policy</a>
                        <a className="hover:text-slate-300 transition-colors" href="#">Terms of Service</a>
                        <a className="hover:text-slate-300 transition-colors" href="#">Support</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
