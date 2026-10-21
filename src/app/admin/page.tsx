import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { getEditorialStats, getAllArticlesAdmin, getEditorialSettings, getShows } from '@/lib/data';
import AdminHeader from '@/components/admin/AdminHeader';
import { 
  FileText, CheckSquare, Clock, Users, Video, Radio, 
  Mail, ArrowRight, PlusCircle, AlertCircle, TrendingUp, Film 
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/admin/login');
  }

  const stats = getEditorialStats();
  const recentArticles = getAllArticlesAdmin('ALL').slice(0, 8);
  const settings = getEditorialSettings();
  const shows = getShows();

  return (
    <div className="flex-1 flex flex-col min-w-0 font-sans text-xs space-y-6">
      <AdminHeader
        title="NEWSIGHT Operations Center"
        subtitle={`Welcome back, ${user.name}. Editorial Edition: ${settings.publication_name}`}
        userRole={user.role}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/videos"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#121925] hover:bg-[#1B2432] text-white border border-[#252D39] rounded-lg transition"
            >
              <Video className="w-3.5 h-3.5 text-[#E50914]" />
              <span>New Video</span>
            </Link>
            <Link
              href="/admin/articles/create"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#075DEB] hover:bg-blue-600 text-white rounded-lg transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Compose Article</span>
            </Link>
          </div>
        }
      />

      <div className="space-y-6">
        {/* Status Callout if Breaking News active */}
        {settings.breaking_banner_active && (
          <div className="p-4 rounded-xl bg-red-950/30 text-red-200 border border-red-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E50914] animate-ping" />
              <strong className="text-white">Active Broadcast Banner:</strong>
              <span className="truncate max-w-xl">{settings.breaking_headline}</span>
            </div>
            <Link href="/admin/settings" className="underline hover:text-white font-semibold shrink-0">
              Configure Banner
            </Link>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl bg-[#0E131C] border border-[#252D39]">
            <div className="flex items-center justify-between text-[#707B8B] text-xs">
              <span>Published Stories</span>
              <FileText className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono mt-2">
              {stats.published}
            </div>
            <span className="text-[10px] text-[#707B8B]">Live on public edition</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0E131C] border border-[#252D39]">
            <div className="flex items-center justify-between text-[#707B8B] text-xs">
              <span>Video Reports</span>
              <Video className="w-4 h-4 text-[#E50914]" />
            </div>
            <div className="text-2xl font-bold text-white font-mono mt-2">
              {stats.totalVideos}
            </div>
            <span className="text-[10px] text-[#707B8B]">Streaming on platform</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0E131C] border border-[#252D39]">
            <div className="flex items-center justify-between text-[#707B8B] text-xs">
              <span>Broadcast Shows</span>
              <Film className="w-4 h-4 text-[#075DEB]" />
            </div>
            <div className="text-2xl font-bold text-white font-mono mt-2">
              {shows.length}
            </div>
            <span className="text-[10px] text-[#707B8B]">Prime time programs</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0E131C] border border-[#252D39]">
            <div className="flex items-center justify-between text-[#707B8B] text-xs">
              <span>In Editorial Review</span>
              <CheckSquare className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono mt-2">
              {stats.inReview}
            </div>
            <span className="text-[10px] text-[#707B8B]">Pending desk clearance</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0E131C] border border-[#252D39]">
            <div className="flex items-center justify-between text-[#707B8B] text-xs">
              <span>Newsletter Readers</span>
              <Mail className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono mt-2">
              {stats.subscribers}
            </div>
            <span className="text-[10px] text-[#707B8B]">Active subscribers</span>
          </div>
        </div>

        {/* Recent Publishing Activity */}
        <div className="p-5 rounded-2xl bg-[#0E131C] border border-[#252D39] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#252D39]">
            <h3 className="text-sm font-bold text-white">
              Recent Editorial Submissions & Articles
            </h3>
            <Link
              href="/admin/articles"
              className="text-xs text-[#075DEB] hover:underline font-bold"
            >
              View All Articles →
            </Link>
          </div>

          <div className="divide-y divide-[#252D39]/50">
            {recentArticles.map((art) => (
              <div
                key={art.id}
                className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.2 bg-[#075DEB]/20 text-[#075DEB] text-[9.5px] font-bold uppercase rounded">
                      {art.category_name}
                    </span>
                    <span className="text-[10px] text-[#707B8B] font-mono">
                      {formatDate(art.created_at)}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-white hover:text-[#075DEB]">
                    <Link href={`/admin/articles/${art.id}/edit`}>
                      {art.title}
                    </Link>
                  </h4>
                  <span className="text-[11px] text-[#707B8B]">
                    By {art.reporter_name || 'Desk'} • Status: {art.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/articles/${art.id}/edit`}
                    className="px-2.5 py-1 bg-[#121925] hover:bg-[#1B2432] border border-[#252D39] text-[#A4ADBB] hover:text-white rounded"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/article/${art.slug}`}
                    target="_blank"
                    className="px-2.5 py-1 bg-[#121925] hover:bg-[#1B2432] border border-[#252D39] text-[#A4ADBB] hover:text-white rounded"
                  >
                    Preview
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
