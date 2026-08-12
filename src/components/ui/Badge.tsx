import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'info' | 'danger' | 'neutral' | 'indigo' | 'brand';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className,
  dot = false,
}) => {
  const baseStyles = 'inline-flex items-center font-semibold rounded-full';

  const variants = {
    brand: 'bg-[#FF1E56]/15 text-[#FF1E56] border border-[#FF1E56]/40',
    success: 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50',
    warning: 'bg-amber-950/60 text-amber-400 border border-amber-800/50',
    info: 'bg-sky-950/60 text-sky-400 border border-sky-800/50',
    danger: 'bg-rose-950/60 text-rose-400 border border-rose-800/50',
    indigo: 'bg-[#FF1E56]/15 text-[#FF1E56] border border-[#FF1E56]/30',
    neutral: 'bg-[#1D1D3A] text-slate-300 border border-[#2D2D54]',
  };

  const dotColors = {
    brand: 'bg-[#FF1E56]',
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    info: 'bg-sky-400',
    danger: 'bg-rose-400',
    indigo: 'bg-[#FF1E56]',
    neutral: 'bg-slate-400',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  };

  return (
    <span className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}>
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  );
};

export default Badge;
