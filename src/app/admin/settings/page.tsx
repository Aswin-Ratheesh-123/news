'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { Settings, Save, CheckCircle2, AlertCircle, Radio, Image as ImageIcon, Flame } from 'lucide-react';
import { EditorialSettings } from '@/lib/types';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<EditorialSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.settings) setSettings(data.settings);
    } catch (_) {
      //
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publication_name: settings.publication_name,
          tagline: settings.tagline,
          logo_url: settings.logo_url || '',
          primary_color: settings.primary_color,
          accent_color: settings.accent_color,
          breaking_banner_active: settings.breaking_banner_active ? '1' : '0',
          breaking_headline: settings.breaking_headline,
          breaking_url: settings.breaking_url,
          breaking_time: settings.breaking_time,
          contact_email: settings.contact_email,
          contact_phone: settings.contact_phone,
          address: settings.address,
          twitter_url: settings.twitter_url,
          facebook_url: settings.facebook_url,
          instagram_url: settings.instagram_url,
          youtube_url: settings.youtube_url,
          footer_text: settings.footer_text,
          ads_enabled: settings.ads_enabled ? '1' : '0',
          ad_active: settings.ad_active ? '1' : '0',
          ad_image_url: settings.ad_image_url || '',
          ad_target_url: settings.ad_target_url || '',
          ad_title: settings.ad_title || '',
          live_stream_url: settings.live_stream_url || '',
          live_stream_title: settings.live_stream_title || '',
          live_current_show: settings.live_current_show || '',
        }),
      });

      if (res.ok) {
        setFeedback({ type: 'success', text: 'NEWSIGHT platform settings & live broadcast channels saved.' });
      } else {
        const d = await res.json();
        setFeedback({ type: 'error', text: d.error || 'Failed to save settings.' });
      }
    } catch (_) {
      setFeedback({ type: 'error', text: 'Network error saving settings.' });
    } finally {
      setSaving(false);
    }
  }

  if (loading || !settings) {
    return (
      <div className="p-8 text-xs text-[#707B8B] font-mono">
        Loading publication configuration...
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 font-sans text-xs space-y-6">
      <AdminHeader
        title="NEWSIGHT Platform & Broadcasting Settings"
        subtitle="Configure brand identity, sidebar promotional ad slots, 24x7 live stream endpoints, and breaking news alerts without touching source code."
      />

      <div className="space-y-6 max-w-5xl">
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

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* 1. Brand Identity */}
          <div className="p-6 rounded-2xl bg-[#0E131C] border border-[#252D39] space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-[#252D39]">
              Brand Identity & Masthead
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#A4ADBB] block mb-1">
                  Brand / Wordmark Name *
                </label>
                <input
                  type="text"
                  value={settings.publication_name}
                  onChange={(e) => setSettings({ ...settings, publication_name: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-[#121925] border border-[#252D39] rounded-lg text-white font-bold focus:outline-none focus:border-[#075DEB]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#A4ADBB] block mb-1">
                  Editorial Tagline
                </label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full px-3 py-2 bg-[#121925] border border-[#252D39] rounded-lg text-white focus:outline-none focus:border-[#075DEB]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#A4ADBB] block mb-1">
                  Primary Theme Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.primary_color || '#080B11'}
                    onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                    className="w-9 h-8 bg-transparent border border-[#252D39] rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.primary_color || '#080B11'}
                    onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                    className="w-32 px-2.5 py-1.5 bg-[#121925] border border-[#252D39] rounded text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#A4ADBB] block mb-1">
                  Accent Red Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.accent_color || '#E50914'}
                    onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })}
                    className="w-9 h-8 bg-transparent border border-[#252D39] rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.accent_color || '#E50914'}
                    onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })}
                    className="w-32 px-2.5 py-1.5 bg-[#121925] border border-[#252D39] rounded text-white font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Sidebar Promotional Banner / Ad Slot */}
          <div className="p-6 rounded-2xl bg-[#0E131C] border border-[#252D39] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#252D39]">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#075DEB]" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Left Sidebar Promotional Banner / Ad Slot
                </h2>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!settings.ad_active}
                  onChange={(e) => setSettings({ ...settings, ad_active: e.target.checked })}
                  className="rounded border-[#252D39] text-[#075DEB] focus:ring-0"
                />
                <span className="text-xs font-bold text-white">Enable Ad Slot</span>
              </label>
            </div>

            <p className="text-xs text-[#707B8B]">
              Configure the promotional showcase card rendered below the left navigation sidebar. Set to hidden if no campaign is active.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#A4ADBB] block mb-1">
                  Banner Image URL (Aspect ~4:5)
                </label>
                <input
                  type="url"
                  value={settings.ad_image_url || ''}
                  onChange={(e) => setSettings({ ...settings, ad_image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-[#121925] border border-[#252D39] rounded-lg text-white placeholder-[#707B8B] focus:outline-none focus:border-[#075DEB]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#A4ADBB] block mb-1">
                  Destination Link URL
                </label>
                <input
                  type="text"
                  value={settings.ad_target_url || ''}
                  onChange={(e) => setSettings({ ...settings, ad_target_url: e.target.value })}
                  placeholder="/shows/special-investigation or https://..."
                  className="w-full px-3 py-2 bg-[#121925] border border-[#252D39] rounded-lg text-white placeholder-[#707B8B] focus:outline-none focus:border-[#075DEB]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#A4ADBB] block mb-1">
                Ad Title / Campaign Label
              </label>
              <input
                type="text"
                value={settings.ad_title || ''}
                onChange={(e) => setSettings({ ...settings, ad_title: e.target.value })}
                placeholder="e.g. NEWSIGHT Special Investigations Showcase"
                className="w-full px-3 py-2 bg-[#121925] border border-[#252D39] rounded-lg text-white placeholder-[#707B8B] focus:outline-none focus:border-[#075DEB]"
              />
            </div>
          </div>

          {/* 3. Live TV Broadcast Stream Configuration */}
          <div className="p-6 rounded-2xl bg-[#0E131C] border border-[#252D39] space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#252D39]">
              <Radio className="w-4 h-4 text-[#E50914]" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Live TV 24x7 Broadcast Settings
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#A4ADBB] block mb-1">
                  Live Stream Endpoint URL (HLS / MP4 / Stream Provider) *
                </label>
                <input
                  type="url"
                  value={settings.live_stream_url || ''}
                  onChange={(e) => setSettings({ ...settings, live_stream_url: e.target.value })}
                  placeholder="https://commondatastorage.googleapis.com/.../stream.mp4"
                  className="w-full px-3 py-2 bg-[#121925] border border-[#252D39] rounded-lg text-white placeholder-[#707B8B] focus:outline-none focus:border-[#075DEB]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#A4ADBB] block mb-1">
                  Currently Airing Program Title
                </label>
                <input
                  type="text"
                  value={settings.live_current_show || ''}
                  onChange={(e) => setSettings({ ...settings, live_current_show: e.target.value })}
                  placeholder="The Daily Brief with Siddharth Nair"
                  className="w-full px-3 py-2 bg-[#121925] border border-[#252D39] rounded-lg text-white placeholder-[#707B8B] focus:outline-none focus:border-[#075DEB]"
                />
              </div>
            </div>
          </div>

          {/* 4. Breaking News Strip Alert */}
          <div className="p-6 rounded-2xl bg-[#0E131C] border border-[#252D39] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#252D39]">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#E50914]" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Breaking News Alert Strip
                </h2>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.breaking_banner_active}
                  onChange={(e) => setSettings({ ...settings, breaking_banner_active: e.target.checked })}
                  className="rounded border-[#252D39] text-[#E50914] focus:ring-0"
                />
                <span className="text-xs font-bold text-white">Broadcast Alert Banner</span>
              </label>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#A4ADBB] block mb-1">
                Breaking Alert Headline
              </label>
              <input
                type="text"
                value={settings.breaking_headline}
                onChange={(e) => setSettings({ ...settings, breaking_headline: e.target.value })}
                placeholder="Alert text displayed at top of homepage..."
                className="w-full px-3 py-2 bg-[#121925] border border-[#252D39] rounded-lg text-white placeholder-[#707B8B] focus:outline-none focus:border-[#075DEB]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#A4ADBB] block mb-1">
                  Target Story Destination URL
                </label>
                <input
                  type="text"
                  value={settings.breaking_url}
                  onChange={(e) => setSettings({ ...settings, breaking_url: e.target.value })}
                  placeholder="/article/slug or /video/slug"
                  className="w-full px-3 py-2 bg-[#121925] border border-[#252D39] rounded-lg text-white placeholder-[#707B8B] focus:outline-none focus:border-[#075DEB]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#A4ADBB] block mb-1">
                  Time Label Indicator
                </label>
                <input
                  type="text"
                  value={settings.breaking_time}
                  onChange={(e) => setSettings({ ...settings, breaking_time: e.target.value })}
                  placeholder="LIVE UPDATE or BREAKING"
                  className="w-full px-3 py-2 bg-[#121925] border border-[#252D39] rounded-lg text-white placeholder-[#707B8B] focus:outline-none focus:border-[#075DEB]"
                />
              </div>
            </div>
          </div>

          {/* 5. Contact Bureau & Social Coordinates */}
          <div className="p-6 rounded-2xl bg-[#0E131C] border border-[#252D39] space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-[#252D39]">
              Newsroom Coordinates & Social Networks
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#A4ADBB] block mb-1">
                  Public Editorial Email
                </label>
                <input
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                  className="w-full px-3 py-2 bg-[#121925] border border-[#252D39] rounded-lg text-white focus:outline-none focus:border-[#075DEB]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#A4ADBB] block mb-1">
                  Newsroom Phone
                </label>
                <input
                  type="text"
                  value={settings.contact_phone}
                  onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                  className="w-full px-3 py-2 bg-[#121925] border border-[#252D39] rounded-lg text-white focus:outline-none focus:border-[#075DEB]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#A4ADBB] block mb-1">
                  Twitter / X URL
                </label>
                <input
                  type="url"
                  value={settings.twitter_url}
                  onChange={(e) => setSettings({ ...settings, twitter_url: e.target.value })}
                  className="w-full px-3 py-2 bg-[#121925] border border-[#252D39] rounded-lg text-white focus:outline-none focus:border-[#075DEB]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#A4ADBB] block mb-1">
                  YouTube Channel URL
                </label>
                <input
                  type="url"
                  value={settings.youtube_url}
                  onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })}
                  className="w-full px-3 py-2 bg-[#121925] border border-[#252D39] rounded-lg text-white focus:outline-none focus:border-[#075DEB]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#A4ADBB] block mb-1">
                Footer Copyright Text
              </label>
              <input
                type="text"
                value={settings.footer_text}
                onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
                className="w-full px-3 py-2 bg-[#121925] border border-[#252D39] rounded-lg text-white focus:outline-none focus:border-[#075DEB]"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-[#075DEB] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Persisting Configuration...' : 'Save All Settings'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
