import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { getAllArticlesAdmin } from '@/lib/data';
import AdminHeader from '@/components/admin/AdminHeader';
import { PlusCircle, Search, Filter, ExternalLink, Trash2, Edit, Check } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ArticlesPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminArticlesPage({ searchParams }: ArticlesPageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/admin/login');
  }

  const { status = 'ALL' } = await searchParams;
  const articles = getAllArticlesAdmin(status);

  const filterTabs = [
    { label: 'All Dispatches', value: 'ALL' },
    { label: 'Published', value: 'PUBLISHED' },
    { label: 'In Review', value: 'IN_REVIEW' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Drafts', value: 'DRAFT' },
    { label: 'Archived', value: 'ARCHIVED' },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Article Management"
        subtitle="Manage all newsroom stories, drafts, workflow approvals, and publication dates."
        userRole={user.role}
        actions={
          <Link
            href="/admin/articles/create"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#E50914] text-white hover:bg-[#b80710] rounded-lg transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create Article</span>
          </Link>
        }
      />

      <div className="p-6 space-y-6">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 text-xs font-semibold">
          {filterTabs.map((tab) => (
            <Link
              key={tab.value}
              href={`/admin/articles?status=${tab.value}`}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                status === tab.value
                  ? 'bg-[#075DEB] text-white shadow-sm'
                  : 'bg-[#121925] border border-[#252D39] text-[#A4ADBB] hover:text-[#F5F7FA] hover:bg-[#1B2432]'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Articles Table */}
        <div className="bg-[#121925] border border-[#252D39] rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#0E131C] text-[#A4ADBB] font-semibold uppercase tracking-wider border-b border-[#252D39]">
                <tr>
                  <th className="px-6 py-3">Headline</th>
                  <th className="px-6 py-3">Section</th>
                  <th className="px-6 py-3">Author</th>
                  <th className="px-6 py-3">Flags</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Published Date</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252D39]">
                {articles.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-[#707B8B] italic">
                      No articles found with status: {status}
                    </td>
                  </tr>
                ) : (
                  articles.map((art) => (
                    <tr key={art.id} className="hover:bg-[#1B2432]/50 transition">
                      <td className="px-6 py-3.5 max-w-sm">
                        <Link
                          href={`/admin/articles/${art.id}/edit`}
                          className="font-bold text-[#F5F7FA] hover:text-[#E50914] block truncate"
                        >
                          {art.title}
                        </Link>
                        <span className="text-[11px] text-[#707B8B] block truncate">
                          {art.deck}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-[#0E131C] border border-[#252D39] text-[#A4ADBB]">
                          {art.category_name}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap text-[#A4ADBB]">
                        {art.reporter_name}
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap space-x-1">
                        {art.is_lead === 1 && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-amber-950/60 text-amber-400 border border-amber-500/30">
                            LEAD
                          </span>
                        )}
                        {art.is_breaking === 1 && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-red-950/60 text-red-400 border border-red-500/30">
                            BREAKING
                          </span>
                        )}
                        {art.is_opinion === 1 && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-purple-950/60 text-purple-400 border border-purple-500/30">
                            OPINION
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${
                            art.status === 'PUBLISHED'
                              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                              : art.status === 'IN_REVIEW'
                              ? 'bg-amber-950/60 text-amber-400 border-amber-500/30'
                              : art.status === 'APPROVED'
                              ? 'bg-blue-950/60 text-blue-400 border-blue-500/30'
                              : 'bg-[#0E131C] text-[#A4ADBB] border-[#252D39]'
                          }`}
                        >
                          {art.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap text-[#707B8B]">
                        {art.published_at ? formatDate(art.published_at, 'short') : 'Not Published'}
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap text-right space-x-3">
                        <Link
                          href={`/admin/articles/${art.id}/edit`}
                          className="font-semibold text-[#075DEB] hover:underline"
                        >
                          Edit
                        </Link>
                        {art.status === 'PUBLISHED' && (
                          <Link
                            href={`/article/${art.slug}`}
                            target="_blank"
                            className="text-[#707B8B] hover:text-[#F5F7FA]"
                          >
                            Live
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
