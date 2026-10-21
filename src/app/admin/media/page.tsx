'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { Image as ImageIcon, Upload, Copy, Check, Search, CheckCircle2, AlertCircle } from 'lucide-react';
import { MediaAsset } from '@/lib/types';

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [altText, setAltText] = useState('');
  const [caption, setCaption] = useState('');
  const [credit, setCredit] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadMedia();
  }, []);

  async function loadMedia() {
    setLoading(true);
    try {
      const res = await fetch('/api/media/upload');
      const data = await res.json();
      if (data.assets) setAssets(data.assets);
    } catch (e) {
      //
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFeedback(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('alt_text', altText);
      formData.append('caption', caption);
      formData.append('credit', credit);

      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setFeedback({ type: 'success', text: `Media asset "${file.name}" uploaded successfully.` });
        setAltText('');
        setCaption('');
        setCredit('');
        await loadMedia();
      } else {
        setFeedback({ type: 'error', text: data.error || 'Upload failed.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Network communication error.' });
    } finally {
      setUploading(false);
    }
  }

  function copyToClipboard(url: string, id: string) {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 font-sans text-xs">
      <AdminHeader
        title="Centralized Media Library"
        subtitle="Manage uploaded photographs, charts, infographics, and editorial image assets."
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

        {/* Upload Form */}
        <div className="bg-[#121925] p-6 border border-[#252D39] rounded-xl space-y-4">
          <h2 className="text-base font-bold text-[#F5F7FA] border-b border-[#252D39] pb-3 mb-4">
            Upload Image Asset
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block font-semibold text-[#A4ADBB] mb-1">Alt Text (Accessibility)</label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Descriptive text for screen readers..."
                className="w-full px-3 py-2 bg-[#0E131C] border border-[#252D39] text-[#F5F7FA] placeholder-[#707B8B] rounded-lg focus:outline-none focus:border-[#E50914] text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#A4ADBB] mb-1">Caption</label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Contextual description..."
                className="w-full px-3 py-2 bg-[#0E131C] border border-[#252D39] text-[#F5F7FA] placeholder-[#707B8B] rounded-lg focus:outline-none focus:border-[#E50914] text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#A4ADBB] mb-1">Photographer Credit</label>
              <input
                type="text"
                value={credit}
                onChange={(e) => setCredit(e.target.value)}
                placeholder="e.g. NEWSIGHT / Tarun Anand"
                className="w-full px-3 py-2 bg-[#0E131C] border border-[#252D39] text-[#F5F7FA] placeholder-[#707B8B] rounded-lg focus:outline-none focus:border-[#E50914] text-xs"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <label className="px-4 py-2 bg-[#E50914] text-white font-bold uppercase tracking-wider text-xs rounded-lg cursor-pointer hover:bg-[#b80710] transition flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>{uploading ? 'Processing Upload...' : 'Choose File to Upload'}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
            <span className="text-[#707B8B] text-[11px]">
              Supported: JPEG, PNG, WebP, AVIF (Max 10MB)
            </span>
          </div>
        </div>

        {/* Assets Grid */}
        <div className="bg-[#121925] border border-[#252D39] rounded-xl p-6">
          <div className="border-b border-[#252D39] pb-3 mb-6 flex items-center justify-between">
            <h3 className="text-base font-bold text-[#F5F7FA]">
              Media Asset Catalog
            </h3>
            <span className="text-[#E50914] font-mono text-xs font-bold">{assets.length} Assets</span>
          </div>

          {assets.length === 0 ? (
            <div className="py-12 text-center text-[#707B8B] italic">
              No custom files uploaded to local media storage yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {assets.map((asset) => (
                <div key={asset.id} className="border border-[#252D39] bg-[#0E131C] rounded-lg p-3 flex flex-col justify-between group">
                  <div>
                    <div className="aspect-[16/10] bg-[#080B11] rounded overflow-hidden mb-2">
                      <img src={asset.url} alt={asset.alt_text} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-semibold text-[#F5F7FA] truncate block text-[11px]">
                      {asset.filename}
                    </span>
                    <span className="text-[#707B8B] font-mono text-[9px] block">
                      {(asset.file_size / 1024).toFixed(1)} KB • {asset.file_type.split('/')[1]?.toUpperCase()}
                    </span>
                  </div>

                  <button
                    onClick={() => copyToClipboard(asset.url, asset.id)}
                    className="mt-3 w-full py-1.5 bg-[#121925] border border-[#252D39] hover:bg-[#1B2432] text-[#A4ADBB] hover:text-[#F5F7FA] rounded transition flex items-center justify-center space-x-1.5 text-[11px] cursor-pointer"
                  >
                    {copiedId === asset.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
