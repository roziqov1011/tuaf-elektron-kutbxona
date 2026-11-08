import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  CalendarClock,
  Download,
  Lock,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { Language, LibraryResource, StudentProfile } from '../types/library';
import { RESOURCE_TYPE_LABELS } from '../data/translations';
import { quickSearchSpotlight } from '../utils/libraryLogic';
import { Book3DCover } from './Book3DCover';

interface SpotlightSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  resources: LibraryResource[];
  lang: Language;
  studentProfile: StudentProfile | null;
  reservedIds: Set<string>;
  onOpenReader: (resource: LibraryResource) => void;
  onDownloadPdf: (resource: LibraryResource) => void;
  onReserveBook: (resource: LibraryResource) => void;
}

export const SpotlightSearchModal: React.FC<SpotlightSearchModalProps> = ({
  isOpen,
  onClose,
  resources,
  lang,
  studentProfile,
  reservedIds,
  onOpenReader,
  onDownloadPdf,
  onReserveBook,
}) => {
  const [query, setQuery] = useState('');
  const [quickCategory, setQuickCategory] = useState<
    'all' | 'book' | 'dissertation'
  >('all');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 40);
    } else {
      setQuery('');
      setQuickCategory('all');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const pool = useMemo(() => {
    if (quickCategory === 'all') return resources;
    return resources.filter((r) => r.type === quickCategory);
  }, [resources, quickCategory]);

  const results = useMemo(
    () => quickSearchSpotlight(pool, query, lang, 6),
    [pool, query, lang]
  );

  if (!isOpen) return null;

  const suggestedQueries = [
    'Bank ishi',
    'Omonov',
    'Alisher Navoiy',
    'Pedagogika',
    'Sun’iy intellekt',
    '60410600',
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="ARM Intellektual Tezkor Qidiruv"
      className="fixed inset-0 z-50 flex items-start justify-center bg-[#041E41]/75 backdrop-blur-sm p-2.5 sm:p-6 lg:pt-16 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-3xl bg-[#FBF9F5] border-2 border-[#C59B27]/60 rounded-2xl shadow-2xl overflow-hidden my-auto sm:my-0">
        {/* Top Search Input Header */}
        <div className="bg-[#041E41] text-white p-3.5 sm:p-5 border-b border-[#C59B27]/35">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#FDE68A]">
              <Sparkles className="w-4 h-4 text-[#C59B27] shrink-0" />
              <span>
                {lang === 'ru'
                  ? 'Интеллектуальный поиск по фонду АРМ ТУАФ'
                  : lang === 'en'
                  ? 'TUAF ARM Instant Academic Spotlight'
                  : 'TUAF ARM Intellektual Tezkor Qidiruv Oynasi'}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tezkor qidiruvni yopish"
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono-tabular text-white/90 flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>ESC</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative">
            <Search className="w-5 h-5 text-[#C59B27] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <label htmlFor="spotlight-search-input" className="sr-only">
              Kitob, muallif, UDK yoki DOI bo‘yicha qidirish
            </label>
            <input
              ref={inputRef}
              id="spotlight-search-input"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                lang === 'ru'
                  ? 'Введите название книги, автора, УДК или шифр направления...'
                  : lang === 'en'
                  ? 'Type book title, author, UDC call number, or DOI...'
                  : 'Kitob nomi, muallif, UDK raqami yoki yo‘nalish shifrini yozing...'
              }
              className="w-full pl-11 pr-4 py-3 sm:py-3.5 bg-white text-[#041E41] rounded-xl text-sm sm:text-base font-medium placeholder:text-stone-400 focus:outline-2 focus:outline-[#C59B27]"
            />
          </div>

          {/* Filter & Quick Suggestions Strip */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div
              role="group"
              aria-label="Resurs turi bo‘yicha saralash"
              className="flex items-center gap-1 bg-[#0B2D5C] p-1 rounded-lg border border-white/15"
            >
              {(
                [
                  {
                    id: 'all',
                    label:
                      lang === 'ru'
                        ? 'Все'
                        : lang === 'en'
                        ? 'All'
                        : 'Barchasi',
                  },
                  {
                    id: 'book',
                    label:
                      lang === 'ru'
                        ? 'Книги и учебники'
                        : lang === 'en'
                        ? 'Books'
                        : 'Kitob va darsliklar',
                  },
                  {
                    id: 'dissertation',
                    label:
                      lang === 'ru'
                        ? 'Диссертации'
                        : lang === 'en'
                        ? 'Dissertations'
                        : 'Dissertatsiyalar',
                  },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setQuickCategory(tab.id)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    quickCategory === tab.id
                      ? 'bg-[#C59B27] text-[#041E41]'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {suggestedQueries.slice(0, 4).map((sq) => (
                <button
                  key={sq}
                  type="button"
                  onClick={() => setQuery(sq)}
                  className="px-2 py-1 text-[11px] rounded bg-white/10 hover:bg-white/20 text-stone-200 transition-colors cursor-pointer"
                >
                  {sq}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live 3D Results List */}
        <div className="max-h-[62vh] overflow-y-auto p-3 sm:p-5 space-y-2.5 divide-y divide-[#E5DEC9]/70">
          {results.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <p className="font-serif-academic text-xl font-bold text-[#0F2342]">
                Hech qanday adabiyot topilmadi
              </p>
              <p className="text-xs text-[#57534E]">
                Boshqa kalit so‘z yoki UDK raqamini kiritib ko‘ring.
              </p>
            </div>
          ) : (
            results.map((item) => {
              const isReserved = reservedIds.has(item.id);
              return (
                <div
                  key={item.id}
                  className="pt-2.5 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-[#F3EFE6]/80 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <Book3DCover
                      resource={item}
                      lang={lang}
                      size="xs"
                      showRibbon={false}
                      onClick={() => {
                        onClose();
                        onOpenReader(item);
                      }}
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#57534E]">
                        <span className="font-semibold text-[#B8860B]">
                          {RESOURCE_TYPE_LABELS[item.type][lang]}
                        </span>
                        <span>·</span>
                        <span className="font-mono-tabular">
                          UDK {item.udc}
                        </span>
                        <span>·</span>
                        <span className="font-mono-tabular">
                          {item.availableCopies}/{item.totalCopies} bo‘sh
                        </span>
                      </div>
                      <h4 className="font-serif-academic font-bold text-base sm:text-lg text-[#0F2342] leading-snug truncate">
                        {item.title[lang]}
                      </h4>
                      <p className="text-xs text-[#57534E] truncate">
                        {item.authors.join(', ')} · {item.year}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenReader(item);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold bg-[#0F2342] hover:bg-[#173461] text-white rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#C59B27]" />
                      <span>Mutolaa</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onDownloadPdf(item);
                      }}
                      className="px-2.5 py-1.5 text-xs font-semibold bg-[#0099B5] hover:bg-[#008199] text-white rounded-lg flex items-center gap-1 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      {studentProfile ? (
                        <Download className="w-3.5 h-3.5" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-[#FDE68A]" />
                      )}
                      <span>PDF</span>
                    </button>
                    <button
                      type="button"
                      disabled={isReserved}
                      onClick={() => {
                        onClose();
                        onReserveBook(item);
                      }}
                      className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border flex items-center gap-1 transition-colors whitespace-nowrap cursor-pointer ${
                        isReserved
                          ? 'bg-[#F7F1E1] border-[#B8860B] text-[#B8860B]'
                          : 'bg-white hover:bg-[#F3EFE6] border-[#0F2342] text-[#0F2342]'
                      }`}
                    >
                      <CalendarClock className="w-3.5 h-3.5 text-[#B8860B]" />
                      <span>{isReserved ? 'Band' : 'Band qilish'}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Guide */}
        <div className="bg-[#F3EFE6] border-t border-[#E5DEC9] px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#57534E] font-mono-tabular">
          <span>
            Ikki sahifali 3D mutolaa oynasini ochish uchun «Mutolaa» tugmasini
            bosing
          </span>
          <span>Tezkor tugma: Ctrl + K</span>
        </div>
      </div>
    </div>
  );
};
