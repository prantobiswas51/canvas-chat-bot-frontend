import React from 'react';
import Card from '@/components/ui/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  changePercent: number;
  isPositive?: boolean;
  period?: string;
  icon: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  changePercent,
  isPositive = true,
  period = 'vs last week',
  icon,
}) => {
  return (
    <Card hoverable className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className="p-2 bg-slate-100 dark:bg-[#1D1C3D] border border-slate-200 dark:border-[#2D2C57] rounded-lg text-[#F81B57]">
          {icon}
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{value}</h3>
        <div
          className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
            isPositive
              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
              : 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40'
          }`}
        >
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{isPositive ? `+${changePercent}%` : `${changePercent}%`}</span>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">{period}</p>
    </Card>
  );
};

export default MetricCard;
