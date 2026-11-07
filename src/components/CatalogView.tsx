import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  Check,
  Download,
  FileText,
  GraduationCap,
  LampDesk,
  Lock,
  Network,
  Play,
  Quote,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Video,
  X,
} from 'lucide-react';
import {
  CatalogFilterState,
  FacultyId,
  Language,
  LibraryResource,
  ResourceType,
  StudentProfile,
} from '../types/library';
import {
  FACULTY_LABELS,
  RESOURCE_TYPE_LABELS,
  UI_TRANSLATIONS,
} from '../data/translations';
import {
  TUAF_HERO_VIDEO_EMBED_URL,
  TUAF_HERO_VIDEO_MODAL_URL,
  TUAF_HERO_VIDEO_POSTER,
  TUAF_OFFICIAL_PROGRAMS,
} from '../data/seedLibraryData';
import { FAMOUS_BOOKS } from '../data/famousBooks';
import { ActiveTab } from './TopBar';

interface CatalogViewProps {
  resources: LibraryResource[];
  filteredResources: LibraryResource[];
  filters: CatalogFilterState;
  setFilters: React.Dispatch<React.SetStateAction<CatalogFilterState>>;
  onResetFilters: () => void;
  lang: Language;
  onOpenReader: (resource: LibraryResource) => void;
  onOpenCitation: (resource: LibraryResource) => void;
  onReserveBook: (resource: LibraryResource) => void;
  reservedIds: Set<string>;
  bookmarkedIds: Set<string>;
  onToggleBookmark: (resourceId: string) => void;
  onNavigateTab?: (tab: ActiveTab) => void;
  studentProfile: StudentProfile | null;
  onDownloadPdf: (resource: LibraryResource) => void;
  downloadedIds: Set<string>;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  resources,
  filteredResources,
  filters,
  setFilters,
  onResetFilters,
  lang,
  onOpenReader,
  onOpenCitation,
  onReserveBook,
  reservedIds,
  bookmarkedIds,
  onToggleBookmark,
  onNavigateTab,
  studentProfile,
  onDownloadPdf,
  downloadedIds,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [programLevelTab, setProgramLevelTab] = useState<'bachelor' | 'master'>(
    'bachelor'
  );
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isYtPlaying, setIsYtPlaying] = useState(false);
  const ytIframeRef = useRef<HTMLIFrameElement | null>(null);

  const t = UI_TRANSLATIONS[lang];

  // Listen for YouTube IFrame API playback state (playerState === 1) so the video fades in cleanly over the building poster only when playing
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.includes('youtube.com')) return;
      try {
        const data =
          typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (
          data?.event === 'infoDelivery' &&
          data?.info?.playerState === 1
        ) {
          setIsYtPlaying(true);
        }
      } catch {
        // Ignore non-JSON messages
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleIframeLoad = () => {
    try {
      ytIframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }),
        '*'
      );
    } catch {
      // Ignore cross-origin postMessage errors
    }
  };

  const leadItem =
    resources.find((r) => r.featuredRank === 'lead') || resources[0];
  const secondaryItems = resources
    .filter((r) => r.id !== leadItem?.id)
    .slice(0, 2);

  const faculties: FacultyId[] = [
    'all',
    'economics-finance',
    'pedagogy-languages',
    'natural-exact-sciences',
    'humanities-social',
    'digital-innovation',
  ];

  const resourceTypes: (ResourceType | 'all')[] = [
    'all',
    'book',
    'dissertation',
    'article',
    'manuscript',
  ];

  const displayedPrograms = TUAF_OFFICIAL_PROGRAMS.filter(
    (p) => p.level === programLevelTab
  );

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-explorer');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Official TUAF Video Hero Section adapted from https://tuaf.vercel.app */}
      <section className="relative bg-[#041E41] text-white overflow-hidden min-h-[480px] sm:min-h-[560px] lg:min-h-[620px]">
        {/* Background Video Layer (YouTube snzSKADGzqw + High-Res TUAF Building Poster) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
          {!brokenImages['hero-poster'] && (
            <img
              src={TUAF_HERO_VIDEO_POSTER}
              alt="Turon Universiteti Andijon filiali bosh o‘quv binosi"
              onError={() =>
                setBrokenImages((prev) => ({ ...prev, 'hero-poster': true }))
              }
              className="absolute inset-0 w-full h-full object-cover object-center scale-105 opacity-75"
            />
          )}
          <iframe
            ref={ytIframeRef}
            onLoad={handleIframeLoad}
            className={`pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-full min-w-[177.78vh] -translate-x-1/2 -translate-y-1/2 scale-105 transition-opacity duration-700 ${
              isYtPlaying ? 'opacity-100' : 'opacity-0'
            }`}
            src={`${TUAF_HERO_VIDEO_EMBED_URL}&enablejsapi=1`}
            title="Turon Universiteti Andijon filiali rasmiy video lavhasi"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>

        {/* Layered Gradient Overlays matching https://tuaf.vercel.app */}
        <div className="absolute inset-0 pointer-events-none z-[1] bg-[linear-gradient(90deg,rgba(4,30,65,0.90)_0%,rgba(4,30,65,0.68)_52%,rgba(4,30,65,0.35)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#041E41] via-[#041E41]/40 to-transparent pointer-events-none z-[1]" />

        {/* Architectural Wireframe SVG from https://tuaf.vercel.app */}
        <svg
          className="absolute right-0 bottom-16 w-[640px] h-[480px] opacity-15 pointer-events-none hidden lg:block z-[2]"
          viewBox="0 0 800 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M80 520H760M120 520V220L280 140L440 220V520M440 260H700V520"
            stroke="url(#kuafGrad)"
            strokeWidth="2"
          />
          <path
            d="M160 520V260M220 520V260M280 520V240M340 520V260M400 520V260"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="1.5"
          />
          <circle cx="280" cy="195" r="24" stroke="#60A5FA" strokeWidth="2" />
          <rect
            x="480"
            y="300"
            width="45"
            height="60"
            stroke="rgba(255,255,255,0.2)"
          />
          <rect
            x="550"
            y="300"
            width="45"
            height="60"
            stroke="rgba(255,255,255,0.2)"
          />
          <rect
            x="620"
            y="300"
            width="45"
            height="60"
            stroke="rgba(255,255,255,0.2)"
          />
          <rect
            x="480"
            y="390"
            width="45"
            height="60"
            stroke="rgba(255,255,255,0.2)"
          />
          <rect
            x="550"
            y="390"
            width="45"
            height="60"
            stroke="rgba(255,255,255,0.2)"
          />
          <rect
            x="620"
            y="390"
            width="45"
            height="60"
            stroke="rgba(255,255,255,0.2)"
          />
          <defs>
            <linearGradient
              id="kuafGrad"
              x1="80"
              y1="140"
              x2="760"
              y2="520"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#38BDF8" />
              <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>

        {/* Main Hero Content Container */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 sm:pt-16 sm:pb-18 lg:pt-20 lg:pb-24">
          <div className="max-w-2xl space-y-5 sm:space-y-6">
            {/* Uzbekistan Tricolor Pill + Kicker */}
            <div className="flex items-center gap-3">
              <div className="flex items-center h-1.5 w-12 sm:w-14 rounded-full overflow-hidden shrink-0">
                <span className="flex-1 h-full bg-[#0099B5]" />
                <span className="w-1.5 h-full bg-[#CE1126]" />
                <span className="flex-1 h-full bg-[#1EB53A]" />
              </div>
              <span className="text-xs tracking-[0.18em] uppercase text-white/90 font-semibold">
                {t.heroKicker}
              </span>
            </div>

            {/* Display Title matching tuaf.vercel.app */}
            <h1 className="font-sans text-3xl sm:text-5xl lg:text-[58px] font-extrabold tracking-tight leading-[1.08] uppercase text-white drop-shadow-md">
              <span className="block">
                {lang === 'ru' ? 'Университет Турон' : 'Turon universiteti'}
              </span>
              <span className="block text-white/95 mt-1">
                {lang === 'ru'
                  ? 'Андижанский филиал'
                  : lang === 'en'
                  ? 'Andijan Branch'
                  : 'Andijon filiali'}
              </span>
            </h1>

            {/* Concise Editorial Tagline */}
            <p className="text-base sm:text-xl font-serif-academic italic text-stone-200 leading-relaxed">
              {t.heroSubtitle}
            </p>

            {/* Clean, Single-Line Search Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                scrollToCatalog();
              }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/25 shadow-xl"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <label htmlFor="catalog-main-search" className="sr-only">
                  {t.searchPlaceholder}
                </label>
                <input
                  id="catalog-main-search"
                  type="search"
                  value={filters.query}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      query: e.target.value,
                    }))
                  }
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-white rounded-lg text-[#041E41] placeholder:text-stone-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 text-sm font-semibold text-white bg-[#0099B5] hover:bg-[#008199] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {t.searchButton}
              </button>
            </form>

            {/* Clean Hero CTA Row matching https://tuaf.vercel.app */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                className="group inline-flex items-center gap-3.5 text-left cursor-pointer focus:outline-none"
              >
                <span className="relative flex items-center justify-center shrink-0">
                  <span className="absolute -inset-1.5 rounded-full bg-white/30 animate-ping opacity-50 pointer-events-none" />
                  <span className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-white text-[#041E41] flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform relative z-10">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </span>
                </span>
                <span>
                  <span className="block text-xs tracking-[0.16em] uppercase text-stone-300 font-semibold">
                    {lang === 'ru'
                      ? 'Видеотур'
                      : lang === 'en'
                      ? 'Video Tour'
                      : 'Video sayohat'}
                  </span>
                  <span className="block text-sm sm:text-base font-medium text-white group-hover:text-blue-200 transition-colors">
                    {lang === 'ru'
                      ? 'Познакомьтесь с университетом'
                      : lang === 'en'
                      ? 'Explore our university campus'
                      : 'Universitet bilan yaqindan tanishing'}
                  </span>
                </span>
              </button>

              <span
                aria-hidden="true"
                className="hidden sm:block h-8 w-px bg-white/20"
              />

              <button
                type="button"
                onClick={scrollToCatalog}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#0B2D5C]/90 hover:bg-[#123e7c] border border-blue-400/40 text-sm font-semibold text-white shadow-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>
                  {lang === 'ru'
                    ? 'Перейти в каталог (10 000+)'
                    : lang === 'en'
                    ? 'Browse Catalog (10,000+)'
                    : 'Elektron katalog (10,000+)'}
                </span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>
        </div>

        {/* Clean 5-Column Library Quick-Service Strip */}
        <div className="relative z-10 bg-white text-stone-900 border-b border-stone-200">
          <div className="max-w-[1400px] mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-x divide-y lg:divide-y-0 divide-stone-200">
            <button
              type="button"
              onClick={scrollToCatalog}
              className="group flex flex-col items-center justify-center py-4 sm:py-5 px-3 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-[#0B2D5C] mb-1.5 group-hover:scale-110 transition-transform shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-stone-800 group-hover:text-[#041E41] text-center">
                {lang === 'ru'
                  ? 'Электронный каталог'
                  : lang === 'en'
                  ? 'Digital Catalog'
                  : 'Elektron katalog'}
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                onNavigateTab ? onNavigateTab('dissertations') : scrollToCatalog()
              }
              className="group flex flex-col items-center justify-center py-4 sm:py-5 px-3 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-[#0B2D5C] mb-1.5 group-hover:scale-110 transition-transform shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-stone-800 group-hover:text-[#041E41] text-center">
                {lang === 'ru'
                  ? 'Диссертации и статьи'
                  : lang === 'en'
                  ? 'Dissertations & Papers'
                  : 'Dissertatsiyalar'}
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                onNavigateTab ? onNavigateTab('mediatheque') : scrollToCatalog()
              }
              className="group flex flex-col items-center justify-center py-4 sm:py-5 px-3 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <Video className="w-5 h-5 sm:w-6 sm:h-6 text-[#0B2D5C] mb-1.5 group-hover:scale-110 transition-transform shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-stone-800 group-hover:text-[#041E41] text-center">
                {lang === 'ru'
                  ? 'Видеолекции'
                  : lang === 'en'
                  ? 'Video Lectures'
                  : 'Video ma’ruzalar'}
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                onNavigateTab ? onNavigateTab('reading-hall') : scrollToCatalog()
              }
              className="group flex flex-col items-center justify-center py-4 sm:py-5 px-3 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <LampDesk className="w-5 h-5 sm:w-6 sm:h-6 text-[#0B2D5C] mb-1.5 group-hover:scale-110 transition-transform shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-stone-800 group-hover:text-[#041E41] text-center">
                {lang === 'ru'
                  ? 'Читальный зал (200+ мест)'
                  : lang === 'en'
                  ? 'Reading Hall (200+ Seats)'
                  : 'O‘quv zali (200+ o‘rin)'}
              </span>
            </button>

            <a
              href="https://hemis.tuaf.uz"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center py-4 sm:py-5 px-3 hover:bg-stone-50 transition-colors col-span-2 sm:col-span-1"
            >
              <Network className="w-5 h-5 sm:w-6 sm:h-6 text-[#0B2D5C] mb-1.5 group-hover:scale-110 transition-transform shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-stone-800 group-hover:text-[#041E41] text-center">
                HEMIS (hemis.tuaf.uz)
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Video Sayohat Modal */}
      {isVideoModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Turon Universiteti Andijon filiali — Video sayohat"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
        >
          <div className="bg-[#041E41] border border-white/20 rounded-xl max-w-4xl w-full overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/15 text-white">
              <h3 className="text-base font-bold">
                Turon Universiteti Andijon filiali — Video sayohat
              </h3>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                aria-label="Videoni yopish"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative aspect-video bg-black">
              <iframe
                src={TUAF_HERO_VIDEO_MODAL_URL}
                title="Turon Universiteti Andijon filiali rasmiy video sayohati"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Clean Degree Programs Selector (12 Bachelor + 8 Master's) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="bg-white border border-[#E5DEC9] rounded-xl p-4 sm:p-6 lg:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DEC9] pb-4">
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-serif-academic font-bold text-[#0F2342] flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#B8860B] shrink-0" />
                <span>{t.programsSectionTitle}</span>
              </h2>
              <p className="text-xs text-[#57534E] mt-1">
                {t.programsSectionSubtitle}
              </p>
            </div>

            <div
              role="group"
              aria-label="Ta’lim bosqichi"
              className="flex items-center gap-1 p-1 bg-[#F3EFE6] border border-[#E5DEC9] rounded-lg self-start w-full sm:w-auto"
            >
              <button
                type="button"
                onClick={() => setProgramLevelTab('bachelor')}
                className={`flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  programLevelTab === 'bachelor'
                    ? 'bg-[#0F2342] text-[#FBF9F5] font-semibold'
                    : 'text-[#57534E] hover:text-[#0F2342]'
                }`}
              >
                {lang === 'ru'
                  ? 'Бакалавриат (12)'
                  : lang === 'en'
                  ? 'Bachelor’s (12)'
                  : 'Bakalavriat (12)'}
              </button>
              <button
                type="button"
                onClick={() => setProgramLevelTab('master')}
                className={`flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  programLevelTab === 'master'
                    ? 'bg-[#0F2342] text-[#FBF9F5] font-semibold'
                    : 'text-[#57534E] hover:text-[#0F2342]'
                }`}
              >
                {lang === 'ru'
                  ? 'Магистратура (8)'
                  : lang === 'en'
                  ? 'Master’s (8)'
                  : 'Magistratura (8)'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {displayedPrograms.map((prog) => {
              const isSelected = filters.programCode === prog.code;
              return (
                <button
                  key={prog.code}
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      programCode: isSelected ? 'all' : prog.code,
                      faculty: 'all',
                    }))
                  }
                  className={`p-3.5 rounded-lg border text-left transition-colors flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-[#0F2342] text-[#FBF9F5] border-[#0F2342]'
                      : 'bg-[#FBF9F5] text-[#1C1917] border-[#E5DEC9] hover:border-[#0F2342]'
                  }`}
                >
                  <span className="text-sm font-semibold leading-snug">
                    {prog.name[lang]}
                  </span>
                  <span
                    className={`text-xs font-mono-tabular shrink-0 ${
                      isSelected ? 'text-[#C59B27]' : 'text-[#57534E]'
                    }`}
                  >
                    {prog.code.split('-')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sohalar bo'yicha mashhur kitoblar (Rasmi va PDF yuklab olish bilan) */}
          <div className="pt-6 border-t border-[#E5DEC9] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-serif-academic font-bold text-[#0F2342]">
                  {lang === 'ru'
                    ? 'Популярные учебники по сферам (с обложками и скачиванием PDF)'
                    : lang === 'en'
                    ? 'Famous Textbooks by Field (Cover Gallery & PDF Download)'
                    : 'Sohalar bo‘yicha mashhur kitoblar (PDF yuklab olish)'}
                </h3>
                <p className="text-xs text-[#57534E]">
                  {studentProfile
                    ? `Talaba hisobi faol (${studentProfile.fullName}) — PDF kitoblarni bepul yuklab olishingiz mumkin`
                    : 'PDF kitoblarni yuklab olish faqat ro‘yxatdan o‘tgan talabalar uchun ochiq'}
                </p>
              </div>
              {onNavigateTab && (
                <button
                  type="button"
                  onClick={() => onNavigateTab('famous-books')}
                  className="text-xs font-semibold text-[#0099B5] hover:underline self-start sm:self-center cursor-pointer"
                >
                  {lang === 'ru'
                    ? 'Все популярные книги →'
                    : lang === 'en'
                    ? 'View all famous books →'
                    : 'Barcha mashhur kitoblar →'}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {FAMOUS_BOOKS.slice(0, 4).map((book) => {
                const isDownloaded = downloadedIds.has(book.id);
                return (
                  <div
                    key={book.id}
                    className="bg-[#FBF9F5] border border-[#E5DEC9] rounded-xl overflow-hidden flex flex-col justify-between hover:border-[#B8860B] transition-colors"
                  >
                    <div>
                      <div className="aspect-[4/3] bg-[#0F2342] overflow-hidden border-b border-[#E5DEC9]">
                        {book.coverImage && !brokenImages[book.id] ? (
                          <img
                            src={book.coverImage}
                            alt={book.title[lang]}
                            referrerPolicy="no-referrer"
                            onError={() =>
                              setBrokenImages((prev) => ({
                                ...prev,
                                [book.id]: true,
                              }))
                            }
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full p-4 flex items-end text-white font-serif-academic text-sm font-bold">
                            {book.title[lang]}
                          </div>
                        )}
                      </div>
                      <div className="p-3.5 space-y-1.5">
                        <div className="text-[11px] font-semibold text-[#B8860B]">
                          {
                            FACULTY_LABELS[
                              book.faculty as Exclude<FacultyId, 'all'>
                            ][lang]
                          }
                        </div>
                        <h4 className="font-serif-academic font-bold text-[#0F2342] text-sm leading-snug line-clamp-2">
                          {book.title[lang]}
                        </h4>
                        <p className="text-xs text-[#57534E] truncate">
                          {book.authors.join(', ')}
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 pt-0 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onDownloadPdf(book)}
                        className="flex-1 py-2 px-2.5 bg-[#0F2342] hover:bg-[#173461] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        {studentProfile ? (
                          <Download className="w-3.5 h-3.5 text-[#38BDF8]" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-[#C59B27]" />
                        )}
                        <span>
                          {isDownloaded
                            ? 'Yuklandi (PDF)'
                            : 'PDF yuklash'}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenReader(book)}
                        className="py-2 px-2.5 bg-white hover:bg-[#F3EFE6] text-[#0F2342] border border-[#E5DEC9] text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        {t.readOnline}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Editions Showcase (Clean & Uncluttered) */}
      {leadItem &&
        filters.query === '' &&
        filters.faculty === 'all' &&
        filters.programCode === 'all' && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="border-b border-[#E5DEC9] pb-3 mb-6">
              <p className="text-xs uppercase tracking-widest text-[#B8860B] font-semibold">
                {t.leadCuratedKicker}
              </p>
              <h2 className="text-2xl lg:text-3xl font-serif-academic font-bold text-[#0F2342] mt-1">
                {t.featuredSectionTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
              {/* Lead Featured Book */}
              <div className="lg:col-span-7 bg-white border border-[#E5DEC9] rounded-xl p-5 sm:p-6 lg:p-8 flex flex-col justify-between">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
                  <div className="sm:col-span-4">
                    <div className="aspect-[3/4] rounded-lg overflow-hidden border border-[#E5DEC9] bg-[#0F2342]">
                      {leadItem.coverImage && !brokenImages[leadItem.id] ? (
                        <img
                          src={leadItem.coverImage}
                          alt={leadItem.title[lang]}
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setBrokenImages((prev) => ({
                              ...prev,
                              [leadItem.id]: true,
                            }))
                          }
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full p-5 flex flex-col justify-between text-[#FBF9F5]">
                          <span className="text-xs font-mono-tabular text-[#C59B27]">
                            {leadItem.year}
                          </span>
                          <span className="font-serif-academic text-lg font-bold">
                            {leadItem.title[lang]}
                          </span>
                          <span className="text-xs text-[#E5DEC9]">
                            {leadItem.authors[0]}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-8 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      <div className="text-xs text-[#B8860B] font-semibold">
                        {RESOURCE_TYPE_LABELS[leadItem.type][lang]} ·{' '}
                        {leadItem.year} · {leadItem.pages} {t.pagesUnit}
                      </div>
                      <h3 className="text-2xl font-serif-academic font-bold text-[#0F2342] leading-snug">
                        {leadItem.title[lang]}
                      </h3>
                      <p className="text-xs font-semibold text-[#1C1917]">
                        {leadItem.authors.join(', ')}
                      </p>
                      <p className="text-sm text-[#57534E] leading-relaxed line-clamp-3">
                        {leadItem.abstract[lang]}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#E5DEC9] flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => onOpenReader(leadItem)}
                        className="px-4 py-2 text-xs font-semibold bg-[#0F2342] text-[#FBF9F5] rounded-lg hover:bg-[#173461] flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-[#C59B27]" />
                        {t.readOnline}
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenCitation(leadItem)}
                        className="px-3.5 py-2 text-xs font-medium bg-[#F3EFE6] text-[#0F2342] border border-[#E5DEC9] rounded-lg hover:bg-[#E5DEC9]/70 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                      >
                        <Quote className="w-3.5 h-3.5" />
                        {t.citeWork}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Featured Books */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-6">
                {secondaryItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex-1 bg-white border border-[#E5DEC9] rounded-xl p-6 flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="text-xs text-[#B8860B] font-semibold">
                        {RESOURCE_TYPE_LABELS[item.type][lang]} · {item.year} ·{' '}
                        {item.pages} {t.pagesUnit}
                      </div>
                      <h3 className="text-xl font-serif-academic font-bold text-[#0F2342] leading-snug">
                        {item.title[lang]}
                      </h3>
                      <p className="text-xs font-semibold text-[#1C1917]">
                        {item.authors.join(', ')}
                      </p>
                      <p className="text-xs text-[#57534E] line-clamp-2 leading-relaxed">
                        {item.abstract[lang]}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#E5DEC9] flex items-center justify-between gap-2">
                      <span className="text-xs text-[#57534E]">
                        {item.availableCopies} {t.copiesAvailable}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onOpenReader(item)}
                          className="px-3.5 py-1.5 text-xs font-semibold bg-[#0F2342] text-[#FBF9F5] rounded-lg hover:bg-[#173461] transition-colors whitespace-nowrap shrink-0"
                        >
                          {t.readOnline}
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenCitation(item)}
                          className="px-3 py-1.5 text-xs font-medium bg-[#F3EFE6] text-[#0F2342] border border-[#E5DEC9] rounded-lg hover:bg-[#E5DEC9]/70 transition-colors whitespace-nowrap shrink-0"
                        >
                          {t.citeWork}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

      {/* Main Catalog Section */}
      <section
        id="catalog-explorer"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pb-10 sm:pb-12"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5DEC9] pb-4 mb-6">
          <div>
            <h2 className="text-2xl lg:text-3xl font-serif-academic font-bold text-[#0F2342]">
              {t.catalogSectionTitle}
            </h2>
            <p className="text-xs text-[#57534E] mt-1">
              {filteredResources.length} {t.resultsFound}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowAdvanced((prev) => !prev)}
              aria-expanded={showAdvanced}
              className="px-4 py-2 text-xs font-semibold text-[#0F2342] bg-[#F3EFE6] border border-[#E5DEC9] rounded-lg hover:bg-[#E5DEC9]/70 flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {t.advancedFilters}
            </button>
            {(filters.query !== '' ||
              filters.faculty !== 'all' ||
              filters.programCode !== 'all' ||
              filters.type !== 'all' ||
              filters.openAccessOnly ||
              filters.peerReviewedOnly) && (
              <button
                type="button"
                onClick={onResetFilters}
                className="px-3.5 py-2 text-xs font-medium text-[#57534E] bg-white border border-[#E5DEC9] rounded-lg hover:text-[#0F2342] flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {t.resetFilters}
              </button>
            )}
          </div>
        </div>

        {/* Collapsible Filter Panel */}
        {showAdvanced && (
          <div className="bg-[#F3EFE6] border border-[#E5DEC9] rounded-xl p-5 mb-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label
                  htmlFor="filter-faculty"
                  className="block text-xs font-semibold text-[#0F2342] mb-1.5"
                >
                  {t.facultyLabel}
                </label>
                <select
                  id="filter-faculty"
                  value={filters.faculty}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      faculty: e.target.value as FacultyId,
                    }))
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5DEC9] rounded-lg text-[#1C1917]"
                >
                  {faculties.map((f) => (
                    <option key={f} value={f}>
                      {FACULTY_LABELS[f][lang]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="filter-program"
                  className="block text-xs font-semibold text-[#0F2342] mb-1.5"
                >
                  {t.programLabel}
                </label>
                <select
                  id="filter-program"
                  value={filters.programCode}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      programCode: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5DEC9] rounded-lg text-[#1C1917]"
                >
                  <option value="all">
                    {lang === 'ru'
                      ? 'Все направления (20)'
                      : lang === 'en'
                      ? 'All Programs (20)'
                      : 'Barcha yo‘nalishlar (20)'}
                  </option>
                  {TUAF_OFFICIAL_PROGRAMS.map((prog) => (
                    <option key={prog.code} value={prog.code}>
                      {prog.name[lang]} ({prog.code.split('-')[0]})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="filter-type"
                  className="block text-xs font-semibold text-[#0F2342] mb-1.5"
                >
                  {t.resourceTypeLabel}
                </label>
                <select
                  id="filter-type"
                  value={filters.type}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      type: e.target.value as ResourceType | 'all',
                    }))
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5DEC9] rounded-lg text-[#1C1917]"
                >
                  {resourceTypes.map((rt) => (
                    <option key={rt} value={rt}>
                      {RESOURCE_TYPE_LABELS[rt][lang]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="filter-sort"
                  className="block text-xs font-semibold text-[#0F2342] mb-1.5"
                >
                  {t.sortByLabel}
                </label>
                <select
                  id="filter-sort"
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      sortBy: e.target.value as CatalogFilterState['sortBy'],
                    }))
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5DEC9] rounded-lg text-[#1C1917]"
                >
                  <option value="relevance">
                    {lang === 'ru'
                      ? 'По актуальности'
                      : lang === 'en'
                      ? 'Recommended First'
                      : 'Tavsiya etilganlar'}
                  </option>
                  <option value="citations-desc">
                    {lang === 'ru'
                      ? 'По цитируемости'
                      : lang === 'en'
                      ? 'Most Cited'
                      : 'Ko‘p iqtibos olinganlar'}
                  </option>
                  <option value="year-desc">
                    {lang === 'ru'
                      ? 'Сначала новые'
                      : lang === 'en'
                      ? 'Newest First'
                      : 'Yangi nashrlar'}
                  </option>
                  <option value="title-asc">
                    {lang === 'ru'
                      ? 'По алфавиту (А–Я)'
                      : lang === 'en'
                      ? 'Alphabetical (A–Z)'
                      : 'Alifbo bo‘yicha (A–Z)'}
                  </option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Catalog Results Grid */}
        {filteredResources.length === 0 ? (
          <div className="bg-white border border-[#E5DEC9] rounded-xl p-12 text-center space-y-4">
            <p className="text-xl font-serif-academic font-bold text-[#0F2342]">
              {t.noResultsTitle}
            </p>
            <p className="text-xs text-[#57534E] max-w-md mx-auto">
              {t.noResultsDesc}
            </p>
            <button
              type="button"
              onClick={onResetFilters}
              className="px-4 py-2 text-xs font-semibold bg-[#0F2342] text-[#FBF9F5] rounded-lg hover:bg-[#173461] transition-colors whitespace-nowrap shrink-0"
            >
              {t.resetFilters}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {filteredResources.map((item) => {
              const isReserved = reservedIds.has(item.id);
              const isBookmarked = bookmarkedIds.has(item.id);

              return (
                <article
                  key={item.id}
                  className="bg-white border border-[#E5DEC9] rounded-xl p-5 sm:p-6 flex flex-col justify-between space-y-4 hover:border-[#B8860B] transition-colors"
                >
                  <div className="space-y-2">
                    {/* Clean Single-Line Metadata */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#57534E]">
                      <span className="font-semibold text-[#B8860B]">
                        {RESOURCE_TYPE_LABELS[item.type][lang]}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{item.year}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.language}</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {item.pages} {t.pagesUnit}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-serif-academic font-bold text-[#0F2342] leading-snug">
                      {item.title[lang]}
                    </h3>

                    {/* Authors */}
                    <p className="text-xs font-semibold text-[#1C1917]">
                      {item.authors.join(', ')}
                    </p>

                    {/* Concise 2-Line Description */}
                    <p className="text-sm text-[#57534E] leading-relaxed line-clamp-2">
                      {item.abstract[lang]}
                    </p>
                  </div>

                  {/* Clean Action Footer */}
                  <div className="pt-4 border-t border-[#E5DEC9] flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-[#57534E]">
                      {item.availableCopies}/{item.totalCopies}{' '}
                      {t.copiesAvailable}
                    </span>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenReader(item)}
                        className="px-3.5 py-2 text-xs font-semibold bg-[#0F2342] text-[#FBF9F5] rounded-lg hover:bg-[#173461] flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-[#C59B27]" />
                        {t.readOnline}
                      </button>

                      <button
                        type="button"
                        onClick={() => onDownloadPdf(item)}
                        className="px-3 py-2 text-xs font-semibold bg-[#0099B5] text-white rounded-lg hover:bg-[#008199] flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        {studentProfile ? (
                          <Download className="w-3.5 h-3.5" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-[#F7F1E1]" />
                        )}
                        <span>PDF</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenCitation(item)}
                        className="px-3 py-2 text-xs font-medium bg-[#F3EFE6] text-[#0F2342] border border-[#E5DEC9] rounded-lg hover:bg-[#E5DEC9]/70 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <Quote className="w-3.5 h-3.5" />
                        {t.citeWork}
                      </button>

                      <button
                        type="button"
                        onClick={() => onReserveBook(item)}
                        disabled={isReserved}
                        className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                          isReserved
                            ? 'bg-[#F7F1E1] text-[#B8860B] border-[#B8860B] font-semibold'
                            : 'bg-white text-[#0F2342] border-[#E5DEC9] hover:bg-[#F3EFE6]'
                        }`}
                      >
                        {isReserved ? (
                          <span className="inline-flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            {t.reservedState}
                          </span>
                        ) : (
                          t.reserveBook
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleBookmark(item.id)}
                        aria-label={`${t.bookmarkAdd}: ${item.title[lang]}`}
                        className={`p-2 rounded-lg border transition-colors ${
                          isBookmarked
                            ? 'bg-[#0F2342] text-[#C59B27] border-[#0F2342]'
                            : 'bg-white text-[#57534E] border-[#E5DEC9] hover:text-[#0F2342]'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
