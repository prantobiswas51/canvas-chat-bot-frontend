import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string | number;
  emptyText?: string;
  isLoading?: boolean;
  className?: string;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyText = 'No records found',
  isLoading = false,
  className,
}: TableProps<T>) {
  return (
    <div className={twMerge('w-full overflow-x-auto border border-slate-200 dark:border-[#27264D] rounded-xl bg-white dark:bg-[#161530] shadow-sm', className)}>
      <table className="w-full text-left text-sm text-slate-800 dark:text-slate-300">
        <thead className="bg-slate-50 dark:bg-[#100F24] text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-[#27264D]">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className={twMerge('px-4 py-3.5 font-semibold', col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-[#27264D]/60">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#F81B57] border-t-transparent rounded-full animate-spin"></div>
                  Loading data...
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500">
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={keyExtractor(item, index)} className="hover:bg-slate-50 dark:hover:bg-[#1D1C3D]/50 transition-colors">
                {columns.map((col, cIdx) => (
                  <td key={cIdx} className={twMerge('px-4 py-3.5 text-sm text-slate-900 dark:text-slate-200', col.className)}>
                    {col.cell
                      ? col.cell(item, index)
                      : col.accessorKey
                      ? (item[col.accessorKey] as React.ReactNode)
                      : null}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
