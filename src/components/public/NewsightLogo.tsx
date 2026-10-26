import React from 'react';
import Link from 'next/link';

interface NewsightLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function NewsightLogo({ className = '', size = 'md' }: NewsightLogoProps) {
  const heightClasses = {
    sm: 'h-6 sm:h-7',
    md: 'h-8 sm:h-9',
    lg: 'h-10 sm:h-12'
  }[size];

  return (
    <Link 
      href="/" 
      className={`inline-flex items-center select-none group shrink-0 ${className}`}
      aria-label="NEWSIGHT Home"
    >
      <img
        src="/logo.png"
        alt="NEWSIGHT"
        className={`${heightClasses} w-auto object-contain transition-transform duration-200 group-hover:scale-105`}
      />
    </Link>
  );
}
