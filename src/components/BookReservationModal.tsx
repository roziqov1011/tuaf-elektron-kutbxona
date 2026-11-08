import React, { useState } from 'react';
import {
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  GraduationCap,
  LampDesk,
  MapPin,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import {
  Language,
  LibraryResource,
  LoanDeliveryFormat,
  LoanDurationDays,
  StudentProfile,
} from '../types/library';
import { addDaysToDateString } from '../utils/libraryLogic';

export interface BookReservationPayload {
  resource: LibraryResource;
  pickupDate: string;
  dueDate: string;
  durationDays: LoanDurationDays;
  format: LoanDeliveryFormat;
  pickupLocation: string;
  note: string;
}

interface BookReservationModalProps {
  resource: LibraryResource | null;
  studentProfile: StudentProfile | null;
  lang: Language;
  onClose: () => void;
  onConfirm: (payload: BookReservationPayload) => void;
}

const DURATION_OPTIONS: {
  days: LoanDurationDays;
  badgeUz: string;
  badgeRu: string;
  badgeEn: string;
  titleUz: string;
  titleRu: string;
  titleEn: string;
  descUz: string;
  descRu: string;
  descEn: string;
  recommended?: boolean;
}[] = [
  {
    days: 3,
    badgeUz: 'Qisqa muddat',
    badgeRu: 'Краткосрочно',
    badgeEn: 'Express Loan',
    titleUz: '3 kun',
    titleRu: '3 дня',
    titleEn: '3 Days',
    descUz: 'Seminar va tezkor konspekt uchun',
    descRu: 'Для семинара и быстрого конспекта',
    descEn: 'For seminar prep & quick review',
  },
  {
    days: 7,
    badgeUz: '1 hafta',
    badgeRu: '1 неделя',
    badgeEn: '1 Week',
    titleUz: '7 kun',
    titleRu: '7 дней',
    titleEn: '7 Days',
    descUz: 'Oraliq nazorat va amaliy mashg‘ulotlar',
    descRu: 'Для промежуточного контроля',
    descEn: 'For midterm exams & coursework',
  },
  {
    days: 14,
    badgeUz: 'Tavsiya etiladi',
    badgeRu: 'Рекомендуется',
    badgeEn: 'Recommended',
    titleUz: '14 kun',
    titleRu: '14 дней',
    titleEn: '14 Days',
    descUz: 'Standart akademik mutolaa muddati (2 hafta)',
    descRu: 'Стандартный академический срок (2 недели)',
    descEn: 'Standard academic loan period (2 weeks)',
    recommended: true,
  },
  {
    days: 30,
    badgeUz: 'Maksimal muddat',
    badgeRu: 'Макс. срок',
    badgeEn: 'Extended Loan',
    titleUz: '30 kun',
    titleRu: '30 дней',
    titleEn: '30 Days',
    descUz: 'Kurs ishi, BMI va magistrlik dissertatsiyasi',
    descRu: 'Для курсовой и магистерской диссертации',
    descEn: 'For thesis, capstone & research work',
  },
];

const DELIVERY_OPTIONS: {
  format: LoanDeliveryFormat;
  titleUz: string;
  titleRu: string;
  titleEn: string;
  locationUz: string;
  locationRu: string;
  locationEn: string;
  descUz: string;
  descRu: string;
  descEn: string;
  icon: 'desk' | 'hall' | 'digital';
}[] = [
  {
    format: 'physical-pickup',
    titleUz: 'Kutubxonadan olib ketish (Uyga / Yotoqxonaga)',
    titleRu: 'Забрать из библиотеки (На руки)',
    titleEn: 'Library Desk Pickup (Take Home)',
    locationUz: '1-qavat, ARM Abonement Topshirish Punkti (104-xona)',
    locationRu: '1-й этаж, Пункт выдачи абонемента ИРЦ (каб. 104)',
    locationEn: '1st Floor, IRC Circulation Desk (Room 104)',
    descUz: 'Kitob sizning HEMIS ID raqamingizga tayyorlab qo‘yiladi, navbatsiz olasiz',
    descRu: 'Книга будет подготовлена на ваш HEMIS ID без очереди',
    descEn: 'Book is held under your HEMIS ID for fast pickup',
    icon: 'desk',
  },
  {
    format: 'reading-hall-desk',
    titleUz: 'O‘quv zalidagi stolga tayyorlab qo‘yish',
    titleRu: 'Подготовить к столу в читальном зале',
    titleEn: 'Deliver to Reading Hall Desk',
    locationUz: '2-qavat, Bosh Akademik O‘quv Zali ma’muriyati',
    locationRu: '2-й этаж, Главный академический читальный зал',
    locationEn: '2nd Floor, Main Academic Reading Hall Desk',
    descUz: 'Kutubxonaga kelganingizda o‘quv zalidagi joyingizda tayyor turadi',
    descRu: 'Книга будет ждать вас в читальном зале к вашему приходу',
    descEn: 'Ready at your reading hall desk when you arrive',
    icon: 'hall',
  },
  {
    format: 'digital-license',
    titleUz: 'Raqamli litsenziya + Bosma nusxa zaxirasi',
    titleRu: 'Цифровая лицензия + Резерв печатной копии',
    titleEn: 'Digital License + Print Copy Hold',
    locationUz: '2-qavat, ARM Elektron Fond Bo‘limi va Shaxsiy Kabinet',
    locationRu: '2-й этаж, Электронный фонд ИРЦ и Личный кабинет',
    locationEn: '2nd Floor, Digital Repository & Personal Cabinet',
    descUz: 'Kabinetda to‘liq elektron foydalanish va kutubxonada zaxira nusxa',
    descRu: 'Полный доступ в кабинете и резерв экземпляра в библиотеке',
    descEn: 'Full online cabinet access plus reserved physical copy',
    icon: 'digital',
  },
];

export const BookReservationModal: React.FC<BookReservationModalProps> = ({
  resource,
  studentProfile,
  lang,
  onClose,
  onConfirm,
}) => {
  const [pickupDate, setPickupDate] = useState<string>('2026-11-08');
  const [durationDays, setDurationDays] = useState<LoanDurationDays>(14);
  const [format, setFormat] = useState<LoanDeliveryFormat>('physical-pickup');
  const [note, setNote] = useState<string>('');

  if (!resource) return null;

  const dueDate = addDaysToDateString(pickupDate, durationDays);
  const activeDelivery =
    DELIVERY_OPTIONS.find((d) => d.format === format) || DELIVERY_OPTIONS[0];

  const pickupLocation =
    lang === 'ru'
      ? activeDelivery.locationRu
      : lang === 'en'
      ? activeDelivery.locationEn
      : activeDelivery.locationUz;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      resource,
      pickupDate,
      dueDate,
      durationDays,
      format,
      pickupLocation,
      note: note.trim(),
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-reserve-modal-title"
      className="fixed inset-0 z-50 bg-[#041E41]/75 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto"
    >
      <div className="bg-[#FBF9F5] border border-[#E5DEC9] rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl my-auto max-h-[94vh] flex flex-col">
        {/* Top Navy Header */}
        <div className="bg-[#041E41] text-white px-4 sm:px-6 py-4 flex items-center justify-between gap-3 border-b border-[#1E3A8A]/40 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#0099B5]/25 border border-[#0099B5]/50 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-[#38BDF8]" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#38BDF8]">
                {lang === 'ru'
                  ? 'Предварительное бронирование книги · TUAF ARM'
                  : lang === 'en'
                  ? 'Book Pre-Reservation & Duration · TUAF IRC'
                  : 'Kitobni oldindan band qilish · TUAF ARM'}
              </div>
              <h2
                id="book-reserve-modal-title"
                className="text-base sm:text-lg font-serif-academic font-bold text-white truncate"
              >
                {lang === 'ru'
                  ? 'Выберите срок и способ получения книги'
                  : lang === 'en'
                  ? 'Select Loan Duration & Pickup Method'
                  : 'Band qilish muddati va qabul qilish usulini tanlang'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Yopish"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form with Scrollable Content + Pinned Action Footer */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 min-h-0 overflow-hidden"
        >
          <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 min-h-0">
          {/* Selected Book Summary Card */}
          <div className="bg-white border border-[#E5DEC9] rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 shadow-xs">
            <div className="flex items-start gap-3.5 min-w-0">
              {resource.coverImage ? (
                <img
                  src={resource.coverImage}
                  alt={resource.title[lang]}
                  className="w-12 h-16 sm:w-14 sm:h-20 object-cover rounded-lg border border-[#E5DEC9] shrink-0"
                />
              ) : (
                <div
                  className="w-12 h-16 sm:w-14 sm:h-20 rounded-lg flex items-center justify-center text-white font-serif-academic font-bold text-xs shrink-0 shadow-xs"
                  style={{ backgroundColor: resource.spineColor || '#0F2342' }}
                >
                  TUAF
                </div>
              )}
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono-tabular text-[#57534E]">
                  <span className="px-2 py-0.5 rounded bg-[#F3EFE6] text-[#0F2342] font-semibold">
                    UDK {resource.udc}
                  </span>
                  <span>·</span>
                  <span>ISBN {resource.isbn}</span>
                </div>
                <h3 className="text-sm sm:text-base font-serif-academic font-bold text-[#0F2342] leading-snug line-clamp-2">
                  {resource.title[lang]}
                </h3>
                <p className="text-xs text-[#57534E] truncate">
                  {resource.authors.join(', ')} · {resource.year}
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E5DEC9] shrink-0">
              <span className="text-[11px] text-[#57534E]">
                {lang === 'ru'
                  ? 'Доступно в фонде:'
                  : lang === 'en'
                  ? 'Available copies:'
                  : 'Fondda mavjud:'}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono-tabular font-bold">
                {resource.availableCopies} / {resource.totalCopies}{' '}
                {lang === 'ru' ? 'экз.' : lang === 'en' ? 'copies' : 'nusxa'}
              </span>
            </div>
          </div>

          {/* STEP 1: Duration Selection Cards */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-[#0F2342] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#0F2342] text-white text-[11px] flex items-center justify-center font-mono-tabular">
                  1
                </span>
                <span>
                  {lang === 'ru'
                    ? 'На какой срок бронируете книгу?'
                    : lang === 'en'
                    ? 'How long would you like to reserve this book?'
                    : 'Kitobni qancha muddatga band qilasiz?'}
                </span>
              </label>
              <span className="text-[11px] font-semibold text-[#0099B5]">
                {lang === 'ru'
                  ? 'Бесплатно по HEMIS ID'
                  : lang === 'en'
                  ? 'Free via HEMIS ID'
                  : 'HEMIS ID orqali bepul'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {DURATION_OPTIONS.map((opt) => {
                const isSelected = durationDays === opt.days;
                const badge =
                  lang === 'ru'
                    ? opt.badgeRu
                    : lang === 'en'
                    ? opt.badgeEn
                    : opt.badgeUz;
                const title =
                  lang === 'ru'
                    ? opt.titleRu
                    : lang === 'en'
                    ? opt.titleEn
                    : opt.titleUz;
                const desc =
                  lang === 'ru'
                    ? opt.descRu
                    : lang === 'en'
                    ? opt.descEn
                    : opt.descUz;

                return (
                  <button
                    key={opt.days}
                    type="button"
                    onClick={() => setDurationDays(opt.days)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer relative ${
                      isSelected
                        ? 'bg-[#0F2342] text-white border-[#0F2342] ring-2 ring-[#0099B5] shadow-md'
                        : 'bg-white text-[#1C1917] border-[#E5DEC9] hover:border-[#0F2342]'
                    }`}
                  >
                    <div className="space-y-1">
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                          isSelected
                            ? 'bg-[#0099B5] text-white'
                            : opt.recommended
                            ? 'bg-[#F7F1E1] text-[#B8860B]'
                            : 'bg-[#F3EFE6] text-[#57534E]'
                        }`}
                      >
                        {badge}
                      </span>
                      <div className="text-lg font-serif-academic font-bold font-mono-tabular">
                        {title}
                      </div>
                    </div>
                    <p
                      className={`text-[11px] leading-snug ${
                        isSelected ? 'text-stone-200' : 'text-[#57534E]'
                      }`}
                    >
                      {desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Pickup Date & Live Calculated Due Date */}
          <div className="space-y-2.5">
            <label
              htmlFor="reserve-pickup-date"
              className="text-xs sm:text-sm font-bold text-[#0F2342] flex items-center gap-2"
            >
              <span className="w-5 h-5 rounded-full bg-[#0F2342] text-white text-[11px] flex items-center justify-center font-mono-tabular">
                2
              </span>
              <span>
                {lang === 'ru'
                  ? 'Когда заберете книгу и дата возврата'
                  : lang === 'en'
                  ? 'Pickup Date & Calculated Return Date'
                  : 'Olib ketish sanasi va qaytarish muddati'}
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white border border-[#E5DEC9] rounded-xl p-3.5">
              <div className="sm:col-span-6 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#0F2342] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#0099B5]" />
                    {lang === 'ru'
                      ? 'Дата получения:'
                      : lang === 'en'
                      ? 'Pickup Date:'
                      : 'Olib ketish sanasi:'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPickupDate('2026-11-08')}
                      className={`px-2 py-0.5 text-[10px] font-semibold rounded cursor-pointer ${
                        pickupDate === '2026-11-08'
                          ? 'bg-[#0F2342] text-white'
                          : 'bg-[#F3EFE6] text-[#57534E] hover:text-[#0F2342]'
                      }`}
                    >
                      {lang === 'ru' ? 'Сегодня' : lang === 'en' ? 'Today' : 'Bugun'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPickupDate('2026-11-09')}
                      className={`px-2 py-0.5 text-[10px] font-semibold rounded cursor-pointer ${
                        pickupDate === '2026-11-09'
                          ? 'bg-[#0F2342] text-white'
                          : 'bg-[#F3EFE6] text-[#57534E] hover:text-[#0F2342]'
                      }`}
                    >
                      {lang === 'ru' ? 'Завтра' : lang === 'en' ? 'Tomorrow' : 'Ertaga'}
                    </button>
                  </div>
                </div>
                <input
                  id="reserve-pickup-date"
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-[#E5DEC9] rounded-lg text-[#0F2342] font-mono-tabular font-semibold"
                />
              </div>

              <div className="sm:col-span-6 bg-[#F7F1E1]/70 border border-[#C59B27]/50 rounded-lg p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-[#57534E]">
                  <span className="flex items-center gap-1 font-semibold text-[#0F2342]">
                    <Clock className="w-3.5 h-3.5 text-[#B8860B]" />
                    {lang === 'ru'
                      ? 'Дата возврата:'
                      : lang === 'en'
                      ? 'Return Due Date:'
                      : 'Topshirish sanasi:'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#0F2342] text-[#C59B27] font-mono-tabular text-[11px] font-bold">
                    {durationDays}{' '}
                    {lang === 'ru' ? 'дней' : lang === 'en' ? 'days' : 'kun'}
                  </span>
                </div>
                <div className="mt-1.5 flex items-baseline justify-between">
                  <span className="text-base sm:text-lg font-serif-academic font-bold text-[#0F2342] font-mono-tabular">
                    {dueDate}
                  </span>
                  <span className="text-[11px] text-[#57534E]">
                    18:00 gacha
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3: Pickup Format & Location */}
          <div className="space-y-2.5">
            <label className="text-xs sm:text-sm font-bold text-[#0F2342] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#0F2342] text-white text-[11px] flex items-center justify-center font-mono-tabular">
                3
              </span>
              <span>
                {lang === 'ru'
                  ? 'Способ получения книги в библиотеке'
                  : lang === 'en'
                  ? 'How would you like to receive the book?'
                  : 'Kitobni qanday usulda qabul qilasiz?'}
              </span>
            </label>

            <div className="grid grid-cols-1 gap-2.5">
              {DELIVERY_OPTIONS.map((opt) => {
                const isSelected = format === opt.format;
                const title =
                  lang === 'ru'
                    ? opt.titleRu
                    : lang === 'en'
                    ? opt.titleEn
                    : opt.titleUz;
                const loc =
                  lang === 'ru'
                    ? opt.locationRu
                    : lang === 'en'
                    ? opt.locationEn
                    : opt.locationUz;
                const desc =
                  lang === 'ru'
                    ? opt.descRu
                    : lang === 'en'
                    ? opt.descEn
                    : opt.descUz;

                return (
                  <button
                    key={opt.format}
                    type="button"
                    onClick={() => setFormat(opt.format)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-[#0F2342]/5 border-[#0F2342] ring-1 ring-[#0F2342]'
                        : 'bg-white border-[#E5DEC9] hover:border-[#0F2342]/60'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-[#0F2342] text-[#C59B27]'
                          : 'bg-[#F3EFE6] text-[#57534E]'
                      }`}
                    >
                      {opt.icon === 'desk' && <Building2 className="w-4 h-4" />}
                      {opt.icon === 'hall' && <LampDesk className="w-4 h-4" />}
                      {opt.icon === 'digital' && <Sparkles className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs sm:text-sm font-bold text-[#0F2342]">
                          {title}
                        </span>
                        {isSelected && (
                          <span className="text-[11px] font-semibold text-[#0099B5] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {lang === 'ru'
                              ? 'Выбрано'
                              : lang === 'en'
                              ? 'Selected'
                              : 'Tanlandi'}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-semibold text-[#B8860B] flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{loc}</span>
                      </div>
                      <p className="text-[11px] text-[#57534E]">{desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Note + Student Identity Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <div className="sm:col-span-7">
              <label
                htmlFor="reserve-note"
                className="block text-[11px] font-semibold text-[#57534E] mb-1"
              >
                <FileText className="w-3 h-3 inline mr-1" />
                {lang === 'ru'
                  ? 'Комментарий для библиотекаря (необязательно):'
                  : lang === 'en'
                  ? 'Note for Librarian (optional):'
                  : 'Kutubxonachi uchun izoh (ixtiyoriy):'}
              </label>
              <input
                id="reserve-note"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={
                  lang === 'ru'
                    ? 'Напр.: Заберу после пары в 14:00'
                    : lang === 'en'
                    ? 'e.g., Will pick up at 14:00 after lecture'
                    : 'Masalan: Soat 14:00 da darsdan so‘ng olaman'
                }
                className="w-full px-3 py-2 text-xs bg-white border border-[#E5DEC9] rounded-lg text-[#1C1917]"
              />
            </div>

            {studentProfile && (
              <div className="sm:col-span-5 bg-[#041E41] text-white rounded-xl p-3 space-y-0.5">
                <div className="flex items-center gap-1.5 text-[10px] text-[#C59B27] font-semibold">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Talaba guvohnomasi (HEMIS)</span>
                </div>
                <div className="text-xs font-bold truncate">
                  {studentProfile.fullName}
                </div>
                <div className="text-[11px] text-emerald-300 font-mono-tabular flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>ID: {studentProfile.hemisId}</span>
                </div>
              </div>
            )}
          </div>

          </div>

          {/* Pinned Sticky Footer Buttons */}
          <div className="px-4 sm:px-6 py-3.5 bg-white border-t border-[#E5DEC9] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-[#57534E] bg-[#FBF9F5] border border-[#E5DEC9] rounded-xl hover:text-[#0F2342] cursor-pointer"
            >
              {lang === 'ru'
                ? 'Отмена'
                : lang === 'en'
                ? 'Cancel'
                : 'Bekor qilish'}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs sm:text-sm font-bold bg-[#0099B5] hover:bg-[#008199] text-white rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {lang === 'ru'
                  ? `Подтвердить бронь на ${durationDays} дн. (до ${dueDate})`
                  : lang === 'en'
                  ? `Confirm Reservation for ${durationDays} Days (Due ${dueDate})`
                  : `Kitobni ${durationDays} kunga band qilish (${dueDate} gacha)`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
