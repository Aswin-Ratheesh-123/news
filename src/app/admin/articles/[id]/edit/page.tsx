import React from 'react';
import { redirect, notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getCategories, getReporters } from '@/lib/data';
import { getDb } from '@/lib/db';
import AdminHeader from '@/components/admin/AdminHeader';
import ArticleForm from '@/components/admin/ArticleForm';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/admin/login');
  }

  const { id } = await params;
  const db = getDb();
  const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(id) as any;

  if (!article) {
    notFound();
  }

  const categories = getCategories(false);
  const reporters = getReporters();

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title={`Edit: ${article.title}`}
        subtitle={`Status: ${article.status} • Filed on ${new Date(article.created_at).toLocaleDateString()}`}
        userRole={user.role}
        actions={
          article.status === 'PUBLISHED' && (
            <Link
              href={`/article/${article.slug}`}
              target="_blank"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-zinc-800 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Published Story</span>
            </Link>
          )
        }
      />
      <div className="p-6">
        <ArticleForm
          initialArticle={article}
          categories={categories}
          reporters={reporters}
          userRole={user.role}
          isEditing={true}
        />
      </div>
    </div>
  );
}
