'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { Users, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { Reporter } from '@/lib/types';
import Link from 'next/link';

export default function AdminReportersPage() {
  const [reporters, setReporters] = useState<Reporter[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [beat, setBeat] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [email, setEmail] = useState('');
  const [twitter, setTwitter] = useState('');
  const [linkedin, setLinkedin] = useState('');

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadReporters();
  }, []);

  async function loadReporters() {
    setLoading(true);
    try {
      const res = await fetch('/api/reporters');
      const data = await res.json();
      if (data.reporters) setReporters(data.reporters);
    } catch (e) {
      //
    } finally {
      setLoading(false);
    }
  }

  async function handleAddReporter(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !title || !beat) return;

    try {
      const res = await fetch('/api/reporters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          title,
          beat,
          bio,
          avatar_url: avatarUrl,
          email,
          twitter,
          linkedin,
        }),
      });

      if (res.ok) {
        setFeedback({ type: 'success', text: 'Journalist added to newsroom roster.' });
        setName('');
        setTitle('');
        setBeat('');
        setBio('');
        setAvatarUrl('');
        setEmail('');
        setTwitter('');
        setLinkedin('');
        await loadReporters();
      } else {
        const d = await res.json();
        setFeedback({ type: 'error', text: d.error || 'Failed to add reporter.' });
      }
    } catch (e) {
      setFeedback({ type: 'error', text: 'Network communication error.' });
    }
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 font-sans text-xs">
      <AdminHeader
        title="Journalist Directory & Staff Management"
        subtitle="Manage correspondent bylines, beats, editorial profiles, and accreditation."
      />

      <div className="p-6 space-y-8">
        {feedback && (
          <div
            className={`p-4 rounded-lg border flex items-center space-x-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                : 'bg-red-950/40 border-red-500/40 text-red-400'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Add Reporter Form */}
        <div className="bg-[#121925] p-6 border border-[#252D39] rounded-xl space-y-4">
          <h2 className="text-base font-bold text-[#F5F7FA] border-b border-[#252D39] pb-3 mb-4">
            Register New Staff Journalist / Correspondent
          </h2>

          <form onSubmit={handleAddReporter} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-[#A4ADBB] mb-1">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rohini Swamy"
                  required
                  className="w-full px-3 py-2 bg-[#0E131C] border border-[#252D39] text-[#F5F7FA] placeholder-[#707B8B] rounded-lg focus:outline-none focus:border-[#E50914] font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#A4ADBB] mb-1">Designation *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Political Correspondent"
                  required
                  className="w-full px-3 py-2 bg-[#0E131C] border border-[#252D39] text-[#F5F7FA] placeholder-[#707B8B] rounded-lg focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#A4ADBB] mb-1">Editorial Beat *</label>
                <input
                  type="text"
                  value={beat}
                  onChange={(e) => setBeat(e.target.value)}
                  placeholder="e.g. Parliament & Governance"
                  required
                  className="w-full px-3 py-2 bg-[#0E131C] border border-[#252D39] text-[#F5F7FA] placeholder-[#707B8B] rounded-lg focus:outline-none focus:border-[#E50914]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-[#A4ADBB] mb-1">Staff Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="journalist@newsight.media"
                  className="w-full px-3 py-2 bg-[#0E131C] border border-[#252D39] text-[#F5F7FA] placeholder-[#707B8B] rounded-lg focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#A4ADBB] mb-1">Profile Photo URL</label>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-[#0E131C] border border-[#252D39] text-[#F5F7FA] placeholder-[#707B8B] rounded-lg focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#A4ADBB] mb-1">Twitter / X Handle</label>
                <input
                  type="text"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="@handle"
                  className="w-full px-3 py-2 bg-[#0E131C] border border-[#252D39] text-[#F5F7FA] placeholder-[#707B8B] rounded-lg focus:outline-none focus:border-[#E50914]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#A4ADBB] mb-1">Professional Biography</label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Experience, past beats, awards, and areas of reporting specialization..."
                className="w-full px-3 py-2 bg-[#0E131C] border border-[#252D39] text-[#F5F7FA] placeholder-[#707B8B] rounded-lg focus:outline-none focus:border-[#E50914]"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#E50914] hover:bg-[#b80710] text-white font-bold uppercase tracking-wider text-xs rounded-lg transition cursor-pointer"
            >
              Add Staff Journalist
            </button>
          </form>
        </div>

        {/* Roster Table */}
        <div className="bg-[#121925] border border-[#252D39] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#252D39] font-bold uppercase tracking-wider text-xs text-[#A4ADBB] flex items-center justify-between">
            <span>Active Newsroom Correspondents</span>
            <span className="text-[#E50914] font-mono">{reporters.length} Journalists</span>
          </div>

          <div className="divide-y divide-[#252D39]">
            {reporters.map((rep) => (
              <div key={rep.id} className="p-4 flex items-center justify-between gap-4 hover:bg-[#1B2432]/50 transition">
                <div className="flex items-center space-x-4">
                  <img
                    src={rep.avatar_url}
                    alt={rep.name}
                    className="w-12 h-12 rounded-full object-cover border border-[#252D39] shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#E50914]">
                      {rep.beat}
                    </span>
                    <h3 className="font-bold text-[#F5F7FA] text-sm">{rep.name}</h3>
                    <span className="text-[#707B8B] text-[11px] block">{rep.title}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <Link
                    href={`/reporters/${rep.slug}`}
                    target="_blank"
                    className="font-semibold text-[#075DEB] hover:underline"
                  >
                    View Bylines Archive →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
