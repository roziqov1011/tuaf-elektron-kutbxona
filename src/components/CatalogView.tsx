import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  Check,
  Compass,
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
  Sparkles,
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
import { Book3DCover } from './Book3DCover';

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
  onOpenSpotlightSearch?: () => void;
  onOpenRoadmapModal?: () => void;
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
  onOpenSpotlightSearch,
  onOpenRoadmapModal,
  studentProfile,
  onDownloadPdf,
  downloadedIds,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [programLevelTab, setProgramLevelTab] = useState<'bachelor' | 'master'>(
    'bachelor'
  );
  const [spotlightIndex, setSpotlightIndex] = useState(0);
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
    setIsYtPlaying(true);
    try {
      ytIframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }),
        '*'
      );
    } catch {
      // Ignore cross-origin postMessage errors
    }
  };

  const spotlightBooks = resources.slice(0, 4);
  const activeSpotlightBook =
    spotlightBooks[spotlightIndex] || spotlightBooks[0] || resources[0];

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
      {/* Official TUAF Video Hero Section (https://www.youtube.com/watch?v=snzSKADGzqw) */}
      <section className="relative bg-[#041E41] text-white overflow-hidden min-h-[480px] sm:min-h-[560px] lg:min-h-[620px]">
        {/* Background Video Layer (YouTube snzSKADGzqw + High-Res TUAF Building Poster fallback) */}
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
              isYtPlaying ? 'opacity-95' : 'opacity-85'
            }`}
            src={`${TUAF_HERO_VIDEO_EMBED_URL}&enablejsapi=1`}
            title="Turon Universiteti Andijon filiali rasmiy video lavhasi"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
            <div className="flex items-center gap-3 tuaf-word-reveal">
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
            <h1 className="font-sans text-3xl sm:text-5xl lg:text-[58px] font-extrabold tracking-tight leading-[1.08] uppercase text-white drop-shadow-md tuaf-word-reveal tuaf-delay-1">
              <span className="block">
                {lang === 'ru' ? 'Университет Турон' : 'Turon universiteti'}
              </span>
              <span className="block tuaf-gold-shimmer-text mt-1">
                {lang === 'ru'
                  ? 'Андижанский филиал'
                  : lang === 'en'
                  ? 'Andijan Branch'
                  : 'Andijon filiali'}
              </span>
            </h1>

            {/* Concise Editorial Tagline */}
            <p className="text-base sm:text-xl font-serif-academic italic text-stone-200 leading-relaxed tuaf-word-reveal tuaf-delay-2">
              {t.heroSubtitle}
            </p>

            {/* Clean, Single-Line Search Bar + Ctrl+K Spotlight Trigger */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                scrollToCatalog();
              }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/25 shadow-xl tuaf-word-reveal tuaf-delay-3"
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
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 sm:flex-initial px-5 py-3 text-sm font-semibold text-white bg-[#0099B5] hover:bg-[#008199] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {t.searchButton}
                </button>
                {onOpenSpotlightSearch && (
                  <button
                    type="button"
                    onClick={onOpenSpotlightSearch}
                    title="Intellektual tezkor qidiruv (Ctrl + K)"
                    className="px-3.5 py-3 text-xs font-semibold text-[#FDE68A] bg-[#041E41]/90 hover:bg-[#0B2D5C] border border-[#C59B27]/60 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
                    <span>Ctrl+K</span>
                  </button>
                )}
              </div>
            </form>

            {/* Clean Hero CTA Row matching https://tuaf.vercel.app */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 tuaf-word-reveal tuaf-delay-4">
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

              {onOpenRoadmapModal && (
                <button
                  type="button"
                  onClick={onOpenRoadmapModal}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-[#C59B27] hover:bg-[#d4a92f] text-[#041E41] text-sm font-extrabold shadow-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Compass className="w-4 h-4 shrink-0" />
                  <span>Talaba Yo‘l Xaritasi (Slayd & PDF)</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Auto-Sliding Library Quick-Service Strip */}
        <div className="relative z-10 bg-white text-stone-900 border-b border-stone-200 overflow-hidden">
          {/* Soft left/right fade masks */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 z-10 bg-gradient-to-r from-white to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 z-10 bg-gradient-to-l from-white to-transparent"
          />

          <div
            aria-label="Kutubxona tezkor xizmatlari avto-slayderi"
            className="animate-tuaf-marquee-left divide-x divide-stone-200"
          >
            {[0, 1].map((dupIndex) => (
              <React.Fragment key={`service-strip-set-${dupIndex}`}>
                <button
                  type="button"
                  onClick={scrollToCatalog}
                  className="group w-[230px] sm:w-[280px] shrink-0 flex flex-col items-center justify-center py-4 sm:py-5 px-4 hover:bg-[#FBF9F5] transition-all cursor-pointer"
                >
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-[#0B2D5C] group-hover:text-[#B8860B] mb-1.5 group-hover:scale-110 transition-all shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-stone-800 group-hover:text-[#041E41] text-center whitespace-nowrap">
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
                    onNavigateTab
                      ? onNavigateTab('dissertations')
                      : scrollToCatalog()
                  }
                  className="group w-[230px] sm:w-[280px] shrink-0 flex flex-col items-center justify-center py-4 sm:py-5 px-4 hover:bg-[#FBF9F5] transition-all cursor-pointer"
                >
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-[#0B2D5C] group-hover:text-[#B8860B] mb-1.5 group-hover:scale-110 transition-all shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-stone-800 group-hover:text-[#041E41] text-center whitespace-nowrap">
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
                    onNavigateTab
                      ? onNavigateTab('mediatheque')
                      : scrollToCatalog()
                  }
                  className="group w-[230px] sm:w-[280px] shrink-0 flex flex-col items-center justify-center py-4 sm:py-5 px-4 hover:bg-[#FBF9F5] transition-all cursor-pointer"
                >
                  <Video className="w-5 h-5 sm:w-6 sm:h-6 text-[#0B2D5C] group-hover:text-[#B8860B] mb-1.5 group-hover:scale-110 transition-all shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-stone-800 group-hover:text-[#041E41] text-center whitespace-nowrap">
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
                    onNavigateTab
                      ? onNavigateTab('reading-hall')
                      : scrollToCatalog()
                  }
                  className="group w-[230px] sm:w-[280px] shrink-0 flex flex-col items-center justify-center py-4 sm:py-5 px-4 hover:bg-[#FBF9F5] transition-all cursor-pointer"
                >
                  <LampDesk className="w-5 h-5 sm:w-6 sm:h-6 text-[#0B2D5C] group-hover:text-[#B8860B] mb-1.5 group-hover:scale-110 transition-all shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-stone-800 group-hover:text-[#041E41] text-center whitespace-nowrap">
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
                  className="group w-[230px] sm:w-[280px] shrink-0 flex flex-col items-center justify-center py-4 sm:py-5 px-4 hover:bg-[#FBF9F5] transition-all"
                >
                  <Network className="w-5 h-5 sm:w-6 sm:h-6 text-[#0B2D5C] group-hover:text-[#B8860B] mb-1.5 group-hover:scale-110 transition-all shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-stone-800 group-hover:text-[#041E41] text-center whitespace-nowrap">
                    HEMIS (hemis.tuaf.uz)
                  </span>
                </a>
              </React.Fragment>
            ))}
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
              <h2 className="text-lg sm:text-xl lg:text-2xl font-serif-academic font-bold text-[#0F2342] flex items-center gap-2 tuaf-word-reveal">
                <GraduationCap className="w-5 h-5 text-[#B8860B] shrink-0" />
                <span className="tuaf-section-heading">{t.programsSectionTitle}</span>
              </h2>
              <p className="text-xs text-[#57534E] mt-1.5 tuaf-word-reveal tuaf-delay-1">
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

          {(() => {
            const midpoint = Math.ceil(displayedPrograms.length / 2);
            const firstRowPrograms = displayedPrograms.slice(0, midpoint);
            const secondRowPrograms = displayedPrograms.slice(midpoint);
            const rowOneTrack = [...firstRowPrograms, ...firstRowPrograms];
            const rowTwoTrack = [...secondRowPrograms, ...secondRowPrograms];

            const renderProgramCard = (
              prog: (typeof displayedPrograms)[number],
              idx: number,
              rowKey: string
            ) => {
              const isSelected = filters.programCode === prog.code;
              return (
                <button
                  key={`${rowKey}-${prog.code}-${idx}`}
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      programCode: isSelected ? 'all' : prog.code,
                      faculty: 'all',
                    }))
                  }
                  className={`tuaf-slider-chip w-[270px] sm:w-[300px] shrink-0 p-3.5 rounded-lg border text-left flex items-center justify-between gap-2.5 cursor-pointer shadow-2xs ${
                    isSelected
                      ? 'bg-[#0F2342] text-[#FBF9F5] border-[#0F2342] ring-2 ring-[#C59B27]/50'
                      : 'bg-[#FBF9F5] text-[#1C1917] border-[#E5DEC9] hover:border-[#B8860B] hover:bg-white'
                  }`}
                >
                  <span className="text-sm font-semibold leading-snug truncate transition-transform duration-300 group-hover:translate-x-0.5">
                    {prog.name[lang]}
                  </span>
                  <span
                    className={`text-xs font-mono-tabular px-2 py-0.5 rounded shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#C59B27] text-[#041E41] font-bold'
                        : 'bg-[#F3EFE6] text-[#57534E]'
                    }`}
                  >
                    {prog.code.split('-')[0]}
                  </span>
                </button>
              );
            };

            return (
              <div
                aria-label="Ta’lim yo‘nalishlari avto-slayderi"
                className="relative overflow-hidden py-1 space-y-3"
              >
                {/* Soft left/right fade masks */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-14 z-10 bg-gradient-to-r from-white to-transparent"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-14 z-10 bg-gradient-to-l from-white to-transparent"
                />

                {/* Row 1: Auto-scrolling Left */}
                <div className="overflow-hidden">
                  <div className="animate-tuaf-marquee-left gap-3 pr-3">
                    {rowOneTrack.map((prog, idx) =>
                      renderProgramCard(prog, idx, 'row1')
                    )}
                  </div>
                </div>

                {/* Row 2: Auto-scrolling Right (Opposite direction) */}
                <div className="overflow-hidden">
                  <div className="animate-tuaf-marquee-right gap-3 pr-3">
                    {rowTwoTrack.map((prog, idx) =>
                      renderProgramCard(prog, idx, 'row2')
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Sohalar bo'yicha mashhur kitoblar — 3D Tirik Javon (Living 3D Bookshelf) */}
          <div className="pt-6 border-t border-[#E5DEC9] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg sm:text-xl font-serif-academic font-bold text-[#0F2342]">
                  {lang === 'ru'
                    ? 'Популярные учебники по сферам (3D-полка и скачивание PDF)'
                    : lang === 'en'
                    ? 'Famous Textbooks by Field (3D Hardcover Shelf & PDF)'
                    : 'Sohalar bo‘yicha mashhur kitoblar — 3D Kutubxona Javoni'}
                </h3>
                <p className="text-xs text-[#57534E]">
                  {studentProfile
                    ? `Talaba hisobi faol (${studentProfile.fullName}) — kitobni bosing yoki PDF formatda yuklab oling`
                    : 'Har bir 3D kitobni ikki betli mutolaa oynasida varaqlab ko‘rishingiz yoki PDF yuklab olishingiz mumkin'}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {FAMOUS_BOOKS.slice(0, 4).map((book, idx) => {
                const isDownloaded = downloadedIds.has(book.id);
                return (
                  <div
                    key={book.id}
                    style={{ animationDelay: `${idx * 85}ms` }}
                    className="tuaf-card-interactive tuaf-card-reveal bg-gradient-to-b from-[#FBF9F5] to-[#F3EFE6] border border-[#E5DEC9] rounded-xl overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* 3D Book Standing on Library Oak Pedestal */}
                      <div className="pt-5 pb-3 px-4 bg-[radial-gradient(circle_at_50%_25%,rgba(197,155,39,0.16),transparent_70%)] flex flex-col items-center">
                        <Book3DCover
                          resource={book}
                          lang={lang}
                          size="md"
                          onClick={() => onOpenReader(book)}
                        />
                        <div className="w-full h-2.5 rounded-full tuaf-library-shelf-plank mt-1" />
                      </div>

                      <div className="p-3.5 space-y-1.5">
                        <div className="text-[11px] font-semibold text-[#B8860B]">
                          {
                            FACULTY_LABELS[
                              book.faculty as Exclude<FacultyId, 'all'>
                            ][lang]
                          }
                        </div>
                        <h4 className="font-serif-academic font-bold text-[#0F2342] text-sm sm:text-base leading-snug line-clamp-2">
                          <span className="tuaf-animated-title">
                            {book.title[lang]}
                          </span>
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
                          {isDownloaded ? 'Yuklandi (PDF)' : 'PDF yuklash'}
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

      {/* ARM Oltin Fondi — Interaktiv 3D Kitob Vitrinasi (Museum-Style Curated Exhibition Spotlight) */}
      {activeSpotlightBook &&
        filters.query === '' &&
        filters.faculty === 'all' &&
        filters.programCode === 'all' && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="rounded-2xl overflow-hidden border border-[#C59B27]/50 bg-gradient-to-br from-[#041E41] via-[#0A254C] to-[#04162E] text-white shadow-2xl">
              {/* Top Exhibition Header Bar */}
              <div className="px-4 sm:px-7 lg:px-10 py-4 sm:py-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#FDE68A] font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-[#C59B27] shrink-0" />
                    <span>ARM OLTIN FONDI EKSPOZITSIYASI · 3D VITRINA</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif-academic font-bold text-white mt-0.5">
                    {t.featuredSectionTitle}
                  </h2>
                </div>

                {/* Interactive Masterpiece Selector Pills */}
                <div
                  role="tablist"
                  aria-label="Oltin fond vitrinasi kitoblari"
                  className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0"
                >
                  {spotlightBooks.map((sb, idx) => {
                    const isCurrent = sb.id === activeSpotlightBook.id;
                    return (
                      <button
                        key={sb.id}
                        type="button"
                        role="tab"
                        aria-selected={isCurrent}
                        onClick={() => setSpotlightIndex(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                          isCurrent
                            ? 'bg-[#C59B27] text-[#041E41] shadow-md'
                            : 'bg-white/10 text-stone-200 hover:bg-white/20'
                        }`}
                      >
                        0{idx + 1}.{' '}
                        {sb.title[lang].length > 24
                          ? `${sb.title[lang].slice(0, 24)}…`
                          : sb.title[lang]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main 12-Column Exhibition Stage */}
              <div className="p-5 sm:p-7 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
                {/* Left 4 Columns: 3D Hardcover Pedestal Stage */}
                <div className="lg:col-span-4 flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl bg-[radial-gradient(circle_at_50%_35%,rgba(197,155,39,0.28),rgba(4,30,65,0.4)_72%)] border border-white/10">
                  <Book3DCover
                    resource={activeSpotlightBook}
                    lang={lang}
                    size="xl"
                    onClick={() => onOpenReader(activeSpotlightBook)}
                  />
                  {/* Wooden Library Shelf Pedestal with Brass Edge */}
                  <div className="w-full max-w-[260px] h-3.5 rounded-full tuaf-library-shelf-plank mt-2" />
                  <p className="mt-3 text-[11px] font-mono-tabular text-[#FDE68A]/90 text-center">
                    3D muqovani bosing — ikki betli jonli kitob ochiladi
                  </p>
                </div>

                {/* Right 8 Columns: Curatorial Details, Chapter Previews & Actions */}
                <div className="lg:col-span-8 space-y-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tabular text-[#FDE68A]">
                    <span>
                      {RESOURCE_TYPE_LABELS[activeSpotlightBook.type][lang]}
                    </span>
                    <span>·</span>
                    <span>{activeSpotlightBook.year} yil</span>
                    <span>·</span>
                    <span>
                      {activeSpotlightBook.pages} {t.pagesUnit}
                    </span>
                    <span>·</span>
                    <span>UDK {activeSpotlightBook.udc}</span>
                    <span>·</span>
                    <span>
                      {activeSpotlightBook.availableCopies}/
                      {activeSpotlightBook.totalCopies} {t.copiesAvailable}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif-academic font-bold text-white leading-tight balance-text">
                      {activeSpotlightBook.title[lang]}
                    </h3>
                    <p className="text-sm font-semibold text-[#38BDF8]">
                      {activeSpotlightBook.authors.join(', ')} —{' '}
                      <span className="text-stone-300 font-normal">
                        {activeSpotlightBook.publisher}
                      </span>
                    </p>
                  </div>

                  {/* Editorial Pull-Quote */}
                  <blockquote className="p-4 rounded-xl bg-white/5 border border-[#C59B27]/35 font-serif-academic italic text-base sm:text-lg text-stone-100 leading-relaxed">
                    «{activeSpotlightBook.abstract[lang]}»
                  </blockquote>

                  {/* Interactive Chapter Preview Strip */}
                  <div className="space-y-2">
                    <div className="text-[11px] uppercase tracking-widest text-stone-300 font-semibold">
                      Ichki boblar mundarijasi (varaqlab o‘qish uchun bosing):
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeSpotlightBook.chapters.slice(0, 2).map((ch) => (
                        <button
                          key={ch.number}
                          type="button"
                          onClick={() => onOpenReader(activeSpotlightBook)}
                          className="p-2.5 rounded-lg bg-white/8 hover:bg-white/15 border border-white/15 text-left flex items-center justify-between gap-2 transition-colors cursor-pointer"
                        >
                          <span className="text-xs font-medium text-white truncate">
                            {ch.title[lang]}
                          </span>
                          <span className="text-[11px] font-mono-tabular text-[#FDE68A] shrink-0">
                            Bet {ch.pageStart} →
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Primary Action Bar */}
                  <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => onOpenReader(activeSpotlightBook)}
                      className="px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold bg-[#C59B27] hover:bg-[#d6aa2e] text-[#041E41] rounded-xl flex items-center gap-2 shadow-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Ikki betli kitobni ochish ({t.readOnline})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDownloadPdf(activeSpotlightBook)}
                      className="px-4 py-2.5 text-xs sm:text-sm font-semibold bg-[#0099B5] hover:bg-[#008199] text-white rounded-xl flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {studentProfile ? (
                        <Download className="w-4 h-4" />
                      ) : (
                        <Lock className="w-4 h-4 text-[#FDE68A]" />
                      )}
                      <span>PDF yuklab olish</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onReserveBook(activeSpotlightBook)}
                      disabled={reservedIds.has(activeSpotlightBook.id)}
                      className="px-4 py-2.5 text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/25 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      {reservedIds.has(activeSpotlightBook.id)
                        ? t.reservedState
                        : t.reserveBook}
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenCitation(activeSpotlightBook)}
                      className="px-3.5 py-2.5 text-xs font-medium bg-white/5 hover:bg-white/15 text-stone-200 border border-white/15 rounded-xl flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Quote className="w-3.5 h-3.5 text-[#C59B27]" />
                      <span>{t.citeWork}</span>
                    </button>
                  </div>
                </div>
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
            <h2 className="text-2xl lg:text-3xl font-serif-academic font-bold text-[#0F2342] tuaf-word-reveal">
              <span className="tuaf-section-heading">
                {t.catalogSectionTitle}
              </span>
            </h2>
            <p className="text-xs text-[#57534E] mt-1.5 tuaf-word-reveal tuaf-delay-1">
              {filteredResources.length} {t.resultsFound}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenSpotlightSearch && (
              <button
                type="button"
                onClick={onOpenSpotlightSearch}
                className="px-3.5 py-2 text-xs font-semibold text-[#041E41] bg-[#F7F1E1] border border-[#C59B27]/60 rounded-lg hover:bg-[#EFE5C8] flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
                <span>Tezkor qidiruv (Ctrl+K)</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowAdvanced((prev) => !prev)}
              aria-expanded={showAdvanced}
              className="px-4 py-2 text-xs font-semibold text-[#0F2342] bg-[#F3EFE6] border border-[#E5DEC9] rounded-lg hover:bg-[#E5DEC9]/70 flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
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
                className="px-3.5 py-2 text-xs font-medium text-[#57534E] bg-white border border-[#E5DEC9] rounded-lg hover:text-[#0F2342] flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
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

        {/* Catalog Results Grid with 3D Hardcover Books */}
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
            {filteredResources.map((item, idx) => {
              const isReserved = reservedIds.has(item.id);
              const isBookmarked = bookmarkedIds.has(item.id);

              return (
                <article
                  key={item.id}
                  style={{ animationDelay: `${(idx % 6) * 70}ms` }}
                  className="tuaf-card-interactive tuaf-card-reveal bg-white border border-[#E5DEC9] rounded-xl p-4 sm:p-6 flex flex-col justify-between space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {/* Tactile 3D Hardcover Book Miniature */}
                    <div className="self-center sm:self-start shrink-0 pt-1">
                      <Book3DCover
                        resource={item}
                        lang={lang}
                        size="sm"
                        onClick={() => onOpenReader(item)}
                      />
                    </div>

                    <div className="space-y-2 min-w-0 flex-1">
                      {/* Clean Single-Line Metadata */}
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#57534E]">
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
                      <h3 className="text-lg sm:text-xl font-serif-academic font-bold text-[#0F2342] leading-snug">
                        <span className="tuaf-animated-title">
                          {item.title[lang]}
                        </span>
                      </h3>

                      {/* Authors */}
                      <p className="text-xs font-semibold text-[#1C1917]">
                        {item.authors.join(', ')}
                      </p>

                      {/* Concise 2-Line Description */}
                      <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed line-clamp-2">
                        {item.abstract[lang]}
                      </p>
                    </div>
                  </div>

                  {/* Clean Action Footer */}
                  <div className="pt-3.5 border-t border-[#E5DEC9] flex flex-wrap items-center justify-between gap-2.5">
                    <span className="text-xs font-mono-tabular text-[#57534E]">
                      {item.availableCopies}/{item.totalCopies}{' '}
                      {t.copiesAvailable}
                    </span>

                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
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
                        className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
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
                        className={`p-2 rounded-lg border transition-colors cursor-pointer ${
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

