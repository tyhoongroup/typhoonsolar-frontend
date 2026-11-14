'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, X, Shield, Phone, Clock, UserCheck, RefreshCw } from 'lucide-react';
import { getRoleTheme } from '@/lib/role-theme';
import { toast } from 'sonner';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: {
    fullName?: string;
    role?: string;
    phone?: string;
    email?: string;
  } | null;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user: initialUser,
}) => {
  const router = useRouter();
  const [localUser, setLocalUser] = React.useState<any>(null);

  React.useEffect(() => {
    if (!initialUser) {
      try {
        const stored = localStorage.getItem('user');
        if (stored) setLocalUser(JSON.parse(stored));
      } catch {}
    }
  }, [initialUser, isOpen]);

  const user = initialUser || localUser;

  if (!isOpen) return null;

  const theme = getRoleTheme(user?.role);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    toast.success('Signed out successfully');
    onClose();
    router.push('/');
  };

  const handleSwitchAccount = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('typhoon_saved_profile');
    toast.info('Switched account. Please choose or enter your credentials.');
    onClose();
    router.push('/');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] max-w-sm w-full p-6 shadow-2xl border border-typhoon-border relative overflow-hidden">
        {/* Top Decorative Role Band */}
        <div
          style={{ backgroundColor: theme.hex.headerBg }}
          className="h-20 -mx-6 -mt-6 p-4 flex items-center justify-between text-white relative"
        >
          <div className="flex items-center gap-2">
            <span
              style={{ color: theme.hex.accentBg }}
              className="text-[10px] font-bold tracking-widest uppercase"
            >
              TYPHOON SOLAR · PROFILE
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Avatar Circle */}
        <div className="text-center -mt-10 relative z-10">
          <div
            style={{
              backgroundColor: theme.hex.headerBg,
              borderColor: theme.hex.accentBg,
              color: theme.hex.accentBg,
            }}
            className="w-20 h-20 rounded-full mx-auto flex items-center justify-center font-serif text-2xl font-bold shadow-lg border-4"
          >
            {theme.tag}
          </div>

          <h3 className="text-xl font-serif font-bold text-typhoon-navy mt-3 tracking-tight">
            {user.fullName || 'Staff User'}
          </h3>

          <div className="mt-1">
            <span
              style={{
                backgroundColor: theme.hex.lightBg,
                color: theme.hex.lightText,
                borderColor: theme.hex.lightBorder,
              }}
              className="inline-block px-3 py-0.5 rounded-full text-xs font-bold border"
            >
              {theme.roleName}
            </span>
          </div>

          {user.phone && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-typhoon-muted font-medium mt-2">
              <Phone className="w-3.5 h-3.5" />
              <span>+91 {user.phone.replace(/\D/g, '')}</span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-typhoon-border/70 my-5" />

        {/* Actions */}
        <div className="space-y-2.5">
          <button
            onClick={handleLogout}
            className="w-full py-3.5 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs tracking-wide border border-rose-200 flex items-center justify-center gap-2 transition"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            <span>Sign Out / Logout</span>
          </button>

          <button
            onClick={handleSwitchAccount}
            className="w-full py-3 px-4 rounded-2xl bg-typhoon-sand hover:bg-typhoon-sand-dark text-typhoon-navy font-semibold text-xs tracking-wide border border-typhoon-border flex items-center justify-center gap-2 transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-typhoon-muted" />
            <span>Switch Profile / Another Number</span>
          </button>
        </div>

        {/* Footer info */}
        <div className="text-center mt-4 text-[10px] text-typhoon-muted">
          <span>Typhoon Solar Rooftop Platform · PWA v1.0</span>
        </div>
      </div>
    </div>
  );
};
