import React, { useState } from 'react';
import {
  BookOpen,
  Compass,
  FileText,
  Globe,
  LampDesk,
  Library,
  LogIn,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Video,
  X,
} from 'lucide-react';
import { Language, StudentProfile } from '../types/library';
import { UI_TRANSLATIONS } from '../data/translations';
import { TUAF_OFFICIAL_LOGO } from '../data/seedLibraryData';

export type ActiveTab =
  | 'catalog'
  | 'famous-books'
  | 'dissertations'
  | 'mediatheque'
  | 'reading-hall'
  | 'cabinet'
  | 'admin';

interface TopBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  studentProfile: StudentProfile | null;
  onOpenLoginModal: () => void;
  onOpenSpotlightSearch?: () => void;
  onOpenRoadmapModal?: () => void;
  onLogout: () => void;
  activeLoansCount: number;
  activeSeatsCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  studentProfile,
  onOpenLoginModal,
  onOpenSpotlightSearch,
  onOpenRoadmapModal,
  onLogout,
  activeLoansCount,
  activeSeatsCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = UI_TRANSLATIONS[lang];

  const navItems: {
    id: ActiveTab;
    label: string;
    shortLabel: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'catalog',
      label: t.navCatalog,
      shortLabel:
        lang === 'ru' ? 'Каталог' : lang === 'en' ? 'Catalog' : 'Katalog',
      icon: <Library className="w-3.5 h-3.5 shrink-0" />,
    },
    {
      id: 'famous-books',
      label:
        lang === 'uz'
          ? 'Mashhur kitoblar'
          : lang === 'ru'
          ? 'Популярные книги'
          : 'Famous Books',
      shortLabel:
        lang === 'uz'
          ? 'Mashhur kitoblar'
          : lang === 'ru'
          ? 'Популярные'
          : 'Famous Books',
      icon: <BookOpen className="w-3.5 h-3.5 shrink-0" />,
    },
    {
      id: 'dissertations',
      label: t.navDissertations,
      shortLabel:
        lang === 'ru'
          ? 'Диссертации'
          : lang === 'en'
          ? 'Dissertations'
          : 'Dissertatsiyalar',
      icon: <FileText className="w-3.5 h-3.5 shrink-0" />,
    },
    {
      id: 'mediatheque',
      label: t.navMediatheque,
      shortLabel:
        lang === 'ru' ? 'Медиатека' : lang === 'en' ? 'Media' : 'Mediateka',
      icon: <Video className="w-3.5 h-3.5 shrink-0" />,
    },
    {
      id: 'reading-hall',
      label: t.navReadingHall,
      shortLabel:
        lang === 'ru'
          ? 'Читальный зал'
          : lang === 'en'
          ? 'Reading Hall'
          : 'O‘quv zali',
      icon: <LampDesk className="w-3.5 h-3.5 shrink-0" />,
    },
    {
      id: 'cabinet',
      label: t.navCabinet,
      shortLabel:
        lang === 'ru' ? 'Кабинет' : lang === 'en' ? 'Cabinet' : 'Kabinet',
      icon: <UserCheck className="w-3.5 h-3.5 shrink-0" />,
    },
    {
      id: 'admin',
      label:
        lang === 'uz'
          ? 'ARM Admin'
          : lang === 'ru'
          ? 'АРМ Админ'
          : 'ARM Admin',
      shortLabel: 'ARM Admin',
      icon: <ShieldCheck className="w-3.5 h-3.5 shrink-0" />,
    },
  ];

  const totalActiveItems = activeLoansCount + activeSeatsCount;
  const activeNavObj =
    navItems.find((item) => item.id === activeTab) || navItems[0];

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#041E41]/95 backdrop-blur-md border-b border-white/15 text-white shadow-md">
      {/* Main Top Row */}
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-2 px-3 sm:px-5 lg:px-8 py-2 sm:py-3">
        {/* Zone 1: Official TUAF Logo + Adaptive Brand Title */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            handleSelectTab('catalog');
          }}
          className="flex items-center gap-2 sm:gap-3 min-w-0 shrink focus-visible:outline-2 focus-visible:outline-[#38BDF8]"
        >
          <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border-2 border-[#C59B27] bg-white flex items-center justify-center overflow-hidden shadow-md shrink-0 p-0.5">
            <img
              src={TUAF_OFFICIAL_LOGO}
              alt="Turon University Andijon"
              className="w-full h-full object-contain"
            />
          </span>
          <div className="min-w-0 flex flex-col">
            <span className="text-sm sm:text-lg lg:text-xl font-bold tracking-tight text-white font-serif-academic truncate leading-tight">
              <span className="sm:hidden">Turon University</span>
              <span className="hidden sm:inline">{t.brandName}</span>
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono-tabular text-[#FDE68A] truncate leading-tight">
              <span className="sm:hidden">
                ARM · {activeNavObj.shortLabel}
              </span>
              <span className="hidden sm:inline xl:hidden">
                Andijon filiali · {activeNavObj.label}
              </span>
              <span className="hidden xl:inline">
                Andijon filiali Axborot-Resurs Markazi
              </span>
            </span>
          </div>
        </a>

        {/* Zone 2: Desktop Single-Line Navigation Links (xl and above where all items fit comfortably) */}
        <nav
          aria-label="Asosiy menyu"
          className="hidden xl:flex items-center gap-3 2xl:gap-5 text-xs 2xl:text-sm font-medium text-white/85 shrink-0"
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const isAdminItem = item.id === 'admin';
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectTab(item.id)}
                className={`py-1.5 transition-colors whitespace-nowrap shrink-0 border-b-2 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'text-white font-semibold border-[#38BDF8]'
                    : isAdminItem
                    ? 'border-transparent text-[#FDE68A] hover:text-white hover:border-[#C59B27]'
                    : 'border-transparent hover:text-white hover:border-white/40'
                }`}
              >
                {isAdminItem && (
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C59B27] shrink-0" />
                )}
                <span>{item.label}</span>
                {item.id === 'cabinet' && totalActiveItems > 0 && (
                  <span className="text-[10px] font-mono-tabular px-1.5 py-0.2 rounded-full bg-[#0099B5] text-white">
                    {totalActiveItems}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Responsive Action Controls (Never overflows on 320px-430px phones) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Student Roadmap (Slide + PDF) Trigger — visible on sm+ in top bar, and in quick strip/drawer on mobile */}
          {onOpenRoadmapModal && (
            <button
              type="button"
              onClick={onOpenRoadmapModal}
              aria-label="Talaba yo‘l xaritasi (Slayd va PDF)"
              className="hidden sm:flex px-2.5 lg:px-3 py-1.5 text-xs font-semibold bg-[#C59B27]/20 hover:bg-[#C59B27]/35 text-[#FDE68A] rounded-full border border-[#C59B27]/70 items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-[#FDE68A] shrink-0" />
              <span className="hidden md:inline">Yo‘l xaritasi (PDF)</span>
            </button>
          )}

          {/* Quick Spotlight Search Trigger (Ctrl + K) */}
          {onOpenSpotlightSearch && (
            <button
              type="button"
              onClick={onOpenSpotlightSearch}
              aria-label="Intellektual qidiruv (Ctrl+K)"
              className="w-9 h-9 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5 text-xs font-medium bg-[#0B2D5C] hover:bg-[#123e7c] text-white/90 hover:text-white rounded-xl sm:rounded-full border border-[#C59B27]/45 flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Search className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-[#FDE68A] shrink-0" />
              <span className="hidden lg:inline">Qidiruv</span>
              <span className="hidden sm:inline font-mono-tabular text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-[#FDE68A]">
                Ctrl+K
              </span>
            </button>
          )}

          {/* Language Switcher — visible on sm+ in top row, inside drawer on mobile phones */}
          <div
            role="group"
            aria-label="Tilni tanlash"
            className="hidden sm:flex items-center gap-0.5 bg-[#0B2D5C] p-0.5 rounded-full border border-white/15 font-mono-tabular"
          >
            {(['uz', 'ru', 'en'] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={`px-2 py-1 text-[10px] sm:text-[11px] uppercase rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  lang === l
                    ? 'bg-white text-[#041E41] font-bold'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Student Profile / Login Button */}
          {studentProfile ? (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleSelectTab('cabinet')}
                className="h-9 sm:h-auto px-2.5 sm:px-3.5 sm:py-1.5 text-xs font-semibold text-white bg-[#0099B5] hover:bg-[#008199] rounded-xl sm:rounded-full transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 shrink-0" />
                <span className="max-w-[68px] sm:max-w-[110px] truncate">
                  {studentProfile.fullName.split(' ')[0]}
                </span>
                {totalActiveItems > 0 && (
                  <span className="font-mono-tabular text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-white">
                    {totalActiveItems}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={onLogout}
                title={
                  lang === 'ru'
                    ? 'Выйти из кабинета'
                    : lang === 'en'
                    ? 'Sign Out'
                    : 'Kabinetdan chiqish'
                }
                aria-label="Kabinetdan chiqish"
                className="hidden sm:flex p-2 text-xs text-white/85 hover:text-white bg-white/10 hover:bg-red-600/80 rounded-full transition-colors cursor-pointer shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenLoginModal}
              className="h-9 sm:h-auto px-2.5 sm:px-3.5 sm:py-1.5 text-xs font-semibold text-white bg-[#0099B5] hover:bg-[#008199] rounded-xl sm:rounded-full transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden md:inline">
                {lang === 'ru'
                  ? 'Войти в кабинет'
                  : lang === 'en'
                  ? 'Student Login'
                  : 'Tizimga kirish'}
              </span>
              <span className="md:hidden">
                {lang === 'ru' ? 'Войти' : lang === 'en' ? 'Login' : 'Kirish'}
              </span>
            </button>
          )}

          {/* Mobile & Tablet Drawer Toggle Button (shown below xl) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Menyuni yopish' : 'Menyuni ochish'}
            className="xl:hidden w-9 h-9 rounded-xl bg-[#0B2D5C] hover:bg-[#123e7c] border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4 text-[#FDE68A]" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Horizontal Quick-Navigation Pill Strip (1-tap section switching on phones & tablets) */}
      <div className="xl:hidden border-t border-white/10 bg-[#06234B]/95 px-3 sm:px-5 py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const isAdminItem = item.id === 'admin';
          return (
            <button
              key={`quick-pill-${item.id}`}
              type="button"
              onClick={() => handleSelectTab(item.id)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#0099B5] text-white shadow-xs'
                  : isAdminItem
                  ? 'bg-[#C59B27]/15 text-[#FDE68A] border border-[#C59B27]/40'
                  : 'bg-white/6 text-white/80 hover:bg-white/12 hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.shortLabel}</span>
              {item.id === 'cabinet' && totalActiveItems > 0 && (
                <span className="text-[10px] font-mono-tabular px-1.5 rounded-full bg-white/20 text-white">
                  {totalActiveItems}
                </span>
              )}
            </button>
          );
        })}

        {onOpenRoadmapModal && (
          <button
            type="button"
            onClick={onOpenRoadmapModal}
            className="sm:hidden px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-[#C59B27] text-[#041E41] flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Compass className="w-3 h-3 shrink-0" />
            <span>Yo‘l xaritasi (PDF)</span>
          </button>
        )}
      </div>

      {/* Collapsible Mobile & Tablet Full Drawer Menu */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobil navigatsiya menyusi"
          className="xl:hidden border-t border-[#C59B27]/40 bg-[#041E41] px-3.5 sm:px-6 py-4 space-y-4 shadow-2xl max-h-[82vh] overflow-y-auto"
        >
          {/* Quick Utility Actions Row (Roadmap PDF + Spotlight Search) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {onOpenRoadmapModal && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenRoadmapModal();
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#C59B27] text-[#041E41] font-extrabold text-xs flex items-center justify-between gap-2 shadow-sm cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Compass className="w-4 h-4 shrink-0" />
                  <span>Talaba Yo‘l Xaritasi (Slayd & PDF)</span>
                </span>
                <span className="text-[10px] font-mono-tabular px-2 py-0.5 rounded bg-[#041E41]/15">
                  Yuklab olish
                </span>
              </button>
            )}

            {onOpenSpotlightSearch && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSpotlightSearch();
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B2D5C] border border-[#C59B27]/50 text-white font-semibold text-xs flex items-center justify-between gap-2 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FDE68A] shrink-0" />
                  <span>Intellektual Tezkor Qidiruv</span>
                </span>
                <span className="text-[10px] font-mono-tabular px-2 py-0.5 rounded bg-white/10 text-[#FDE68A]">
                  Ctrl+K
                </span>
              </button>
            )}
          </div>

          {/* All 7 Library Sections Grid */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-mono-tabular uppercase tracking-wider text-white/60 px-1">
              Platforma bo‘limlari
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                const isAdmin = item.id === 'admin';
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectTab(item.id)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                      isActive
                        ? 'bg-[#0099B5] text-white shadow-sm ring-1 ring-white/30'
                        : isAdmin
                        ? 'bg-[#C59B27]/15 text-[#FDE68A] border border-[#C59B27]/40 hover:bg-[#C59B27]/25'
                        : 'bg-[#0B2D5C]/85 text-white/90 hover:bg-[#0B2D5C] hover:text-white border border-white/10'
                    }`}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      {item.icon}
                      <span className="truncate">{item.label}</span>
                    </span>
                    {item.id === 'cabinet' && totalActiveItems > 0 && (
                      <span className="text-[10px] font-mono-tabular px-1.5 py-0.5 rounded-full bg-white/20 text-white shrink-0">
                        {totalActiveItems}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Drawer Row: Language Selector + Student Session Status */}
          <div className="pt-3 border-t border-white/15 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center justify-between sm:justify-start gap-2">
              <span className="text-xs text-white/75 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Interfeys tili:</span>
              </span>
              <div className="flex items-center gap-1 bg-[#0B2D5C] p-1 rounded-xl border border-white/15 font-mono-tabular">
                {(
                  [
                    { code: 'uz', label: 'O‘zbek (UZ)' },
                    { code: 'ru', label: 'Рус (RU)' },
                    { code: 'en', label: 'Eng (EN)' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => setLang(item.code)}
                    className={`px-2.5 py-1 text-[11px] rounded-lg transition-colors cursor-pointer ${
                      lang === item.code
                        ? 'bg-white text-[#041E41] font-bold'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {studentProfile ? (
              <div className="flex items-center justify-between gap-2 bg-[#0B2D5C] px-3 py-2 rounded-xl border border-white/15">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">
                    {studentProfile.fullName}
                  </div>
                  <div className="text-[10px] font-mono-tabular text-[#38BDF8]">
                    HEMIS: {studentProfile.hemisId}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Chiqish</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLoginModal();
                }}
                className="px-4 py-2.5 rounded-xl bg-[#0099B5] hover:bg-[#008199] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>HEMIS orqali talaba kabinetiga kirish</span>
              </button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};
