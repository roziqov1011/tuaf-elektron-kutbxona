import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  CalendarPlus,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  KeyRound,
  LampDesk,
  LogOut,
  Minus,
  Plus,
  PlusCircle,
  QrCode,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserCheck,
} from 'lucide-react';
import {
  AdminStaffProfile,
  BookLoanReservation,
  FacultyId,
  Language,
  LibraryResource,
  QrPassTicketItem,
  ReadingRoomSeat,
  ResourceType,
  SeatReservation,
} from '../types/library';
import { READING_HALL_INFO } from '../data/seedLibraryData';
import { FACULTY_LABELS } from '../data/translations';
import {
  calculateHallOccupancy,
  findReservationsByQuery,
  validateNewResourceForm,
} from '../utils/libraryLogic';

export type AdminSubTab = 'scanner-loans' | 'halls-monitor' | 'catalog-manager';

interface AdminPortalViewProps {
  lang: Language;
  adminStaff: AdminStaffProfile | null;
  onAdminLogin: (staff: AdminStaffProfile) => void;
  onAdminLogout: () => void;
  onBackToCatalog: () => void;
  resources: LibraryResource[];
  onAddResource: (newRes: LibraryResource) => void;
  onUpdateResourceCopies: (resourceId: string, delta: number) => void;
  loans: BookLoanReservation[];
  onHandOverBook: (loanId: string) => void;
  onReturnBook: (loanId: string) => void;
  onExtendLoan: (loanId: string, extraDays: number) => void;
  onCancelLoan: (loanId: string) => void;
  seats: ReadingRoomSeat[];
  seatReservations: SeatReservation[];
  onCancelSeatReservation: (resId: string) => void;
  onOpenQrTicket: (item: QrPassTicketItem) => void;
}

