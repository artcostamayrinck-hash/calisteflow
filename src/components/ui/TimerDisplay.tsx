import React from 'react';

export interface TimerDisplayProps {
  seconds: number;
  phase?: 'work' | 'rest' | 'prep';
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showWarningAt?: number;
  className?: string;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  seconds,
  phase = 'work',
  size = 'md',
  showWarningAt = 3,
  className = '',
}) => {
  const isWarning = seconds <= showWarningAt && seconds > 0;

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const formatted = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  const phaseColors = {
    work: 'text-emerald-400',
    rest: 'text-amber-400',
    prep: 'text-cyan-400',
  };

  const sizeStyles = {
    sm: 'text-lg font-bold',
    md: 'text-2xl sm:text-3xl font-extrabold',
    lg: 'text-4xl sm:text-5xl font-black',
    hero: 'text-6xl sm:text-7xl font-black tracking-tight',
  };

  return (
    <div
      className={`font-mono select-none transition-colors duration-150 flex items-center justify-center tabular-nums ${
        isWarning ? 'text-red-400 scale-105 animate-pulse' : phaseColors[phase]
      } ${sizeStyles[size]} ${className}`}
      aria-live="polite"
    >
      {formatted}
    </div>
  );
};

