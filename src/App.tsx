/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import {
  BookLoanReservation,
  CatalogFilterState,
  Language,
  LibraryResource,
  PersonalNote,
  SeatReservation,
  StudentProfile,
} from './types/library';
import { UI_TRANSLATIONS } from './data/translations';
import {
  INITIAL_BOOK_LOANS,
  INITIAL_LIBRARY_RESOURCES,
  INITIAL_MEDIA_LECTURES,
  INITIAL_PERSONAL_NOTES,
  INITIAL_READING_ROOM_SEATS,
  INITIAL_SEAT_RESERVATIONS,
} from './data/seedLibraryData';
import { FAMOUS_BOOKS } from './data/famousBooks';
import { filterCatalogItems } from './utils/libraryLogic';
import { downloadResourcePdf } from './utils/pdfGenerator';
import { ActiveTab, TopBar } from './components/TopBar';
import { CatalogView } from './components/CatalogView';
import { DissertationsView } from './components/DissertationsView';
import { MediathequeView } from './components/MediathequeView';
import { ReadingHallView } from './components/ReadingHallView';
import { FamousBooksView } from './components/FamousBooksView';
import { LoginPage } from './components/LoginPage';
import { CabinetAdminView } from './components/CabinetAdminView';
import { ReaderModal } from './components/ReaderModal';
import { CitationModal } from './components/CitationModal';

const DEFAULT_FILTERS: CatalogFilterState = {
  query: '',
  faculty: 'all',
  programCode: 'all',
  type: 'all',
  language: 'all',
  openAccessOnly: false,
  peerReviewedOnly: false,
  yearFrom: 1400,
  yearTo: 2030,
  sortBy: 'relevance',
};

const COMBINED_INITIAL_RESOURCES: LibraryResource[] = [
  ...INITIAL_LIBRARY_RESOURCES,
  ...FAMOUS_BOOKS.filter(
    (fb) => !INITIAL_LIBRARY_RESOURCES.some((ir) => ir.id === fb.id)
  ),
];

