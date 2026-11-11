import React from 'react';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  max?: number;
  variant?: 'emerald' | 'cyan' | 'amber' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = 'emerald',
  size = 'md',
  showLabel = false,
  label,
  className = '',
  ...props
}) => {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));

  const variantStyles = {
    emerald: 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-sm shadow-emerald-500/30',
    cyan: 'bg-gradient-to-r from-cyan-500 to-blue-400 shadow-sm shadow-cyan-500/30',
    amber: 'bg-gradient-to-r from-amber-500 to-orange-400 shadow-sm shadow-amber-500/30',
    purple: 'bg-gradient-to-r from-purple-500 to-indigo-400 shadow-sm shadow-purple-500/30',
  };

  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`} {...props}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
          <span>{label || 'Progresso'}</span>
          <span className="font-mono text-slate-400">{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        className={`w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/50 ${sizeStyles[size]}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${variantStyles[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

