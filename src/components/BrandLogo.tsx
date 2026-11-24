import React from 'react';

interface BrandLogoProps {
  accentColor?: string;
  textColor?: string;
  size?: number;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-center select-none ${className}`}>
      <img
        src="/images/typhoon-logo.png"
        alt="Typhoon Solar System"
        className="h-8 sm:h-9 w-auto max-w-[150px] sm:max-w-[170px] object-contain drop-shadow-xs"
      />
    </div>
  );
};

