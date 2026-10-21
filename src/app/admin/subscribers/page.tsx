import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getDb } from '@/lib/db';
import AdminHeader from '@/components/admin/AdminHeader';
import { Mail, CheckCircle2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default async function AdminSubscribersPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/admin/login');
  }

  const db = getDb();
  const subscribers = db.prepare('SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC').all() as any[];

  return (
    <div className="flex-1 flex flex-col min-w-0 font-sans text-xs">
      <AdminHeader
        title="Newsletter Subscriber Roster"
        subtitle="Manage active morning briefing subscribers and edition distribution channels."
        userRole={user.role}
      />

      <div className="p-6 space-y-6">
        <div className="bg-[#121925] border border-[#252D39] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#252D39] flex items-center justify-between">
            <h2 className="font-bold uppercase tracking-wider text-xs text-[#A4ADBB]">
              Active Subscribers
            </h2>
            <span className="text-[#E50914] font-mono text-xs font-bold">{subscribers.length} Registered</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#0E131C] text-[#A4ADBB] font-semibold uppercase tracking-wider border-b border-[#252D39]">
                <tr>
                  <th className="px-6 py-3">Subscriber Email</th>
                  <th className="px-6 py-3">Edition Preference</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Subscribed On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252D39]">
                {subscribers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-[#707B8B] italic">
                      No subscribers registered yet.
                    </td>
                  </tr>
                ) : (
                  subscribers.map((sub) => (
                    <tr key={sub.id} className="hover:bg-[#1B2432]/50 transition">
                      <td className="px-6 py-3.5 font-mono font-semibold text-[#F5F7FA]">
                        {sub.email}
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-[#0E131C] border border-[#252D39] text-[#A4ADBB]">
                          {sub.edition_preference} Edition
                        </span>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center space-x-1 text-emerald-400 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </span>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap text-[#707B8B]">
                        {formatDate(sub.subscribed_at, 'full')}
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
