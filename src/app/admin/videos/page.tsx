'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { Video, Plus, CheckCircle2, AlertCircle, Play, ExternalLink, Trash2, Film } from 'lucide-react';
import { VideoItem, Reporter, Show } from '@/lib/types';
import Link from 'next/link';

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [reporters, setReporters] = useState<Reporter[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [duration, setDuration] = useState('08:30');
  const [category, setCategory] = useState('Ground Report');
  const [reporterId, setReporterId] = useState('');
  const [showId, setShowId] = useState('');
  const [videoType, setVideoType] = useState<'REPORT' | 'INTERVIEW' | 'DOCUMENTARY' | 'EXPLAINER' | 'CLASSIC'>('REPORT');
  const [isFeatured, setIsFeatured] = useState(false);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [resVids, resReps, resShows] = await Promise.all([
        fetch('/api/videos').then((r) => r.json()),
        fetch('/api/reporters').then((r) => r.json()),
        fetch('/api/shows').then((r) => r.json()),
      ]);

      if (resVids.videos) setVideos(resVids.videos);
      if (resReps.reporters) {
        setReporters(resReps.reporters);
        setReporterId(resReps.reporters[0]?.id || '');
      }
      if (resShows.shows) setShows(resShows.shows);
    } catch (_) {
      //
    } finally {
      setLoading(false);
    }
  }

  async function handleAddVideo(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !videoUrl) return;

    try {
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          summary,
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80',
          duration,
          category,
          reporter_id: reporterId || null,
          show_id: showId || null,
          video_type: videoType,
          is_featured: isFeatured ? 1 : 0,
        }),
      });

      if (res.ok) {
        setFeedback({ type: 'success', text: `Video report "${title}" published successfully.` });
        setTitle('');
        setSummary('');
        setVideoUrl('');
        setThumbnailUrl('');
        setIsFeatured(false);
        await loadData();
      } else {
        const d = await res.json();
        setFeedback({ type: 'error', text: d.error || 'Failed to publish video.' });
      }
    } catch (_) {
      setFeedback({ type: 'error', text: 'Network communication error.' });
    }
  }

  async function handleDeleteVideo(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete video "${name}"?`)) return;

    try {
      const res = await fetch(`/api/videos?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setFeedback({ type: 'success', text: `Video "${name}" removed.` });
        await loadData();
      }
    } catch (_) {
      setFeedback({ type: 'error', text: 'Failed to delete video.' });
    }
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 font-sans text-xs space-y-6">
      <AdminHeader
        title="Video Journalism & Broadcast Management"
        subtitle="Publish field dispatches, longform documentaries, associate with prime time shows, and configure homepage video slots."
      />

      <div className="space-y-6">
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
          
          {/* Published Videos List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-2xl bg-[#0E131C] border border-[#252D39]">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#E50914]" />
                  <span>Published Video Library ({videos.length})</span>
                </span>
              </h3>

              {loading ? (
                <p className="text-xs text-[#707B8B]">Loading dispatches...</p>
              ) : videos.length === 0 ? (
                <p className="text-xs text-[#707B8B]">No videos currently published.</p>
              ) : (
                <div className="space-y-3 max-h-[680px] overflow-y-auto pr-1">
                  {videos.map((vid) => (
                    <div
                      key={vid.id}
                      className="p-3.5 rounded-xl bg-[#121925] border border-[#252D39] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-20 aspect-video bg-black rounded-lg overflow-hidden shrink-0 border border-[#252D39]">
                          <img
                            src={vid.thumbnail_url}
                            alt={vid.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 bg-black/80 text-[8px] font-mono text-white rounded">
                            {vid.duration}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-1.5 py-0.5 bg-[#E50914] text-white text-[9px] font-bold uppercase rounded">
                              {vid.category}
                            </span>
                            {vid.is_featured === 1 && (
                              <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[9px] font-bold uppercase rounded">
                                FEATURED
                              </span>
                            )}
                            {vid.show_title && (
                              <span className="text-[10px] text-[#075DEB] font-semibold">
                                Show: {vid.show_title}
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-bold text-white line-clamp-1 mt-1">
                            {vid.title}
                          </h4>
                          <span className="text-[10px] text-[#707B8B] block">
                            {vid.reporter_name || 'Desk Staff'} • {vid.views_count || 0} views
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <Link
                          href={`/video/${vid.slug}`}
                          target="_blank"
                          className="p-2 bg-[#0E131C] hover:bg-[#1B2432] text-[#A4ADBB] hover:text-white border border-[#252D39] rounded-lg transition-colors"
                          title="Watch Video"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteVideo(vid.id, vid.title)}
                          className="p-2 bg-red-950/30 hover:bg-red-900/50 text-red-400 border border-red-900/40 rounded-lg transition-colors"
                          title="Delete Video"
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

          {/* Upload / Create Video Form (5 cols) */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-2xl bg-[#0E131C] border border-[#252D39] space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#075DEB]" />
                <span>Publish New Video Report</span>
              </h3>

              <form onSubmit={handleAddVideo} className="space-y-3 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-[#A4ADBB] block mb-1">Headline *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Clear editorial headline..."
                    className="w-full px-3 py-2 bg-[#121925] border border-[#252D39] rounded-lg text-white placeholder-[#707B8B] focus:outline-none focus:border-[#075DEB]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#A4ADBB] block mb-1">Summary / Deck</label>
                  <textarea
                    rows={2}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Executive brief of the visual dispatch..."
                    className="w-full px-3 py-2 bg-[#121925] border border-[#252D39] rounded-lg text-white placeholder-[#707B8B] focus:outline-none focus:border-[#075DEB]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#A4ADBB] block mb-1">Video Stream URL (MP4 / HLS) *</label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    required
                    placeholder="https://commondatastorage.googleapis.com/.../video.mp4"
                    className="w-full px-3 py-2 bg-[#121925] border border-[#252D39] rounded-lg text-white placeholder-[#707B8B] focus:outline-none focus:border-[#075DEB]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#A4ADBB] block mb-1">Poster Thumbnail URL</label>
                  <input
                    type="url"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-[#121925] border border-[#252D39] rounded-lg text-white placeholder-[#707B8B] focus:outline-none focus:border-[#075DEB]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#A4ADBB] block mb-1">Duration (MM:SS)</label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="08:30"
                      className="w-full px-3 py-2 bg-[#121925] border border-[#252D39] rounded-lg text-white font-mono focus:outline-none focus:border-[#075DEB]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#A4ADBB] block mb-1">Category Desk</label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Ground Report, Politics, Tech..."
                      className="w-full px-3 py-2 bg-[#121925] border border-[#252D39] rounded-lg text-white focus:outline-none focus:border-[#075DEB]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#A4ADBB] block mb-1">Associate Show</label>
                    <select
                      value={showId}
                      onChange={(e) => setShowId(e.target.value)}
                      className="w-full px-3 py-2 bg-[#121925] border border-[#252D39] rounded-lg text-white focus:outline-none focus:border-[#075DEB]"
                    >
                      <option value="">No Program (Standalone)</option>
                      {shows.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#A4ADBB] block mb-1">Reporter</label>
                    <select
                      value={reporterId}
                      onChange={(e) => setReporterId(e.target.value)}
                      className="w-full px-3 py-2 bg-[#121925] border border-[#252D39] rounded-lg text-white focus:outline-none focus:border-[#075DEB]"
                    >
                      <option value="">Desk / Anonymous</option>
                      {reporters.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="rounded border-[#252D39] text-[#E50914] focus:ring-0"
                    />
                    <span className="text-xs font-bold text-white">Feature in Hero Video Slot</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#E50914] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 mt-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Video Report</span>
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
