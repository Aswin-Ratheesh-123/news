import React from 'react';
import Link from 'next/link';

interface NewsightLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function NewsightLogo({ className = '', size = 'md' }: NewsightLogoProps) {
  const sizeClasses = {
    sm: 'text-base sm:text-lg tracking-tight',
    md: 'text-xl sm:text-2xl tracking-tighter',
    lg: 'text-2xl sm:text-4xl tracking-tighter'
  }[size];

  return (
    <Link 
      href="/" 
      className={`inline-flex items-center gap-1.5 font-black uppercase select-none group ${className}`}
      aria-label="NEWSIGHT Home"
    >
      <span className="flex items-center">
        <span className={`text-white font-extrabold ${sizeClasses}`}>NEW</span>
        <span className={`text-[#E50914] font-black ${sizeClasses}`}>SIGHT</span>
      </span>
      {/* Editorial Live Dot / Camera Aperture Accent */}
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E50914] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E50914]"></span>
      </span>
    </Link>
  );
}
