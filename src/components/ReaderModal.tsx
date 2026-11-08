import React, { useState } from 'react';
import {
  BookOpen,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Columns2,
  FileText,
  List,
  MessageSquare,
  Plus,
  Quote,
  Sparkles,
  X,
} from 'lucide-react';
import { Language, LibraryResource, PersonalNote } from '../types/library';
import { UI_TRANSLATIONS } from '../data/translations';
import {
  generateCitation,
  splitChapterIntoSpreadPages,
} from '../utils/libraryLogic';

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
type ReaderLayoutMode = 'spread' | 'single';

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
  const [layoutMode, setLayoutMode] = useState<ReaderLayoutMode>('spread');
  const [mobilePanel, setMobilePanel] = useState<MobileReaderPanel>('read');
  const [showSideDrawers, setShowSideDrawers] = useState(true);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [flipKey, setFlipKey] = useState(0);
  const [noteInput, setNoteInput] = useState('');
  const [savedToast, setSavedToast] = useState(false);

  if (!resource) return null;

  const t = UI_TRANSLATIONS[lang];
  const chapters = resource.chapters;
  const currentChapter = chapters[activeChapterIdx] || chapters[0];
  const resourceNotes = notes.filter((n) => n.resourceId === resource.id);

  const { leftPageParagraphs, rightPageParagraphs } =
    splitChapterIntoSpreadPages(
      currentChapter.content[lang],
      resource.abstract[lang]
    );

  const surfaceStyles: Record<ReaderSurface, string> = {
    archival: 'bg-[#FBF9F5] text-[#1C1917] border-[#E5DEC9]',
    sepia: 'bg-[#F3EAD8] text-[#292018] border-[#DFC9A6]',
    night: 'bg-[#0B1528] text-[#E2E8F0] border-[#1E3A5F]',
  };

  const deskBackdropStyles: Record<ReaderSurface, string> = {
    archival: 'bg-[#EAE3D2]',
    sepia: 'bg-[#DFD2BA]',
    night: 'bg-[#050B16]',
  };

  const fontSizeClasses: Record<'sm' | 'md' | 'lg', string> = {
    sm: 'text-[14px] sm:text-[15px] leading-[1.72]',
    md: 'text-[15px] sm:text-[16px] leading-[1.82]',
    lg: 'text-[17px] sm:text-[18px] leading-[1.88]',
  };

  const handleSelectChapter = (nextIdx: number) => {
    if (nextIdx < 0 || nextIdx >= chapters.length) return;
    setFlipDirection(nextIdx >= activeChapterIdx ? 'next' : 'prev');
    setActiveChapterIdx(nextIdx);
    setFlipKey((prev) => prev + 1);
    setMobilePanel('read');
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    onAddNote(resource.id, currentChapter.number, noteInput.trim());
    setNoteInput('');
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const leftPageNum = currentChapter.pageStart;
  const rightPageNum = currentChapter.pageStart + 1;
  const gostPreview = generateCitation(resource, 'GOST', lang);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={resource.title[lang]}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-1.5 sm:p-4 lg:p-6"
    >
      <div className="w-full max-w-[1380px] h-[95vh] sm:h-[92vh] flex flex-col bg-[#FBF9F5] border border-[#C59B27]/50 rounded-2xl shadow-2xl overflow-hidden">
        {/* Top Royal Library Reader Toolbar */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-2 sm:gap-3 px-3.5 sm:px-6 py-2.5 sm:py-3 bg-[#041E41] text-[#FBF9F5] border-b border-[#C59B27]/40 shrink-0">
          <div className="flex items-center justify-between gap-2.5 min-w-0 flex-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-7 h-7 rounded-lg bg-[#C59B27]/20 border border-[#C59B27]/50 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4 text-[#FDE68A]" />
              </span>
              <div className="truncate">
                <span className="text-xs sm:text-sm font-bold tracking-wide text-white">
                  {resource.title[lang]}
                </span>
                <span className="mx-2 text-[#C59B27] hidden xl:inline">·</span>
                <span className="text-xs text-[#D6CEBE] font-mono-tabular hidden xl:inline">
                  UDK {resource.udc} · DOI: {resource.doi}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close Online Reader Mobile"
              className="sm:hidden p-1.5 rounded-lg bg-[#162E52] hover:bg-red-900/60 text-white transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-1.5 sm:gap-2 shrink-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Two-Page Spread vs Single-Page Toggle (Desktop) */}
              <div
                role="group"
                aria-label="Kitob ko‘rinishi rejimi"
                className="hidden md:flex items-center bg-[#0B2D5C] rounded-lg p-0.5 border border-white/15"
              >
                <button
                  type="button"
                  onClick={() => setLayoutMode('spread')}
                  className={`px-2.5 py-1 text-xs rounded-md flex items-center gap-1 transition-colors whitespace-nowrap cursor-pointer ${
                    layoutMode === 'spread'
                      ? 'bg-[#C59B27] text-[#041E41] font-bold'
                      : 'text-[#E5DEC9] hover:text-white'
                  }`}
                >
                  <Columns2 className="w-3.5 h-3.5" />
                  <span>2-Betli Kitob</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLayoutMode('single')}
                  className={`px-2.5 py-1 text-xs rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    layoutMode === 'single'
                      ? 'bg-[#C59B27] text-[#041E41] font-bold'
                      : 'text-[#E5DEC9] hover:text-white'
                  }`}
                >
                  1-Betli
                </button>
              </div>

              {/* Toggle Side Panels on Desktop for Maximum Book Focus */}
              <button
                type="button"
                onClick={() => setShowSideDrawers((prev) => !prev)}
                className="hidden lg:inline-flex px-2.5 py-1 text-xs font-medium bg-[#0B2D5C] hover:bg-[#163d77] text-[#E5DEC9] border border-white/15 rounded-lg items-center gap-1.5 transition-colors cursor-pointer"
              >
                <List className="w-3.5 h-3.5 text-[#C59B27]" />
                <span>{showSideDrawers ? 'Keng ekran' : 'Mundarija'}</span>
              </button>

              {/* Font size selector */}
              <div
                role="group"
                aria-label="Font Size Controls"
                className="flex items-center bg-[#0B2D5C] rounded-lg p-0.5 border border-white/15"
              >
                <button
                  type="button"
                  onClick={() => setFontScale('sm')}
                  className={`px-2 py-1 text-[11px] sm:text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    fontScale === 'sm'
                      ? 'bg-[#C59B27] text-[#041E41] font-bold'
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
                      ? 'bg-[#C59B27] text-[#041E41] font-bold'
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
                      ? 'bg-[#C59B27] text-[#041E41] font-bold'
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
                className="flex items-center bg-[#0B2D5C] rounded-lg p-0.5 border border-white/15"
              >
                <button
                  type="button"
                  onClick={() => setSurface('archival')}
                  className={`px-2 py-1 text-[11px] sm:text-xs rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    surface === 'archival'
                      ? 'bg-[#FBF9F5] text-[#041E41] font-semibold'
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
                className="px-2.5 sm:px-3 py-1.5 text-xs font-medium bg-[#0B2D5C] hover:bg-[#163d77] border border-white/15 rounded-lg flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Bookmark
                  className={`w-3.5 h-3.5 ${
                    isBookmarked
                      ? 'fill-[#C59B27] text-[#C59B27]'
                      : 'text-[#C59B27]'
                  }`}
                />
                <span className="hidden sm:inline">
                  {isBookmarked ? t.bookmarkSaved : t.bookmarkAdd}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onOpenCitation(resource)}
                className="px-2.5 sm:px-3 py-1.5 text-xs bg-[#C59B27] text-[#041E41] hover:bg-[#d4a930] rounded-lg flex items-center gap-1.5 font-bold whitespace-nowrap shrink-0 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.citeWork}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close Online Reader"
                className="hidden sm:inline-flex p-1.5 rounded-lg bg-[#0B2D5C] hover:bg-red-900/70 text-white transition-colors cursor-pointer"
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

        {/* Main Academic Reader Body */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left: Table of Contents & Bibliographic Metadata */}
          <aside
            className={`lg:col-span-2 border-b lg:border-b-0 lg:border-r border-[#E5DEC9] bg-[#F3EFE6] p-3.5 sm:p-4 overflow-y-auto ${
              mobilePanel === 'chapters'
                ? 'block'
                : showSideDrawers
                ? 'hidden lg:block'
                : 'hidden'
            }`}
          >
            <p className="text-[11px] uppercase tracking-widest text-[#57534E] font-semibold mb-2.5">
              {t.readerChapterList}
            </p>
            <div className="space-y-1.5 mb-5">
              {chapters.map((ch, idx) => (
                <button
                  key={ch.number}
                  type="button"
                  onClick={() => handleSelectChapter(idx)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    idx === activeChapterIdx
                      ? 'bg-[#0F2342] text-[#FBF9F5] font-semibold shadow-xs'
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

            <div className="pt-3.5 border-t border-[#E5DEC9] space-y-2 text-xs text-[#57534E]">
              <div>
                <span className="font-semibold text-[#1C1917]">Authors: </span>
                {resource.authors.join(', ')}
              </div>
              <div>
                <span className="font-semibold text-[#1C1917]">
                  Publisher:{' '}
                </span>
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

          {/* Center: Open Book Desk Surface */}
          <main
            className={`${
              showSideDrawers ? 'lg:col-span-7' : 'lg:col-span-12'
            } p-2.5 sm:p-5 lg:p-7 overflow-y-auto transition-colors flex flex-col justify-between ${
              deskBackdropStyles[surface]
            } ${mobilePanel === 'read' ? 'flex' : 'hidden lg:flex'}`}
          >
            {/* Open Hardcover Book Container */}
            <div
              key={flipKey}
              className={`relative my-auto w-full max-w-5xl mx-auto rounded-xl border tuaf-open-book-shell overflow-hidden transition-colors ${
                surfaceStyles[surface]
              } ${
                flipDirection === 'next'
                  ? 'tuaf-page-flip-next'
                  : 'tuaf-page-flip-prev'
              }`}
            >
              {/* Hanging Crimson/Gold Silk Bookmark Ribbon */}
              <button
                type="button"
                onClick={() => onToggleBookmark(resource.id)}
                title={isBookmarked ? t.bookmarkSaved : t.bookmarkAdd}
                aria-label="Kitob sahifasiga xatcho‘p qo‘yish"
                className={`absolute top-0 right-6 sm:right-10 z-20 w-6 sm:w-7 transition-all duration-300 cursor-pointer flex flex-col items-center ${
                  isBookmarked ? 'h-16 sm:h-20' : 'h-9 sm:h-11 hover:h-14'
                }`}
              >
                <div
                  className={`w-full h-full shadow-md ${
                    isBookmarked
                      ? 'bg-gradient-to-b from-[#B91C1C] via-[#991B1B] to-[#7F1D1D] border-x border-[#FDE68A]/50'
                      : 'bg-gradient-to-b from-[#C59B27] to-[#9A7209]'
                  }`}
                  style={{
                    clipPath:
                      'polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)',
                  }}
                />
              </button>

              {layoutMode === 'spread' ? (
                /* TWO-PAGE OPEN BOOK SPREAD (Desktop & Tablet >= 768px; Responsive Single Stack on Mobile) */
                <div className="relative grid grid-cols-1 md:grid-cols-2 min-h-[470px] lg:min-h-[530px]">
                  {/* Center Book Spine Crease & Stitched Gutter Shadow (Desktop/Tablet) */}
                  <div
                    aria-hidden="true"
                    className="hidden md:block pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-10 z-10"
                    style={{
                      background:
                        surface === 'night'
                          ? 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 42%, rgba(255,255,255,0.06) 50%, rgba(0,0,0,0.5) 58%, rgba(0,0,0,0) 100%)'
                          : 'linear-gradient(90deg, rgba(28,25,23,0) 0%, rgba(28,25,23,0.12) 42%, rgba(28,25,23,0.26) 50%, rgba(28,25,23,0.12) 58%, rgba(28,25,23,0) 100%)',
                    }}
                  />

                  {/* LEFT PAGE (VERSO) */}
                  <div className="p-4 sm:p-6 lg:p-9 md:pr-8 lg:pr-11 flex flex-col justify-between border-b md:border-b-0 border-current/10">
                    <div>
                      {/* Running Header Left */}
                      <div className="flex items-center justify-between gap-2 text-[10px] sm:text-[11px] uppercase tracking-widest opacity-60 font-mono-tabular pb-3 mb-4 border-b border-current/15 pr-12 md:pr-0">
                        <span className="truncate">
                          TUAF ARM · {resource.programCode}
                        </span>
                        <span className="shrink-0">
                          Bob {currentChapter.number} / {chapters.length}
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-2xl lg:text-[26px] font-serif-academic font-bold mb-4 leading-snug balance-text">
                        {currentChapter.title[lang]}
                      </h2>

                      <article
                        className={`${fontSizeClasses[fontScale]} font-normal space-y-4`}
                      >
                        {leftPageParagraphs.map((para, i) => (
                          <p
                            key={i}
                            className={
                              i === 0
                                ? 'first-letter:text-4xl sm:first-letter:text-5xl first-letter:font-serif-academic first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[#B8860B]'
                                : ''
                            }
                          >
                            {para}
                          </p>
                        ))}
                      </article>
                    </div>

                    {/* Left Page Footer */}
                    <div className="pt-5 mt-6 border-t border-current/10 flex items-center justify-between text-[11px] font-mono-tabular opacity-65">
                      <span>{resource.authors[0]}</span>
                      <span>Bet {leftPageNum}</span>
                    </div>
                  </div>

                  {/* RIGHT PAGE (RECTO) */}
                  <div className="p-4 sm:p-6 lg:p-9 md:pl-8 lg:pl-11 flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Running Header Right */}
                      <div className="flex items-center justify-between gap-2 text-[10px] sm:text-[11px] uppercase tracking-widest opacity-60 font-mono-tabular pb-3 mb-4 border-b border-current/15 pr-12 sm:pr-14">
                        <span className="truncate">{resource.publisher}</span>
                        <span className="shrink-0">{resource.year}</span>
                      </div>

                      <article
                        className={`${fontSizeClasses[fontScale]} font-normal space-y-4`}
                      >
                        {rightPageParagraphs.map((para, i) => (
                          <p key={i} className="opacity-95">
                            {para}
                          </p>
                        ))}
                      </article>

                      {/* Archival Curatorial Stamp & Quick Citation Box */}
                      <div
                        className={`mt-5 p-3.5 rounded-xl border ${
                          surface === 'night'
                            ? 'bg-[#112240]/70 border-[#C59B27]/35'
                            : 'bg-black/[0.03] border-[#C59B27]/40'
                        } space-y-2`}
                      >
                        <div className="flex items-center justify-between gap-2 text-[11px] font-semibold text-[#B8860B]">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Ilmiy iqtibos namunasi (GOST)</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => onOpenCitation(resource)}
                            className="underline hover:opacity-80 cursor-pointer flex items-center gap-1"
                          >
                            <Quote className="w-3 h-3" />
                            <span>Barcha formatlar</span>
                          </button>
                        </div>
                        <p className="text-[11px] font-mono-tabular opacity-80 leading-relaxed line-clamp-2">
                          {gostPreview}
                        </p>
                      </div>
                    </div>

                    {/* Right Page Footer */}
                    <div className="pt-5 mt-6 border-t border-current/10 flex items-center justify-between text-[11px] font-mono-tabular opacity-65">
                      <span>UDK {resource.udc}</span>
                      <span>Bet {rightPageNum}</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* SINGLE-PAGE CLASSIC SCROLL MODE */
                <div className="p-5 sm:p-8 lg:p-12 max-w-2xl mx-auto">
                  <div className="text-xs uppercase tracking-widest opacity-60 font-mono-tabular mb-2">
                    {resource.publisher} · {resource.year} · p.{' '}
                    {currentChapter.pageStart}
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
                </div>
              )}
            </div>

            {/* Bottom Page-Turn Control Bar */}
            <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-3 max-w-5xl mx-auto w-full text-xs font-mono-tabular">
              <button
                type="button"
                disabled={activeChapterIdx === 0}
                onClick={() => handleSelectChapter(activeChapterIdx - 1)}
                className="px-3.5 py-2 rounded-xl bg-[#041E41] text-white disabled:opacity-40 hover:bg-[#0B2D5C] flex items-center gap-1.5 font-sans font-semibold shadow-sm transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 text-[#C59B27]" />
                <span>Oldingi bob</span>
              </button>

              <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-black/10">
                <span>
                  Bet {leftPageNum}–{rightPageNum} / {resource.pages}
                </span>
                <span>·</span>
                <span>
                  Bob {activeChapterIdx + 1} / {chapters.length}
                </span>
              </div>

              <button
                type="button"
                disabled={activeChapterIdx >= chapters.length - 1}
                onClick={() => handleSelectChapter(activeChapterIdx + 1)}
                className="px-3.5 py-2 rounded-xl bg-[#041E41] text-white disabled:opacity-40 hover:bg-[#0B2D5C] flex items-center gap-1.5 font-sans font-semibold shadow-sm transition-colors cursor-pointer"
              >
                <span>Keyingi bob</span>
                <ChevronRight className="w-4 h-4 text-[#C59B27]" />
              </button>
            </div>
          </main>

          {/* Right: Researcher Margin Notes */}
          <aside
            className={`lg:col-span-3 border-t lg:border-t-0 lg:border-l border-[#E5DEC9] bg-[#F3EFE6] p-4 sm:p-5 flex-col overflow-y-auto ${
              mobilePanel === 'notes'
                ? 'flex'
                : showSideDrawers
                ? 'hidden lg:flex'
                : 'hidden'
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
                className="w-full p-2.5 text-xs bg-white border border-[#E5DEC9] rounded-lg text-[#1C1917] focus:outline-2 focus:outline-[#0F2342]"
              />
              <button
                type="submit"
                className="w-full py-2 px-3 text-xs font-semibold bg-[#0F2342] text-[#FBF9F5] rounded-lg hover:bg-[#173461] flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
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
                  className="p-3 bg-white border border-[#E5DEC9] rounded-lg text-xs space-y-1.5"
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
