import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Download,
  Lock,
  Quote,
} from 'lucide-react';
import { FAMOUS_BOOKS } from '../data/famousBooks';
import {
  FacultyId,
  Language,
  LibraryResource,
  StudentProfile,
} from '../types/library';
import { FACULTY_LABELS, UI_TRANSLATIONS } from '../data/translations';
import { Book3DCover } from './Book3DCover';

interface FamousBooksViewProps {
  lang: Language;
  studentProfile: StudentProfile | null;
  onDownloadPdf: (book: LibraryResource) => void;
  onOpenReader: (book: LibraryResource) => void;
  onOpenCitation: (book: LibraryResource) => void;
  onReserveBook: (book: LibraryResource) => void;
  reservedIds: Set<string>;
  downloadedIds: Set<string>;
}

export function FamousBooksView({
  lang,
  studentProfile,
  onDownloadPdf,
  onOpenReader,
  onOpenCitation,
  onReserveBook,
  reservedIds,
  downloadedIds,
}: FamousBooksViewProps) {
  const [selectedField, setSelectedField] = useState<
    'all' | 'economics-finance' | 'pedagogy-languages' | 'humanities-social'
  >('all');

  const t = UI_TRANSLATIONS[lang];

  const filteredBooks = FAMOUS_BOOKS.filter((book) =>
    selectedField === 'all' ? true : book.faculty === selectedField
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* Header & Field Filter Tabs */}
      <div className="border-b border-[#E5DEC9] pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="text-xs uppercase tracking-widest text-[#B8860B] font-semibold tuaf-word-reveal">
            {lang === 'ru'
              ? 'ЗОЛОТОЙ ФОНД ПО НАПРАВЛЕНИЯМ · 3D ПОЛКА'
              : lang === 'en'
              ? 'CURATED CLASSICS BY FIELD · 3D BOOKSHELF'
              : 'YO‘NALISHLAR BO‘YICHA MASHHUR ADABIYOTLAR · 3D JAVON'}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif-academic font-bold text-[#0F2342] tuaf-word-reveal tuaf-delay-1">
            <span className="tuaf-section-heading">
              {lang === 'uz'
                ? 'Sohalar bo‘yicha mashhur kitoblar (3D Javon va PDF)'
                : lang === 'ru'
                ? 'Популярные книги по направлениям (3D-полка и PDF)'
                : 'Famous Books by Academic Field (3D Shelf & PDF)'}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[#57534E] tuaf-word-reveal tuaf-delay-2">
            {studentProfile
              ? lang === 'ru'
                ? `Вы вошли как ${studentProfile.fullName} (HEMIS: ${studentProfile.hemisId}). Скачивание PDF и предварительная бронь открыты.`
                : lang === 'en'
                ? `Signed in as ${studentProfile.fullName} (HEMIS: ${studentProfile.hemisId}). Full PDF downloads and book reservations unlocked.`
                : `Siz ${studentProfile.fullName} (HEMIS: ${studentProfile.hemisId}) sifatida tizimdasiz — PDF yuklab olish va kitobni muddat tanlab band qilish ochiq.`
              : lang === 'ru'
              ? 'Нажмите на любую 3D-книгу для чтения на развороте из двух страниц или войдите для скачивания PDF.'
              : lang === 'en'
              ? 'Click any 3D hardcover book to open the two-page spread reader, or sign in for full PDF downloads.'
              : 'Istalgan 3D kitobni bosib ikki betli jonli mutolaa oynasida varaqlang yoki PDF yuklab olish uchun tizimga kiring.'}
          </p>
        </div>

        <div
          role="group"
          aria-label="Sohalar bo‘yicha saralash"
          className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F3EFE6] border border-[#E5DEC9] rounded-xl self-start max-w-full"
        >
          {(
            [
              {
                id: 'all',
                label:
                  lang === 'ru'
                    ? 'Все сферы'
                    : lang === 'en'
                    ? 'All Fields'
                    : 'Barcha sohalar',
              },
              {
                id: 'economics-finance',
                label: FACULTY_LABELS['economics-finance'][lang],
              },
              {
                id: 'pedagogy-languages',
                label: FACULTY_LABELS['pedagogy-languages'][lang],
              },
              {
                id: 'humanities-social',
                label: FACULTY_LABELS['humanities-social'][lang],
              },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedField(tab.id)}
              className={`px-3 sm:px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedField === tab.id
                  ? 'bg-[#0F2342] text-white shadow-sm'
                  : 'text-[#57534E] hover:text-[#0F2342]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Books Grid with 3D Hardcover Books on Library Shelf */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
        {filteredBooks.map((book, idx) => {
          const isDownloaded = downloadedIds.has(book.id);
          const isReserved = reservedIds.has(book.id);
          return (
            <article
              key={book.id}
              style={{ animationDelay: `${idx * 85}ms` }}
              className="tuaf-card-interactive tuaf-card-reveal border border-[#E5DEC9] bg-white rounded-xl overflow-hidden flex flex-col justify-between shadow-sm"
            >
              <div>
                {/* 3D Hardcover Book Stage on Oak Shelf */}
                <div className="pt-6 pb-4 px-5 bg-gradient-to-b from-[#041E41] via-[#0B2D5C] to-[#081C38] border-b border-[#E5DEC9] flex flex-col items-center">
                  <Book3DCover
                    resource={book}
                    lang={lang}
                    size="lg"
                    onClick={() => onOpenReader(book)}
                  />
                  <div className="w-full max-w-[220px] h-3 rounded-full tuaf-library-shelf-plank mt-1.5" />
                </div>

                {/* Book Metadata & Abstract */}
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-[#57534E]">
                    <span className="font-semibold text-[#B8860B]">
                      {
                        FACULTY_LABELS[
                          book.faculty as Exclude<FacultyId, 'all'>
                        ][lang]
                      }
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{book.year}</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {book.pages} {t.pagesUnit}
                    </span>
                  </div>

                  <h2 className="font-serif-academic font-bold text-[#0F2342] text-xl leading-snug">
                    <span className="tuaf-animated-title">
                      {book.title[lang]}
                    </span>
                  </h2>

                  <p className="text-xs font-semibold text-[#1C1917]">
                    {book.authors.join(', ')}
                  </p>

                  <p className="text-xs text-[#57534E] leading-relaxed line-clamp-2">
                    {book.abstract[lang]}
                  </p>
                </div>
              </div>

              {/* Action Buttons: PDF Download + Pre-Reserve with Duration + Online Reader */}
              <div className="px-5 pb-5 pt-3 border-t border-[#E5DEC9] space-y-2">
                <button
                  type="button"
                  onClick={() => onDownloadPdf(book)}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    studentProfile
                      ? 'bg-[#0099B5] hover:bg-[#008199] text-white shadow-sm'
                      : 'bg-[#0F2342] hover:bg-[#173461] text-white'
                  }`}
                >
                  {isDownloaded ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                      <span>
                        {lang === 'uz'
                          ? 'PDF yuklab olindi (Qayta yuklash)'
                          : lang === 'ru'
                          ? 'PDF скачан (Скачать снова)'
                          : 'PDF Downloaded (Download Again)'}
                      </span>
                    </>
                  ) : studentProfile ? (
                    <>
                      <Download className="w-4 h-4" />
                      <span>
                        {lang === 'uz'
                          ? 'PDF formatda yuklab olish'
                          : lang === 'ru'
                          ? 'Скачать книгу в PDF'
                          : 'Download Full PDF'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-[#C59B27]" />
                      <span>
                        {lang === 'uz'
                          ? 'PDF yuklab olish (Talaba kirishi)'
                          : lang === 'ru'
                          ? 'Скачать PDF (Вход для студентов)'
                          : 'Download PDF (Student Login)'}
                      </span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={isReserved}
                  onClick={() => onReserveBook(book)}
                  className={`w-full px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-colors cursor-pointer ${
                    isReserved
                      ? 'bg-[#F7F1E1] border-[#B8860B] text-[#0F2342]'
                      : 'bg-white hover:bg-[#FBF9F5] border-[#0F2342] text-[#0F2342]'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-[#B8860B]" />
                  <span>
                    {isReserved
                      ? t.reservedState
                      : lang === 'ru'
                      ? 'Забронировать книгу (выбор срока)'
                      : lang === 'en'
                      ? 'Pre-Reserve Book (Select Duration)'
                      : 'Kitobni oldindan band qilish (muddat tanlash)'}
                  </span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenReader(book)}
                    className="flex-1 py-2 px-3 bg-[#F3EFE6] hover:bg-[#E5DEC9]/80 text-[#0F2342] border border-[#E5DEC9] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#B8860B]" />
                    <span>{t.readOnline}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenCitation(book)}
                    className="py-2 px-3 bg-white hover:bg-[#F3EFE6] text-[#57534E] hover:text-[#0F2342] border border-[#E5DEC9] rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Quote className="w-3.5 h-3.5" />
                    <span>{t.citeWork}</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
