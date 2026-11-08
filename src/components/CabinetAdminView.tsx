import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  Bookmark,
  CalendarPlus,
  CheckCircle2,
  Clock,
  Download,
  GraduationCap,
  LampDesk,
  LogOut,
  MapPin,
  PlusCircle,
  QrCode,
  Quote,
  Search,
  ShieldCheck,
  Ticket,
  Trash2,
} from 'lucide-react';
import {
  BookLoanReservation,
  FacultyId,
  Language,
  LibraryResource,
  PersonalNote,
  QrPassTicketItem,
  ReadingRoomSeat,
  SeatReservation,
  StudentProfile,
} from '../types/library';
import { FACULTY_LABELS, UI_TRANSLATIONS } from '../data/translations';
import { calculateDaysBetween } from '../utils/libraryLogic';
import { LoginPage } from './LoginPage';
import { ReadingHallView } from './ReadingHallView';

export type CabinetSubTab =
  | 'overview'
  | 'reserve-books'
  | 'reserve-seats'
  | 'saved-notes';

interface CabinetAdminViewProps {
  lang: Language;
  studentProfile: StudentProfile | null;
  onLoginSuccess: (profile: StudentProfile, rememberMe: boolean) => void;
  onLogout: () => void;
  resources: LibraryResource[];
  loans: BookLoanReservation[];
  onOpenBookReservation: (resource: LibraryResource) => void;
  onExtendLoan: (loanId: string, extraDays: number) => void;
  onCancelLoan: (loanId: string) => void;
  seats: ReadingRoomSeat[];
  seatReservations: SeatReservation[];
  onBookSeat: (reservation: Omit<SeatReservation, 'id' | 'createdAt'>) => void;
  onCancelSeatReservation: (resId: string) => void;
  bookmarkedIds: Set<string>;
  onToggleBookmark: (resourceId: string) => void;
  notes: PersonalNote[];
  onDeleteNote: (noteId: string) => void;
  onOpenReader: (resource: LibraryResource) => void;
  onOpenCitation: (resource: LibraryResource) => void;
  onDownloadPdf: (resource: LibraryResource) => void;
  onOpenQrTicket: (item: QrPassTicketItem) => void;
  downloadedIds: Set<string>;
}

