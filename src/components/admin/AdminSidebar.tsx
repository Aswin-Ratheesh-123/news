'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, FileText, CheckSquare, Radio, Video, Film,
  Users, FolderTree, Image as ImageIcon, Mail, Settings, 
  ExternalLink, LogOut, ShieldAlert
} from 'lucide-react';
import { UserRole } from '@/lib/types';

interface AdminSidebarProps {
  userRole?: UserRole;
  userName?: string;
}

export default function AdminSidebar({ userRole, userName }: AdminSidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Articles', href: '/admin/articles', icon: FileText },
    { name: 'Video Journalism', href: '/admin/videos', icon: Video },
    { name: 'Shows & Programs', href: '/admin/shows', icon: Film },
    { name: 'Review Queue', href: '/admin/review-queue', icon: CheckSquare, badge: 'Workflow' },
    { name: 'Live Blogs', href: '/admin/live-blogs', icon: Radio },
    { name: 'Reporters & Staff', href: '/admin/reporters', icon: Users },
    { name: 'Categories & Desks', href: '/admin/categories', icon: FolderTree },
    { name: 'Media Library', href: '/admin/media', icon: ImageIcon },
    { name: 'Subscribers', href: '/admin/subscribers', icon: Mail },
    { name: 'Platform Settings', href: '/admin/settings', icon: Settings, adminOnly: true },
  ];

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }

  return (
    <aside className="w-64 bg-[#0A0E15] text-[#A4ADBB] flex flex-col shrink-0 min-h-screen border-r border-[#252D39] text-xs font-sans">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#252D39]">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-7 h-7 bg-[#E50914] text-white flex items-center justify-center font-black text-sm rounded">
            N
          </div>
          <div>
            <h1 className="font-bold text-sm text-white tracking-wider uppercase group-hover:text-[#E50914] transition">
              NEWSIGHT
            </h1>
            <span className="text-[10px] text-[#707B8B] font-mono tracking-widest block">
              EDITORIAL CMS
            </span>
          </div>
        </Link>
      </div>

      {/* User Status Strip */}
      <div className="px-5 py-3 bg-zinc-900/60 border-b border-zinc-800 flex items-center justify-between">
        <div className="overflow-hidden">
          <span className="font-semibold text-white block truncate">
            {userName || 'Staff Journalist'}
          </span>
          <span className="text-[10px] text-red-400 font-mono font-bold tracking-wider">
            {userRole || 'REPORTER'}
          </span>
        </div>
        <Link
          href="/"
          target="_blank"
          title="View Public Site"
          className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-3 py-2">
          Newsroom Management
        </div>
        {menuItems.map((item) => {
          if (item.adminOnly && userRole !== 'SUPER_ADMIN') return null;

          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-none font-medium transition ${
                isActive
                  ? 'bg-red-950/80 text-white border-l-3 border-red-600 font-semibold'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-red-400' : 'text-zinc-400'}`} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="bg-red-900/80 text-red-200 text-[9px] px-1.5 py-0.2 font-mono uppercase font-bold rounded">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-900/30">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition font-semibold"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Newsroom</span>
        </button>
      </div>
    </aside>
  );
}
