import React from 'react';

export interface CircularProgressProps {
  value: number; // 0 to 100
  size?: number; // px, default 120
  strokeWidth?: number; // px, default 8
  variant?: 'emerald' | 'cyan' | 'amber' | 'red';
  children?: React.ReactNode;
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 120,
  strokeWidth = 8,
  variant = 'emerald',
  children,
  className = '',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, value));
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const strokeColors = {
    emerald: '#10b981',
    cyan: '#06b6d4',
    amber: '#f59e0b',
    red: '#ef4444',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(51, 65, 85, 0.4)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColors[variant]}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-300 ease-out"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
          {children}
        </div>
      )}
    </div>
  );
};

