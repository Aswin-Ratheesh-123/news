import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    return <div className="min-h-screen bg-[#080B11] text-[#F5F7FA]">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#080B11] text-[#F5F7FA] font-sans">
      <AdminSidebar userRole={user.role} userName={user.name} />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
}
