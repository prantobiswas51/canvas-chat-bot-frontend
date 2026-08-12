import React from 'react';
import logoUrl from '@/assets/logo.svg';

export interface CanvasLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  variant?: 'tile' | 'flat';
}

export const CanvasLogo: React.FC<CanvasLogoProps> = ({
  className = '',
  size = 36,
  showText = true,
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <img
        src={logoUrl}
        alt="Canvas Bot Logo"
        style={{ width: `${size}px`, height: `${size}px` }}
        className="object-contain shrink-0"
      />
      {showText && (
        <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white font-sans">
          Canvas <span className="text-[#F81B57]">Bot</span>
        </span>
      )}
    </div>
  );
};

export default CanvasLogo;
