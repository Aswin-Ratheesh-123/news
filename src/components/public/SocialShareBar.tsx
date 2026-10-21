'use client';

import React, { useState } from 'react';
import { Share2, Link as LinkIcon, Check, MessageCircle } from 'lucide-react';

interface SocialShareBarProps {
  title: string;
  url: string;
}

export default function SocialShareBar({ title, url }: SocialShareBarProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  const encodedUrl = encodeURIComponent(typeof window !== 'undefined' ? window.location.href : url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex items-center gap-2 text-[#A4ADBB] text-xs">
      <span className="font-bold uppercase tracking-wider text-white flex items-center gap-1.5 mr-1">
        <Share2 className="w-4 h-4 text-[#075DEB]" />
        <span>Share</span>
      </span>

      {/* Twitter / X */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className="p-2 rounded-lg bg-[#121925] border border-[#252D39] hover:bg-[#1B2432] hover:text-white transition-colors"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </a>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className="p-2 rounded-lg bg-[#121925] border border-[#252D39] hover:bg-[#1B2432] hover:text-blue-400 transition-colors"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </a>

      {/* WhatsApp */}
      <a
        href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
        className="p-2 rounded-lg bg-[#121925] border border-[#252D39] hover:bg-[#1B2432] hover:text-emerald-400 transition-colors"
      >
        <MessageCircle className="w-4 h-4" />
      </a>

      {/* Copy Link */}
      <button
        onClick={handleCopy}
        aria-label="Copy link to clipboard"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121925] border border-[#252D39] hover:bg-[#1B2432] text-[#A4ADBB] hover:text-white transition-colors font-medium text-xs"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-semibold">Copied!</span>
          </>
        ) : (
          <>
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
}
