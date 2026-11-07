import React, { useState } from 'react';
import {
  Calendar,
  Check,
  Clock,
  LampDesk,
  Monitor,
  Plug,
  Search,
  Wifi,
} from 'lucide-react';
import {
  HallId,
  Language,
  ReadingRoomSeat,
  SeatReservation,
} from '../types/library';
import { UI_TRANSLATIONS } from '../data/translations';
import { READING_HALL_INFO as HALL_DATA } from '../data/seedLibraryData';
import { calculateHallOccupancy } from '../utils/libraryLogic';

interface ReadingHallViewProps {
  seats: ReadingRoomSeat[];
  reservations: SeatReservation[];
  onBookSeat: (reservation: Omit<SeatReservation, 'id' | 'createdAt'>) => void;
  lang: Language;
}

const HALL_IDS: HallId[] = [
  'main-bodleian',
  'stem-silent',
  'digital-media-pod',
  'rare-manuscripts',
];

const TIME_SLOTS = [
  '09:00 – 12:30',
  '13:00 – 16:00',
  '16:00 – 18:00',
  '09:00 – 18:00',
];

export const ReadingHallView: React.FC<ReadingHallViewProps> = ({
  seats,
  reservations,
  onBookSeat,
  lang,
}) => {
  const [selectedHall, setSelectedHall] = useState<HallId>('main-bodleian');
  const [selectedSeatId, setSelectedSeatId] = useState<string>('mb-1');
  const [date, setDate] = useState<string>('2026-11-07');
  const [timeSlot, setTimeSlot] = useState<string>(TIME_SLOTS[0]);
  const [purpose, setPurpose] = useState<string>(
    'Darsliklar va ilmiy adabiyotlar bilan ishlash'
  );
  const [bookingConfirmedBanner, setBookingConfirmedBanner] = useState<
    string | null
  >(null);

  const t = UI_TRANSLATIONS[lang];
  const hallInfo = HALL_DATA[selectedHall];
  const hallSeats = seats.filter((s) => s.hallId === selectedHall);
  const occupancy = calculateHallOccupancy(seats, reservations, selectedHall);

  const userReservedSeatIds = new Set(
    reservations
      .filter((r) => r.hallId === selectedHall && r.status === 'confirmed')
      .map((r) => r.seatId)
  );

  const activeSeat =
    hallSeats.find((s) => s.id === selectedSeatId) ||
    hallSeats.find(
      (s) => s.defaultStatus === 'available' && !userReservedSeatIds.has(s.id)
    ) ||
    hallSeats[0];

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSeat) return;
    if (
      activeSeat.defaultStatus === 'occupied' ||
      userReservedSeatIds.has(activeSeat.id)
    ) {
      return;
    }

    onBookSeat({
      seatId: activeSeat.id,
      seatCode: activeSeat.seatCode,
      hallId: selectedHall,
      hallName: hallInfo.name,
      studentName: 'Sardorbek Islomov',
      studentId: 'HEMIS-2026-8841',
      date,
      timeSlot,
      purpose: purpose.trim() || 'Ilmiy mutolaa',
      status: 'confirmed',
    });

    setBookingConfirmedBanner(
      `${activeSeat.seatCode} (${hallInfo.name[lang]}) — ${date} (${timeSlot})`
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* Clean Header */}
      <div className="border-b border-[#E5DEC9] pb-6 space-y-1.5">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif-academic font-bold text-[#0F2342]">
          {t.readingHallTitle}
        </h1>
        <p className="text-xs sm:text-sm text-[#57534E] max-w-2xl leading-relaxed">
          {t.readingHallSubtitle}
        </p>
      </div>

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
                  ? 'bg-[#0F2342] text-[#FBF9F5] border-[#0F2342]'
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
                className={`text-xs font-mono-tabular pt-2 border-t ${
                  isSelected
                    ? 'border-[#254575] text-[#E5DEC9]'
                    : 'border-[#E5DEC9] text-[#57534E]'
                }`}
              >
                {stats.available} / {stats.total} {t.seatAvailable}
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
        <div className="lg:col-span-8 bg-white border border-[#E5DEC9] rounded-xl p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6">
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

          <div className="p-3.5 sm:p-6 bg-[#FBF9F5] border border-[#E5DEC9] rounded-xl">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {hallSeats.map((seat) => {
                const isReservedByUser = userReservedSeatIds.has(seat.id);
                const isOccupied = seat.defaultStatus === 'occupied';
                const isSelected = activeSeat?.id === seat.id;

                let stateLabel = t.seatAvailable;
                let cardClasses =
                  'bg-white border-[#E5DEC9] text-[#0F2342] hover:border-[#0F2342]';

                if (isReservedByUser) {
                  stateLabel = t.seatYours;
                  cardClasses =
                    'bg-[#F7F1E1] border-[#B8860B] text-[#0F2342] font-semibold';
                } else if (isOccupied) {
                  stateLabel = t.seatOccupied;
                  cardClasses =
                    'bg-[#F3EFE6] border-[#E5DEC9] text-[#57534E]/60 cursor-not-allowed';
                } else if (isSelected) {
                  stateLabel = t.seatSelected;
                  cardClasses =
                    'bg-[#0F2342] border-[#0F2342] text-[#FBF9F5] ring-2 ring-[#B8860B]';
                }

                return (
                  <button
                    key={seat.id}
                    type="button"
                    disabled={isOccupied}
                    onClick={() => setSelectedSeatId(seat.id)}
                    aria-label={`${seat.seatCode} - ${stateLabel}`}
                    className={`p-4 rounded-lg border text-left transition-all flex flex-col justify-between space-y-3 ${cardClasses}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold font-mono-tabular whitespace-nowrap shrink-0">
                        {seat.seatCode}
                      </span>
                      <span className="text-[11px] opacity-85 whitespace-nowrap truncate">
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

        {/* Right: Clean Booking Form */}
        <div className="lg:col-span-4 bg-white border border-[#E5DEC9] rounded-xl p-6 space-y-5">
          <div className="border-b border-[#E5DEC9] pb-3">
            <h3 className="text-xl font-serif-academic font-bold text-[#0F2342]">
              {activeSeat
                ? `${
                    lang === 'ru'
                      ? 'Место'
                      : lang === 'en'
                      ? 'Desk'
                      : 'Joy'
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
            <form onSubmit={handleConfirmBooking} className="space-y-4">
              <div>
                <label
                  htmlFor="booking-date"
                  className="block text-xs font-semibold text-[#0F2342] mb-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 inline mr-1.5 text-[#B8860B]" />
                  {t.selectDateLabel}
                </label>
                <input
                  id="booking-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-[#E5DEC9] rounded-lg text-[#1C1917] font-mono-tabular"
                />
              </div>

              <div>
                <label
                  htmlFor="booking-timeslot"
                  className="block text-xs font-semibold text-[#0F2342] mb-1.5"
                >
                  <Clock className="w-3.5 h-3.5 inline mr-1.5 text-[#B8860B]" />
                  {t.selectTimeSlotLabel}
                </label>
                <select
                  id="booking-timeslot"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-[#E5DEC9] rounded-lg text-[#1C1917] font-mono-tabular"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="booking-purpose"
                  className="block text-xs font-semibold text-[#0F2342] mb-1.5"
                >
                  {t.selectPurposeLabel}
                </label>
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
                disabled={
                  activeSeat.defaultStatus === 'occupied' ||
                  userReservedSeatIds.has(activeSeat.id)
                }
                className="w-full py-2.5 px-4 text-xs font-semibold bg-[#0F2342] text-[#FBF9F5] rounded-lg hover:bg-[#173461] disabled:opacity-40 transition-colors whitespace-nowrap shrink-0"
              >
                {userReservedSeatIds.has(activeSeat.id)
                  ? t.seatYours
                  : t.bookSeatAction}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
