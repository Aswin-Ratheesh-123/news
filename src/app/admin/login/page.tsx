'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import NewsightLogo from '@/components/public/NewsightLogo';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'Invalid newsroom credentials.');
      }
    } catch (_) {
      setError('Network connection error.');
    } finally {
      setLoading(false);
    }
  }

  function prefillCredentials(role: 'admin' | 'reporter') {
    if (role === 'admin') {
      setEmail('editor@dailysignal.com');
      setPassword('Newsroom2026!');
    } else {
      setEmail('ayesha.sen@dailysignal.com');
      setPassword('Reporter2026!');
    }
  }

  return (
    <div className="min-h-screen bg-[#080B11] text-[#F5F7FA] flex flex-col justify-center items-center px-4 py-12 font-sans">
      
      {/* Brand Header */}
      <div className="text-center mb-8 space-y-2">
        <NewsightLogo size="lg" />
        <h2 className="text-sm font-bold text-[#A4ADBB] uppercase tracking-widest block pt-2">
          NEWSROOM EDITORIAL CMS PORTAL
        </h2>
        <p className="text-xs text-[#707B8B] max-w-sm mx-auto">
          Authorized access point for senior editors, broadcast anchors, desk staff, and video journalists.
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#0E131C] border border-[#252D39] p-8 rounded-2xl shadow-2xl space-y-6">
        
        {error && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="text-[11px] font-bold text-[#A4ADBB] uppercase tracking-wider block mb-1">
              Staff Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="editor@newsight.media"
                className="w-full pl-9 pr-3 py-2.5 bg-[#121925] border border-[#252D39] rounded-lg text-white placeholder-[#707B8B] focus:outline-none focus:border-[#075DEB]"
              />
              <Mail className="w-4 h-4 text-[#707B8B] absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#A4ADBB] uppercase tracking-wider block mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-[#121925] border border-[#252D39] rounded-lg text-white placeholder-[#707B8B] focus:outline-none focus:border-[#075DEB]"
              />
              <Lock className="w-4 h-4 text-[#707B8B] absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#075DEB] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Operations'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Credentials Quick Autofill */}
        <div className="pt-4 border-t border-[#252D39] text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#707B8B] block mb-2">
            Demonstration Newsroom Credentials
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => prefillCredentials('admin')}
              className="p-2 bg-[#121925] hover:bg-[#1B2432] border border-[#252D39] text-[#A4ADBB] hover:text-white rounded-lg text-left"
            >
              <strong className="block text-white text-[11px]">Super Admin / Editor</strong>
              <span className="text-[9.5px] text-[#707B8B]">Newsroom2026!</span>
            </button>
            <button
              type="button"
              onClick={() => prefillCredentials('reporter')}
              className="p-2 bg-[#121925] hover:bg-[#1B2432] border border-[#252D39] text-[#A4ADBB] hover:text-white rounded-lg text-left"
            >
              <strong className="block text-white text-[11px]">Field Journalist</strong>
              <span className="text-[9.5px] text-[#707B8B]">Reporter2026!</span>
            </button>
          </div>
        </div>

        <div className="pt-2 text-center">
          <Link href="/" className="text-xs text-[#075DEB] hover:underline font-semibold">
            ← Return to NEWSIGHT Broadcast
          </Link>
        </div>

      </div>
    </div>
  );
}
