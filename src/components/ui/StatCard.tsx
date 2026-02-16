
import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
    subtitle?: string;
    icon: string;
    trend?: string;
    trendUp?: boolean;
    color?: "primary" | "blue" | "green" | "purple" | "red" | "orange";
    children?: React.ReactNode; // For custom content like progress bar
}

export default function StatCard({
    title,
    value,
    subtitle,
    icon,
    trend,
    trendUp = true,
    color = "primary",
    children
}: StatCardProps) {

    const colorClasses = {
        primary: "text-primary",
        blue: "text-blue-400",
        green: "text-green-400",
        purple: "text-purple-400",
        red: "text-red-400",
        orange: "text-orange-400",
    };

    return (
        <div className={`glass-panel p-5 rounded-xl flex flex-col justify-between h-32 relative overflow-hidden group ${color === 'red' ? 'border-red-500/20' : ''}`}>
            <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className={`material-icons-round text-6xl ${colorClasses[color]}`}>{icon}</span>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-400">{title}</span>
                {trend && (
                    <span className={`text-xs font-bold px-2 py-1 rounded ${trendUp ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                        {trend}
                    </span>
                )}
                {/* Custom header accessory if needed (like the pulsing dot) can be passed or handled separately, but for now specific logic is handled by parent or slots if we went full slot pattern. */}
            </div>

            <div>
                <h3 className="text-2xl font-bold text-white">{value}</h3>
                {subtitle && <p className={`text-xs mt-1 ${color === 'red' ? 'text-red-400' : 'text-gray-500'}`}>{subtitle}</p>}
                {children}
            </div>
        </div>
    );
}
