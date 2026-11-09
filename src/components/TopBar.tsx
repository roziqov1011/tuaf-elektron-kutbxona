import React, { useState } from 'react';
import { Compass, LogIn, LogOut, Menu, Search, ShieldCheck, UserCheck, X } from 'lucide-react';
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

  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'catalog', label: t.navCatalog },
    {
      id: 'famous-books',
      label:
        lang === 'uz'
          ? 'Mashhur kitoblar'
          : lang === 'ru'
          ? 'Популярные книги'
          : 'Famous Books',
    },
    { id: 'dissertations', label: t.navDissertations },
    { id: 'mediatheque', label: t.navMediatheque },
    { id: 'reading-hall', label: t.navReadingHall },
    { id: 'cabinet', label: t.navCabinet },
    {
      id: 'admin',
      label:
        lang === 'uz'
          ? 'ARM Admin'
          : lang === 'ru'
          ? 'АРМ Админ'
          : 'ARM Admin',
    },
  ];

  const totalActiveItems = activeLoansCount + activeSeatsCount;

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#041E41]/95 backdrop-blur-md border-b border-white/15 text-white">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-2 sm:gap-4 px-3.5 sm:px-6 lg:px-10 py-2.5 sm:py-3.5">
        {/* Zone 1: Official TUAF Emblem + Responsive Brand Name */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            handleSelectTab('catalog');
          }}
          className="flex items-center gap-2.5 sm:gap-3 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#38BDF8] min-w-0"
        >
          <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border-2 border-[#C59B27] bg-white flex items-center justify-center overflow-hidden shadow-md shrink-0 p-0.5">
            <img
              src={TUAF_OFFICIAL_LOGO}
              alt="Turon University Andijon"
              className="w-full h-full object-contain"
            />
          </span>
          <span className="text-base sm:text-xl font-bold tracking-tight text-white font-serif-academic truncate">
            <span className="sm:hidden">Turon · ARM</span>
            <span className="hidden sm:inline">{t.brandName}</span>
          </span>
        </a>

        {/* Zone 2: Desktop Single-Line Navigation Links */}
        <nav
          aria-label="Asosiy menyu"
          className="hidden lg:flex items-center gap-4 xl:gap-6 text-sm font-medium text-white/85"
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const isAdminItem = item.id === 'admin';
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectTab(item.id)}
                className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 flex items-center gap-1 cursor-pointer ${
                  isActive
                    ? 'text-white font-semibold border-[#38BDF8]'
                    : isAdminItem
                    ? 'border-transparent text-[#C59B27] hover:text-white hover:border-[#C59B27]'
                    : 'border-transparent hover:text-white hover:border-white/40'
                }`}
              >
                {isAdminItem && <ShieldCheck className="w-3.5 h-3.5 shrink-0" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Language Switcher + Student Auth / Cabinet + Mobile Menu Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Tablet Quick Section Select */}
          <div className="hidden md:flex lg:hidden items-center">
            <label htmlFor="mobile-nav-select" className="sr-only">
              Bo‘lim tanlash
            </label>
            <select
              id="mobile-nav-select"
              value={activeTab}
              onChange={(e) => handleSelectTab(e.target.value as ActiveTab)}
              className="bg-[#0B2D5C] text-white text-xs px-2.5 py-1.5 rounded-lg border border-white/20"
            >
              {navItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* Student Roadmap (Slide + PDF) Trigger */}
          {onOpenRoadmapModal && (
            <button
              type="button"
              onClick={onOpenRoadmapModal}
              aria-label="Talaba yo‘l xaritasi (Slayd va PDF)"
              className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold bg-[#C59B27]/20 hover:bg-[#C59B27]/35 text-[#FDE68A] rounded-full border border-[#C59B27]/70 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
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
              className="px-2.5 sm:px-3 py-1.5 text-xs font-medium bg-[#0B2D5C] hover:bg-[#123e7c] text-white/90 hover:text-white rounded-full border border-[#C59B27]/45 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-[#C59B27] shrink-0" />
              <span className="hidden xl:inline">Qidiruv</span>
              <span className="hidden sm:inline font-mono-tabular text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-[#FDE68A]">
                Ctrl+K
              </span>
            </button>
          )}

          {/* Clean Language Switcher */}
          <div
            role="group"
            aria-label="Tilni tanlash"
            className="flex items-center gap-0.5 bg-[#0B2D5C] p-0.5 rounded-full border border-white/15 font-mono-tabular"
          >
            {(['uz', 'ru', 'en'] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={`px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] uppercase rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  lang === l
                    ? 'bg-white text-[#041E41] font-bold'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {studentProfile ? (
            <div className="flex items-center gap-1 sm:gap-1.5">
              <button
                type="button"
                onClick={() => handleSelectTab('cabinet')}
                className="px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0099B5] hover:bg-[#008199] rounded-full transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 shrink-0" />
                <span className="max-w-[78px] sm:max-w-none truncate">
                  {studentProfile.fullName.split(' ')[0]}
                </span>
                <span className="font-mono-tabular opacity-90 hidden xs:inline sm:inline">
                  ({totalActiveItems})
                </span>
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
                className="p-2 text-xs text-white/85 hover:text-white bg-white/10 hover:bg-red-600/80 rounded-full transition-colors cursor-pointer shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenLoginModal}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-white bg-[#0099B5] hover:bg-[#008199] rounded-full transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">
                {lang === 'ru'
                  ? 'Войти в кабинет'
                  : lang === 'en'
                  ? 'Student Login'
                  : 'Tizimga kirish'}
              </span>
              <span className="sm:hidden">
                {lang === 'ru' ? 'Войти' : lang === 'en' ? 'Login' : 'Kirish'}
              </span>
            </button>
          )}

          {/* Mobile & Tablet Navigation Drawer Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Menyuni yopish' : 'Menyuni ochish'}
            className="lg:hidden p-2 rounded-lg bg-[#0B2D5C] hover:bg-[#123e7c] border border-white/20 text-white transition-colors cursor-pointer shrink-0"
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Collapsible Mobile & Tablet Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobil navigatsiya menyusi"
          className="lg:hidden border-t border-white/15 bg-[#041E41] px-4 py-3 space-y-2 shadow-xl"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectTab(item.id)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-[#0099B5] text-white shadow-sm'
                      : 'bg-[#0B2D5C]/80 text-white/85 hover:bg-[#0B2D5C] hover:text-white border border-white/10'
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  {item.id === 'cabinet' && totalActiveItems > 0 && (
                    <span className="text-[10px] font-mono-tabular px-1.5 py-0.5 rounded-full bg-white/20 text-white shrink-0">
                      {totalActiveItems}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
};
