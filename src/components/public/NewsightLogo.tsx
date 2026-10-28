'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from './ThemeProvider';

interface NewsightLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  withBadge?: boolean;
}

export default function NewsightLogo({ 
  className = '', 
  size = 'md',
}: NewsightLogoProps) {
  const { theme, isMounted } = useTheme();
  const isLight = isMounted && theme === 'light';

  const heightClasses = {
    sm: 'h-6 sm:h-7',
    md: 'h-8 sm:h-9',
    lg: 'h-10 sm:h-12'
  }[size];

  const logoImg = (
    <img
      src="/logo.png"
      alt="NEWSIGHT"
      className={`${heightClasses} w-auto object-contain transition-transform duration-200 group-hover:scale-105`}
    />
  );

  return (
    <Link 
      href="/" 
      className={`inline-flex items-center select-none group shrink-0 ${className}`}
      aria-label="NEWSIGHT Home"
    >
      <div 
        className={`flex items-center transition-all duration-200 ${
          isLight 
            ? 'bg-black px-2.5 py-1 rounded-xl shadow-xs' 
            : 'bg-transparent'
        }`}
      >
        {logoImg}
      </div>
    </Link>
  );
}
