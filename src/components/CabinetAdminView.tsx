import React from 'react';
import {
  BookOpen,
  Bookmark,
  Download,
  GraduationCap,
  LogOut,
  Quote,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import {
  BookLoanReservation,
  Language,
  LibraryResource,
  PersonalNote,
  SeatReservation,
  StudentProfile,
} from '../types/library';
import { UI_TRANSLATIONS } from '../data/translations';
import { LoginPage } from './LoginPage';

interface CabinetAdminViewProps {
  lang: Language;
  studentProfile: StudentProfile | null;
  onLoginSuccess: (profile: StudentProfile, rememberMe: boolean) => void;
  onLogout: () => void;
  resources: LibraryResource[];
  loans: BookLoanReservation[];
  onCancelLoan: (loanId: string) => void;
  seatReservations: SeatReservation[];
  onCancelSeatReservation: (resId: string) => void;
  bookmarkedIds: Set<string>;
  onToggleBookmark: (resourceId: string) => void;
  notes: PersonalNote[];
  onDeleteNote: (noteId: string) => void;
  onOpenReader: (resource: LibraryResource) => void;
  onOpenCitation: (resource: LibraryResource) => void;
  onDownloadPdf: (resource: LibraryResource) => void;
  downloadedIds: Set<string>;
}

export const CabinetAdminView: React.FC<CabinetAdminViewProps> = ({
  lang,
  studentProfile,
  onLoginSuccess,
  onLogout,
  resources,
  loans,
  onCancelLoan,
  seatReservations,
  onCancelSeatReservation,
  bookmarkedIds,
  onToggleBookmark,
  notes,
  onDeleteNote,
  onOpenReader,
  onOpenCitation,
  onDownloadPdf,
  downloadedIds,
}) => {
  const t = UI_TRANSLATIONS[lang];

  // If the student is not logged in, render the full interactive Login & Registration Portal inline
  if (!studentProfile) {
    return (
      <LoginPage
        lang={lang}
        mode="inline"
        onLoginSuccess={onLoginSuccess}
        reasonMessage={
          lang === 'ru'
            ? 'Войдите в личный кабинет студента для управления бронями, заметками и скачивания PDF-учебников.'
            : lang === 'en'
            ? 'Sign in to your student cabinet to manage book loans, reading hall seats, and PDF textbook downloads.'
            : 'Band qilingan kitoblar, o‘quv zali joylari va PDF darsliklarni boshqarish uchun talaba kabinetiga kiring.'
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
      {/* Top Student Profile Banner & Logout Action */}
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
                {studentProfile.programName} ({studentProfile.programCode.split('-')[0]})
              </span>
              <span aria-hidden="true">·</span>
              <span>{studentProfile.courseYear}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-stretch sm:self-start lg:self-center">
          <button
            type="button"
            onClick={onLogout}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold bg-red-600/90 hover:bg-red-700 text-white rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>
              {lang === 'ru'
                ? 'Выйти из кабинета'
                : lang === 'en'
                ? 'Sign Out of Cabinet'
                : 'Kabinetdan chiqish'}
            </span>
          </button>
        </div>
      </div>

      {/* 4-Column Student Activity Metrics */}
      <div className="bg-white border border-[#E5DEC9] rounded-xl p-4 sm:p-6 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div>
          <div className="text-xs text-[#57534E]">{t.adminManageLoansTitle}</div>
          <div className="text-2xl font-serif-academic font-bold text-[#0F2342] font-mono-tabular mt-1">
            {loans.length}
          </div>
        </div>
        <div>
          <div className="text-xs text-[#57534E]">{t.adminManageSeatsTitle}</div>
          <div className="text-2xl font-serif-academic font-bold text-[#0F2342] font-mono-tabular mt-1">
            {activeSeatBookings.length}
          </div>
        </div>
        <div>
          <div className="text-xs text-[#57534E]">
            {lang === 'ru'
              ? 'Скачанные PDF книги'
              : lang === 'en'
              ? 'Downloaded PDFs'
              : 'Yuklab olingan PDF kitoblar'}
          </div>
          <div className="text-2xl font-serif-academic font-bold text-[#0F2342] font-mono-tabular mt-1">
            {downloadedResources.length}
          </div>
        </div>
        <div>
          <div className="text-xs text-[#57534E]">{t.readerNotesTitle}</div>
          <div className="text-2xl font-serif-academic font-bold text-[#0F2342] font-mono-tabular mt-1">
            {bookmarkedResources.length + notes.length}
          </div>
        </div>
      </div>

      {/* 2-Column Split: Active Loans & Seat Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        <div className="lg:col-span-6 bg-white border border-[#E5DEC9] rounded-xl p-5 sm:p-6 space-y-4">
          <h2 className="text-xl font-serif-academic font-bold text-[#0F2342] border-b border-[#E5DEC9] pb-3">
            {t.adminManageLoansTitle} ({loans.length})
          </h2>

          {loans.length === 0 ? (
            <p className="text-xs text-[#57534E] py-4">
              {lang === 'ru'
                ? 'Нет забронированных книг.'
                : lang === 'en'
                ? 'No active book reservations.'
                : 'Hozircha band qilingan kitoblar yo‘q.'}
            </p>
          ) : (
            <div className="space-y-3">
              {loans.map((loan) => {
                const matchedRes = resources.find(
                  (r) => r.id === loan.resourceId
                );
                return (
                  <div
                    key={loan.id}
                    className="p-4 bg-[#FBF9F5] border border-[#E5DEC9] rounded-lg space-y-2"
                  >
                    <div className="text-base font-serif-academic font-bold text-[#0F2342]">
                      {loan.resourceTitle[lang]}
                    </div>
                    <div className="text-xs text-[#57534E]">
                      {loan.authors.join(', ')} · {loan.dueDate}
                    </div>
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {matchedRes && (
                          <button
                            type="button"
                            onClick={() => onOpenReader(matchedRes)}
                            className="px-3 py-1.5 text-xs font-semibold bg-[#0F2342] text-[#FBF9F5] rounded-lg hover:bg-[#173461] flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-[#C59B27]" />
                            {t.readOnline}
                          </button>
                        )}
                        {matchedRes && (
                          <button
                            type="button"
                            onClick={() => onDownloadPdf(matchedRes)}
                            className="px-3 py-1.5 text-xs font-semibold bg-[#0099B5] text-white rounded-lg hover:bg-[#008199] flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            PDF
                          </button>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => onCancelLoan(loan.id)}
                        className="px-3 py-1.5 text-xs text-red-800 hover:bg-red-50 rounded-lg flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
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

        <div className="lg:col-span-6 bg-white border border-[#E5DEC9] rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-serif-academic font-bold text-[#0F2342] border-b border-[#E5DEC9] pb-3">
            {t.adminManageSeatsTitle} ({activeSeatBookings.length})
          </h2>

          {activeSeatBookings.length === 0 ? (
            <p className="text-xs text-[#57534E] py-4">
              {lang === 'ru'
                ? 'Нет активных броней мест.'
                : lang === 'en'
                ? 'No active desk reservations.'
                : 'Band qilingan joylar mavjud emas.'}
            </p>
          ) : (
            <div className="space-y-3">
              {activeSeatBookings.map((rsv) => (
                <div
                  key={rsv.id}
                  className="p-4 bg-[#FBF9F5] border border-[#E5DEC9] rounded-lg space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-mono-tabular">
                    <span className="font-bold text-[#B8860B]">
                      {rsv.seatCode}
                    </span>
                    <span className="text-[#57534E]">
                      {rsv.date} · {rsv.timeSlot}
                    </span>
                  </div>
                  <div className="text-base font-serif-academic font-bold text-[#0F2342]">
                    {rsv.hallName[lang]}
                  </div>
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-xs text-[#57534E]">{rsv.purpose}</span>
                    <button
                      type="button"
                      onClick={() => onCancelSeatReservation(rsv.id)}
                      className="px-3 py-1 text-xs text-red-800 hover:bg-red-50 rounded-lg flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
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

      {/* Bookmarks & Notes */}
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
    </div>
  );
};
