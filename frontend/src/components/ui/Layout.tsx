import React from 'react';
import { cn } from '../../utils/cn';

export const Card = ({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => (
    <div
        className={cn("glass-card rounded-2xl p-6 relative overflow-hidden", className)}
        onClick={onClick}
    >
        {children}
    </div>
);

export const ProgressBar = ({ value, colorClass }: { value: number, colorClass: string }) => (
    <div className="h-2 w-full bg-secondary rounded-full mt-4 overflow-hidden">
        <div
            className={cn("h-full transition-all duration-1000", colorClass)}
            style={{ width: `${value}%` }}
        />
    </div>
);