export const CabinetAdminView: React.FC<CabinetAdminViewProps> = ({
  lang,
  studentProfile,
  onLoginSuccess,
  onLogout,
  resources,
  loans,
  onOpenBookReservation,
  onExtendLoan,
  onCancelLoan,
  seats,
  seatReservations,
  onBookSeat,
  onCancelSeatReservation,
  bookmarkedIds,
  onToggleBookmark,
  notes,
  onDeleteNote,
  onOpenReader,
  onOpenCitation,
  onDownloadPdf,
  onOpenQrTicket,
  downloadedIds,
}) => {
  const [subTab, setSubTab] = useState<CabinetSubTab>('overview');
  const [bookQuery, setBookQuery] = useState('');
  const [facultyFilter, setFacultyFilter] = useState<'all' | FacultyId>('all');

  const t = UI_TRANSLATIONS[lang];

  const reservedResourceIds = useMemo(
    () => new Set(loans.map((l) => l.resourceId)),
    [loans]
  );

  const cabinetFilteredBooks = useMemo(() => {
    const q = bookQuery.trim().toLowerCase();
    return resources.filter((item) => {
      if (facultyFilter !== 'all' && item.faculty !== facultyFilter) {
        return false;
      }
      if (!q) return true;
      return (
        item.title.uz.toLowerCase().includes(q) ||
        item.title.ru.toLowerCase().includes(q) ||
        item.title.en.toLowerCase().includes(q) ||
        item.authors.some((a) => a.toLowerCase().includes(q)) ||
        item.udc.toLowerCase().includes(q) ||
        (item.isbn ? item.isbn.toLowerCase().includes(q) : false)
      );
    });
  }, [resources, bookQuery, facultyFilter]);

  // If the student is not logged in, render the full interactive Login & Registration Portal inline
  if (!studentProfile) {
    return (
      <LoginPage
        lang={lang}
        mode="inline"
        onLoginSuccess={onLoginSuccess}
        reasonMessage={
          lang === 'ru'
            ? 'Войдите в личный кабинет студента для предварительного бронирования книг с выбором срока, бронирования мест в читальном зале и скачивания PDF.'
            : lang === 'en'
            ? 'Sign in to your student cabinet to pre-reserve books with custom loan durations, book reading hall desks, and download PDFs.'
            : 'Kutubxonadagi kitoblarni muddat tanlab oldindan band qilish, o‘quv zalidan joy band qilish va PDF darsliklarni yuklab olish uchun talaba kabinetiga kiring.'
        }
      />
    );
  }

  const bookmarkedResources = resources.filter((r) => bookmarkedIds.has(r.id));
  const downloadedResources = resources.filter((r) => downloadedIds.has(r.id));
  const activeSeatBookings = seatReservations.filter(
    (r) => r.status === 'confirmed'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* Top Student Profile Banner & Quick Actions */}
      <div className="bg-[#041E41] text-white border border-[#0F2342] rounded-2xl p-5 sm:p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#0099B5] border-2 border-[#C59B27] flex items-center justify-center text-lg sm:text-xl font-bold text-white shrink-0 shadow-md">
            {studentProfile.avatarInitials}
          </div>
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#C59B27] font-semibold">
              <GraduationCap className="w-4 h-4 shrink-0" />
              <span>Turon University · Andijon Filiali Talaba Kabineti</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                HEMIS tasdiqlangan
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-serif-academic font-bold text-white break-words">
              {studentProfile.fullName}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-300 font-mono-tabular">
              <span>HEMIS ID: {studentProfile.hemisId}</span>
              <span aria-hidden="true">·</span>
              <span>
                {studentProfile.programName} (
                {studentProfile.programCode.split('-')[0]})
              </span>
              <span aria-hidden="true">·</span>
              <span>{studentProfile.courseYear}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-stretch sm:self-start lg:self-center">
          <button
            type="button"
            onClick={() => setSubTab('reserve-books')}
            className="flex-1 sm:flex-initial px-4 py-2.5 text-xs font-bold bg-[#0099B5] hover:bg-[#008199] text-white rounded-xl transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>
              {lang === 'ru'
                ? 'Забронировать книгу'
                : lang === 'en'
                ? 'Reserve a Book'
                : 'Kitob band qilish'}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('reserve-seats')}
            className="flex-1 sm:flex-initial px-4 py-2.5 text-xs font-bold bg-[#C59B27] hover:bg-[#b08920] text-[#041E41] rounded-xl transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer shadow-sm"
          >
            <LampDesk className="w-4 h-4" />
            <span>
              {lang === 'ru'
                ? 'Занять место в зале'
                : lang === 'en'
                ? 'Book a Seat'
                : 'Joy band qilish'}
            </span>
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold bg-red-600/90 hover:bg-red-700 text-white rounded-xl transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>
              {lang === 'ru'
                ? 'Выйти'
                : lang === 'en'
                ? 'Sign Out'
                : 'Kabinetdan chiqish'}
            </span>
          </button>
        </div>
      </div>

      {/* 4-Column Interactive Student Activity Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <button
          type="button"
          onClick={() => setSubTab('overview')}
          className={`text-left p-4 sm:p-5 rounded-xl border transition-all cursor-pointer ${
            subTab === 'overview'
              ? 'bg-white border-[#0F2342] ring-2 ring-[#0F2342]/15 shadow-sm'
              : 'bg-white border-[#E5DEC9] hover:border-[#0F2342]'
          }`}
        >
          <div className="text-xs text-[#57534E] flex items-center justify-between">
            <span>{t.adminManageLoansTitle}</span>
            <BookOpen className="w-4 h-4 text-[#0099B5]" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif-academic font-bold text-[#0F2342] font-mono-tabular mt-1">
            {loans.length}
          </div>
          <div className="text-[11px] text-[#0099B5] font-semibold mt-1">
            {lang === 'ru'
              ? 'Срок: от 3 до 30 дней'
              : lang === 'en'
              ? 'Duration: 3 to 30 days'
              : 'Muddat: 3 kundan 30 kungacha'}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('reserve-seats')}
          className={`text-left p-4 sm:p-5 rounded-xl border transition-all cursor-pointer ${
            subTab === 'reserve-seats'
              ? 'bg-white border-[#0F2342] ring-2 ring-[#0F2342]/15 shadow-sm'
              : 'bg-white border-[#E5DEC9] hover:border-[#0F2342]'
          }`}
        >
          <div className="text-xs text-[#57534E] flex items-center justify-between">
            <span>{t.adminManageSeatsTitle}</span>
            <LampDesk className="w-4 h-4 text-[#B8860B]" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif-academic font-bold text-[#0F2342] font-mono-tabular mt-1">
            {activeSeatBookings.length}
          </div>
          <div className="text-[11px] text-[#B8860B] font-semibold mt-1">
            {lang === 'ru'
              ? '4 читальных зала · выбор места'
              : lang === 'en'
              ? '4 reading halls · pick desk'
              : '4 ta o‘quv zali · joy tanlash'}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('reserve-books')}
          className={`text-left p-4 sm:p-5 rounded-xl border transition-all cursor-pointer ${
            subTab === 'reserve-books'
              ? 'bg-white border-[#0F2342] ring-2 ring-[#0F2342]/15 shadow-sm'
              : 'bg-white border-[#E5DEC9] hover:border-[#0F2342]'
          }`}
        >
          <div className="text-xs text-[#57534E] flex items-center justify-between">
            <span>
              {lang === 'ru'
                ? 'Доступно для брони'
                : lang === 'en'
                ? 'Available to Reserve'
                : 'Fonddagi kitoblar'}
            </span>
            <PlusCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif-academic font-bold text-[#0F2342] font-mono-tabular mt-1">
            {resources.length}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            {lang === 'ru'
              ? '+ Забронировать онлайн'
              : lang === 'en'
              ? '+ Pre-book online now'
              : '+ Oldindan band qilish'}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('saved-notes')}
          className={`text-left p-4 sm:p-5 rounded-xl border transition-all cursor-pointer ${
            subTab === 'saved-notes'
              ? 'bg-white border-[#0F2342] ring-2 ring-[#0F2342]/15 shadow-sm'
              : 'bg-white border-[#E5DEC9] hover:border-[#0F2342]'
          }`}
        >
          <div className="text-xs text-[#57534E] flex items-center justify-between">
            <span>{t.readerNotesTitle}</span>
            <Bookmark className="w-4 h-4 text-[#0F2342]" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif-academic font-bold text-[#0F2342] font-mono-tabular mt-1">
            {bookmarkedResources.length +
              notes.length +
              downloadedResources.length}
          </div>
          <div className="text-[11px] text-[#57534E] font-semibold mt-1">
            {downloadedResources.length} PDF · {bookmarkedResources.length}{' '}
            saqlangan
          </div>
        </button>
      </div>

      {/* Clear 4-Tab Cabinet Navigation Bar */}
      <div
        role="tablist"
        aria-label="Talaba kabineti bo‘limlari"
        className="bg-white border border-[#E5DEC9] rounded-xl p-1.5 flex flex-wrap gap-1.5 shadow-xs"
      >
        <button
          type="button"
          role="tab"
          aria-selected={subTab === 'overview'}
          onClick={() => setSubTab('overview')}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
            subTab === 'overview'
              ? 'bg-[#0F2342] text-white shadow-xs'
              : 'text-[#57534E] hover:text-[#0F2342] hover:bg-[#FBF9F5]'
          }`}
        >
          <Ticket className="w-4 h-4 text-[#C59B27]" />
          <span>
            {lang === 'ru'
              ? `Мои брони (${loans.length + activeSeatBookings.length})`
              : lang === 'en'
              ? `My Reservations (${loans.length + activeSeatBookings.length})`
              : `Mening bandlovlarim (${loans.length + activeSeatBookings.length})`}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={subTab === 'reserve-books'}
          onClick={() => setSubTab('reserve-books')}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
            subTab === 'reserve-books'
              ? 'bg-[#0F2342] text-white shadow-xs'
              : 'text-[#57534E] hover:text-[#0F2342] hover:bg-[#FBF9F5]'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#38BDF8]" />
          <span>
            {lang === 'ru'
              ? '+ Забронировать книгу (Выбор срока)'
              : lang === 'en'
              ? '+ Reserve a Book (Select Duration)'
              : '+ Kitobni oldindan band qilish'}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={subTab === 'reserve-seats'}
          onClick={() => setSubTab('reserve-seats')}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
            subTab === 'reserve-seats'
              ? 'bg-[#0F2342] text-white shadow-xs'
              : 'text-[#57534E] hover:text-[#0F2342] hover:bg-[#FBF9F5]'
          }`}
        >
          <LampDesk className="w-4 h-4 text-[#C59B27]" />
          <span>
            {lang === 'ru'
              ? '+ Забронировать место в зале'
              : lang === 'en'
              ? '+ Book Reading Hall Seat'
              : '+ O‘quv zalidan joy band qilish'}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={subTab === 'saved-notes'}
          onClick={() => setSubTab('saved-notes')}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
            subTab === 'saved-notes'
              ? 'bg-[#0F2342] text-white shadow-xs'
              : 'text-[#57534E] hover:text-[#0F2342] hover:bg-[#FBF9F5]'
          }`}
        >
          <Bookmark className="w-4 h-4 text-[#38BDF8]" />
          <span>
            {lang === 'ru'
              ? 'Сохраненные и заметки'
              : lang === 'en'
              ? 'Saved Books & Notes'
              : 'Saqlanganlar va Qaydlar'}
          </span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW OF ACTIVE BOOK LOANS & SEAT RESERVATIONS */}
      {subTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Left Column: Active Book Reservations with Duration & +7 Days Extension */}
          <div className="lg:col-span-7 bg-white border border-[#E5DEC9] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5DEC9] pb-3.5">
              <div>
                <h2 className="text-xl font-serif-academic font-bold text-[#0F2342]">
                  {t.adminManageLoansTitle} ({loans.length})
                </h2>
                <p className="text-xs text-[#57534E]">
                  {lang === 'ru'
                    ? 'Вы можете продлить срок возврата книги на +7 дней прямо из кабинета'
                    : lang === 'en'
                    ? 'Manage your pre-booked textbooks or extend your loan duration by +7 days'
                    : 'Oldindan band qilingan kitoblaringiz va muddatni +7 kunga uzaytirish'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSubTab('reserve-books')}
                className="px-3.5 py-2 text-xs font-bold bg-[#0099B5] text-white rounded-xl hover:bg-[#008199] flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>
                  {lang === 'ru'
                    ? 'Добавить книгу'
                    : lang === 'en'
                    ? 'Reserve Book'
                    : 'Yangi kitob band qilish'}
                </span>
              </button>
            </div>

            {loans.length === 0 ? (
              <div className="p-8 bg-[#FBF9F5] border border-dashed border-[#E5DEC9] rounded-xl text-center space-y-3">
                <BookOpen className="w-8 h-8 text-[#0099B5] mx-auto" />
                <div className="space-y-1">
                  <div className="text-sm font-bold text-[#0F2342]">
                    {lang === 'ru'
                      ? 'У вас пока нет забронированных книг'
                      : lang === 'en'
                      ? 'No active book reservations yet'
                      : 'Hozircha oldindan band qilingan kitoblar yo‘q'}
                  </div>
                  <p className="text-xs text-[#57534E] max-w-md mx-auto">
                    {lang === 'ru'
                      ? 'Выберите нужный учебник или монографию и укажите удобный срок (3, 7, 14 или 30 дней).'
                      : lang === 'en'
                      ? 'Select any textbook or monograph from the library and choose your loan duration (3, 7, 14, or 30 days).'
                      : 'Kutubxona fondidan o‘zingizga kerakli darslikni tanlab, 3, 7, 14 yoki 30 kun muddatga oldindan band qiling.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSubTab('reserve-books')}
                  className="px-4 py-2 text-xs font-bold bg-[#0F2342] text-white rounded-xl hover:bg-[#173461] cursor-pointer"
                >
                  {lang === 'ru'
                    ? 'Перейти к выбору книг'
                    : lang === 'en'
                    ? 'Browse Books to Reserve'
                    : 'Kitob tanlash va band qilish'}
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {loans.map((loan) => {
                  const matchedRes = resources.find(
                    (r) => r.id === loan.resourceId
                  );
                  const totalDays =
                    loan.durationDays ||
                    calculateDaysBetween(loan.pickupDate, loan.dueDate);

                  return (
                    <div
                      key={loan.id}
                      className="p-4 sm:p-5 bg-[#FBF9F5] border border-[#E5DEC9] rounded-xl space-y-3 transition-all hover:border-[#0F2342]/40"
                    >
                      {/* Top Status & Ticket Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tabular">
                        <div className="flex flex-wrap items-center gap-2">
                          {loan.ticketCode && (
                            <span className="px-2 py-0.5 rounded bg-[#0F2342] text-[#C59B27] font-bold">
                              #{loan.ticketCode}
                            </span>
                          )}
                          <span className="px-2.5 py-0.5 rounded bg-[#0099B5]/15 text-[#008199] font-bold">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {totalDays}{' '}
                            {lang === 'ru'
                              ? 'дней брони'
                              : lang === 'en'
                              ? 'days loan'
                              : 'kunga band qilingan'}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded font-semibold ${
                              loan.status === 'ready-for-pickup'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-[#F7F1E1] text-[#B8860B]'
                            }`}
                          >
                            {loan.status === 'ready-for-pickup'
                              ? lang === 'ru'
                                ? 'Готова к выдаче'
                                : lang === 'en'
                                ? 'Ready for Pickup'
                                : 'Olib ketishga tayyor'
                              : lang === 'ru'
                              ? 'Активная бронь'
                              : lang === 'en'
                              ? 'Active Reservation'
                              : 'Faol bandlov'}
                          </span>
                        </div>
                        <span className="text-[#57534E]">{loan.callNumber}</span>
                      </div>

                      {/* Title & Authors */}
                      <div>
                        <div className="text-base sm:text-lg font-serif-academic font-bold text-[#0F2342] leading-snug">
                          {loan.resourceTitle[lang]}
                        </div>
                        <div className="text-xs text-[#57534E] mt-0.5">
                          {loan.authors.join(', ')}
                        </div>
                      </div>

                      {/* Dates & Pickup Location Box */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 bg-white border border-[#E5DEC9] rounded-lg text-xs">
                        <div className="space-y-0.5 font-mono-tabular">
                          <div className="text-[11px] text-[#57534E]">
                            {lang === 'ru'
                              ? 'Период пользования:'
                              : lang === 'en'
                              ? 'Reservation Period:'
                              : 'Bandlik muddati (Olish → Topshirish):'}
                          </div>
                          <div className="font-bold text-[#0F2342]">
                            {loan.pickupDate} → {loan.dueDate}
                          </div>
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-[11px] text-[#57534E] flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#B8860B]" />
                            <span>
                              {lang === 'ru'
                                ? 'Место получения:'
                                : lang === 'en'
                                ? 'Pickup Location:'
                                : 'Qabul qilish joyi:'}
                            </span>
                          </div>
                          <div className="font-semibold text-[#0F2342] truncate">
                            {loan.pickupLocation ||
                              (loan.format === 'reading-hall-desk'
                                ? '2-qavat, Bosh Akademik O‘quv Zali'
                                : '1-qavat, ARM Abonement Punkti (104-xona)')}
                          </div>
                        </div>
                      </div>

                      {/* Actions Row: QR Talon, Read, PDF, Extend +7 Days, Cancel */}
                      <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              onOpenQrTicket({ kind: 'book', loan })
                            }
                            className="px-3 py-1.5 text-xs font-bold bg-[#0F2342] text-[#C59B27] border border-[#0F2342] rounded-lg hover:bg-[#173461] flex items-center gap-1.5 whitespace-nowrap cursor-pointer shadow-xs"
                          >
                            <QrCode className="w-3.5 h-3.5 text-[#C59B27]" />
                            <span>
                              {lang === 'ru'
                                ? 'QR-талон'
                                : lang === 'en'
                                ? 'QR Pass'
                                : 'QR Talon'}
                            </span>
                          </button>

                          {matchedRes && (
                            <button
                              type="button"
                              onClick={() => onOpenReader(matchedRes)}
                              className="px-3 py-1.5 text-xs font-semibold bg-white border border-[#E5DEC9] text-[#0F2342] rounded-lg hover:border-[#0F2342] flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-[#0F2342]" />
                              {t.readOnline}
                            </button>
                          )}
                          {matchedRes && (
                            <button
                              type="button"
                              onClick={() => onDownloadPdf(matchedRes)}
                              className="px-3 py-1.5 text-xs font-semibold bg-[#0099B5] text-white rounded-lg hover:bg-[#008199] flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              PDF
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => onExtendLoan(loan.id, 7)}
                            className="px-3 py-1.5 text-xs font-bold bg-[#F7F1E1] border border-[#C59B27] text-[#0F2342] hover:bg-[#efe4c6] rounded-lg flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors"
                            title="Topshirish muddatini yana 7 kunga uzaytirish"
                          >
                            <CalendarPlus className="w-3.5 h-3.5 text-[#B8860B]" />
                            <span>
                              {lang === 'ru'
                                ? '+7 дней продлить'
                                : lang === 'en'
                                ? 'Extend +7 Days'
                                : '+7 kun uzaytirish'}
                            </span>
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onCancelLoan(loan.id)}
                          className="px-3 py-1.5 text-xs text-red-800 hover:bg-red-50 rounded-lg flex items-center gap-1 whitespace-nowrap cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          {lang === 'ru'
                            ? 'Отменить'
                            : lang === 'en'
                            ? 'Cancel'
                            : 'Bekor qilish'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Active Seat Bookings */}
          <div className="lg:col-span-5 bg-white border border-[#E5DEC9] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5DEC9] pb-3.5">
              <div>
                <h2 className="text-xl font-serif-academic font-bold text-[#0F2342]">
                  {t.adminManageSeatsTitle} ({activeSeatBookings.length})
                </h2>
                <p className="text-xs text-[#57534E]">
                  {lang === 'ru'
                    ? 'Ваши закрепленные столы в читальных залах TUAF'
                    : lang === 'en'
                    ? 'Your reserved reading hall desks and time slots'
                    : 'O‘quv zallarida siz uchun band qilingan stollar'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSubTab('reserve-seats')}
                className="px-3.5 py-2 text-xs font-bold bg-[#0F2342] text-[#C59B27] rounded-xl hover:bg-[#173461] flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <LampDesk className="w-3.5 h-3.5" />
                <span>
                  {lang === 'ru'
                    ? '+ Занять место'
                    : lang === 'en'
                    ? '+ Book Seat'
                    : '+ Joy band qilish'}
                </span>
              </button>
            </div>

            {activeSeatBookings.length === 0 ? (
              <div className="p-8 bg-[#FBF9F5] border border-dashed border-[#E5DEC9] rounded-xl text-center space-y-3">
                <LampDesk className="w-8 h-8 text-[#B8860B] mx-auto" />
                <div className="space-y-1">
                  <div className="text-sm font-bold text-[#0F2342]">
                    {lang === 'ru'
                      ? 'Нет активных броней мест в читальном зале'
                      : lang === 'en'
                      ? 'No reading hall desk reservations'
                      : 'Band qilingan o‘quv zali joylari yo‘q'}
                  </div>
                  <p className="text-xs text-[#57534E]">
                    {lang === 'ru'
                      ? 'Выберите читальный зал, стол с компьютером или розеткой и время посещения.'
                      : lang === 'en'
                      ? 'Choose a reading hall, desk with monitor/power, and your preferred time slot.'
                      : '4 ta o‘quv zalidan birini, kompyuterli yoki sokin stolni hamda vaqt oralig‘ini tanlab band qiling.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSubTab('reserve-seats')}
                  className="px-4 py-2 text-xs font-bold bg-[#0F2342] text-white rounded-xl hover:bg-[#173461] cursor-pointer"
                >
                  {lang === 'ru'
                    ? 'Выбрать место в зале'
                    : lang === 'en'
                    ? 'Select Reading Hall Seat'
                    : 'O‘quv zalidan joy tanlash'}
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {activeSeatBookings.map((rsv) => (
                  <div
                    key={rsv.id}
                    className="p-4 bg-[#FBF9F5] border border-[#E5DEC9] rounded-xl space-y-2.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tabular">
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

                    {rsv.durationHours && (
                      <div className="text-xs font-semibold text-[#B8860B] flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Muddat: {rsv.durationHours}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-[#E5DEC9] flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onOpenQrTicket({ kind: 'seat', seat: rsv })
                        }
                        className="px-3 py-1.5 text-xs font-bold bg-[#0F2342] text-[#C59B27] rounded-lg hover:bg-[#173461] flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>
                          {lang === 'ru'
                            ? 'QR-талон'
                            : lang === 'en'
                            ? 'QR Pass'
                            : 'QR Talon'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onCancelSeatReservation(rsv.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-red-800 hover:bg-red-50 rounded-lg flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        {lang === 'ru'
                          ? 'Освободить'
                          : lang === 'en'
                          ? 'Release'
                          : 'Bo‘shatish'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: IN-CABINET BOOK PRE-RESERVATION WITH DURATION */}
      {subTab === 'reserve-books' && (
        <div className="bg-white border border-[#E5DEC9] rounded-2xl p-5 sm:p-6 lg:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E5DEC9] pb-5">
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-[#0099B5]">
                {lang === 'ru'
                  ? 'Предварительный заказ книг из фонда TUAF'
                  : lang === 'en'
                  ? 'Pre-Book Library Textbooks & Monographs'
                  : 'Kutubxona fondidagi kitoblarni oldindan band qilish'}
              </div>
              <h2 className="text-2xl font-serif-academic font-bold text-[#0F2342]">
                {lang === 'ru'
                  ? 'Выберите книгу и укажите срок бронирования (3, 7, 14 или 30 дней)'
                  : lang === 'en'
                  ? 'Select a Book & Choose Your Loan Duration (3, 7, 14, or 30 Days)'
                  : 'Kitobni tanlang va qancha muddatga band qilishni belgilang (3, 7, 14 yoki 30 kun)'}
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-[#57534E] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={bookQuery}
                  onChange={(e) => setBookQuery(e.target.value)}
                  placeholder={
                    lang === 'ru'
                      ? 'Поиск по названию, автору, УДК...'
                      : lang === 'en'
                      ? 'Search by title, author, UDC...'
                      : 'Kitob nomi, muallif yoki UDK...'
                  }
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#FBF9F5] border border-[#E5DEC9] rounded-xl text-[#1C1917]"
                />
              </div>

              <select
                value={facultyFilter}
                onChange={(e) =>
                  setFacultyFilter(e.target.value as 'all' | FacultyId)
                }
                aria-label="Kafedra bo‘yicha saralash"
                className="px-3 py-2 text-xs bg-[#FBF9F5] border border-[#E5DEC9] rounded-xl text-[#0F2342] font-semibold"
              >
                <option value="all">{FACULTY_LABELS.all[lang]}</option>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cabinetFilteredBooks.map((item) => {
              const isReserved = reservedResourceIds.has(item.id);
              const existingLoan = loans.find((l) => l.resourceId === item.id);

              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 bg-[#FBF9F5] border border-[#E5DEC9] rounded-xl flex flex-col justify-between gap-4 hover:border-[#0F2342]/50 transition-all"
                >
                  <div className="flex items-start gap-3.5">
                    {item.coverImage ? (
                      <img
                        src={item.coverImage}
                        alt={item.title[lang]}
                        className="w-14 h-20 object-cover rounded-lg border border-[#E5DEC9] shrink-0"
                      />
                    ) : (
                      <div
                        className="w-14 h-20 rounded-lg flex items-center justify-center text-white font-serif-academic font-bold text-xs shrink-0"
                        style={{
                          backgroundColor: item.spineColor || '#0F2342',
                        }}
                      >
                        TUAF
                      </div>
                    )}

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-1.5 text-[11px] font-mono-tabular">
                        <span className="px-2 py-0.5 rounded bg-white border border-[#E5DEC9] text-[#0F2342] font-semibold">
                          UDK {item.udc}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold">
                          Bo‘sh nusxa: {item.availableCopies} / {item.totalCopies}
                        </span>
                      </div>

                      <h3 className="text-base font-serif-academic font-bold text-[#0F2342] leading-snug line-clamp-2">
                        {item.title[lang]}
                      </h3>

                      <p className="text-xs text-[#57534E] truncate">
                        {item.authors.join(', ')} · {item.year}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E5DEC9] flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenReader(item)}
                        className="px-3 py-1.5 text-xs font-semibold bg-white border border-[#E5DEC9] text-[#0F2342] rounded-lg hover:border-[#0F2342] cursor-pointer"
                      >
                        {t.readOnline}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDownloadPdf(item)}
                        className="px-3 py-1.5 text-xs font-semibold bg-white border border-[#E5DEC9] text-[#0099B5] rounded-lg hover:border-[#0099B5] flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </button>
                    </div>

                    {isReserved ? (
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1.5 text-xs font-bold bg-[#F7F1E1] border border-[#B8860B] text-[#0F2342] rounded-lg flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#B8860B]" />
                          <span>
                            {existingLoan?.dueDate
                              ? `${existingLoan.dueDate} gacha band`
                              : t.reservedState}
                          </span>
                        </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onOpenBookReservation(item)}
                        className="px-4 py-2 text-xs font-bold bg-[#0F2342] hover:bg-[#173461] text-white rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                      >
                        <Clock className="w-3.5 h-3.5 text-[#C59B27]" />
                        <span>
                          {lang === 'ru'
                            ? 'Выбрать срок и забронировать'
                            : lang === 'en'
                            ? 'Select Duration & Reserve'
                            : 'Muddat tanlab band qilish'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: IN-CABINET READING HALL SEAT RESERVATION */}
      {subTab === 'reserve-seats' && (
        <div className="bg-white border border-[#E5DEC9] rounded-2xl overflow-hidden shadow-xs">
          <ReadingHallView
            seats={seats}
            reservations={seatReservations}
            onBookSeat={onBookSeat}
            onCancelSeatReservation={onCancelSeatReservation}
            onOpenQrTicket={onOpenQrTicket}
            studentProfile={studentProfile}
            lang={lang}
          />
        </div>
      )}

      {/* TAB 4: BOOKMARKS & PERSONAL NOTES */}
      {subTab === 'saved-notes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 bg-white border border-[#E5DEC9] rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-serif-academic font-bold text-[#0F2342] border-b border-[#E5DEC9] pb-3">
              {t.bookmarkSaved} ({bookmarkedResources.length})
            </h2>
            {bookmarkedResources.length === 0 ? (
              <p className="text-xs text-[#57534E]">
                {lang === 'ru'
                  ? 'Нет сохраненных книг.'
                  : lang === 'en'
                  ? 'No saved books.'
                  : 'Saqlangan kitoblar yo‘q.'}
              </p>
            ) : (
              <div className="space-y-3">
                {bookmarkedResources.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-[#FBF9F5] border border-[#E5DEC9] rounded-lg flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-serif-academic font-bold text-[#0F2342] truncate">
                        {item.title[lang]}
                      </div>
                      <div className="text-xs text-[#57534E]">
                        {item.authors.join(', ')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onOpenBookReservation(item)}
                        className="px-2.5 py-1.5 text-xs bg-[#0F2342] text-white rounded-lg flex items-center gap-1 cursor-pointer"
                        title="Kitobni muddat tanlab band qilish"
                      >
                        <Clock className="w-3.5 h-3.5 text-[#C59B27]" />
                        <span>Band qilish</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDownloadPdf(item)}
                        className="px-2.5 py-1.5 text-xs bg-[#0099B5] text-white rounded-lg flex items-center gap-1 cursor-pointer"
                        title="PDF yuklab olish"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenCitation(item)}
                        className="p-1.5 text-xs bg-[#F3EFE6] border border-[#E5DEC9] rounded-lg text-[#0F2342] cursor-pointer"
                        aria-label={`Cite ${item.title[lang]}`}
                      >
                        <Quote className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleBookmark(item.id)}
                        className="p-1.5 text-xs bg-[#0F2342] text-[#C59B27] rounded-lg cursor-pointer"
                        aria-label={`Remove Bookmark ${item.title[lang]}`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-6 bg-white border border-[#E5DEC9] rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-serif-academic font-bold text-[#0F2342] border-b border-[#E5DEC9] pb-3">
              {t.readerNotesTitle} ({notes.length})
            </h2>
            {notes.length === 0 ? (
              <p className="text-xs text-[#57534E]">
                {lang === 'ru'
                  ? 'Заметок пока нет.'
                  : lang === 'en'
                  ? 'No notes saved yet.'
                  : 'Hozircha qaydlar yo‘q.'}
              </p>
            ) : (
              <div className="space-y-3">
                {notes.map((n) => (
                  <div
                    key={n.id}
                    className="p-4 bg-[#FBF9F5] border border-[#E5DEC9] rounded-lg space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs text-[#57534E]">
                      <span className="font-semibold text-[#0F2342] truncate">
                        {n.resourceTitle[lang]}
                      </span>
                      <button
                        type="button"
                        onClick={() => onDeleteNote(n.id)}
                        aria-label={`Delete Note ${n.id}`}
                        className="text-red-700 hover:underline shrink-0 cursor-pointer"
                      >
                        {lang === 'ru'
                          ? 'Удалить'
                          : lang === 'en'
                          ? 'Delete'
                          : 'O‘chirish'}
                      </button>
                    </div>
                    <p className="text-xs text-[#1C1917] leading-relaxed">
                      {n.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
