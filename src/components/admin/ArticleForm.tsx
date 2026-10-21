'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Article, Category, Reporter, UserRole } from '@/lib/types';
import RichEditor from './RichEditor';
import { Save, Send, Trash2, Eye, CheckCircle2, AlertCircle, Upload, ShieldAlert } from 'lucide-react';

interface ArticleFormProps {
  initialArticle?: Partial<Article>;
  categories: Category[];
  reporters: Reporter[];
  userRole?: UserRole;
  isEditing?: boolean;
}

export default function ArticleForm({
  initialArticle,
  categories,
  reporters,
  userRole,
  isEditing = false,
}: ArticleFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialArticle?.title || '');
  const [deck, setDeck] = useState(initialArticle?.deck || '');
  const [content, setContent] = useState(initialArticle?.body || '');
  const [categoryId, setCategoryId] = useState(initialArticle?.category_id || categories[0]?.id || '');
  const [reporterId, setReporterId] = useState(initialArticle?.reporter_id || reporters[0]?.id || '');
  const [articleType, setArticleType] = useState(initialArticle?.article_type || 'NEWS');
  const [featuredImage, setFeaturedImage] = useState(initialArticle?.featured_image || '');
  const [imageCaption, setImageCaption] = useState(initialArticle?.image_caption || '');
  const [imageCredit, setImageCredit] = useState(initialArticle?.image_credit || '');
  const [isBreaking, setIsBreaking] = useState(Boolean(initialArticle?.is_breaking));
  const [isLead, setIsLead] = useState(Boolean(initialArticle?.is_lead));
  const [isFeatured, setIsFeatured] = useState(Boolean(initialArticle?.is_featured));
  const [isOpinion, setIsOpinion] = useState(Boolean(initialArticle?.is_opinion));
  const [district, setDistrict] = useState(initialArticle?.district || '');
  const [sourceAttribution, setSourceAttribution] = useState(initialArticle?.source_attribution || '');
  const [correctionNotice, setCorrectionNotice] = useState(initialArticle?.correction_notice || '');

  const [status, setStatus] = useState(initialArticle?.status || 'DRAFT');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const canApproveAndPublish = userRole === 'SUPER_ADMIN' || userRole === 'EDITOR';

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('caption', imageCaption);
      formData.append('credit', imageCredit);

      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.asset?.url) {
        setFeaturedImage(data.asset.url);
        setSuccess('Image uploaded and set as featured photograph.');
      } else {
        setError(data.error || 'Failed to upload image.');
      }
    } catch (err) {
      setError('Image upload failed.');
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSave(targetStatus: string) {
    if (!title.trim() || !deck.trim() || !content.trim()) {
      setError('Please provide title, summary, and article body.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    const payload = {
      title,
      deck,
      content,
      category_id: categoryId,
      reporter_id: reporterId,
      article_type: articleType,
      featured_image: featuredImage,
      image_caption: imageCaption,
      image_credit: imageCredit,
      is_breaking: isBreaking ? 1 : 0,
      is_lead: isLead ? 1 : 0,
      is_featured: isFeatured ? 1 : 0,
      is_opinion: isOpinion ? 1 : 0,
      district: district || null,
      source_attribution: sourceAttribution || null,
      correction_notice: correctionNotice || null,
      status: targetStatus,
    };

    try {
      const url = isEditing ? `/api/articles/${initialArticle?.id}` : '/api/articles';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(`Story saved successfully as ${targetStatus}.`);
        setStatus(targetStatus as any);
        setTimeout(() => {
          router.push('/admin/articles');
          router.refresh();
        }, 1200);
      } else {
        setError(data.error || 'Failed to save story.');
      }
    } catch (err) {
      setError('Network communication error.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!initialArticle?.id) return;
    if (!confirm('Are you sure you want to permanently delete this article?')) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/articles/${initialArticle.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/articles');
        router.refresh();
      } else {
        const d = await res.json();
        setError(d.error || 'Failed to delete article.');
      }
    } catch (e) {
      setError('Delete error.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 font-sans text-xs">
      {/* Alert Notices */}
      {error && (
        <div className="p-4 bg-red-100 border-l-4 border-red-700 text-red-900 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-100 border-l-4 border-emerald-700 text-emerald-900 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Main Composer Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Title, Deck, Rich Text Body */}
        <div className="lg:col-span-8 space-y-5 bg-[#121925] p-6 border border-[#252D39] rounded-xl">
          <div>
            <label className="block font-bold text-[#F5F7FA] uppercase tracking-wider text-[11px] mb-1.5">
              Article Headline *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. National Inter-State Water Treaty Re-negotiations Enter Critical Phase"
              className="w-full p-3 font-headline text-lg sm:text-xl font-bold bg-[#0E131C] border border-[#252D39] text-[#F5F7FA] placeholder-[#707B8B] rounded-lg focus:outline-none focus:border-[#E50914] leading-snug"
            />
          </div>

          <div>
            <label className="block font-bold text-[#F5F7FA] uppercase tracking-wider text-[11px] mb-1.5">
              Subheadline / Deck (Editorial Summary) *
            </label>
            <textarea
              rows={2}
              value={deck}
              onChange={(e) => setDeck(e.target.value)}
              placeholder="Summary explaining the critical context, primary parties, and immediate implications..."
              className="w-full p-2.5 text-xs text-[#A4ADBB] bg-[#0E131C] border border-[#252D39] placeholder-[#707B8B] rounded-lg focus:outline-none focus:border-[#E50914] leading-relaxed italic"
            />
          </div>

          <div>
            <label className="block font-bold text-[#F5F7FA] uppercase tracking-wider text-[11px] mb-1.5">
              Full Journalistic Article Body *
            </label>
            <RichEditor value={content} onChange={setContent} />
          </div>

          {/* Material Correction Notice */}
          <div className="p-4 bg-amber-950/40 border border-amber-500/40 rounded-lg">
            <div className="flex items-center space-x-1.5 font-bold uppercase tracking-wider text-amber-400 text-[11px] mb-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Editorial Correction Notice (if amending published story)</span>
            </div>
            <textarea
              rows={2}
              value={correctionNotice}
              onChange={(e) => setCorrectionNotice(e.target.value)}
              placeholder="e.g. Correction Note: An earlier draft incorrectly cited the barrage distance as 14km instead of 11.2km. Amended accordingly."
              className="w-full p-2 text-xs bg-[#0E131C] border border-amber-500/40 text-[#F5F7FA] placeholder-[#707B8B] rounded focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Source Attribution */}
          <div>
            <label className="block font-bold text-[#A4ADBB] uppercase tracking-wider text-[11px] mb-1">
              Official Source Attribution
            </label>
            <input
              type="text"
              value={sourceAttribution}
              onChange={(e) => setSourceAttribution(e.target.value)}
              placeholder="e.g. Supreme Court Registrar / Press Information Bureau"
              className="w-full p-2 text-xs bg-[#0E131C] border border-[#252D39] text-[#F5F7FA] placeholder-[#707B8B] rounded-lg focus:outline-none focus:border-[#E50914]"
            />
          </div>
        </div>

        {/* Right Column (4 cols): Desks, Bylines, Flags, Media, Workflow Actions */}
        <div className="lg:col-span-4 space-y-5">
          {/* Workflow Actions Box */}
          <div className="bg-[#121925] p-5 border border-[#252D39] rounded-xl space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-widest text-[#F5F7FA] border-b border-[#252D39] pb-2">
              Publishing Workflow
            </h3>
            <div className="text-xs text-[#A4ADBB] font-sans">
              Current Status: <strong className="text-[#E50914] uppercase">{status}</strong>
            </div>

            <div className="space-y-2 pt-2">
              {/* Save Draft */}
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSave('DRAFT')}
                className="w-full py-2 bg-[#1B2432] hover:bg-[#252D39] text-[#F5F7FA] font-bold uppercase tracking-wider text-xs rounded-lg transition border border-[#252D39] cursor-pointer"
              >
                Save as Draft
              </button>

              {/* Submit for Review (if reporter) */}
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSave('IN_REVIEW')}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase tracking-wider text-xs rounded-lg transition cursor-pointer"
              >
                Submit for Editorial Review
              </button>

              {/* Approve & Publish (if editor or admin) */}
              {canApproveAndPublish && (
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSave('PUBLISHED')}
                  className="w-full py-2.5 bg-[#E50914] hover:bg-[#b80710] text-white font-extrabold uppercase tracking-wider text-xs rounded-lg transition shadow-sm cursor-pointer"
                >
                  Approve & Publish Now
                </button>
              )}

              {/* Delete Article (if editing) */}
              {isEditing && canApproveAndPublish && (
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleDelete}
                  className="w-full py-1.5 text-[#E50914] hover:bg-[#E50914]/10 rounded font-semibold transition text-xs mt-2 cursor-pointer"
                >
                  Delete Story Permanently
                </button>
              )}
            </div>
          </div>

          {/* Section & Byline Metadata */}
          <div className="bg-[#121925] p-5 border border-[#252D39] rounded-xl space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-widest text-[#F5F7FA] border-b border-[#252D39] pb-2">
              Editorial Metadata
            </h3>

            <div>
              <label className="block font-semibold text-[#A4ADBB] mb-1">Section Desk *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-2 bg-[#0E131C] border border-[#252D39] text-[#F5F7FA] rounded-lg focus:outline-none focus:border-[#E50914] cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#A4ADBB] mb-1">Reporter Byline *</label>
              <select
                value={reporterId}
                onChange={(e) => setReporterId(e.target.value)}
                className="w-full p-2 bg-[#0E131C] border border-[#252D39] text-[#F5F7FA] rounded-lg focus:outline-none focus:border-[#E50914] cursor-pointer"
              >
                {reporters.map((r) => (
                  <option key={r.id} value={r.id}>{r.name} ({r.beat})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#A4ADBB] mb-1">Article Type</label>
              <select
                value={articleType}
                onChange={(e) => setArticleType(e.target.value as any)}
                className="w-full p-2 bg-[#0E131C] border border-[#252D39] text-[#F5F7FA] rounded-lg focus:outline-none focus:border-[#E50914] cursor-pointer"
              >
                <option value="NEWS">Reported News</option>
                <option value="ANALYSIS">Analysis & Deep Dive</option>
                <option value="OPINION">Opinion & Column</option>
                <option value="INVESTIGATION">Special Investigation</option>
                <option value="GROUND_REPORT">Ground Report</option>
                <option value="EXPLAINER">Explainer</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#A4ADBB] mb-1">District Tag (for Kerala Desk)</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Wayanad, Kochi, Thiruvananthapuram"
                className="w-full p-2 bg-[#0E131C] border border-[#252D39] text-[#F5F7FA] placeholder-[#707B8B] rounded-lg focus:outline-none focus:border-[#E50914]"
              />
            </div>
          </div>

          {/* Editorial Display Flags */}
          <div className="bg-[#121925] p-5 border border-[#252D39] rounded-xl space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-widest text-[#F5F7FA] border-b border-[#252D39] pb-2">
              Homepage Placement Flags
            </h3>

            <label className="flex items-center space-x-2 text-[#F5F7FA] cursor-pointer py-1">
              <input
                type="checkbox"
                checked={isLead}
                onChange={(e) => setIsLead(e.target.checked)}
                className="rounded bg-[#0E131C] border-[#252D39] text-[#E50914] focus:ring-0"
              />
              <span className="font-semibold text-xs">Main Lead Story (Hero Position)</span>
            </label>

            <label className="flex items-center space-x-2 text-[#E50914] cursor-pointer py-1">
              <input
                type="checkbox"
                checked={isBreaking}
                onChange={(e) => setIsBreaking(e.target.checked)}
                className="rounded bg-[#0E131C] border-[#252D39] text-[#E50914] focus:ring-0"
              />
              <span className="font-semibold text-xs">Breaking News Alert</span>
            </label>

            <label className="flex items-center space-x-2 text-[#A4ADBB] cursor-pointer py-1">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded bg-[#0E131C] border-[#252D39] text-[#E50914] focus:ring-0"
              />
              <span className="text-xs">Featured in Section Tops</span>
            </label>

            <label className="flex items-center space-x-2 text-[#A4ADBB] cursor-pointer py-1">
              <input
                type="checkbox"
                checked={isOpinion}
                onChange={(e) => setIsOpinion(e.target.checked)}
                className="rounded bg-[#0E131C] border-[#252D39] text-[#E50914] focus:ring-0"
              />
              <span className="text-xs">Opinion / Columnist Flag</span>
            </label>
          </div>

          {/* Photography & Media */}
          <div className="bg-[#121925] p-5 border border-[#252D39] rounded-xl space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-widest text-[#F5F7FA] border-b border-[#252D39] pb-2">
              Featured Photograph
            </h3>

            {featuredImage && (
              <div className="aspect-[16/10] w-full overflow-hidden bg-[#0A0E15] border border-[#252D39] rounded-lg mb-2">
                <img src={featuredImage} alt="Featured Preview" className="w-full h-full object-cover" />
              </div>
            )}

            <div>
              <label className="block text-[#A4ADBB] mb-1 font-semibold text-xs">Image URL</label>
              <input
                type="text"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="https://..."
                className="w-full p-2 bg-[#0E131C] border border-[#252D39] text-[#F5F7FA] placeholder-[#707B8B] rounded-lg focus:outline-none focus:border-[#E50914] text-xs"
              />
            </div>

            <div>
              <label className="block text-[#A4ADBB] mb-1 font-semibold text-xs">Upload Local Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="w-full text-xs text-[#707B8B] file:mr-2 file:py-1 file:px-2.5 file:border-0 file:text-xs file:font-semibold file:bg-[#1B2432] file:text-[#F5F7FA] file:rounded hover:file:bg-[#252D39] cursor-pointer"
              />
              {uploadingImage && <span className="text-[10px] text-[#A4ADBB] mt-1 block">Uploading file to media library...</span>}
            </div>

            <div>
              <label className="block text-[#A4ADBB] mb-1 font-semibold text-xs">Caption</label>
              <input
                type="text"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                placeholder="Descriptive photographic caption..."
                className="w-full p-2 bg-[#0E131C] border border-[#252D39] text-[#F5F7FA] placeholder-[#707B8B] rounded-lg focus:outline-none focus:border-[#E50914] text-xs"
              />
            </div>

            <div>
              <label className="block text-[#A4ADBB] mb-1 font-semibold text-xs">Photo Credit</label>
              <input
                type="text"
                value={imageCredit}
                onChange={(e) => setImageCredit(e.target.value)}
                placeholder="e.g. NEWSIGHT / Rajesh Gurung"
                className="w-full p-2 bg-[#0E131C] border border-[#252D39] text-[#F5F7FA] placeholder-[#707B8B] rounded-lg focus:outline-none focus:border-[#E50914] text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
