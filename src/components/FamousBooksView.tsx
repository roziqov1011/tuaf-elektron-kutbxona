import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
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

interface FamousBooksViewProps {
  lang: Language;
  studentProfile: StudentProfile | null;
  onDownloadPdf: (book: LibraryResource) => void;
  onOpenReader: (book: LibraryResource) => void;
  onOpenCitation: (book: LibraryResource) => void;
  downloadedIds: Set<string>;
}

export function FamousBooksView({
  lang,
  studentProfile,
  onDownloadPdf,
  onOpenReader,
  onOpenCitation,
  downloadedIds,
}: FamousBooksViewProps) {
  const [selectedField, setSelectedField] = useState<
    'all' | 'economics-finance' | 'pedagogy-languages' | 'humanities-social'
  >('all');
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const t = UI_TRANSLATIONS[lang];

  const filteredBooks = FAMOUS_BOOKS.filter((book) =>
    selectedField === 'all' ? true : book.faculty === selectedField
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* Header & Field Filter Tabs */}
      <div className="border-b border-[#E5DEC9] pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="text-xs uppercase tracking-widest text-[#B8860B] font-semibold">
            {lang === 'ru'
              ? 'ЗОЛОТОЙ ФОНД ПО НАПРАВЛЕНИЯМ'
              : lang === 'en'
              ? 'CURATED CLASSICS BY FIELD'
              : 'YO‘NALISHLAR BO‘YICHA MASHHUR ADABIYOTLAR'}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif-academic font-bold text-[#0F2342]">
            {lang === 'uz'
              ? 'Sohalar bo‘yicha mashhur kitoblar (PDF)'
              : lang === 'ru'
              ? 'Популярные книги по направлениям (PDF)'
              : 'Famous Books by Academic Field (PDF)'}
          </h1>
          <p className="text-xs sm:text-sm text-[#57534E]">
            {studentProfile
              ? lang === 'ru'
                ? `Вы вошли как ${studentProfile.fullName} (HEMIS: ${studentProfile.hemisId}). Скачивание PDF открыто.`
                : lang === 'en'
                ? `Signed in as ${studentProfile.fullName} (HEMIS: ${studentProfile.hemisId}). Full PDF downloads unlocked.`
                : `Siz ${studentProfile.fullName} (HEMIS: ${studentProfile.hemisId}) sifatida tizimdasiz — barcha PDF kitoblarni bepul yuklab olishingiz mumkin.`
              : lang === 'ru'
              ? 'Полное скачивание PDF-книг доступно только зарегистрированным студентам университета.'
              : lang === 'en'
              ? 'Full PDF downloads are available exclusively to registered university students.'
              : 'PDF kitoblarni yuklab olish faqat ro‘yxatdan o‘tgan talabalar uchun ochiq.'}
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

      {/* Books Grid with Cover Images & PDF Download */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
        {filteredBooks.map((book) => {
          const isDownloaded = downloadedIds.has(book.id);
          return (
            <article
              key={book.id}
              className="border border-[#E5DEC9] bg-white rounded-xl overflow-hidden flex flex-col justify-between shadow-sm hover:border-[#B8860B] transition-colors"
            >
              <div>
                {/* High-Res Book Cover Image */}
                <div className="relative aspect-[4/3] bg-[#0F2342] overflow-hidden border-b border-[#E5DEC9]">
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
                    <div className="w-full h-full p-6 flex flex-col justify-between text-white">
                      <span className="text-xs font-mono-tabular text-[#C59B27]">
                        {book.programCode} · {book.year}
                      </span>
                      <span className="font-serif-academic text-lg font-bold">
                        {book.title[lang]}
                      </span>
                    </div>
                  )}
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
                    {book.title[lang]}
                  </h2>

                  <p className="text-xs font-semibold text-[#1C1917]">
                    {book.authors.join(', ')}
                  </p>

                  <p className="text-xs text-[#57534E] leading-relaxed line-clamp-2">
                    {book.abstract[lang]}
                  </p>
                </div>
              </div>

              {/* Action Buttons: PDF Download (Student Auth Gated) + Online Reader */}
              <div className="px-5 pb-5 pt-3 border-t border-[#E5DEC9] space-y-2.5">
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
