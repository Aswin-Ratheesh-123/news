'use client';

import React, { useState } from 'react';
import { 
  Heading1, Heading2, Bold, Italic, Quote, List, 
  ListOrdered, Eye, Edit3, Image as ImageIcon, Link as LinkIcon 
} from 'lucide-react';

interface RichEditorProps {
  value: string;
  onChange: (val: string) => void;
}

export default function RichEditor({ value, onChange }: RichEditorProps) {
  const [isPreview, setIsPreview] = useState(false);

  function insertFormatting(prefix: string, suffix: string = '') {
    const textarea = document.getElementById('rich-editor-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);

    const replacement = `${prefix}${selected || 'Sample Text'}${suffix}`;
    const newText = text.substring(0, start) + replacement + text.substring(end);
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected.length || 'Sample Text'.length));
    }, 50);
  }

  return (
    <div className="border border-[#252D39] bg-[#0E131C] rounded-lg overflow-hidden font-sans text-xs">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-1 p-2.5 bg-[#121925] border-b border-[#252D39]">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => insertFormatting('\n## ', '\n')}
            title="Heading 2"
            className="p-1.5 hover:bg-[#1B2432] text-[#A4ADBB] hover:text-[#F5F7FA] rounded transition cursor-pointer"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('\n### ', '\n')}
            title="Heading 3"
            className="p-1.5 hover:bg-[#1B2432] text-[#A4ADBB] hover:text-[#F5F7FA] rounded transition cursor-pointer"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <span className="text-[#252D39]">|</span>
          <button
            type="button"
            onClick={() => insertFormatting('**', '**')}
            title="Bold"
            className="p-1.5 hover:bg-[#1B2432] text-[#A4ADBB] hover:text-[#F5F7FA] rounded transition cursor-pointer"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('*', '*')}
            title="Italic"
            className="p-1.5 hover:bg-[#1B2432] text-[#A4ADBB] hover:text-[#F5F7FA] rounded transition cursor-pointer"
          >
            <Italic className="w-4 h-4" />
          </button>
          <span className="text-[#252D39]">|</span>
          <button
            type="button"
            onClick={() => insertFormatting('\n> ', '\n')}
            title="Blockquote / Pullquote"
            className="p-1.5 hover:bg-[#1B2432] text-[#A4ADBB] hover:text-[#F5F7FA] rounded transition cursor-pointer"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('\n- ', '')}
            title="Bullet list"
            className="p-1.5 hover:bg-[#1B2432] text-[#A4ADBB] hover:text-[#F5F7FA] rounded transition cursor-pointer"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('\n1. ', '')}
            title="Numbered list"
            className="p-1.5 hover:bg-[#1B2432] text-[#A4ADBB] hover:text-[#F5F7FA] rounded transition cursor-pointer"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Toggle */}
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded border transition cursor-pointer ${
            isPreview
              ? 'bg-[#075DEB] text-white border-[#075DEB]'
              : 'bg-[#121925] text-[#A4ADBB] border-[#252D39] hover:text-[#F5F7FA] hover:bg-[#1B2432]'
          }`}
        >
          {isPreview ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{isPreview ? 'Edit Source' : 'Formatted Preview'}</span>
        </button>
      </div>

      {/* Editor Body */}
      {isPreview ? (
        <div className="p-6 bg-[#0E131C] min-h-[350px] article-prose overflow-y-auto text-[#F5F7FA]">
          {value.split('\n\n').map((paragraph, index) => {
            const p = paragraph.trim();
            if (!p) return null;
            if (p.startsWith('## ')) return <h2 key={index} className="text-xl font-bold text-[#F5F7FA] mt-4 mb-2">{p.replace('## ', '')}</h2>;
            if (p.startsWith('### ')) return <h3 key={index} className="text-lg font-bold text-[#F5F7FA] mt-3 mb-1.5">{p.replace('### ', '')}</h3>;
            if (p.startsWith('> ')) return <blockquote key={index} className="border-l-3 border-[#E50914] pl-4 my-3 italic text-[#A4ADBB]">{p.replace(/^>\s*/gm, '')}</blockquote>;
            if (p.startsWith('- ') || p.startsWith('1. ')) {
              return (
                <ul key={index} className="list-disc pl-5 my-2 text-[#A4ADBB] space-y-1">
                  {p.split('\n').map((l, lIdx) => (
                    <li key={lIdx}>{l.replace(/^-\s*/, '').replace(/^\d+\.\s*/, '')}</li>
                  ))}
                </ul>
              );
            }
            return <p key={index} className="my-2.5 text-sm text-[#A4ADBB] leading-relaxed">{p}</p>;
          })}
        </div>
      ) : (
        <textarea
          id="rich-editor-textarea"
          rows={15}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Compose full journalistic article content using standard editorial paragraphs, ## Section Headings, > Pullquotes, and bullet points..."
          className="w-full p-4 font-mono text-xs text-[#F5F7FA] bg-[#0E131C] focus:outline-none resize-y min-h-[350px] leading-relaxed placeholder-[#707B8B]"
        />
      )}
    </div>
  );
}
