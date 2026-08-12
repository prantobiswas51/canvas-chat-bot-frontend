import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hoverable = false, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-white dark:bg-[#161530] border border-slate-200 dark:border-[#27264D] text-slate-900 dark:text-slate-100 rounded-xl p-5 shadow-sm dark:shadow-lg dark:shadow-black/20 backdrop-blur-sm transition-all duration-200',
          hoverable && 'hover:border-slate-300 dark:hover:border-[#38376E] hover:shadow-md hover:translate-y-[-1px]',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
