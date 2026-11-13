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
        className={`w-full py-4 px-6 rounded-2xl ${theme.accentBg} ${theme.accentHoverBg} ${theme.accentText} font-bold text-sm tracking-wide shadow-soft flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...props}
      >
        {icon}
        <span>{children}</span>
      </button>
    </div>
  );
};

