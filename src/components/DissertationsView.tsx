import React, { useState } from 'react';
import { Award, BookOpen, Check, Quote, Search } from 'lucide-react';
import { AcademicDegree, Language, LibraryResource } from '../types/library';
import { FACULTY_LABELS, UI_TRANSLATIONS } from '../data/translations';

interface DissertationsViewProps {
  resources: LibraryResource[];
  lang: Language;
  onOpenReader: (resource: LibraryResource) => void;
  onOpenCitation: (resource: LibraryResource) => void;
  onReserveBook: (resource: LibraryResource) => void;
  reservedIds: Set<string>;
}

export const DissertationsView: React.FC<DissertationsViewProps> = ({
  resources,
  lang,
  onOpenReader,
  onOpenCitation,
  onReserveBook,
  reservedIds,
}) => {
  const [degreeFilter, setDegreeFilter] = useState<AcademicDegree | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const t = UI_TRANSLATIONS[lang];

  const repositoryItems = resources.filter((item) => {
    const isRepoType =
      item.type === 'dissertation' ||
      item.type === 'article' ||
      Boolean(item.degree);
    if (!isRepoType) return false;

    if (degreeFilter !== 'all' && item.degree !== degreeFilter) {
      return false;
    }

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const matchTitle =
        item.title.uz.toLowerCase().includes(q) ||
        item.title.en.toLowerCase().includes(q) ||
        item.title.ru.toLowerCase().includes(q);
      const matchAuthor = item.authors.some((a) =>
        a.toLowerCase().includes(q)
      );
      const matchDoi = item.doi.toLowerCase().includes(q);
      const matchUdc = item.udc.toLowerCase().includes(q);
      return matchTitle || matchAuthor || matchDoi || matchUdc;
    }

    return true;
  });

  const degreeLabels: Record<'all' | AcademicDegree, string> = {
    all:
      lang === 'ru'
        ? 'Все работы'
        : lang === 'en'
        ? 'All Works'
        : 'Barchasi',
    DSc: 'DSc',
    PhD: 'PhD',
    Master:
      lang === 'ru'
        ? 'Магистратура'
        : lang === 'en'
        ? 'Master'
        : 'Magistratura',
    Monograph:
      lang === 'ru'
        ? 'Монографии'
        : lang === 'en'
        ? 'Monographs'
        : 'Monografiyalar',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* Clean Section Header */}
      <div className="border-b border-[#E5DEC9] pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif-academic font-bold text-[#0F2342]">
            {t.dissertationsTitle}
          </h1>
          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
            {t.dissertationsSubtitle}
          </p>
        </div>

        <div
          role="group"
          aria-label="Ilmiy daraja filtri"
          className="flex flex-wrap items-center gap-1 p-1 bg-[#F3EFE6] border border-[#E5DEC9] rounded-lg self-start max-w-full"
        >
          {(['all', 'DSc', 'PhD', 'Monograph'] as const).map((deg) => (
            <button
              key={deg}
              type="button"
              onClick={() => setDegreeFilter(deg)}
              className={`px-3 sm:px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                degreeFilter === deg
                  ? 'bg-[#0F2342] text-[#FBF9F5] font-semibold'
                  : 'text-[#57534E] hover:text-[#0F2342]'
              }`}
            >
              {degreeLabels[deg]}
            </button>
          ))}
        </div>
      </div>

      {/* Clean Search Bar */}
      <div className="bg-white border border-[#E5DEC9] rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#57534E] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <label htmlFor="dissertation-search" className="sr-only">
            {t.searchPlaceholder}
          </label>
          <input
            id="dissertation-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              lang === 'ru'
                ? 'Поиск по теме диссертации или автору...'
                : lang === 'en'
                ? 'Search by dissertation topic or author...'
                : 'Dissertatsiya mavzusi yoki muallif bo‘yicha qidirish...'
            }
            className="w-full pl-10 pr-4 py-2.5 sm:py-2 text-sm bg-[#FBF9F5] border border-[#E5DEC9] rounded-lg text-[#1C1917]"
          />
        </div>
        <div className="text-xs text-[#57534E] shrink-0">
          {repositoryItems.length} {t.resultsFound}
        </div>
      </div>

      {/* Repository List */}
      <div className="space-y-4">
        {repositoryItems.map((item) => {
          const isReserved = reservedIds.has(item.id);
          return (
            <article
              key={item.id}
              className="bg-white border border-[#E5DEC9] rounded-xl p-5 sm:p-6 transition-colors hover:border-[#0F2342]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
                <div className="lg:col-span-8 space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#57534E]">
                    <span className="font-bold text-[#B8860B]">
                      {item.degree || RESOURCE_TYPE_LABELS_FALLBACK(lang)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{item.year}</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {item.pages} {t.pagesUnit}
                    </span>
                  </div>

                  <h2 className="text-xl lg:text-2xl font-serif-academic font-bold text-[#0F2342]">
                    {item.title[lang]}
                  </h2>

                  <div className="text-xs text-[#1C1917] flex flex-wrap items-center gap-2">
                    <span className="font-semibold">
                      {item.authors.join(', ')}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#57534E]">
                      {FACULTY_LABELS[item.faculty][lang]}
                    </span>
                    {item.supervisor && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#B8860B] font-medium">
                          {lang === 'ru'
                            ? `Научный руководитель: ${item.supervisor}`
                            : lang === 'en'
                            ? `Supervisor: ${item.supervisor}`
                            : `Ilmiy rahbar: ${item.supervisor}`}
                        </span>
                      </>
                    )}
                  </div>

                  <p className="text-sm text-[#57534E] leading-relaxed line-clamp-2">
                    {item.abstract[lang]}
                  </p>
                </div>

                {/* Right Column: Actions */}
                <div className="lg:col-span-4 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-[#E5DEC9] lg:pl-6 flex flex-col justify-between space-y-3.5 sm:space-y-4">
                  <div className="flex items-center justify-between text-xs text-[#57534E]">
                    <span className="inline-flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-[#B8860B]" />
                      {item.defenseDate || item.year}
                    </span>
                    <span>
                      {item.citationsCount} {t.citationsUnit}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenReader(item)}
                      className="flex-1 py-2.5 px-3 text-xs font-semibold bg-[#0F2342] text-[#FBF9F5] rounded-lg hover:bg-[#173461] flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#C59B27]" />
                      {t.readOnline}
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenCitation(item)}
                      className="py-2.5 px-3 text-xs font-medium bg-[#F3EFE6] text-[#0F2342] border border-[#E5DEC9] rounded-lg hover:bg-[#E5DEC9]/70 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                    >
                      <Quote className="w-3.5 h-3.5" />
                      {t.citeWork}
                    </button>

                    <button
                      type="button"
                      onClick={() => onReserveBook(item)}
                      disabled={isReserved}
                      className={`py-2.5 px-3 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                        isReserved
                          ? 'bg-[#F7F1E1] text-[#B8860B] border-[#B8860B]'
                          : 'bg-white text-[#0F2342] border-[#E5DEC9] hover:bg-[#F3EFE6]'
                      }`}
                    >
                      {isReserved ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        t.reserveBook
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

function RESOURCE_TYPE_LABELS_FALLBACK(lang: Language): string {
  if (lang === 'ru') return 'Научная статья';
  if (lang === 'en') return 'Research Article';
  return 'Ilmiy maqola';
}
