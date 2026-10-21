'use client';

import React from 'react';
import Link from 'next/link';
import { PlusCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { UserRole } from '@/lib/types';

import ThemeToggle from '@/components/public/ThemeToggle';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  userRole?: UserRole;
  actions?: React.ReactNode;
}

export default function AdminHeader({
  title,
  subtitle,
  userRole,
  actions,
}: AdminHeaderProps) {
  return (
    <header className="bg-[#0A0E15] border-b border-[#252D39] px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 font-sans rounded-xl mb-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-[#A4ADBB] mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {actions}
        <ThemeToggle />
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#A4ADBB] bg-[#121925] hover:bg-[#1B2432] hover:text-white border border-[#252D39] rounded-lg transition"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>View Live Site</span>
        </Link>
      </div>
    </header>
  );
}