export default function App() {
  const [lang, setLang] = useState<Language>('uz');
  const [activeTab, setActiveTab] = useState<ActiveTab>('catalog');

  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(
    () => {
      try {
        const saved = localStorage.getItem('tuaf_student_session_v1');
        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    }
  );
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginReasonMessage, setLoginReasonMessage] = useState<string | null>(
    null
  );
  const [pendingPdfBook, setPendingPdfBook] = useState<LibraryResource | null>(
    null
  );
  const [downloadedIds, setDownloadedIds] = useState<Set<string>>(
    () => new Set()
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [resources] = useState<LibraryResource[]>(COMBINED_INITIAL_RESOURCES);

  const [loans, setLoans] = useState<BookLoanReservation[]>(() => {
    try {
      const saved = localStorage.getItem('tuaf_loans_v2');
      return saved ? JSON.parse(saved) : INITIAL_BOOK_LOANS;
    } catch {
      return INITIAL_BOOK_LOANS;
    }
  });

  const [seatReservations, setSeatReservations] = useState<SeatReservation[]>(
    () => {
      try {
        const saved = localStorage.getItem('tuaf_seats_v2');
        return saved ? JSON.parse(saved) : INITIAL_SEAT_RESERVATIONS;
      } catch {
        return INITIAL_SEAT_RESERVATIONS;
      }
    }
  );

  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(
    () =>
      new Set([
        'tuaf-omonov-banking-monograph',
        'tuaf-dsc-linguistics-corpora',
      ])
  );

  const [notes, setNotes] = useState<PersonalNote[]>(() => {
    try {
      const saved = localStorage.getItem('tuaf_notes_v2');
      return saved ? JSON.parse(saved) : INITIAL_PERSONAL_NOTES;
    } catch {
      return INITIAL_PERSONAL_NOTES;
    }
  });

  const [filters, setFilters] = useState<CatalogFilterState>(DEFAULT_FILTERS);
  const [readerResource, setReaderResource] = useState<LibraryResource | null>(
    null
  );
  const [citationResource, setCitationResource] =
    useState<LibraryResource | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('tuaf_loans_v2', JSON.stringify(loans));
    } catch {
      // Ignore storage quota errors
    }
  }, [loans]);

  useEffect(() => {
    try {
      localStorage.setItem('tuaf_seats_v2', JSON.stringify(seatReservations));
    } catch {
      // Ignore storage quota errors
    }
  }, [seatReservations]);

  useEffect(() => {
    try {
      localStorage.setItem('tuaf_notes_v2', JSON.stringify(notes));
    } catch {
      // Ignore storage quota errors
    }
  }, [notes]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const t = UI_TRANSLATIONS[lang];

  const filteredResources = useMemo(
    () => filterCatalogItems(resources, filters, lang),
    [resources, filters, lang]
  );

  const reservedIds = useMemo(
    () => new Set(loans.map((l) => l.resourceId)),
    [loans]
  );

  const handleLoginSuccess = (
    profile: StudentProfile,
    rememberMe: boolean
  ) => {
    setStudentProfile(profile);
    setShowLoginModal(false);
    setLoginReasonMessage(null);

    if (rememberMe) {
      try {
        localStorage.setItem(
          'tuaf_student_session_v1',
          JSON.stringify(profile)
        );
      } catch {
        // Ignore storage errors
      }
    }

    if (pendingPdfBook) {
      const fileName = downloadResourcePdf(pendingPdfBook, profile, lang);
      setDownloadedIds((prev) => new Set(prev).add(pendingPdfBook.id));
      setPendingPdfBook(null);
      setToastMessage(
        `Xush kelibsiz, ${profile.fullName}! "${fileName}" PDF fayli yuklab olindi.`
      );
    } else {
      setToastMessage(
        `Xush kelibsiz, ${profile.fullName} (HEMIS: ${profile.hemisId})!`
      );
    }
  };

  const handleLogout = () => {
    setStudentProfile(null);
    try {
      localStorage.removeItem('tuaf_student_session_v1');
    } catch {
      // Ignore storage errors
    }
    setToastMessage(
      lang === 'ru'
        ? 'Вы успешно вышли из личного кабинета студента.'
        : lang === 'en'
        ? 'You have signed out of your student cabinet.'
        : 'Talaba shaxsiy kabinetidan muvaffaqiyatli chiqildi.'
    );
  };

  const handleDownloadPdf = (resource: LibraryResource) => {
    if (!studentProfile) {
      setPendingPdfBook(resource);
      setLoginReasonMessage(
        lang === 'ru'
          ? `Для скачивания книги «${resource.title.ru}» в формате PDF войдите в студенческий кабинет.`
          : lang === 'en'
          ? `Please sign in to your student account to download "${resource.title.en}" as PDF.`
          : `«${resource.title.uz}» kitobini PDF formatda yuklab olish uchun talaba sifatida tizimga kiring.`
      );
      setShowLoginModal(true);
      return;
    }

    const fileName = downloadResourcePdf(resource, studentProfile, lang);
    setDownloadedIds((prev) => new Set(prev).add(resource.id));
    setToastMessage(`PDF yuklab olindi: ${fileName}`);
  };

  const handleReserveBook = (resource: LibraryResource) => {
    if (reservedIds.has(resource.id)) return;
    const newLoan: BookLoanReservation = {
      id: `tuaf-loan-${Date.now()}`,
      resourceId: resource.id,
      resourceTitle: resource.title,
      authors: resource.authors,
      callNumber: `UDK ${resource.udc}`,
      studentName: studentProfile
        ? `${studentProfile.fullName} (${studentProfile.programName})`
        : 'Sardorbek Islomov (TUAF Talabasi)',
      studentId: studentProfile
        ? `HEMIS-${studentProfile.hemisId}`
        : 'HEMIS-TUAF-2026-8841',
      pickupDate: '2026-11-07',
      dueDate: '2026-11-21',
      format: resource.openAccess ? 'digital-license' : 'physical-pickup',
      status: 'active',
    };
    setLoans((prev) => [newLoan, ...prev]);
    setToastMessage(`"${resource.title[lang]}" kitobi siz uchun band qilindi.`);
  };

  const handleToggleBookmark = (resourceId: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(resourceId)) {
        next.delete(resourceId);
      } else {
        next.add(resourceId);
      }
      return next;
    });
  };

  const handleAddNote = (
    resourceId: string,
    chapterNumber: number,
    text: string
  ) => {
    const target = resources.find((r) => r.id === resourceId);
    if (!target) return;
    const newNote: PersonalNote = {
      id: `tuaf-note-${Date.now()}`,
      resourceId,
      resourceTitle: target.title,
      chapterNumber,
      text,
      createdAt: '2026-11-07',
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const handleBookSeat = (
    newBooking: Omit<SeatReservation, 'id' | 'createdAt'>
  ) => {
    const created: SeatReservation = {
      ...newBooking,
      id: `tuaf-rsv-${Date.now()}`,
      createdAt: '2026-11-07 10:30',
    };
    setSeatReservations((prev) => [created, ...prev]);
  };

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1917] overflow-x-hidden">
      {/* Consolidated Single Header Bar */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        studentProfile={studentProfile}
        onOpenLoginModal={() => {
          setPendingPdfBook(null);
          setLoginReasonMessage(null);
          setShowLoginModal(true);
        }}
        onLogout={handleLogout}
        activeLoansCount={loans.length}
        activeSeatsCount={
          seatReservations.filter((r) => r.status === 'confirmed').length
        }
      />

      {/* Non-blocking Status Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-5 sm:bottom-5 z-40 sm:max-w-md bg-[#041E41] text-white border border-[#C59B27] px-4 py-3 rounded-xl shadow-2xl flex items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <CheckCircle2 className="w-4 h-4 text-[#38BDF8] shrink-0" />
            <span className="break-words">{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            aria-label="Xabarni yopish"
            className="text-white/70 hover:text-white p-1 cursor-pointer shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Active Workspace Viewport */}
      <main className="flex-1">
        {activeTab === 'catalog' && (
          <CatalogView
            resources={resources}
            filteredResources={filteredResources}
            filters={filters}
            setFilters={setFilters}
            onResetFilters={() => setFilters(DEFAULT_FILTERS)}
            lang={lang}
            onOpenReader={(res) => setReaderResource(res)}
            onOpenCitation={(res) => setCitationResource(res)}
            onReserveBook={handleReserveBook}
            reservedIds={reservedIds}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
            onNavigateTab={setActiveTab}
            studentProfile={studentProfile}
            onDownloadPdf={handleDownloadPdf}
            downloadedIds={downloadedIds}
          />
        )}

        {activeTab === 'famous-books' && (
          <FamousBooksView
            lang={lang}
            studentProfile={studentProfile}
            onDownloadPdf={handleDownloadPdf}
            onOpenReader={(res) => setReaderResource(res)}
            onOpenCitation={(res) => setCitationResource(res)}
            downloadedIds={downloadedIds}
          />
        )}

        {activeTab === 'dissertations' && (
          <DissertationsView
            resources={resources}
            lang={lang}
            onOpenReader={(res) => setReaderResource(res)}
            onOpenCitation={(res) => setCitationResource(res)}
            onReserveBook={handleReserveBook}
            reservedIds={reservedIds}
          />
        )}

        {activeTab === 'mediatheque' && (
          <MediathequeView lectures={INITIAL_MEDIA_LECTURES} lang={lang} />
        )}

        {activeTab === 'reading-hall' && (
          <ReadingHallView
            seats={INITIAL_READING_ROOM_SEATS}
            reservations={seatReservations}
            onBookSeat={handleBookSeat}
            lang={lang}
          />
        )}

        {activeTab === 'cabinet' && (
          <CabinetAdminView
            lang={lang}
            studentProfile={studentProfile}
            onLoginSuccess={handleLoginSuccess}
            onLogout={handleLogout}
            resources={resources}
            loans={loans}
            onCancelLoan={(loanId) =>
              setLoans((prev) => prev.filter((l) => l.id !== loanId))
            }
            seatReservations={seatReservations}
            onCancelSeatReservation={(resId) =>
              setSeatReservations((prev) =>
                prev.filter((r) => r.id !== resId)
              )
            }
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
            notes={notes}
            onDeleteNote={(noteId) =>
              setNotes((prev) => prev.filter((n) => n.id !== noteId))
            }
            onOpenReader={(res) => setReaderResource(res)}
            onOpenCitation={(res) => setCitationResource(res)}
            onDownloadPdf={handleDownloadPdf}
            downloadedIds={downloadedIds}
          />
        )}
      </main>

      {/* Modals */}
      <ReaderModal
        resource={readerResource}
        lang={lang}
        onClose={() => setReaderResource(null)}
        onOpenCitation={(res) => setCitationResource(res)}
        notes={notes}
        onAddNote={handleAddNote}
        isBookmarked={
          readerResource ? bookmarkedIds.has(readerResource.id) : false
        }
        onToggleBookmark={handleToggleBookmark}
      />

      <CitationModal
        resource={citationResource}
        lang={lang}
        onClose={() => setCitationResource(null)}
      />

      {showLoginModal && (
        <LoginPage
          lang={lang}
          mode="modal"
          reasonMessage={loginReasonMessage}
          onLoginSuccess={handleLoginSuccess}
          onClose={() => {
            setShowLoginModal(false);
            setPendingPdfBook(null);
            setLoginReasonMessage(null);
          }}
        />
      )}

      {/* Official Turon University Andijon Filiali (tuaf.uz) Institutional Footer */}
      <footer className="border-t border-[#E5DEC9] bg-[#F3EFE6] px-4 sm:px-6 lg:px-12 py-8 sm:py-10 text-xs text-[#57534E]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 pb-8 border-b border-[#E5DEC9]">
          <div className="md:col-span-5 space-y-2">
            <div className="font-serif-academic text-lg font-bold text-[#0F2342]">
              Turon University — Andijon Filiali Axborot-Resurs Markazi
            </div>
            <p className="leading-relaxed">
              {t.utilityCollection}. Integratsiyalashgan fanlar fakulteti (Iqtisodiyot va moliya, Pedagogika va tillar, Tabiiy, aniq va gumanitar fanlar kafedralari).
            </p>
          </div>

          <div className="md:col-span-4 space-y-1.5 font-mono-tabular">
            <div className="font-semibold text-[#0F2342] font-sans">
              Rasmiy Aloqa va Manzil (tuaf.uz)
            </div>
            <div>Andijon shahar, Paxtakor MFY, A.Yuldashev ko‘chasi, 58-a-uy</div>
            <div>Tel: +998 74 200 00 25 · Dush–Shan: 09:00–18:00</div>
            <div>Email: turonuniversityandijan@gmail.com</div>
          </div>

          <div className="md:col-span-3 space-y-1.5">
            <div className="font-semibold text-[#0F2342]">
              TUAF Raqamli Ekotizimi
            </div>
            <div className="flex flex-col space-y-1 font-mono-tabular">
              <a
                href="https://tuaf.uz"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#0F2342] underline decoration-[#E5DEC9]"
              >
                Rasmiy veb-sayt: tuaf.uz
              </a>
              <a
                href="https://hemis.tuaf.uz"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#0F2342] underline decoration-[#E5DEC9]"
              >
                HEMIS portali: hemis.tuaf.uz
              </a>
              <a
                href="https://qabul.tuaf.uz"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#0F2342] underline decoration-[#E5DEC9]"
              >
                Qabul tizimi: qabul.tuaf.uz
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono-tabular text-[11px]">
          <div>
            © 2026 Turon University — Andijon Filiali. Barcha huquqlar himoyalangan.
          </div>
          <div>{t.utilityStandard}</div>
        </div>
      </footer>
    </div>
  );
}
