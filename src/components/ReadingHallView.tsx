import React, { useState } from 'react';
import {
  Calendar,
  Check,
  Clock,
  GraduationCap,
  LampDesk,
  Monitor,
  Plug,
  QrCode,
  Search,
  ShieldCheck,
  Ticket,
  Trash2,
  Wifi,
} from 'lucide-react';
import {
  HallId,
  Language,
  QrPassTicketItem,
  ReadingRoomSeat,
  SeatReservation,
  StudentProfile,
} from '../types/library';
import { UI_TRANSLATIONS } from '../data/translations';
import { READING_HALL_INFO as HALL_DATA } from '../data/seedLibraryData';
import {
  calculateHallOccupancy,
  generateBookingTicketCode,
} from '../utils/libraryLogic';

interface ReadingHallViewProps {
  seats: ReadingRoomSeat[];
  reservations: SeatReservation[];
  onBookSeat: (reservation: Omit<SeatReservation, 'id' | 'createdAt'>) => void;
  onCancelSeatReservation?: (resId: string) => void;
  onOpenQrTicket?: (item: QrPassTicketItem) => void;
  studentProfile?: StudentProfile | null;
  onOpenLoginModal?: (reason: string) => void;
  lang: Language;
}

const HALL_IDS: HallId[] = [
  'main-bodleian',
  'stem-silent',
  'digital-media-pod',
  'rare-manuscripts',
];

export const SEAT_TIME_SLOT_OPTIONS = [
  {
    slot: '09:00 – 12:30',
    durationUz: '3.5 soat · Ertalabki smena',
    durationRu: '3.5 часа · Утренняя смена',
    durationEn: '3.5 Hours · Morning Shift',
    badgeUz: '3.5 soat',
  },
  {
    slot: '13:00 – 16:00',
    durationUz: '3 soat · Kunduzgi smena',
    durationRu: '3 часа · Дневная смена',
    durationEn: '3 Hours · Afternoon Shift',
    badgeUz: '3 soat',
  },
  {
    slot: '16:00 – 18:00',
    durationUz: '2 soat · Kechki smena',
    durationRu: '2 часа · Вечерняя смена',
    durationEn: '2 Hours · Evening Shift',
    badgeUz: '2 soat',
  },
  {
    slot: '09:00 – 18:00',
    durationUz: '9 soat · To‘liq kun (Ilmiy tadqiqot)',
    durationRu: '9 часов · Полный день',
    durationEn: '9 Hours · Full Academic Day',
    badgeUz: 'To‘liq kun (9 soat)',
  },
];

const QUICK_PURPOSES = [
  'Mustaqil ta’lim va darsliklar mutolaasi',
  'Kurs ishi va dissertatsiya yozish',
  'Oraliq va yakuniy nazoratga tayyorgarlik',
  'HEMIS va Scopus ilmiy bazalarida ishlash',
];

