
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    icon?: string;
    fullWidth?: boolean;
}

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    icon,
    fullWidth = false,
    className = '',
    ...props
}: ButtonProps) {

    const baseClasses = "inline-flex items-center justify-center rounded-lg font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-dark disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-primary hover:bg-violet-600 text-white shadow-lg shadow-primary/30",
        secondary: "bg-surface-dark border border-slate-700 hover:bg-slate-800 text-white",
        success: "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20",
        danger: "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20",
        ghost: "text-slate-400 hover:text-white hover:bg-white/5",
        outline: "border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-5 py-2.5 text-sm",
        lg: "px-6 py-3.5 text-base"
    };

    return (
        <button
            className={`
        ${baseClasses} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? 'w-full' : ''} 
        ${className}
      `}
            {...props}
        >
            {icon && <span className={`material-icons-round ${children ? 'mr-2' : ''} text-lg`}>{icon}</span>}
            {children}
        </button>
    );
}
