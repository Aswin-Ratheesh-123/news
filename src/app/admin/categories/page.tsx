'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { FolderTree, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { Category } from '@/lib/types';
import Link from 'next/link';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#0f172a');
  const [orderIndex, setOrderIndex] = useState(0);
  const [showInNav, setShowInNav] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
    } catch (e) {
      //
    }
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return;

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          color,
          order_index: Number(orderIndex),
          show_in_nav: showInNav ? 1 : 0,
        }),
      });

      if (res.ok) {
        setFeedback({ type: 'success', text: 'Category created successfully.' });
        setName('');
        setDescription('');
        await loadCategories();
      } else {
        const d = await res.json();
        setFeedback({ type: 'error', text: d.error || 'Failed to create category.' });
      }
    } catch (e) {
      setFeedback({ type: 'error', text: 'Network communication error.' });
    }
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 font-sans text-xs">
      <AdminHeader
        title="Category & Desk Management"
        subtitle="Manage news desks, navigation bar priority, and section descriptions."
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Add Category Form (5 cols) */}
          <div className="lg:col-span-5 bg-[#121925] p-6 border border-[#252D39] rounded-xl space-y-4">
            <h2 className="text-base font-bold text-[#F5F7FA] border-b border-[#252D39] pb-3">
              Create Editorial Desk / Category
            </h2>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block font-semibold text-[#A4ADBB] mb-1">Category Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Defense & Aerospace"
                  required
                  className="w-full px-3 py-2 bg-[#0E131C] border border-[#252D39] text-[#F5F7FA] placeholder-[#707B8B] rounded-lg focus:outline-none focus:border-[#E50914] font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#A4ADBB] mb-1">Desk Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Focus of reporting in this section..."
                  className="w-full px-3 py-2 bg-[#0E131C] border border-[#252D39] text-[#F5F7FA] placeholder-[#707B8B] rounded-lg focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#A4ADBB] mb-1">Color Token</label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full h-9 p-1 bg-[#0E131C] border border-[#252D39] rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#A4ADBB] mb-1">Display Order</label>
                  <input
                    type="number"
                    value={orderIndex}
                    onChange={(e) => setOrderIndex(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#0E131C] border border-[#252D39] text-[#F5F7FA] rounded-lg focus:outline-none focus:border-[#E50914]"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="show-nav-check"
                  checked={showInNav}
                  onChange={(e) => setShowInNav(e.target.checked)}
                  className="rounded bg-[#0E131C] border-[#252D39] text-[#E50914] focus:ring-0"
                />
                <label htmlFor="show-nav-check" className="font-semibold text-[#A4ADBB] cursor-pointer">
                  Display in Primary Header Navigation
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#E50914] hover:bg-[#b80710] text-white font-bold uppercase tracking-wider text-xs rounded-lg transition cursor-pointer"
              >
                Create Category
              </button>
            </form>
          </div>

          {/* Existing Categories (7 cols) */}
          <div className="lg:col-span-7 bg-[#121925] border border-[#252D39] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#252D39] font-bold uppercase tracking-wider text-xs text-[#A4ADBB] flex items-center justify-between">
              <span>Active Editorial Categories</span>
              <span className="text-[#E50914] font-mono">{categories.length} Desks</span>
            </div>

            <div className="divide-y divide-[#252D39] max-h-[600px] overflow-y-auto">
              {categories.map((c) => (
                <div key={c.id} className="p-4 flex items-center justify-between gap-4 hover:bg-[#1B2432]/50 transition">
                  <div className="flex items-center space-x-3">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: c.color || '#E50914' }}
                    />
                    <div>
                      <h4 className="font-bold text-[#F5F7FA] text-sm">{c.name}</h4>
                      <span className="text-[#707B8B] font-mono text-[10px]">slug: {c.slug}</span>
                      {c.description && <p className="text-[#A4ADBB] text-xs mt-0.5 line-clamp-1">{c.description}</p>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <Link
                      href={`/category/${c.slug}`}
                      target="_blank"
                      className="text-[#075DEB] hover:underline font-semibold"
                    >
                      View Desk →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
