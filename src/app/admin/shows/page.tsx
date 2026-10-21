'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { Film, Plus, Trash2, CheckCircle2, AlertCircle, ExternalLink, Calendar, User } from 'lucide-react';
import { Show } from '@/lib/types';
import Link from 'next/link';

export default function AdminShowsPage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [hostName, setHostName] = useState('');
  const [scheduleInfo, setScheduleInfo] = useState('');
  const [orderIndex, setOrderIndex] = useState(0);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadShows();
  }, []);

  async function loadShows() {
    setLoading(true);
    try {
      const res = await fetch('/api/shows');
      const data = await res.json();
      if (data.shows) setShows(data.shows);
    } catch (_) {
      //
    } finally {
      setLoading(false);
    }
  }

  async function handleAddShow(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !description) return;

    try {
      const res = await fetch('/api/shows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          cover_image: coverImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80',
          banner_image: bannerImage,
          host_name: hostName,
          schedule_info: scheduleInfo,
          order_index: orderIndex
        }),
      });

      if (res.ok) {
        setFeedback({ type: 'success', text: `Show "${title}" registered successfully.` });
        setTitle('');
        setDescription('');
        setCoverImage('');
        setBannerImage('');
        setHostName('');
        setScheduleInfo('');
        loadShows();
      } else {
        const d = await res.json();
        setFeedback({ type: 'error', text: d.error || 'Failed to create program.' });
      }
    } catch (_) {
      setFeedback({ type: 'error', text: 'Network error creating program.' });
    }
  }

  async function handleDeleteShow(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"? Associated videos will be unlinked.`)) return;

    try {
      const res = await fetch(`/api/shows?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setFeedback({ type: 'success', text: `Show "${name}" removed.` });
        loadShows();
      }
    } catch (_) {
      setFeedback({ type: 'error', text: 'Failed to delete show.' });
    }
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Shows & Programs Management"
        subtitle="Configure editorial broadcasts, weekly investigations, prime time lineups, and series."
      />

      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center gap-2 text-xs ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Shows List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-[#0E131C] border border-[#252D39]">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Film className="w-4 h-4 text-[#075DEB]" />
              <span>Current Programs ({shows.length})</span>
            </h3>

            {loading ? (
              <p className="text-xs text-[#707B8B]">Loading broadcast lineup...</p>
            ) : shows.length === 0 ? (
              <p className="text-xs text-[#707B8B]">No shows configured. Create one below.</p>
            ) : (
              <div className="space-y-3">
                {shows.map((show) => (
                  <div
                    key={show.id}
                    className="p-4 rounded-xl bg-[#121925] border border-[#252D39] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 h-12 bg-black rounded-lg overflow-hidden shrink-0 border border-[#252D39]">
                        <img
                          src={show.cover_image}
                          alt={show.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white">{show.title}</h4>
                          <span className="text-[10px] text-[#707B8B] font-mono">
                            Order: #{show.order_index}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#A4ADBB] line-clamp-1 mt-0.5">
                          {show.description}
                        </p>
                        <div className="flex items-center gap-3 text-[10px] text-[#707B8B] mt-1">
                          {show.host_name && <span>Host: {show.host_name}</span>}
                          {show.schedule_info && <span>• {show.schedule_info}</span>}
                          <span>• {show.episode_count || 0} Episodes</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/shows/${show.slug}`}
                        target="_blank"
                        className="p-2 bg-[#0E131C] hover:bg-[#1B2432] text-[#A4ADBB] hover:text-white border border-[#252D39] rounded-lg transition-colors"
                        title="View Public Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteShow(show.id, show.title)}
                        className="p-2 bg-red-950/30 hover:bg-red-900/50 text-red-400 border border-red-900/40 rounded-lg transition-colors"
                        title="Delete Show"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Create Show Form (5 cols) */}
        <div className="lg:col-span-5">
          <div className="p-6 rounded-2xl bg-[#0E131C] border border-[#252D39] space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#075DEB]" />
              <span>Create New Program</span>
            </h3>

            <form onSubmit={handleAddShow} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-[#A4ADBB] block mb-1">
                  Program Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Ground Report"
                  required
                  className="w-full px-3 py-2 bg-[#121925] border border-[#252D39] rounded-lg text-white placeholder-[#707B8B] focus:outline-none focus:border-[#075DEB]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#A4ADBB] block mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief synopsis of the format and editorial mandate..."
                  required
                  className="w-full px-3 py-2 bg-[#121925] border border-[#252D39] rounded-lg text-white placeholder-[#707B8B] focus:outline-none focus:border-[#075DEB]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#A4ADBB] block mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-[#121925] border border-[#252D39] rounded-lg text-white placeholder-[#707B8B] focus:outline-none focus:border-[#075DEB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#A4ADBB] block mb-1">
                    Presenter / Anchor
                  </label>
                  <input
                    type="text"
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    placeholder="e.g. Siddharth Nair"
                    className="w-full px-3 py-2 bg-[#121925] border border-[#252D39] rounded-lg text-white placeholder-[#707B8B] focus:outline-none focus:border-[#075DEB]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#A4ADBB] block mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={orderIndex}
                    onChange={(e) => setOrderIndex(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#121925] border border-[#252D39] rounded-lg text-white focus:outline-none focus:border-[#075DEB]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#A4ADBB] block mb-1">
                  Broadcast Schedule Slot
                </label>
                <input
                  type="text"
                  value={scheduleInfo}
                  onChange={(e) => setScheduleInfo(e.target.value)}
                  placeholder="e.g. Weeknights at 9:00 PM IST"
                  className="w-full px-3 py-2 bg-[#121925] border border-[#252D39] rounded-lg text-white placeholder-[#707B8B] focus:outline-none focus:border-[#075DEB]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#075DEB] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 mt-2"
              >
                <Plus className="w-4 h-4" />
                <span>Save & Launch Show</span>
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
