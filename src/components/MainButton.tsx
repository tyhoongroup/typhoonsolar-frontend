import React from 'react';
import { getRoleTheme } from '@/lib/role-theme';

interface MainButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  role?: string;
}

export const MainButton: React.FC<MainButtonProps> = ({
  children,
  icon,
  role,
  className = '',
  disabled,
  ...props
}) => {
  const theme = getRoleTheme(role);

  return (
    <div className="px-4 mt-6 mb-24">
      <button
        disabled={disabled}
        style={{
          background: theme.hex.accentGradient || theme.hex.accentBg,
          color: theme.hex.accentTextColor,
          boxShadow: theme.hex.accentShadow || '0 8px 24px -4px rgba(36, 72, 255, 0.4)',
        }}
        className={`w-full py-4 px-6 rounded-2xl font-bold text-base tracking-wide flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-95 active:scale-98 cursor-pointer ${className}`}
        {...props}
      >
        {icon}
        <span>{children}</span>
      </button>
    </div>
  );
};

