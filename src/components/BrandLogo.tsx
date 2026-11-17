import React from 'react';

interface BrandLogoProps {
  accentColor: string;
  textColor: string;
  size?: number;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  accentColor,
  textColor,
  size = 24,
}) => {
  return (
    <div className="flex items-center gap-1.5 select-none">
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-none"
      >
        <rect x="2" y="2" width="9" height="9" rx="2" fill={accentColor} />
        <rect x="13" y="2" width="9" height="9" rx="2" fill={accentColor} fillOpacity="0.6" />
        <rect x="2" y="13" width="9" height="9" rx="2" fill={accentColor} fillOpacity="0.6" />
        <rect x="13" y="13" width="9" height="9" rx="2" fill={textColor} />
      </svg>
      <span
        style={{ color: textColor }}
        className="text-[10px] font-extrabold leading-[1.1] tracking-[0.04em] uppercase"
      >
        TYPHOON
        <br />
        SOLAR SYSTEM
      </span>
    </div>
  );
};
