'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { Radio, PlusCircle, Send, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { LiveBlog, Category, Reporter } from '@/lib/types';
import Link from 'next/link';

export default function AdminLiveBlogsPage() {
  const [liveBlogs, setLiveBlogs] = useState<LiveBlog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reporters, setReporters] = useState<Reporter[]>([]);
  const [loading, setLoading] = useState(true);

  // New Blog Form
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogSummary, setNewBlogSummary] = useState('');
  const [newBlogCategory, setNewBlogCategory] = useState('');
  const [newBlogReporter, setNewBlogReporter] = useState('');

  // New Update Form
  const [selectedBlogId, setSelectedBlogId] = useState('');
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateContent, setUpdateContent] = useState('');
  const [updateImage, setUpdateImage] = useState('');
  const [isKeyEvent, setIsKeyEvent] = useState(false);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [resBlogs, resCats, resReps] = await Promise.all([
        fetch('/api/live-blogs').then((r) => r.json()),
        fetch('/api/categories').then((r) => r.json()),
        fetch('/api/reporters').then((r) => r.json()),
      ]);

      if (resBlogs.liveBlogs) {
        setLiveBlogs(resBlogs.liveBlogs);
        if (resBlogs.liveBlogs.length > 0) {
          setSelectedBlogId(resBlogs.liveBlogs[0].id);
        }
      }
      if (resCats.categories) {
        setCategories(resCats.categories);
        setNewBlogCategory(resCats.categories[0]?.id || '');
      }
      if (resReps.reporters) {
        setReporters(resReps.reporters);
        setNewBlogReporter(resReps.reporters[0]?.id || '');
      }
    } catch (e) {
      //
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateBlog(e: React.FormEvent) {
    e.preventDefault();
    if (!newBlogTitle || !newBlogSummary) return;

    try {
      const res = await fetch('/api/live-blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newBlogTitle,
          summary: newBlogSummary,
          category_id: newBlogCategory,
          reporter_id: newBlogReporter,
          status: 'ACTIVE',
        }),
      });

      if (res.ok) {
        setFeedback({ type: 'success', text: 'Live Blog created successfully.' });
        setNewBlogTitle('');
        setNewBlogSummary('');
        await loadData();
      } else {
        const d = await res.json();
        setFeedback({ type: 'error', text: d.error || 'Failed to create blog.' });
      }
    } catch (e) {
      setFeedback({ type: 'error', text: 'Network error.' });
    }
  }

  async function handlePostUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedBlogId || !updateTitle || !updateContent) return;

    try {
      const res = await fetch(`/api/live-blogs/${selectedBlogId}/updates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: updateTitle,
          content: updateContent,
          image_url: updateImage,
          is_key_event: isKeyEvent ? 1 : 0,
        }),
      });

      if (res.ok) {
        setFeedback({ type: 'success', text: 'Live update dispatched to readers in real time.' });
        setUpdateTitle('');
        setUpdateContent('');
        setUpdateImage('');
        setIsKeyEvent(false);
      } else {
        const d = await res.json();
        setFeedback({ type: 'error', text: d.error || 'Failed to post update.' });
      }
    } catch (e) {
      setFeedback({ type: 'error', text: 'Post update error.' });
    }
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 font-sans text-xs">
      <AdminHeader
        title="Live Blog Operations"
        subtitle="Manage breaking live event coverages and publish real-time timestamped updates."
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

        {/* Dual Column Layout: Post Update to Active Blog (Left) & Create New Blog (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Post Update to Active Blog (7 cols) */}
          <div className="lg:col-span-7 bg-[#121925] p-6 border border-[#252D39] rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#252D39] pb-3">
              <div className="flex items-center space-x-2 text-[#E50914] font-bold uppercase text-[11px] tracking-wider">
                <Radio className="w-4 h-4 animate-pulse" />
                <span>Post Real-Time Update</span>
              </div>
              <span className="text-[11px] text-[#707B8B]">Pushed to client feeds immediately</span>
            </div>

            <form onSubmit={handlePostUpdate} className="space-y-4">
              <div>
                <label className="block font-semibold text-[#A4ADBB] mb-1">Target Live Blog *</label>
                <select
                  value={selectedBlogId}
                  onChange={(e) => setSelectedBlogId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0E131C] border border-[#252D39] text-[#F5F7FA] rounded-lg focus:outline-none focus:border-[#E50914] text-xs cursor-pointer"
                >
                  {liveBlogs.map((b) => (
                    <option key={b.id} value={b.id}>
                      [{b.status}] {b.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#A4ADBB] mb-1">Update Headline *</label>
                <input
                  type="text"
                  value={updateTitle}
                  onChange={(e) => setUpdateTitle(e.target.value)}
                  placeholder="e.g. Finance Ministry Concludes Tripartite Deliberations"
                  required
                  className="w-full px-3 py-2 bg-[#0E131C] border border-[#252D39] text-[#F5F7FA] placeholder-[#707B8B] rounded-lg focus:outline-none focus:border-[#E50914] text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#A4ADBB] mb-1">Update Text *</label>
                <textarea
                  rows={4}
                  value={updateContent}
                  onChange={(e) => setUpdateContent(e.target.value)}
                  placeholder="The text of the live dispatch from the floor..."
                  required
                  className="w-full px-3 py-2 bg-[#0E131C] border border-[#252D39] text-[#F5F7FA] placeholder-[#707B8B] rounded-lg focus:outline-none focus:border-[#E50914] text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#A4ADBB] mb-1">Optional Photo URL</label>
                <input
                  type="text"
                  value={updateImage}
                  onChange={(e) => setUpdateImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-[#0E131C] border border-[#252D39] text-[#F5F7FA] placeholder-[#707B8B] rounded-lg focus:outline-none focus:border-[#E50914] text-xs"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="key-event-check"
                  checked={isKeyEvent}
                  onChange={(e) => setIsKeyEvent(e.target.checked)}
                  className="rounded bg-[#0E131C] border-[#252D39] text-[#E50914] focus:ring-0"
                />
                <label htmlFor="key-event-check" className="font-semibold text-[#E50914] cursor-pointer">
                  Mark as Key Event / Major Milestone
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#E50914] hover:bg-[#b80710] text-white font-bold uppercase tracking-wider text-xs rounded-lg transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish Update to Live Stream</span>
              </button>
            </form>
          </div>

          {/* Create New Live Blog (5 cols) */}
          <div className="lg:col-span-5 bg-[#121925] p-6 border border-[#252D39] rounded-xl space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-widest text-[#F5F7FA] border-b border-[#252D39] pb-2">
              Start New Live Blog
            </h3>

            <form onSubmit={handleCreateBlog} className="space-y-4">
              <div>
                <label className="block font-semibold text-[#A4ADBB] mb-1">Event Title *</label>
                <input
                  type="text"
                  value={newBlogTitle}
                  onChange={(e) => setNewBlogTitle(e.target.value)}
                  placeholder="e.g. State Assembly Budget Debate 2026: Live"
                  required
                  className="w-full px-3 py-2 bg-[#0E131C] border border-[#252D39] text-[#F5F7FA] placeholder-[#707B8B] rounded-lg focus:outline-none focus:border-[#E50914] text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#A4ADBB] mb-1">Summary / Context *</label>
                <textarea
                  rows={3}
                  value={newBlogSummary}
                  onChange={(e) => setNewBlogSummary(e.target.value)}
                  placeholder="Live overview of ministerial announcements, bills tabled, and amendments..."
                  required
                  className="w-full px-3 py-2 bg-[#0E131C] border border-[#252D39] text-[#F5F7FA] placeholder-[#707B8B] rounded-lg focus:outline-none focus:border-[#E50914] text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#A4ADBB] mb-1">Desk Section</label>
                <select
                  value={newBlogCategory}
                  onChange={(e) => setNewBlogCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0E131C] border border-[#252D39] text-[#F5F7FA] rounded-lg focus:outline-none focus:border-[#E50914] text-xs cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#A4ADBB] mb-1">Lead Anchor / Correspondent</label>
                <select
                  value={newBlogReporter}
                  onChange={(e) => setNewBlogReporter(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0E131C] border border-[#252D39] text-[#F5F7FA] rounded-lg focus:outline-none focus:border-[#E50914] text-xs cursor-pointer"
                >
                  {reporters.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#075DEB] hover:bg-[#064bc0] text-white font-bold uppercase tracking-wider text-xs rounded-lg transition cursor-pointer"
              >
                Initialize Live Blog
              </button>
            </form>
          </div>
        </div>

        {/* Existing Live Blogs List */}
        <div className="bg-[#121925] border border-[#252D39] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#252D39] font-bold uppercase tracking-wider text-xs text-[#A4ADBB] flex items-center justify-between">
            <span>Active and Concluded Live Coverages</span>
            <span className="text-[#E50914] font-mono text-xs">{liveBlogs.length} Events</span>
          </div>

          <div className="divide-y divide-[#252D39]">
            {liveBlogs.map((b) => (
              <div key={b.id} className="p-4 flex items-center justify-between gap-4 hover:bg-[#1B2432]/50 transition">
                <div>
                  <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider mb-1">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        b.status === 'ACTIVE'
                          ? 'bg-[#E50914] text-white'
                          : 'bg-[#1B2432] text-[#A4ADBB] border border-[#252D39]'
                      }`}
                    >
                      {b.status}
                    </span>
                    <span className="text-[#707B8B]">Started {new Date(b.started_at).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-base font-bold text-[#F5F7FA]">
                    {b.title}
                  </h4>
                  <p className="text-xs text-[#A4ADBB] line-clamp-1 mt-0.5">{b.summary}</p>
                </div>
                <div className="flex items-center space-x-3 shrink-0">
                  <Link
                    href={`/live/${b.slug}`}
                    target="_blank"
                    className="font-bold text-[#075DEB] hover:underline"
                  >
                    View Public Live Feed →
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
