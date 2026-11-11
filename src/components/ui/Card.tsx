import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'solid' | 'interactive' | 'elevated' | 'outline';
}

export const Card: React.FC<CardProps> = ({
  variant = 'glass',
  className = '',
  children,
  ...props
}) => {
  const variantStyles = {
    glass: 'glass-card rounded-2xl',
    solid: 'bg-slate-900 border border-slate-800 rounded-2xl shadow-lg',
    interactive:
      'glass-card rounded-2xl transition-all duration-200 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-950/30 cursor-pointer active:scale-[0.99]',
    elevated:
      'glass-panel rounded-3xl border border-slate-700/60 shadow-2xl',
    outline:
      'bg-transparent border border-slate-800 hover:border-slate-700 rounded-2xl',
  };

  return (
    <div
      className={`p-4 sm:p-5 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`flex flex-col gap-1 mb-3 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <h3 className={`text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2 ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <p className={`text-xs sm:text-sm text-slate-400 leading-relaxed ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`space-y-3 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 ${className}`} {...props}>
    {children}
  </div>
);

