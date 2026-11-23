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
  const aColor = theme.hex.accentBg || '#6366F1';
  const onColor = theme.hex.accentTextColor || '#FFFFFF';

  return (
    <div className="px-3.5 mt-3.5 mb-20">
      <button
        disabled={disabled}
        style={{
          background: theme.hex.accentGradient || `linear-gradient(180deg, rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0.06)), ${aColor}`,
          color: onColor,
          borderRadius: '18px',
          padding: '14px',
          boxShadow: `0 8px 20px color-mix(in srgb, ${aColor} 35%, transparent)`,
        }}
        className={`w-full flex items-center justify-center gap-2 text-sm font-medium tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-95 active:scale-[0.98] cursor-pointer font-sans ${className}`}
        {...props}
      >
        {icon}
        <span>{children}</span>
      </button>
    </div>
  );
};