export const ReadingHallView: React.FC<ReadingHallViewProps> = ({
  seats,
  reservations,
  onBookSeat,
  onCancelSeatReservation,
  onOpenQrTicket,
  studentProfile,
  onOpenLoginModal,
  lang,
}) => {
  const [selectedHall, setSelectedHall] = useState<HallId>('main-bodleian');
  const [selectedSeatId, setSelectedSeatId] = useState<string>('mb-1');
  const [date, setDate] = useState<string>('2026-11-08');
  const [timeSlot, setTimeSlot] = useState<string>(
    SEAT_TIME_SLOT_OPTIONS[0].slot
  );
  const [purpose, setPurpose] = useState<string>(QUICK_PURPOSES[0]);
  const [bookingConfirmedBanner, setBookingConfirmedBanner] = useState<
    string | null
  >(null);

  const t = UI_TRANSLATIONS[lang];
  const hallInfo = HALL_DATA[selectedHall];
  const hallSeats = seats.filter((s) => s.hallId === selectedHall);
  const occupancy = calculateHallOccupancy(seats, reservations, selectedHall);

  const confirmedReservations = reservations.filter(
    (r) => r.status === 'confirmed'
  );

  const userReservedSeatIds = new Set(
    confirmedReservations
      .filter((r) => r.hallId === selectedHall)
      .map((r) => r.seatId)
  );

  const activeSeat =
    hallSeats.find((s) => s.id === selectedSeatId) ||
    hallSeats.find(
      (s) => s.defaultStatus === 'available' && !userReservedSeatIds.has(s.id)
    ) ||
    hallSeats[0];

  const activeSeatReservation = activeSeat
    ? confirmedReservations.find((r) => r.seatId === activeSeat.id)
    : undefined;

  const selectedSlotMeta =
    SEAT_TIME_SLOT_OPTIONS.find((o) => o.slot === timeSlot) ||
    SEAT_TIME_SLOT_OPTIONS[0];

  const durationText =
    lang === 'ru'
      ? selectedSlotMeta.durationRu
      : lang === 'en'
      ? selectedSlotMeta.durationEn
      : selectedSlotMeta.durationUz;

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSeat) return;

    if (!studentProfile && onOpenLoginModal) {
      onOpenLoginModal(
        lang === 'ru'
          ? `Для бронирования места ${activeSeat.seatCode} в читальном зале войдите в кабинет студента.`
          : lang === 'en'
          ? `Please sign in to your student cabinet to reserve desk ${activeSeat.seatCode}.`
          : `O‘quv zalidagi ${activeSeat.seatCode} joyni o‘zingizga band qilish uchun talaba kabinetiga kiring.`
      );
      return;
    }

    if (
      activeSeat.defaultStatus === 'occupied' ||
      userReservedSeatIds.has(activeSeat.id)
    ) {
      return;
    }

    const ticketCode = generateBookingTicketCode('JOY', Date.now());

    onBookSeat({
      seatId: activeSeat.id,
      seatCode: activeSeat.seatCode,
      hallId: selectedHall,
      hallName: hallInfo.name,
      studentName: studentProfile
        ? `${studentProfile.fullName} (${studentProfile.programName})`
        : 'Sardorbek Islomov (TUAF Talabasi)',
      studentId: studentProfile
        ? `HEMIS-${studentProfile.hemisId}`
        : 'HEMIS-2026-8841',
      date,
      timeSlot,
      durationHours: durationText,
      ticketCode,
      purpose: purpose.trim() || 'Ilmiy mutolaa',
      status: 'confirmed',
    });

    setBookingConfirmedBanner(
      `${ticketCode} · ${activeSeat.seatCode} (${hallInfo.name[lang]}) — ${date}, ${timeSlot} (${durationText})`
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* Clean Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E5DEC9] pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0099B5]">
            <LampDesk className="w-4 h-4" />
            <span>
              {lang === 'ru'
                ? 'Интерактивная карта читальных залов TUAF'
                : lang === 'en'
                ? 'Interactive Reading Hall Seat Reservation'
                : 'TUAF O‘quv zallari joylarini oldindan band qilish tizimi'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif-academic font-bold text-[#0F2342]">
            {t.readingHallTitle}
          </h1>
          <p className="text-xs sm:text-sm text-[#57534E] max-w-2xl leading-relaxed">
            {t.readingHallSubtitle}
          </p>
        </div>

        {/* Student status badge */}
        <div className="bg-white border border-[#E5DEC9] rounded-xl px-4 py-2.5 flex items-center gap-3 self-start md:self-auto shadow-xs">
          <GraduationCap className="w-5 h-5 text-[#0F2342] shrink-0" />
          <div className="text-xs">
            {studentProfile ? (
              <>
                <div className="font-bold text-[#0F2342]">
                  {studentProfile.fullName}
                </div>
                <div className="text-[11px] text-emerald-700 font-mono-tabular flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>
                    HEMIS: {studentProfile.hemisId} · Faol bandlovlar:{' '}
                    {confirmedReservations.length} ta
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="font-bold text-[#0F2342]">
                  {lang === 'ru'
                    ? 'Гостевой режим просмотра'
                    : lang === 'en'
                    ? 'Guest Preview Mode'
                    : 'Talaba sifatida kiring'}
                </div>
                <div className="text-[11px] text-[#57534E]">
                  {lang === 'ru'
                    ? 'Авторизуйтесь для закрепления места за вашим HEMIS ID'
                    : lang === 'en'
                    ? 'Sign in to bind desk reservations to your HEMIS ID'
                    : 'Joyni HEMIS ID ga biriktirish uchun kabinetga kiring'}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* My Active Seat Reservations Bar (Easy visibility & 1-click release) */}
      {confirmedReservations.length > 0 && (
        <div className="bg-[#041E41] text-white rounded-2xl p-4 sm:p-5 space-y-3 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#C59B27]">
              <Ticket className="w-4 h-4" />
              <span>
                {lang === 'ru'
                  ? `Ваши забронированные места в читальных залах (${confirmedReservations.length})`
                  : lang === 'en'
                  ? `Your Reserved Reading Hall Desks (${confirmedReservations.length})`
                  : `Siz band qilgan o‘quv zali joylari (${confirmedReservations.length} ta)`}
              </span>
            </div>
            <span className="text-[11px] text-stone-300">
              {lang === 'ru'
                ? 'Покажите код брони на входе в читальный зал'
                : lang === 'en'
                ? 'Present your ticket code at the reading hall entrance'
                : 'O‘quv zaliga kirishda talon kodini ko‘rsating'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {confirmedReservations.map((rsv) => (
              <div
                key={rsv.id}
                className="bg-white/10 border border-white/15 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tabular">
                    <span className="px-2 py-0.5 rounded bg-[#C59B27] text-[#041E41] font-bold">
                      {rsv.seatCode}
                    </span>
                    {rsv.ticketCode && (
                      <span className="px-2 py-0.5 rounded bg-[#0099B5]/30 border border-[#38BDF8]/40 text-[#38BDF8] font-semibold">
                        #{rsv.ticketCode}
                      </span>
                    )}
                    <span className="text-stone-200">
                      {rsv.date} · {rsv.timeSlot}
                    </span>
                  </div>
                  <div className="text-sm font-serif-academic font-bold text-white truncate">
                    {rsv.hallName[lang]}
                  </div>
                  <div className="text-[11px] text-stone-300 truncate">
                    {rsv.durationHours ? `${rsv.durationHours} · ` : ''}
                    {rsv.purpose}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {onOpenQrTicket && (
                    <button
                      type="button"
                      onClick={() => onOpenQrTicket({ kind: 'seat', seat: rsv })}
                      className="px-3 py-1.5 text-xs font-bold bg-[#C59B27] hover:bg-[#b08920] text-[#041E41] rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
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
                  )}

                  {onCancelSeatReservation && (
                    <button
                      type="button"
                      onClick={() => onCancelSeatReservation(rsv.id)}
                      className="px-3 py-1.5 text-xs font-semibold bg-red-500/20 hover:bg-red-500/35 text-red-200 border border-red-400/30 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>
                        {lang === 'ru'
                          ? 'Освободить'
                          : lang === 'en'
                          ? 'Release Desk'
                          : 'Joyni bo‘shatish'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hall Selector Tabs */}
      <div
        role="tablist"
        aria-label="O‘quv zalini tanlash"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
      >
        {HALL_IDS.map((hId) => {
          const info = HALL_DATA[hId];
          const stats = calculateHallOccupancy(seats, reservations, hId);
          const isSelected = selectedHall === hId;
          return (
            <button
              key={hId}
              role="tab"
              aria-selected={isSelected}
              type="button"
              onClick={() => {
                setSelectedHall(hId);
                const firstAvailable = seats.find(
                  (s) => s.hallId === hId && s.defaultStatus === 'available'
                );
                if (firstAvailable) setSelectedSeatId(firstAvailable.id);
                setBookingConfirmedBanner(null);
              }}
              className={`text-left p-4 rounded-xl border transition-colors flex flex-col justify-between space-y-3 cursor-pointer ${
                isSelected
                  ? 'bg-[#0F2342] text-[#FBF9F5] border-[#0F2342] shadow-md'
                  : 'bg-white text-[#1C1917] border-[#E5DEC9] hover:border-[#0F2342]'
              }`}
            >
              <div className="space-y-1">
                <div
                  className={`text-xs ${
                    isSelected ? 'text-[#C59B27]' : 'text-[#57534E]'
                  }`}
                >
                  {info.floor[lang]}
                </div>
                <div className="text-base font-serif-academic font-bold leading-snug">
                  {info.name[lang]}
                </div>
              </div>
              <div
                className={`text-xs font-mono-tabular pt-2 border-t flex items-center justify-between ${
                  isSelected
                    ? 'border-[#254575] text-[#E5DEC9]'
                    : 'border-[#E5DEC9] text-[#57534E]'
                }`}
              >
                <span>
                  {stats.available} / {stats.total} {t.seatAvailable}
                </span>
                {stats.reservedByUser > 0 && (
                  <span className="px-1.5 py-0.5 rounded bg-[#C59B27] text-[#041E41] text-[10px] font-bold">
                    Sizda: {stats.reservedByUser}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {bookingConfirmedBanner && (
        <div
          role="status"
          className="p-4 bg-[#F7F1E1] border border-[#B8860B] rounded-xl flex items-center justify-between gap-4 text-xs text-[#0F2342]"
        >
          <div className="flex items-center gap-2 font-semibold">
            <Check className="w-4 h-4 text-[#B8860B] shrink-0" />
            <span>
              {lang === 'ru'
                ? 'Место успешно забронировано:'
                : lang === 'en'
                ? 'Desk reserved:'
                : 'Joy muvaffaqiyatli band qilindi:'}{' '}
              <strong className="font-mono-tabular">
                {bookingConfirmedBanner}
              </strong>
            </span>
          </div>
        </div>
      )}

      {/* Floor Plan & Form Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        <div className="lg:col-span-7 bg-white border border-[#E5DEC9] rounded-xl p-4 sm:p-6 lg:p-7 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5DEC9] pb-4">
            <div>
              <h2 className="text-xl lg:text-2xl font-serif-academic font-bold text-[#0F2342]">
                {hallInfo.name[lang]}
              </h2>
              <p className="text-xs text-[#57534E] mt-0.5">
                {hallInfo.ambiance[lang]}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
              <span className="text-[#16A34A] font-semibold">
                ● {occupancy.available} {t.seatAvailable}
              </span>
              <span className="text-[#B8860B] font-semibold">
                ● {occupancy.reservedByUser} {t.seatYours}
              </span>
              <span className="text-[#57534E]">
                ● {occupancy.occupied} {t.seatOccupied}
              </span>
            </div>
          </div>

          <div className="p-3.5 sm:p-5 bg-[#FBF9F5] border border-[#E5DEC9] rounded-xl">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {hallSeats.map((seat) => {
                const isReservedByUser = userReservedSeatIds.has(seat.id);
                const isOccupied = seat.defaultStatus === 'occupied';
                const isSelected = activeSeat?.id === seat.id;

                let stateLabel = t.seatAvailable;
                let cardClasses =
                  'bg-white border-[#E5DEC9] text-[#0F2342] hover:border-[#0F2342] cursor-pointer';

                if (isReservedByUser) {
                  stateLabel = t.seatYours;
                  cardClasses = isSelected
                    ? 'bg-[#F7F1E1] border-[#B8860B] text-[#0F2342] font-semibold ring-2 ring-[#0F2342] cursor-pointer'
                    : 'bg-[#F7F1E1] border-[#B8860B] text-[#0F2342] font-semibold cursor-pointer';
                } else if (isOccupied) {
                  stateLabel = t.seatOccupied;
                  cardClasses =
                    'bg-[#F3EFE6] border-[#E5DEC9] text-[#57534E]/60 cursor-not-allowed';
                } else if (isSelected) {
                  stateLabel = t.seatSelected;
                  cardClasses =
                    'bg-[#0F2342] border-[#0F2342] text-[#FBF9F5] ring-2 ring-[#B8860B] cursor-pointer';
                }

                return (
                  <button
                    key={seat.id}
                    type="button"
                    disabled={isOccupied}
                    onClick={() => setSelectedSeatId(seat.id)}
                    aria-label={`${seat.seatCode} - ${stateLabel}`}
                    className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2.5 ${cardClasses}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold font-mono-tabular whitespace-nowrap shrink-0">
                        {seat.seatCode}
                      </span>
                      <span className="text-[10px] opacity-85 whitespace-nowrap truncate">
                        {stateLabel}
                      </span>
                    </div>

                    <div className="text-[11px] opacity-80 truncate">
                      {seat.zoneLabel}
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-current/10">
                      {seat.features.includes('lamp') && (
                        <LampDesk className="w-3.5 h-3.5" />
                      )}
                      {seat.features.includes('power') && (
                        <Plug className="w-3.5 h-3.5" />
                      )}
                      {seat.features.includes('monitor') && (
                        <Monitor className="w-3.5 h-3.5" />
                      )}
                      {seat.features.includes('lan') && (
                        <Wifi className="w-3.5 h-3.5" />
                      )}
                      {seat.features.includes('magnifier') && (
                        <Search className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Step-by-step Seat & Duration Booking Form */}
        <div className="lg:col-span-5 bg-white border border-[#E5DEC9] rounded-xl p-5 sm:p-6 space-y-5 shadow-xs">
          <div className="border-b border-[#E5DEC9] pb-3 flex items-center justify-between gap-2">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#0099B5]">
                {lang === 'ru'
                  ? 'Оформление места'
                  : lang === 'en'
                  ? 'Desk Configuration'
                  : 'Tanlangan o‘quv joyi'}
              </div>
              <h3 className="text-xl font-serif-academic font-bold text-[#0F2342]">
                {activeSeat
                  ? `${
                      lang === 'ru'
                        ? 'Стол / Место'
                        : lang === 'en'
                        ? 'Desk'
                        : 'Joy raqami'
                    }: ${activeSeat.seatCode}`
                  : ''}
              </h3>
              {activeSeat && (
                <p className="text-xs text-[#57534E] mt-0.5">
                  {activeSeat.zoneLabel} · {hallInfo.floor[lang]}
                </p>
              )}
            </div>

            {activeSeat && (
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono-tabular ${
                  activeSeatReservation
                    ? 'bg-[#F7F1E1] text-[#B8860B] border border-[#B8860B]'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}
              >
                {activeSeatReservation ? t.seatYours : t.seatAvailable}
              </span>
            )}
          </div>

          {activeSeatReservation ? (
            <div className="bg-[#FBF9F5] border border-[#B8860B] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#0F2342]">
                  {lang === 'ru'
                    ? 'Это место забронировано вами'
                    : lang === 'en'
                    ? 'Reserved under your account'
                    : 'Ushbu joy sizning nomingizga band qilingan'}
                </span>
                {activeSeatReservation.ticketCode && (
                  <span className="px-2 py-0.5 rounded bg-[#0F2342] text-[#C59B27] font-mono-tabular font-bold">
                    #{activeSeatReservation.ticketCode}
                  </span>
                )}
              </div>
              <div className="text-xs text-[#57534E] space-y-1 font-mono-tabular">
                <div>
                  Sana va vaqt: <strong>{activeSeatReservation.date}</strong> ·{' '}
                  <strong>{activeSeatReservation.timeSlot}</strong>
                </div>
                {activeSeatReservation.durationHours && (
                  <div>
                    Muddat: <strong>{activeSeatReservation.durationHours}</strong>
                  </div>
                )}
                <div>Maqsad: {activeSeatReservation.purpose}</div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                {onOpenQrTicket && (
                  <button
                    type="button"
                    onClick={() =>
                      onOpenQrTicket({ kind: 'seat', seat: activeSeatReservation })
                    }
                    className="flex-1 py-2.5 px-4 text-xs font-bold bg-[#0F2342] hover:bg-[#173461] text-white rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <QrCode className="w-4 h-4 text-[#C59B27]" />
                    <span>
                      {lang === 'ru'
                        ? 'Открыть QR-талон'
                        : lang === 'en'
                        ? 'Open QR Pass'
                        : 'QR Talonni ochish'}
                    </span>
                  </button>
                )}
                {onCancelSeatReservation && (
                  <button
                    type="button"
                    onClick={() =>
                      onCancelSeatReservation(activeSeatReservation.id)
                    }
                    className="flex-1 py-2.5 px-4 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>
                      {lang === 'ru'
                        ? 'Освободить место'
                        : lang === 'en'
                        ? 'Release Desk'
                        : 'Joyni bo‘shatish'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            activeSeat && (
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                {/* Step 1: Date with Today/Tomorrow quick buttons */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="booking-date"
                      className="text-xs font-bold text-[#0F2342] flex items-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#0099B5]" />
                      <span>1. {t.selectDateLabel}</span>
                    </label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setDate('2026-11-08')}
                        className={`px-2 py-0.5 text-[10px] font-semibold rounded cursor-pointer ${
                          date === '2026-11-08'
                            ? 'bg-[#0F2342] text-white'
                            : 'bg-[#F3EFE6] text-[#57534E]'
                        }`}
                      >
                        Bugun
                      </button>
                      <button
                        type="button"
                        onClick={() => setDate('2026-11-09')}
                        className={`px-2 py-0.5 text-[10px] font-semibold rounded cursor-pointer ${
                          date === '2026-11-09'
                            ? 'bg-[#0F2342] text-white'
                            : 'bg-[#F3EFE6] text-[#57534E]'
                        }`}
                      >
                        Ertaga
                      </button>
                    </div>
                  </div>
                  <input
                    id="booking-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-[#E5DEC9] rounded-lg text-[#1C1917] font-mono-tabular font-semibold"
                  />
                </div>

                {/* Step 2: Time Slot & Duration Cards */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#0F2342]">
                    <Clock className="w-3.5 h-3.5 inline mr-1.5 text-[#0099B5]" />
                    2.{' '}
                    {lang === 'ru'
                      ? 'Выберите время и длительность пребывания'
                      : lang === 'en'
                      ? 'Select Time Slot & Duration'
                      : 'Vaqt oralig‘i va qancha soat o‘tirishni tanlang'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SEAT_TIME_SLOT_OPTIONS.map((opt) => {
                      const isSel = timeSlot === opt.slot;
                      const dur =
                        lang === 'ru'
                          ? opt.durationRu
                          : lang === 'en'
                          ? opt.durationEn
                          : opt.durationUz;
                      return (
                        <button
                          key={opt.slot}
                          type="button"
                          onClick={() => setTimeSlot(opt.slot)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isSel
                              ? 'bg-[#0F2342] text-white border-[#0F2342] ring-2 ring-[#0099B5]'
                              : 'bg-[#FBF9F5] text-[#1C1917] border-[#E5DEC9] hover:border-[#0F2342]'
                          }`}
                        >
                          <div className="text-xs font-bold font-mono-tabular">
                            {opt.slot}
                          </div>
                          <div
                            className={`text-[11px] mt-0.5 ${
                              isSel ? 'text-[#38BDF8]' : 'text-[#57534E]'
                            }`}
                          >
                            {dur}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 3: Purpose with Quick Chips */}
                <div className="space-y-2">
                  <label
                    htmlFor="booking-purpose"
                    className="block text-xs font-bold text-[#0F2342]"
                  >
                    3. {t.selectPurposeLabel}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_PURPOSES.map((qp) => (
                      <button
                        key={qp}
                        type="button"
                        onClick={() => setPurpose(qp)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors cursor-pointer ${
                          purpose === qp
                            ? 'bg-[#0099B5] text-white font-semibold'
                            : 'bg-[#F3EFE6] text-[#57534E] hover:text-[#0F2342]'
                        }`}
                      >
                        {qp}
                      </button>
                    ))}
                  </div>
                  <input
                    id="booking-purpose"
                    type="text"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-[#E5DEC9] rounded-lg text-[#1C1917]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={activeSeat.defaultStatus === 'occupied'}
                  className="w-full py-3 px-4 text-xs sm:text-sm font-bold bg-[#0F2342] text-[#FBF9F5] rounded-xl hover:bg-[#173461] disabled:opacity-40 transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Check className="w-4 h-4 text-[#C59B27]" />
                  <span>
                    {lang === 'ru'
                      ? `Забронировать место ${activeSeat.seatCode} (${selectedSlotMeta.badgeUz})`
                      : lang === 'en'
                      ? `Reserve Desk ${activeSeat.seatCode} (${selectedSlotMeta.badgeUz})`
                      : `${activeSeat.seatCode} joyni band qilish (${selectedSlotMeta.badgeUz})`}
                  </span>
                </button>
              </form>
            )
          )}
        </div>
      </div>
    </div>
  );
};
