import React, { useState } from 'react';
import { BookOpen, Bookmark, Check, FileText, List, MessageSquare, Plus, X } from 'lucide-react';
import { Language, LibraryResource, PersonalNote } from '../types/library';
import { UI_TRANSLATIONS } from '../data/translations';

interface ReaderModalProps {
  resource: LibraryResource | null;
  lang: Language;
  onClose: () => void;
  onOpenCitation: (resource: LibraryResource) => void;
  notes: PersonalNote[];
  onAddNote: (resourceId: string, chapterNumber: number, text: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (resourceId: string) => void;
}

type ReaderSurface = 'archival' | 'sepia' | 'night';
type MobileReaderPanel = 'read' | 'chapters' | 'notes';

export const ReaderModal: React.FC<ReaderModalProps> = ({
  resource,
  lang,
  onClose,
  onOpenCitation,
  notes,
  onAddNote,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [fontScale, setFontScale] = useState<'sm' | 'md' | 'lg'>('md');
  const [surface, setSurface] = useState<ReaderSurface>('archival');
  const [mobilePanel, setMobilePanel] = useState<MobileReaderPanel>('read');
  const [noteInput, setNoteInput] = useState('');
  const [savedToast, setSavedToast] = useState(false);

  if (!resource) return null;

  const t = UI_TRANSLATIONS[lang];
  const chapters = resource.chapters;
  const currentChapter = chapters[activeChapterIdx] || chapters[0];
  const resourceNotes = notes.filter((n) => n.resourceId === resource.id);

  const surfaceStyles: Record<ReaderSurface, string> = {
    archival: 'bg-[#FBF9F5] text-[#1C1917]',
    sepia: 'bg-[#F3EAD8] text-[#292018]',
    night: 'bg-[#0F172A] text-[#E2E8F0]',
  };

  const fontSizeClasses: Record<'sm' | 'md' | 'lg', string> = {
    sm: 'text-[15px] leading-[1.75]',
    md: 'text-[16px] sm:text-[17px] leading-[1.85]',
    lg: 'text-[18px] sm:text-[20px] leading-[1.9]',
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    onAddNote(resource.id, currentChapter.number, noteInput.trim());
    setNoteInput('');
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={resource.title[lang]}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-2 sm:p-4 lg:p-8"
    >
      <div className="w-full max-w-6xl h-[94vh] sm:h-[90vh] flex flex-col bg-[#FBF9F5] border border-[#E5DEC9] rounded-xl shadow-2xl overflow-hidden">
        {/* Top Reader Toolbar */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-2.5 sm:gap-4 px-3.5 sm:px-6 py-2.5 sm:py-3.5 bg-[#0F2342] text-[#FBF9F5]">
          <div className="flex items-center justify-between gap-2.5 min-w-0 flex-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <BookOpen className="w-4 h-4 text-[#C59B27] shrink-0" />
              <div className="truncate">
                <span className="text-xs sm:text-sm font-semibold tracking-wide">
                  {resource.title[lang]}
                </span>
                <span className="mx-2 text-[#C59B27] hidden md:inline">·</span>
                <span className="text-xs text-[#D6CEBE] font-mono-tabular hidden md:inline">
                  DOI: {resource.doi}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close Online Reader Mobile"
              className="sm:hidden p-1.5 rounded bg-[#162E52] hover:bg-red-900/60 text-white transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-1.5 sm:gap-2.5 shrink-0">
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* Font size selector */}
              <div
                role="group"
                aria-label="Font Size Controls"
                className="flex items-center bg-[#162E52] rounded p-0.5 border border-[#254575]"
              >
                <button
                  type="button"
                  onClick={() => setFontScale('sm')}
                  className={`px-2 py-1 text-[11px] sm:text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    fontScale === 'sm'
                      ? 'bg-[#C59B27] text-[#0F2342] font-bold'
                      : 'text-[#E5DEC9] hover:text-white'
                  }`}
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() => setFontScale('md')}
                  className={`px-2 py-1 text-[11px] sm:text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    fontScale === 'md'
                      ? 'bg-[#C59B27] text-[#0F2342] font-bold'
                      : 'text-[#E5DEC9] hover:text-white'
                  }`}
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => setFontScale('lg')}
                  className={`px-2 py-1 text-[11px] sm:text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    fontScale === 'lg'
                      ? 'bg-[#C59B27] text-[#0F2342] font-bold'
                      : 'text-[#E5DEC9] hover:text-white'
                  }`}
                >
                  A+
                </button>
              </div>

              {/* Surface theme selector */}
              <div
                role="group"
                aria-label="Reading Paper Theme"
                className="flex items-center bg-[#162E52] rounded p-0.5 border border-[#254575]"
              >
                <button
                  type="button"
                  onClick={() => setSurface('archival')}
                  className={`px-2 py-1 text-[11px] sm:text-xs rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    surface === 'archival'
                      ? 'bg-[#FBF9F5] text-[#0F2342] font-semibold'
                      : 'text-[#E5DEC9]'
                  }`}
                >
                  Paper
                </button>
                <button
                  type="button"
                  onClick={() => setSurface('sepia')}
                  className={`px-2 py-1 text-[11px] sm:text-xs rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    surface === 'sepia'
                      ? 'bg-[#F3EAD8] text-[#292018] font-semibold'
                      : 'text-[#E5DEC9]'
                  }`}
                >
                  Sepia
                </button>
                <button
                  type="button"
                  onClick={() => setSurface('night')}
                  className={`px-2 py-1 text-[11px] sm:text-xs rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    surface === 'night'
                      ? 'bg-[#0F172A] text-white font-semibold border border-[#C59B27]'
                      : 'text-[#E5DEC9]'
                  }`}
                >
                  Night
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => onToggleBookmark(resource.id)}
                className="px-2.5 sm:px-3 py-1.5 text-xs font-medium bg-[#162E52] hover:bg-[#214170] border border-[#254575] rounded flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5 text-[#C59B27]" />
                <span className="hidden sm:inline">
                  {isBookmarked ? t.bookmarkSaved : t.bookmarkAdd}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onOpenCitation(resource)}
                className="px-2.5 sm:px-3 py-1.5 text-xs bg-[#C59B27] text-[#0F2342] hover:bg-[#d4a930] rounded flex items-center gap-1.5 font-semibold whitespace-nowrap shrink-0 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.citeWork}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close Online Reader"
                className="hidden sm:inline-flex p-1.5 rounded bg-[#162E52] hover:bg-red-900/60 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile & Tablet Panel Switcher (<1024px) */}
        <div
          role="tablist"
          aria-label="O‘quvchi bo‘limlari"
          className="lg:hidden grid grid-cols-3 border-b border-[#E5DEC9] bg-[#F3EFE6] p-1 gap-1 shrink-0"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mobilePanel === 'read'}
            onClick={() => setMobilePanel('read')}
            className={`py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              mobilePanel === 'read'
                ? 'bg-[#0F2342] text-white shadow-xs'
                : 'text-[#57534E] hover:text-[#0F2342]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>
              {lang === 'ru' ? 'Чтение' : lang === 'en' ? 'Read' : 'Mutolaa'}
            </span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mobilePanel === 'chapters'}
            onClick={() => setMobilePanel('chapters')}
            className={`py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              mobilePanel === 'chapters'
                ? 'bg-[#0F2342] text-white shadow-xs'
                : 'text-[#57534E] hover:text-[#0F2342]'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>
              {lang === 'ru'
                ? `Главы (${chapters.length})`
                : lang === 'en'
                ? `Chapters (${chapters.length})`
                : `Boblar (${chapters.length})`}
            </span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mobilePanel === 'notes'}
            onClick={() => setMobilePanel('notes')}
            className={`py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              mobilePanel === 'notes'
                ? 'bg-[#0F2342] text-white shadow-xs'
                : 'text-[#57534E] hover:text-[#0F2342]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>
              {lang === 'ru'
                ? `Заметки (${resourceNotes.length})`
                : lang === 'en'
                ? `Notes (${resourceNotes.length})`
                : `Qaydlar (${resourceNotes.length})`}
            </span>
          </button>
        </div>

        {/* Main 3-Column Academic Reader Body */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left: Table of Contents & Bibliographic Metadata */}
          <aside
            className={`lg:col-span-3 border-b lg:border-b-0 lg:border-r border-[#E5DEC9] bg-[#F3EFE6] p-4 sm:p-5 overflow-y-auto ${
              mobilePanel === 'chapters' ? 'block' : 'hidden lg:block'
            }`}
          >
            <p className="text-xs uppercase tracking-widest text-[#57534E] font-semibold mb-3">
              {t.readerChapterList}
            </p>
            <div className="space-y-1.5 mb-6">
              {chapters.map((ch, idx) => (
                <button
                  key={ch.number}
                  type="button"
                  onClick={() => {
                    setActiveChapterIdx(idx);
                    setMobilePanel('read');
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded text-xs transition-colors cursor-pointer ${
                    idx === activeChapterIdx
                      ? 'bg-[#0F2342] text-[#FBF9F5] font-medium'
                      : 'text-[#1C1917] hover:bg-[#E5DEC9]/60'
                  }`}
                >
                  <div className="line-clamp-2">{ch.title[lang]}</div>
                  <div
                    className={`mt-1 text-[11px] font-mono-tabular ${
                      idx === activeChapterIdx
                        ? 'text-[#C59B27]'
                        : 'text-[#57534E]'
                    }`}
                  >
                    p. {ch.pageStart}
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-[#E5DEC9] space-y-2 text-xs text-[#57534E]">
              <div>
                <span className="font-semibold text-[#1C1917]">Authors: </span>
                {resource.authors.join(', ')}
              </div>
              <div>
                <span className="font-semibold text-[#1C1917]">Publisher: </span>
                {resource.publisher}
              </div>
              <div className="font-mono-tabular">
                <span className="font-semibold text-[#1C1917]">UDC: </span>
                {resource.udc}
              </div>
              {resource.isbn && (
                <div className="font-mono-tabular">
                  <span className="font-semibold text-[#1C1917]">ISBN: </span>
                  {resource.isbn}
                </div>
              )}
            </div>
          </aside>

          {/* Center: Archival Reading Canvas (65-75ch constrained measure) */}
          <main
            className={`lg:col-span-6 p-4 sm:p-6 lg:p-12 overflow-y-auto transition-colors ${
              surfaceStyles[surface]
            } ${mobilePanel === 'read' ? 'block' : 'hidden lg:block'}`}
          >
            <div className="max-w-2xl mx-auto">
              <div className="text-xs uppercase tracking-widest opacity-60 font-mono-tabular mb-2">
                {resource.publisher} · {resource.year} · p. {currentChapter.pageStart}
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif-academic font-bold mb-6 pb-4 border-b border-current/15 balance-text">
                {currentChapter.title[lang]}
              </h2>

              <article
                className={`${fontSizeClasses[fontScale]} font-normal space-y-6`}
              >
                <p className="first-letter:text-4xl sm:first-letter:text-5xl first-letter:font-serif-academic first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[#B8860B]">
                  {currentChapter.content[lang]}
                </p>
                <p className="opacity-90">{resource.abstract[lang]}</p>
              </article>

              {/* Chapter pagination footer */}
              <div className="mt-10 sm:mt-12 pt-6 border-t border-current/15 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tabular">
                <span>
                  Page {currentChapter.pageStart} of {resource.pages}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={activeChapterIdx === 0}
                    onClick={() =>
                      setActiveChapterIdx((prev) => Math.max(0, prev - 1))
                    }
                    className="px-3 py-1.5 border border-current/25 rounded disabled:opacity-40 hover:bg-current/5 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    ← Prev
                  </button>
                  <button
                    type="button"
                    disabled={activeChapterIdx >= chapters.length - 1}
                    onClick={() =>
                      setActiveChapterIdx((prev) =>
                        Math.min(chapters.length - 1, prev + 1)
                      )
                    }
                    className="px-3 py-1.5 border border-current/25 rounded disabled:opacity-40 hover:bg-current/5 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          </main>

          {/* Right: Researcher Margin Notes */}
          <aside
            className={`lg:col-span-3 border-t lg:border-t-0 lg:border-l border-[#E5DEC9] bg-[#F3EFE6] p-4 sm:p-5 flex-col overflow-y-auto ${
              mobilePanel === 'notes' ? 'flex' : 'hidden lg:flex'
            }`}
          >
            <p className="text-xs uppercase tracking-widest text-[#57534E] font-semibold mb-3">
              {t.readerNotesTitle}
            </p>

            <form onSubmit={handleSaveNote} className="mb-5 space-y-2.5">
              <label htmlFor="reader-note-input" className="sr-only">
                {t.readerNotesTitle}
              </label>
              <textarea
                id="reader-note-input"
                rows={3}
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder={t.readerNotePlaceholder}
                className="w-full p-2.5 text-xs bg-white border border-[#E5DEC9] rounded text-[#1C1917] focus:outline-2 focus:outline-[#0F2342]"
              />
              <button
                type="submit"
                className="w-full py-2 px-3 text-xs font-semibold bg-[#0F2342] text-[#FBF9F5] rounded hover:bg-[#173461] flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {savedToast ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#C59B27]" />
                    {t.copiedText}
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    {t.readerSaveNote}
                  </>
                )}
              </button>
            </form>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {resourceNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-3 bg-white border border-[#E5DEC9] rounded text-xs space-y-1.5"
                >
                  <div className="text-[11px] text-[#57534E] font-mono-tabular">
                    Chapter {note.chapterNumber} · {note.createdAt}
                  </div>
                  <p className="text-[#1C1917] leading-relaxed">{note.text}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