const DEMO_STAFF_ACCOUNTS: {
  profile: AdminStaffProfile;
  login: string;
  accessCode: string;
  badge: string;
}[] = [
  {
    profile: {
      id: 'staff-tuaf-1',
      fullName: 'Dots. M. Qodirov',
      roleTitle: 'Axborot-Resurs Markazi Direktori (Bosh Admin)',
      staffId: 'ARM-ADMIN-001',
      email: 'arm.admin@tuaf.uz',
      department: 'TUAF Axborot-resurs markazi boshqarmasi',
    },
    login: 'arm.admin@tuaf.uz',
    accessCode: 'TUAF-ARM-2026',
    badge: 'Bosh Administrator',
  },
  {
    profile: {
      id: 'staff-tuaf-2',
      fullName: 'Zulxumor Rahimova',
      roleTitle: 'Bosh Kutubxonachi (104-xona Abonement va Topshirish punkti)',
      staffId: 'ARM-LIB-104',
      email: 'abonement@tuaf.uz',
      department: '1-qavat, Kitob topshirish va qabul qilish bo‘limi',
    },
    login: 'abonement@tuaf.uz',
    accessCode: 'TUAF-104-2026',
    badge: 'Bosh Kutubxonachi',
  },
];

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  lang,
  adminStaff,
  onAdminLogin,
  onAdminLogout,
  onBackToCatalog,
  resources,
  onAddResource,
  onUpdateResourceCopies,
  loans,
  onHandOverBook,
  onReturnBook,
  onExtendLoan,
  onCancelLoan,
  seats,
  seatReservations,
  onCancelSeatReservation,
  onOpenQrTicket,
}) => {
  // Login state
  const [loginInput, setLoginInput] = useState('arm.admin@tuaf.uz');
  const [codeInput, setCodeInput] = useState('TUAF-ARM-2026');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Admin workspace state
  const [subTab, setSubTab] = useState<AdminSubTab>('scanner-loans');
  const [scannerQuery, setScannerQuery] = useState('');
  const [loanStatusFilter, setLoanStatusFilter] = useState<
    'all' | 'ready-for-pickup' | 'active'
  >('all');

  // New resource form state
  const [titleUz, setTitleUz] = useState('');
  const [authorsStr, setAuthorsStr] = useState('');
  const [doi, setDoi] = useState('10.1093/tuaf/2026.105');
  const [isbn, setIsbn] = useState('978-9943-88-410-2');
  const [udc, setUdc] = useState('336.71(575.1)');
  const [year, setYear] = useState('2026');
  const [type, setType] = useState<ResourceType>('book');
  const [faculty, setFaculty] =
    useState<Exclude<FacultyId, 'all'>>('economics-finance');
  const [language, setLanguage] = useState<
    'O‘zbek' | 'English' | 'Русский' | 'Arab / Fors (Transkripsiya)'
  >('O‘zbek');
  const [pages, setPages] = useState('360');
  const [totalCopies, setTotalCopies] = useState('20');
  const [publisher, setPublisher] = useState(
    'Turon University Andijon Filiali Nashriyoti'
  );
  const [abstractUz, setAbstractUz] = useState('');
  const [chapterContent, setChapterContent] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const activeSeatBookings = useMemo(
    () => seatReservations.filter((r) => r.status === 'confirmed'),
    [seatReservations]
  );

  const { matchedLoans, matchedSeats } = useMemo(
    () => findReservationsByQuery(scannerQuery, loans, activeSeatBookings),
    [scannerQuery, loans, activeSeatBookings]
  );

  const filteredLoans = useMemo(() => {
    if (loanStatusFilter === 'all') return matchedLoans;
    return matchedLoans.filter((l) => l.status === loanStatusFilter);
  }, [matchedLoans, loanStatusFilter]);

  const readyForPickupCount = loans.filter(
    (l) => l.status === 'ready-for-pickup'
  ).length;
  const activeHandedOverCount = loans.filter(
    (l) => l.status === 'active'
  ).length;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const trimmedLogin = loginInput.trim().toLowerCase();
    const trimmedCode = codeInput.trim();

    if (!trimmedLogin || trimmedCode.length < 4) {
      setLoginError(
        'Iltimos, xodim login (yoki ID) va maxfiy kirish kodini to‘liq kiriting.'
      );
      return;
    }

    const matched = DEMO_STAFF_ACCOUNTS.find(
      (d) =>
        d.login.toLowerCase() === trimmedLogin ||
        d.profile.staffId.toLowerCase() === trimmedLogin
    );

    if (matched) {
      onAdminLogin(matched.profile);
      return;
    }

    onAdminLogin({
      id: `staff-${Date.now()}`,
      fullName: 'TUAF ARM Mas’ul Xodimi',
      roleTitle: 'Axborot-Resurs Markazi Kutubxonachisi',
      staffId: 'ARM-STAFF-2026',
      email: trimmedLogin,
      department: 'TUAF Axborot-resurs markazi',
    });
  };

  const handleFillDemoBook = () => {
    setTitleUz(
      'Raqamli Iqtisodiyotda Bank Ауditi, Moliyaviy Tahlil va Korporativ Boshqaruv'
    );
    setAuthorsStr('Prof. A. Omonov, Dots. S. Xolmirzayev (TUAF)');
    setDoi('10.1093/tuaf/econ.2026.712');
    setIsbn('978-9943-91-204-5');
    setUdc('60410600 · 336.717');
    setYear('2026');
    setPages('412');
    setTotalCopies('25');
    setFaculty('economics-finance');
    setAbstractUz(
      'Turon universiteti Andijon filiali Iqtisodiyot va moliya kafedrasi talabalari uchun mo‘ljallangan ushbu o‘quv qo‘llanmada xalqaro audit standartlari va bank tavakkalchiliklarini boshqarish amaliyoti yoritilgan.'
    );
    setChapterContent(
      'I Bob. Tijorat banklarida ichki audit va komplayens-nazorat tizimini raqamlashtirish asoslari.'
    );
    setFormError(null);
    setFormSuccess(null);
  };

  const handleCreateBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const validation = validateNewResourceForm({
      title: titleUz,
      authors: authorsStr,
      doi,
      isbn,
      udc,
      year,
      type,
      faculty,
      language:
        language === 'Arab / Fors (Transkripsiya)' ? 'O‘zbek' : language,
      pages,
      publisher,
      abstract: abstractUz,
      chapterContent:
        chapterContent || 'I Bob. Asosiy nazariy va amaliy qoidalar.',
      openAccess: true,
      peerReviewed: true,
    });

    if (!validation.valid) {
      setFormError(
        `Ma’lumotni tekshiring: "${validation.errorKey}" maydoni to‘g‘ri to‘ldirilishi shart (DOI 10.xxxx/... formatda bo‘lishi lozim).`
      );
      return;
    }

    const copiesNum = Math.max(1, Number(totalCopies) || 15);
    const created: LibraryResource = {
      id: `tuaf-custom-${Date.now()}`,
      title: {
        uz: titleUz.trim(),
        ru: titleUz.trim(),
        en: titleUz.trim(),
      },
      authors: authorsStr
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean),
      year: Number(year),
      type,
      faculty,
      programCode: '60410600',
      isbn: isbn.trim(),
      doi: doi.trim(),
      udc: udc.trim(),
      language,
      pages: Number(pages) || 250,
      citationsCount: 12,
      downloadsCount: 140,
      openAccess: true,
      peerReviewed: true,
      publisher: publisher.trim(),
      spineColor: '#0F2342',
      availableCopies: copiesNum,
      totalCopies: copiesNum,
      abstract: {
        uz: abstractUz.trim(),
        ru: abstractUz.trim(),
        en: abstractUz.trim(),
      },
      keywords: [udc.trim(), 'TUAF ARM', 'Yangi adabiyot'],
      chapters: [
        {
          number: 1,
          title: {
            uz: 'I Bob. Kirish va asosiy qism',
            ru: 'Глава I. Введение и основная часть',
            en: 'Chapter I. Introduction & Core Concepts',
          },
          pageStart: 1,
          content: {
            uz:
              chapterContent.trim() ||
              abstractUz.trim(),
            ru:
              chapterContent.trim() ||
              abstractUz.trim(),
            en:
              chapterContent.trim() ||
              abstractUz.trim(),
          },
        },
      ],
    };

    onAddResource(created);
    setFormSuccess(
      `«${created.title.uz}» kitobi (${copiesNum} nusxada) kutubxona fondiga muvaffaqiyatli qo‘shildi!`
    );
    setTitleUz('');
    setAuthorsStr('');
    setAbstractUz('');
    setChapterContent('');
  };

  // RENDER ADMIN LOGIN PORTAL IF NOT AUTHENTICATED AS STAFF
  if (!adminStaff) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
        <div className="mb-4">
          <button
            type="button"
            onClick={onBackToCatalog}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#0F2342] hover:text-[#0099B5] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Asosiy katalogga qaytish</span>
          </button>
        </div>

        <div className="bg-white border-2 border-[#0F2342] rounded-2xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12">
          {/* Left Institutional Staff Info Column */}
          <div className="lg:col-span-5 bg-[#041E41] text-white p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C59B27]/20 border border-[#C59B27]/50 text-[#C59B27] text-xs font-bold">
                <ShieldAlert className="w-4 h-4" />
                <span>TUAF ARM · MAXSUS BOSHQARUV TIZIMI</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif-academic font-bold leading-tight">
                Kutubxonachi va Admin Boshqaruv Paneli
              </h1>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Ushbu bo‘lim faqat Turon universiteti Andijon filiali
                Axborot-resurs markazi (ARM) xodimlari uchun mo‘ljallangan.
                Talaba kabinetidan to‘liq ajratilgan.
              </p>

              <div className="space-y-2.5 pt-2 text-xs text-stone-200">
                <div className="flex items-start gap-2.5">
                  <QrCode className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                  <span>
                    Talabalarning <strong>#TUAF-KTB-...</strong> va{' '}
                    <strong>#TUAF-JOY-...</strong> QR talonlarini tekshirish va
                    kitob topshirish
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <LampDesk className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5" />
                  <span>
                    4 ta o‘quv zalidagi band qilingan joylarni real vaqtda
                    nazorat qilish
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <BookOpen className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    Fondga yangi darslik, monografiya qo‘shish va nusxalar
                    sonini boshqarish
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-[11px] text-stone-300 space-y-1 font-mono-tabular">
              <div className="font-bold text-[#C59B27]">
                ARM Ma’muriyati (104-xona)
              </div>
              <div>Andijon sh., A.Yuldashev ko‘chasi, 58-a-uy</div>
              <div>Ichki raqam: +998 74 200 00 25 (104)</div>
            </div>
          </div>

          {/* Right Admin Login Form + 1-Click Staff Demo */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 bg-[#FBF9F5]">
            <div className="space-y-1 border-b border-[#E5DEC9] pb-4">
              <div className="text-xs font-bold uppercase tracking-wider text-[#0099B5]">
                Xodim autentifikatsiyasi
              </div>
              <h2 className="text-xl sm:text-2xl font-serif-academic font-bold text-[#0F2342]">
                ARM Xodimi sifatida tizimga kirish
              </h2>
            </div>

            {/* 1-Click Demo Staff Selector */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#0F2342] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
                <span>
                  Tezkor sinov uchun xodim profilini tanlang (1-bosishda):
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DEMO_STAFF_ACCOUNTS.map((item) => (
                  <button
                    key={item.profile.id}
                    type="button"
                    onClick={() => {
                      setLoginInput(item.login);
                      setCodeInput(item.accessCode);
                      setLoginError(null);
                      onAdminLogin(item.profile);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      loginInput === item.login
                        ? 'bg-[#0F2342] text-white border-[#0F2342] shadow-sm'
                        : 'bg-white text-[#1C1917] border-[#E5DEC9] hover:border-[#0F2342]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold">
                        {item.profile.fullName}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-mono-tabular font-bold ${
                          loginInput === item.login
                            ? 'bg-[#C59B27] text-[#041E41]'
                            : 'bg-[#F3EFE6] text-[#0F2342]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    </div>
                    <div
                      className={`text-[11px] mt-1 font-mono-tabular ${
                        loginInput === item.login
                          ? 'text-stone-300'
                          : 'text-[#57534E]'
                      }`}
                    >
                      ID: {item.profile.staffId} · {item.login}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 font-semibold">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="admin-login-input"
                  className="block text-xs font-bold text-[#0F2342] mb-1.5"
                >
                  Xodim Email yoki Tabel ID raqami
                </label>
                <input
                  id="admin-login-input"
                  type="text"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#E5DEC9] rounded-xl text-[#0F2342] font-mono-tabular font-semibold"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-code-input"
                  className="block text-xs font-bold text-[#0F2342] mb-1.5"
                >
                  Maxfiy kirish kaliti (Access Key)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#57534E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="admin-code-input"
                    type="password"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#E5DEC9] rounded-xl text-[#0F2342] font-mono-tabular font-semibold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-5 bg-[#0F2342] hover:bg-[#173461] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-[#C59B27]" />
                <span>Admin boshqaruv paneliga kirish</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // RENDER AUTHENTICATED ADMIN & LIBRARIAN WORKSPACE
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* Top Staff Header */}
      <div className="bg-[#0F2342] text-white border-2 border-[#C59B27] rounded-2xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#C59B27] text-[#041E41] flex items-center justify-center font-serif-academic font-bold text-lg shrink-0 shadow-md">
            ARM
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#C59B27]">
              <ShieldCheck className="w-4 h-4" />
              <span>TUAF ARM · KUTUBXONACHI VA ADMIN BOSHQARUV PANELI</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif-academic font-bold text-white">
              {adminStaff.fullName}
            </h1>
            <div className="text-xs text-stone-300 font-mono-tabular">
              {adminStaff.roleTitle} · ID: {adminStaff.staffId}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onBackToCatalog}
            className="px-4 py-2.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors cursor-pointer"
          >
            Katalogga o‘tish
          </button>
          <button
            type="button"
            onClick={onAdminLogout}
            className="px-4 py-2.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Admin tizimidan chiqish</span>
          </button>
        </div>
      </div>

      {/* 4 Admin Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <div className="bg-white border border-[#E5DEC9] rounded-xl p-4 sm:p-5">
          <div className="text-xs text-[#57534E]">
            Topshirishni kutayotgan kitoblar
          </div>
          <div className="text-2xl sm:text-3xl font-serif-academic font-bold text-emerald-700 font-mono-tabular mt-1">
            {readyForPickupCount} ta
          </div>
          <div className="text-[11px] text-[#57534E] mt-1">
            104-xonada tayyorlab qo‘yilgan
          </div>
        </div>

        <div className="bg-white border border-[#E5DEC9] rounded-xl p-4 sm:p-5">
          <div className="text-xs text-[#57534E]">
            Talabalarning qo‘lidagi kitoblar
          </div>
          <div className="text-2xl sm:text-3xl font-serif-academic font-bold text-[#0F2342] font-mono-tabular mt-1">
            {activeHandedOverCount} ta
          </div>
          <div className="text-[11px] text-[#0099B5] font-semibold mt-1">
            Muddatli abonementda
          </div>
        </div>

        <div className="bg-white border border-[#E5DEC9] rounded-xl p-4 sm:p-5">
          <div className="text-xs text-[#57534E]">
            O‘quv zalida band qilingan joylar
          </div>
          <div className="text-2xl sm:text-3xl font-serif-academic font-bold text-[#B8860B] font-mono-tabular mt-1">
            {activeSeatBookings.length} ta
          </div>
          <div className="text-[11px] text-[#57534E] mt-1">
            Jami 36 ta interaktiv o‘rin
          </div>
        </div>

        <div className="bg-white border border-[#E5DEC9] rounded-xl p-4 sm:p-5">
          <div className="text-xs text-[#57534E]">
            Elektron katalogdagi nashrlar
          </div>
          <div className="text-2xl sm:text-3xl font-serif-academic font-bold text-[#0F2342] font-mono-tabular mt-1">
            {resources.length} ta
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            + Yangi darslik qo‘shish ochiq
          </div>
        </div>
      </div>

      {/* 3-Tab Admin Navigation */}
      <div
        role="tablist"
        aria-label="Admin boshqaruv bo‘limlari"
        className="bg-white border border-[#E5DEC9] rounded-xl p-1.5 flex flex-wrap gap-1.5 shadow-xs"
      >
        <button
          type="button"
          role="tab"
          aria-selected={subTab === 'scanner-loans'}
          onClick={() => setSubTab('scanner-loans')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
            subTab === 'scanner-loans'
              ? 'bg-[#0F2342] text-white shadow-xs'
              : 'text-[#57534E] hover:text-[#0F2342]'
          }`}
        >
          <QrCode className="w-4 h-4 text-[#C59B27]" />
          <span>
            1. QR Talon Tekshirish va Kitob Topshirish ({loans.length})
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={subTab === 'halls-monitor'}
          onClick={() => setSubTab('halls-monitor')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
            subTab === 'halls-monitor'
              ? 'bg-[#0F2342] text-white shadow-xs'
              : 'text-[#57534E] hover:text-[#0F2342]'
          }`}
        >
          <LampDesk className="w-4 h-4 text-[#38BDF8]" />
          <span>
            2. O‘quv Zallari Monitoringi ({activeSeatBookings.length})
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={subTab === 'catalog-manager'}
          onClick={() => setSubTab('catalog-manager')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
            subTab === 'catalog-manager'
              ? 'bg-[#0F2342] text-white shadow-xs'
              : 'text-[#57534E] hover:text-[#0F2342]'
          }`}
        >
          <PlusCircle className="w-4 h-4 text-emerald-400" />
          <span>3. Yangi Kitob Qo‘shish va Fond ({resources.length})</span>
        </button>
      </div>

      {/* SUB-TAB 1: QR TICKET SCANNER & BOOK CIRCULATION DESK */}
      {subTab === 'scanner-loans' && (
        <div className="space-y-6">
          {/* Express QR Ticket Code Lookup Box */}
          <div className="bg-white border-2 border-[#0F2342] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#0099B5]">
                  Tezkor QR Talon va HEMIS ID Skayneri
                </div>
                <h2 className="text-lg sm:text-xl font-serif-academic font-bold text-[#0F2342]">
                  Talaba talon kodini (#TUAF-KTB-... yoki #TUAF-JOY-...) kiriting
                </h2>
              </div>

              {/* Sample Quick Ticket Chips */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-[#57534E] text-[11px]">Namunalar:</span>
                {['TUAF-KTB-5190', 'TUAF-KTB-4821', 'TUAF-JOY-1108'].map(
                  (code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() =>
                        setScannerQuery((prev) => (prev === code ? '' : code))
                      }
                      className={`px-2.5 py-1 rounded-lg font-mono-tabular font-bold cursor-pointer transition-colors ${
                        scannerQuery === code
                          ? 'bg-[#0F2342] text-[#C59B27]'
                          : 'bg-[#F3EFE6] text-[#0F2342] hover:bg-[#E5DEC9]'
                      }`}
                    >
                      #{code}
                    </button>
                  )
                )}
                {scannerQuery && (
                  <button
                    type="button"
                    onClick={() => setScannerQuery('')}
                    className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 font-semibold cursor-pointer"
                  >
                    Tozalash
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#57534E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={scannerQuery}
                  onChange={(e) => setScannerQuery(e.target.value)}
                  placeholder="Talon kodi (masalan: TUAF-KTB-5190), Talaba F.I.Sh. yoki HEMIS ID..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#FBF9F5] border border-[#E5DEC9] rounded-xl text-[#0F2342] font-mono-tabular font-semibold"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-[#F3EFE6] p-1 rounded-xl border border-[#E5DEC9]">
                {(
                  [
                    { id: 'all', label: `Barchasi (${matchedLoans.length})` },
                    {
                      id: 'ready-for-pickup',
                      label: `Topshirishga tayyor (${
                        matchedLoans.filter(
                          (l) => l.status === 'ready-for-pickup'
                        ).length
                      })`,
                    },
                    {
                      id: 'active',
                      label: `Talabada (${
                        matchedLoans.filter((l) => l.status === 'active').length
                      })`,
                    },
                  ] as const
                ).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setLoanStatusFilter(f.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      loanStatusFilter === f.id
                        ? 'bg-[#0F2342] text-white'
                        : 'text-[#57534E] hover:text-[#0F2342]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Book Loans Management List */}
          <div className="bg-white border border-[#E5DEC9] rounded-2xl p-5 sm:p-6 space-y-4">
            <h3 className="text-lg font-serif-academic font-bold text-[#0F2342] border-b border-[#E5DEC9] pb-3">
              Kitob Bandlovlari va Abonement Nazorati ({filteredLoans.length})
            </h3>

            {filteredLoans.length === 0 ? (
              <p className="text-xs text-[#57534E] py-6 text-center">
                Qidiruv bo‘yicha kitob bandlovlari topilmadi.
              </p>
            ) : (
              <div className="space-y-3.5">
                {filteredLoans.map((loan) => (
                  <div
                    key={loan.id}
                    className="p-4 sm:p-5 bg-[#FBF9F5] border border-[#E5DEC9] rounded-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tabular">
                        <span className="px-2.5 py-0.5 rounded bg-[#0F2342] text-[#C59B27] font-bold">
                          #{loan.ticketCode || 'TUAF-KTB-PASS'}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded font-bold ${
                            loan.status === 'ready-for-pickup'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-sky-100 text-sky-900'
                          }`}
                        >
                          {loan.status === 'ready-for-pickup'
                            ? '● 104-xonada topshirishga tayyor'
                            : '● Talabaga topshirilgan (Qo‘lda)'}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white border border-[#E5DEC9] text-[#0F2342] font-semibold">
                          <Clock className="w-3 h-3 inline mr-1 text-[#0099B5]" />
                          {loan.durationDays || 14} kunga ({loan.pickupDate} →{' '}
                          {loan.dueDate})
                        </span>
                      </div>

                      <div className="text-base sm:text-lg font-serif-academic font-bold text-[#0F2342]">
                        {loan.resourceTitle[lang]}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#57534E]">
                        <span className="font-bold text-[#0F2342]">
                          Talaba: {loan.studentName}
                        </span>
                        <span className="font-mono-tabular">
                          ID: {loan.studentId}
                        </span>
                        <span>·</span>
                        <span>
                          Joy:{' '}
                          {loan.pickupLocation ||
                            '1-qavat, ARM Abonement (104-xona)'}
                        </span>
                      </div>
                    </div>

                    {/* Librarian Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#E5DEC9]">
                      <button
                        type="button"
                        onClick={() => onOpenQrTicket({ kind: 'book', loan })}
                        className="px-3 py-2 text-xs font-bold bg-white border border-[#0F2342] text-[#0F2342] hover:bg-[#F3EFE6] rounded-xl flex items-center gap-1.5 cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5 text-[#B8860B]" />
                        <span>QR Talon</span>
                      </button>

                      {loan.status === 'ready-for-pickup' ? (
                        <button
                          type="button"
                          onClick={() => onHandOverBook(loan.id)}
                          className="px-4 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                        >
                          <UserCheck className="w-4 h-4" />
                          <span>Talabaga topshirish</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onReturnBook(loan.id)}
                          className="px-4 py-2 text-xs font-bold bg-[#0099B5] hover:bg-[#008199] text-white rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                        >
                          <ClipboardCheck className="w-4 h-4" />
                          <span>Kitob qaytarib olindi</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onExtendLoan(loan.id, 7)}
                        className="px-3 py-2 text-xs font-bold bg-[#F7F1E1] border border-[#C59B27] text-[#0F2342] rounded-xl flex items-center gap-1 cursor-pointer"
                      >
                        <CalendarPlus className="w-3.5 h-3.5 text-[#B8860B]" />
                        <span>+7 kun</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onCancelLoan(loan.id)}
                        className="p-2 text-xs text-red-700 hover:bg-red-50 rounded-xl cursor-pointer"
                        title="Bandlovni bekor qilish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* If scannerQuery also matches seat bookings, display them right below */}
          {scannerQuery && matchedSeats.length > 0 && (
            <div className="bg-white border border-[#E5DEC9] rounded-2xl p-5 space-y-3">
              <h3 className="text-base font-serif-academic font-bold text-[#0F2342]">
                Topilgan O‘quv Zali Joy Talonlari ({matchedSeats.length})
              </h3>
              {matchedSeats.map((s) => (
                <div
                  key={s.id}
                  className="p-4 bg-[#FBF9F5] border border-[#B8860B] rounded-xl flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="space-y-1 text-xs">
                    <div className="font-mono-tabular font-bold text-[#0F2342]">
                      #{s.ticketCode} · Joy: {s.seatCode} ({s.hallName[lang]})
                    </div>
                    <div className="text-[#57534E]">
                      Talaba: <strong>{s.studentName}</strong> ({s.studentId}) ·{' '}
                      {s.date} · {s.timeSlot}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenQrTicket({ kind: 'seat', seat: s })}
                      className="px-3 py-1.5 text-xs font-bold bg-[#0F2342] text-white rounded-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5 text-[#C59B27]" />
                      <span>QR Talon</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onCancelSeatReservation(s.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 rounded-lg cursor-pointer"
                    >
                      Joyni bo‘shatish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: READING HALLS MONITORING */}
      {subTab === 'halls-monitor' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(
              [
                'main-bodleian',
                'stem-silent',
                'digital-media-pod',
                'rare-manuscripts',
              ] as const
            ).map((hId) => {
              const info = READING_HALL_INFO[hId];
              const stats = calculateHallOccupancy(
                seats,
                seatReservations,
                hId
              );
              return (
                <div
                  key={hId}
                  className="bg-white border border-[#E5DEC9] rounded-xl p-4 space-y-2.5"
                >
                  <div className="text-[11px] font-semibold text-[#B8860B]">
                    {info.floor[lang]}
                  </div>
                  <div className="text-base font-serif-academic font-bold text-[#0F2342] leading-snug">
                    {info.name[lang]}
                  </div>
                  <div className="pt-2 border-t border-[#E5DEC9] flex items-center justify-between text-xs font-mono-tabular">
                    <span className="text-emerald-700 font-bold">
                      Bo‘sh: {stats.available}
                    </span>
                    <span className="text-[#B8860B] font-bold">
                      Talaba bandlov: {stats.reservedByUser}
                    </span>
                    <span className="text-[#57534E]">
                      Band: {stats.occupied}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white border border-[#E5DEC9] rounded-2xl p-5 sm:p-6 space-y-4">
            <h3 className="text-lg font-serif-academic font-bold text-[#0F2342] border-b border-[#E5DEC9] pb-3">
              Faol O‘quv Zali Joy Bandlovlari ({activeSeatBookings.length})
            </h3>

            {activeSeatBookings.length === 0 ? (
              <p className="text-xs text-[#57534E] py-4">
                Hozirda band qilingan o‘quv zali joylari yo‘q.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeSeatBookings.map((rsv) => (
                  <div
                    key={rsv.id}
                    className="p-4 bg-[#FBF9F5] border border-[#E5DEC9] rounded-xl flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono-tabular">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded bg-[#0F2342] text-[#C59B27] font-bold">
                            Joy: {rsv.seatCode}
                          </span>
                          {rsv.ticketCode && (
                            <span className="px-2 py-0.5 rounded bg-[#0099B5]/15 text-[#008199] font-bold">
                              #{rsv.ticketCode}
                            </span>
                          )}
                        </div>
                        <span className="font-semibold text-[#0F2342]">
                          {rsv.date} · {rsv.timeSlot}
                        </span>
                      </div>

                      <div className="text-base font-serif-academic font-bold text-[#0F2342]">
                        {rsv.hallName[lang]}
                      </div>

                      <div className="text-xs text-[#57534E]">
                        <strong>{rsv.studentName}</strong> ({rsv.studentId})
                      </div>
                      {rsv.durationHours && (
                        <div className="text-[11px] font-semibold text-[#B8860B]">
                          Davomiyligi: {rsv.durationHours}
                        </div>
                      )}
                    </div>

                    <div className="pt-2.5 border-t border-[#E5DEC9] flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onOpenQrTicket({ kind: 'seat', seat: rsv })
                        }
                        className="px-3 py-1.5 text-xs font-bold bg-white border border-[#0F2342] text-[#0F2342] rounded-lg flex items-center gap-1.5 cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5 text-[#B8860B]" />
                        <span>QR Talon</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onCancelSeatReservation(rsv.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Joyni bo‘shatish</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: ADD NEW BOOK & INVENTORY MANAGER */}
      {subTab === 'catalog-manager' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left: Add New Book Form */}
          <div className="lg:col-span-6 bg-white border border-[#E5DEC9] rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5DEC9] pb-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#0099B5]">
                  Elektron va Bosma Fondni Boyitish
                </div>
                <h3 className="text-xl font-serif-academic font-bold text-[#0F2342]">
                  Yangi darslik yoki ilmiy nashr qo‘shish
                </h3>
              </div>

              <button
                type="button"
                onClick={handleFillDemoBook}
                className="px-3 py-1.5 text-xs font-bold bg-[#F7F1E1] border border-[#C59B27] text-[#0F2342] rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
                <span>Namuna bilan to‘ldirish</span>
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 font-semibold">
                {formError}
              </div>
            )}

            {formSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateBookSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#0F2342] mb-1">
                  Kitob / Darslik nomi *
                </label>
                <input
                  type="text"
                  value={titleUz}
                  onChange={(e) => setTitleUz(e.target.value)}
                  placeholder="Masalan: Xalqaro moliya standartlari va bank auditi"
                  className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-[#E5DEC9] rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0F2342] mb-1">
                    Muallif(lar) *
                  </label>
                  <input
                    type="text"
                    value={authorsStr}
                    onChange={(e) => setAuthorsStr(e.target.value)}
                    placeholder="Prof. A. Omonov, Dots. B. Xoliqov"
                    className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-[#E5DEC9] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0F2342] mb-1">
                    Kafedra / Yo‘nalish *
                  </label>
                  <select
                    value={faculty}
                    onChange={(e) =>
                      setFaculty(e.target.value as Exclude<FacultyId, 'all'>)
                    }
                    className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-[#E5DEC9] rounded-lg font-semibold"
                  >
                    <option value="economics-finance">
                      {FACULTY_LABELS['economics-finance'][lang]}
                    </option>
                    <option value="pedagogy-languages">
                      {FACULTY_LABELS['pedagogy-languages'][lang]}
                    </option>
                    <option value="natural-exact-sciences">
                      {FACULTY_LABELS['natural-exact-sciences'][lang]}
                    </option>
                    <option value="humanities-social">
                      {FACULTY_LABELS['humanities-social'][lang]}
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#0F2342] mb-1">
                    UDK / Shifr *
                  </label>
                  <input
                    type="text"
                    value={udc}
                    onChange={(e) => setUdc(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs bg-[#FBF9F5] border border-[#E5DEC9] rounded-lg font-mono-tabular"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#0F2342] mb-1">
                    DOI raqami *
                  </label>
                  <input
                    type="text"
                    value={doi}
                    onChange={(e) => setDoi(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs bg-[#FBF9F5] border border-[#E5DEC9] rounded-lg font-mono-tabular"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#0F2342] mb-1">
                    Nashr yili *
                  </label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs bg-[#FBF9F5] border border-[#E5DEC9] rounded-lg font-mono-tabular"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#0F2342] mb-1">
                    Nusxalar soni *
                  </label>
                  <input
                    type="number"
                    value={totalCopies}
                    onChange={(e) => setTotalCopies(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs bg-[#FBF9F5] border border-[#E5DEC9] rounded-lg font-mono-tabular font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#0F2342] mb-1">
                    Nashr turi
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ResourceType)}
                    className="w-full px-2.5 py-2 text-xs bg-[#FBF9F5] border border-[#E5DEC9] rounded-lg"
                  >
                    <option value="book">Darslik / Monografiya</option>
                    <option value="dissertation">Dissertatsiya</option>
                    <option value="article">Ilmiy maqola</option>
                    <option value="manuscript">Nodir qo‘lyozma</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#0F2342] mb-1">
                    Nashr tili
                  </label>
                  <select
                    value={language}
                    onChange={(e) =>
                      setLanguage(
                        e.target.value as
                          | 'O‘zbek'
                          | 'English'
                          | 'Русский'
                          | 'Arab / Fors (Transkripsiya)'
                      )
                    }
                    className="w-full px-2.5 py-2 text-xs bg-[#FBF9F5] border border-[#E5DEC9] rounded-lg"
                  >
                    <option value="O‘zbek">O‘zbek</option>
                    <option value="English">English</option>
                    <option value="Русский">Русский</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#0F2342] mb-1">
                    Betlar soni
                  </label>
                  <input
                    type="number"
                    value={pages}
                    onChange={(e) => setPages(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs bg-[#FBF9F5] border border-[#E5DEC9] rounded-lg font-mono-tabular"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F2342] mb-1">
                  Annotatsiya (Qisqacha mazmuni) *
                </label>
                <textarea
                  rows={3}
                  value={abstractUz}
                  onChange={(e) => setAbstractUz(e.target.value)}
                  placeholder="Darslikning asosiy mazmuni va qaysi yo‘nalish talabalari uchun mo‘ljallangani..."
                  className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-[#E5DEC9] rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#0F2342] hover:bg-[#173461] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <PlusCircle className="w-4 h-4 text-[#C59B27]" />
                <span>Kitobni kutubxona fondiga qo‘shish</span>
              </button>
            </form>
          </div>

          {/* Right: Live Inventory & Copies Manager */}
          <div className="lg:col-span-6 bg-white border border-[#E5DEC9] rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="border-b border-[#E5DEC9] pb-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#B8860B]">
                Fond Inventarizatsiyasi
              </div>
              <h3 className="text-xl font-serif-academic font-bold text-[#0F2342]">
                Mavjud kitoblar va nusxalar soni ({resources.length})
              </h3>
            </div>

            <div className="space-y-2.5 max-h-[540px] overflow-y-auto pr-1">
              {resources.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-[#FBF9F5] border border-[#E5DEC9] rounded-xl flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-mono-tabular text-[#57534E]">
                      UDK {item.udc} · {item.year}
                    </div>
                    <div className="text-sm font-serif-academic font-bold text-[#0F2342] truncate">
                      {item.title[lang]}
                    </div>
                    <div className="text-[11px] text-[#57534E] truncate">
                      {item.authors.join(', ')}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right font-mono-tabular">
                      <div className="text-xs font-bold text-emerald-800">
                        {item.availableCopies} / {item.totalCopies}
                      </div>
                      <div className="text-[10px] text-[#57534E]">nusxa</div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onUpdateResourceCopies(item.id, -1)}
                        className="p-1.5 rounded-lg bg-white border border-[#E5DEC9] hover:border-[#0F2342] text-[#0F2342] cursor-pointer"
                        title="Nusxa sonini kamaytirish (-1)"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdateResourceCopies(item.id, 1)}
                        className="p-1.5 rounded-lg bg-[#0F2342] text-[#C59B27] hover:bg-[#173461] cursor-pointer"
                        title="Yangi nusxa qo‘shish (+1)"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
