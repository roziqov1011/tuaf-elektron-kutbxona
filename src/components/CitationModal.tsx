import React, { useState } from 'react';
import { Check, Copy, Download, Quote, X } from 'lucide-react';
import { CitationFormat, Language, LibraryResource } from '../types/library';
import { UI_TRANSLATIONS } from '../data/translations';
import { generateCitation } from '../utils/libraryLogic';

interface CitationModalProps {
  resource: LibraryResource | null;
  lang: Language;
  onClose: () => void;
}

const CITATION_FORMATS: { id: CitationFormat; label: string }[] = [
  { id: 'APA', label: 'APA 7th' },
  { id: 'MLA', label: 'MLA 9th' },
  { id: 'IEEE', label: 'IEEE' },
  { id: 'HARVARD', label: 'Harvard' },
  { id: 'GOST', label: 'GOST 7.0.5' },
  { id: 'BIBTEX', label: 'BibTeX' },
];

export const CitationModal: React.FC<CitationModalProps> = ({
  resource,
  lang,
  onClose,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<CitationFormat>('APA');
  const [copied, setCopied] = useState(false);

  if (!resource) return null;

  const t = UI_TRANSLATIONS[lang];
  const citationText = generateCitation(resource, selectedFormat, lang);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(citationText).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadBib = () => {
    const bibContent = generateCitation(resource, 'BIBTEX', lang);
    const blob = new Blob([bibContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resource.id}.bib`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.citationModalTitle}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
    >
      <div className="w-full max-w-2xl bg-[#FBF9F5] border border-[#E5DEC9] rounded-xl shadow-xl overflow-hidden my-auto">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 bg-[#0F2342] text-[#FBF9F5]">
          <div className="flex items-center gap-2.5 min-w-0">
            <Quote className="w-4 h-4 text-[#C59B27] shrink-0" />
            <h3 className="text-base sm:text-lg font-serif-academic font-semibold truncate">
              {t.citationModalTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Citation Modal"
            className="p-1.5 rounded hover:bg-[#173461] text-[#E5DEC9] cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div>
            <p className="text-sm font-semibold text-[#0F2342]">
              {resource.title[lang]}
            </p>
            <p className="text-xs text-[#57534E] mt-1 font-mono-tabular break-words">
              {resource.authors.join(', ')} · {resource.year} · DOI:{' '}
              {resource.doi}
            </p>
          </div>

          {/* Segmented Format Selector */}
          <div
            role="tablist"
            aria-label="Citation Style Format"
            className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F3EFE6] border border-[#E5DEC9] rounded-lg"
          >
            {CITATION_FORMATS.map((fmt) => (
              <button
                key={fmt.id}
                role="tab"
                aria-selected={selectedFormat === fmt.id}
                type="button"
                onClick={() => setSelectedFormat(fmt.id)}
                className={`px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedFormat === fmt.id
                    ? 'bg-[#0F2342] text-[#FBF9F5] font-semibold'
                    : 'text-[#57534E] hover:text-[#0F2342]'
                }`}
              >
                {fmt.label}
              </button>
            ))}
          </div>

          {/* Formatted Citation Output Box */}
          <div className="p-3.5 sm:p-4 bg-white border border-[#E5DEC9] rounded-lg max-h-48 overflow-y-auto">
            <pre className="text-xs text-[#1C1917] whitespace-pre-wrap break-words font-mono-tabular leading-relaxed">
              {citationText}
            </pre>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleDownloadBib}
              className="px-4 py-2.5 text-xs font-medium text-[#0F2342] bg-[#F3EFE6] border border-[#E5DEC9] rounded-lg hover:bg-[#E5DEC9]/70 flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export .BIB (BibTeX / LaTeX)
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-2.5 text-xs font-semibold text-[#FBF9F5] bg-[#0F2342] rounded-lg hover:bg-[#173461] flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#C59B27]" />
                  {t.copiedText}
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  {t.copyCitation}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
