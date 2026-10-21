import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getCategories, getReporters } from '@/lib/data';
import AdminHeader from '@/components/admin/AdminHeader';
import ArticleForm from '@/components/admin/ArticleForm';

export default async function CreateArticlePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/admin/login');
  }

  const categories = getCategories(false);
  const reporters = getReporters();

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Compose New Article"
        subtitle="Draft news report, investigative piece, ground report, or editorial column."
        userRole={user.role}
      />
      <div className="p-6">
        <ArticleForm
          categories={categories}
          reporters={reporters}
          userRole={user.role}
          isEditing={false}
        />
      </div>
    </div>
  );
}
