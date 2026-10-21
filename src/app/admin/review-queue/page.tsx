import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { getAllArticlesAdmin } from '@/lib/data';
import AdminHeader from '@/components/admin/AdminHeader';
import { CheckSquare, CheckCircle, ArrowRight, Eye, AlertCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default async function ReviewQueuePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/admin/login');
  }

  const inReviewArticles = getAllArticlesAdmin('IN_REVIEW');
  const approvedArticles = getAllArticlesAdmin('APPROVED');

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Editorial Review Queue"
        subtitle="Review, approve, and authorize dispatches submitted by staff correspondents."
        userRole={user.role}
      />

      <div className="p-6 space-y-8 font-sans">
        {/* In Review Section */}
        <div className="bg-[#121925] border border-[#252D39] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#252D39] flex items-center justify-between bg-[#0E131C]">
            <div className="flex items-center space-x-2">
              <CheckSquare className="w-5 h-5 text-amber-400" />
              <div>
                <h2 className="text-base font-bold text-[#F5F7FA]">
                  Submissions Awaiting Editor Approval
                </h2>
                <p className="text-xs text-[#707B8B]">
                  Correspondents have filed these articles for fact-checking and publication authorization.
                </p>
              </div>
            </div>
            <span className="text-amber-400 font-mono text-xs font-bold">{inReviewArticles.length} Pending</span>
          </div>

          <div className="divide-y divide-[#252D39] text-xs">
            {inReviewArticles.length === 0 ? (
              <div className="p-8 text-center text-[#707B8B] italic">
                The review queue is currently clear. No pending reporter drafts awaiting approval.
              </div>
            ) : (
              inReviewArticles.map((art) => (
                <div key={art.id} className="p-6 flex flex-col sm:flex-row items-start justify-between gap-4 hover:bg-[#1B2432]/50 transition">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider text-[#E50914]">
                      <span>{art.category_name}</span>
                      <span>•</span>
                      <span className="text-[#A4ADBB] font-normal">Filed by {art.reporter_name}</span>
                      <span>•</span>
                      <span className="text-[#707B8B] font-normal">{formatDate(art.created_at, 'relative')}</span>
                    </div>

                    <h3 className="text-lg font-bold text-[#F5F7FA]">
                      {art.title}
                    </h3>

                    <p className="text-[#A4ADBB] text-xs leading-relaxed max-w-2xl">
                      {art.deck}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <Link
                      href={`/admin/articles/${art.id}/edit`}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase tracking-wider text-[11px] rounded-lg transition flex items-center space-x-1.5 cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Review & Authorize</span>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Approved for Scheduling Section */}
        <div className="bg-[#121925] border border-[#252D39] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#252D39] flex items-center justify-between bg-[#0E131C]">
            <div>
              <h2 className="text-base font-bold text-[#F5F7FA]">
                Approved Articles Ready for Scheduled Broadcast
              </h2>
              <p className="text-xs text-[#707B8B]">
                These stories have passed editorial fact-checks and can be published on demand.
              </p>
            </div>
            <span className="text-[#075DEB] font-mono text-xs font-bold">{approvedArticles.length} Ready</span>
          </div>

          <div className="divide-y divide-[#252D39] text-xs">
            {approvedArticles.length === 0 ? (
              <div className="p-6 text-center text-[#707B8B] italic">
                No approved articles on hold.
              </div>
            ) : (
              approvedArticles.map((art) => (
                <div key={art.id} className="p-4 flex items-center justify-between gap-4 hover:bg-[#1B2432]/50 transition">
                  <div>
                    <h3 className="font-bold text-[#F5F7FA] text-sm">{art.title}</h3>
                    <span className="text-[11px] text-[#707B8B]">By {art.reporter_name} • {art.category_name}</span>
                  </div>
                  <Link
                    href={`/admin/articles/${art.id}/edit`}
                    className="text-[#075DEB] hover:underline font-semibold"
                  >
                    Edit / Publish
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
