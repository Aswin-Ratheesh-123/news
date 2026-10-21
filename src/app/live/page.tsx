import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Radio, Clock, Calendar, AlertCircle, ChevronRight, 
  MessageSquare, User, Eye, Sparkles 
} from 'lucide-react';
import PublicLayout from '@/components/public/PublicLayout';
import VideoPlayer from '@/components/public/VideoPlayer';
import { getEditorialSettings, getLiveBlogs, getLatestArticles } from '@/lib/data';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'NEWSIGHT 24x7 | Official Live TV Broadcast Stream',
  description: 'Watch NEWSIGHT 24x7 live stream. Continuous coverage of breaking developments, prime time shows, parliamentary debates, and verified field investigations.',
};

export const dynamic = 'force-dynamic';

export default async function LiveTvPage() {
  const settings = getEditorialSettings();
  const liveBlogs = getLiveBlogs();
  const latestArticles = getLatestArticles(5);

  let schedule = [
    { time: '06:00 - 08:00', title: 'Morning Bulletin & Global Markets', host: 'NEWSIGHT Desk', active: false },
    { time: '08:00 - 09:30', title: 'National Newspapers & Editorial Review', host: 'Vikramaditya Roy', active: false },
    { time: '09:30 - 12:00', title: 'Live Parliament & Bureau Coverage', host: 'Ayesha Sen', active: false },
    { time: '12:00 - 14:00', title: 'Afternoon News Hour & Regional Desks', host: 'K. R. Madhavan', active: false },
    { time: '14:00 - 16:30', title: 'News Explained: Deep Dives & Telemetry', host: 'Dr. Elena Vance', active: false },
    { time: '16:30 - 18:00', title: 'Business Focus: Markets & Policy', host: 'Vikramaditya Roy', active: false },
    { time: '18:00 - 19:30', title: 'The Ground Report Dispatch', host: 'Ayesha Sen', active: false },
    { time: '19:30 - 20:30', title: 'The Debate: Nuanced Perspectives', host: 'K. R. Madhavan', active: false },
    { time: '20:30 - 21:00', title: 'Special Investigation Spotlight', host: 'Editorial Unit', active: false },
    { time: '21:00 - 22:30', title: 'The Daily Brief: Flagship Prime Time', host: 'Siddharth Nair', active: true },
    { time: '22:30 - 00:00', title: 'World View: Diplomatic & Geopolitical Wrap', host: 'Ayesha Sen', active: false }
  ];

  if (settings.live_schedule_json) {
    try {
      const parsed = JSON.parse(settings.live_schedule_json);
      if (Array.isArray(parsed) && parsed.length > 0) {
        schedule = parsed.map((item, idx) => ({ ...item, active: idx === 9 }));
      }
    } catch (_) {}
  }

  const streamUrl = settings.live_stream_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';

  return (
    <PublicLayout>
      <div className="px-3 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#252D39] pb-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E50914] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#E50914]"></span>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
                  NEWSIGHT 24x7 LIVE
                </h1>
                <span className="px-2 py-0.5 bg-[#E50914] text-white font-extrabold text-[10px] uppercase rounded">
                  ON AIR
                </span>
              </div>
              <p className="text-xs text-[#A4ADBB]">
                Channel Feed 1 • High Definition Multi-Bitrate Broadcast
              </p>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-[#F5F7FA] block">
              Now Airing: {settings.live_current_show || 'The Daily Brief with Siddharth Nair'}
            </span>
            <span className="text-[11px] text-[#707B8B]">
              National Master Feed • 1080p 50fps
            </span>
          </div>
        </div>

        {/* Live Broadcast Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Player (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative rounded-xl overflow-hidden border border-[#252D39] bg-black">
              {streamUrl ? (
                <VideoPlayer
                  src={streamUrl}
                  poster="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1280&q=80"
                  title="NEWSIGHT 24x7 Broadcast"
                />
              ) : (
                <div className="aspect-video flex flex-col items-center justify-center p-6 text-center bg-[#121925]">
                  <AlertCircle className="w-12 h-12 text-[#E50914] mb-3" />
                  <h3 className="text-lg font-bold text-white mb-1">Live Broadcast Unavailable</h3>
                  <p className="text-xs text-[#A4ADBB] max-w-md">
                    The scheduled live feed is temporarily inactive or undergoing maintenance. Please check upcoming programs in the schedule guide below.
                  </p>
                </div>
              )}
            </div>

            {/* Current Program Details */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#121925] border border-[#252D39] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#E50914] block mb-1">
                  CURRENT PROGRAM
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  {settings.live_current_show || 'The Daily Brief with Siddharth Nair'}
                </h2>
                <p className="text-xs text-[#A4ADBB] mt-0.5">
                  Live verification, ministerial statements, and contextual legal breakdown of national events.
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span className="px-3 py-1.5 bg-[#0E131C] border border-[#252D39] rounded-lg text-xs font-mono text-[#F5F7FA]">
                  21:00 - 22:30 IST
                </span>
              </div>
            </div>

            {/* Live Text Blogs from Editorial Desk */}
            {liveBlogs.length > 0 && (
              <div className="p-5 rounded-xl bg-[#0E131C] border border-[#252D39] space-y-4">
                <div className="flex items-center justify-between border-b border-[#252D39] pb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#E50914]" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-white">
                      Live Text Blogs & Real-Time Updates
                    </h3>
                  </div>
                  <span className="text-[10px] text-[#707B8B]">Updated by Correspondents</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {liveBlogs.map((blog) => (
                    <Link
                      key={blog.id}
                      href={`/live/${blog.slug}`}
                      className="p-3.5 rounded-lg bg-[#121925] hover:bg-[#1B2432] border border-[#252D39]/50 block group transition-colors"
                    >
                      <div className="flex items-center justify-between text-[10px] mb-1.5">
                        <span className="font-bold text-[#E50914] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-ping" />
                          <span>{blog.status}</span>
                        </span>
                        <span className="text-[#707B8B]">{formatDate(blog.updated_at)}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white group-hover:text-[#075DEB] line-clamp-2 leading-snug">
                        {blog.title}
                      </h4>
                      <p className="text-[11px] text-[#A4ADBB] line-clamp-2 mt-1">
                        {blog.summary}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Rail: Broadcast Schedule Guide (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="p-4 sm:p-5 rounded-xl bg-[#0E131C] border border-[#252D39]">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#252D39]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#075DEB]" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-white">
                    Program Guide
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#707B8B]">Today</span>
              </div>

              <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
                {schedule.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border transition-all ${
                      item.active
                        ? 'bg-[#121925] border-[#E50914] shadow-sm'
                        : 'bg-[#121925]/50 border-[#252D39]/40 opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className={`font-mono font-bold ${item.active ? 'text-[#E50914]' : 'text-[#707B8B]'}`}>
                        {item.time}
                      </span>
                      {item.active && (
                        <span className="px-1.5 py-0.2 bg-[#E50914] text-white text-[9px] font-black uppercase rounded">
                          NOW AIRING
                        </span>
                      )}
                    </div>
                    <h4 className={`text-xs font-bold leading-tight ${item.active ? 'text-white' : 'text-[#F5F7FA]'}`}>
                      {item.title}
                    </h4>
                    <p className="text-[10.5px] text-[#A4ADBB] mt-0.5">
                      Host: {item.host}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Breaking Stories */}
            <div className="p-4 rounded-xl bg-[#0E131C] border border-[#252D39]">
              <h4 className="text-xs font-black uppercase tracking-wider text-white pb-2 mb-2 border-b border-[#252D39]">
                Developing News Desk
              </h4>
              <div className="divide-y divide-[#252D39]/40">
                {latestArticles.map((art) => (
                  <Link
                    key={art.id}
                    href={`/article/${art.slug}`}
                    className="block py-2 group"
                  >
                    <h5 className="text-xs font-medium text-[#F5F7FA] group-hover:text-[#075DEB] line-clamp-2 leading-snug">
                      {art.title}
                    </h5>
                  </Link>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </PublicLayout>
  );
}
