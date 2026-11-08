import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  Calendar,
  Check,
  Clock,
  Copy,
  Download,
  GraduationCap,
  LampDesk,
  MapPin,
  QrCode,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Language, QrPassTicketItem } from '../types/library';
import { generateQrMatrix } from '../utils/libraryLogic';
import { downloadTicketPassPdf } from '../utils/pdfGenerator';

interface QrTicketModalProps {
  ticket: QrPassTicketItem | null;
  lang: Language;
  onClose: () => void;
}

export const QrTicketModal: React.FC<QrTicketModalProps> = ({
  ticket,
  lang,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const qrPayload = useMemo(() => {
    if (!ticket) return '';
    if (ticket.kind === 'book') {
      const l = ticket.loan;
      return `TUAF-PASS|BOOK|${l.ticketCode || l.id}|${l.studentId}|${l.dueDate}`;
    }
    const s = ticket.seat;
    return `TUAF-PASS|SEAT|${s.ticketCode || s.id}|${s.seatCode}|${s.date}|${s.timeSlot}`;
  }, [ticket]);

  const qrMatrix = useMemo(() => generateQrMatrix(qrPayload, 21), [qrPayload]);

  if (!ticket) return null;

  const isBook = ticket.kind === 'book';
  const ticketCode = isBook
    ? ticket.loan.ticketCode || 'TUAF-KTB-4821'
    : ticket.seat.ticketCode || 'TUAF-JOY-1108';

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(ticketCode).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdfPass = () => {
    downloadTicketPassPdf(ticket, lang);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-ticket-modal-title"
      className="fixed inset-0 z-50 bg-[#041E41]/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div className="bg-[#FBF9F5] border-2 border-[#C59B27] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl my-auto flex flex-col">
        {/* Official Pass Header */}
        <div className="bg-[#041E41] text-white px-5 py-4 flex items-center justify-between gap-3 border-b border-[#C59B27]/40">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#0099B5]/25 border border-[#C59B27] flex items-center justify-center shrink-0">
              <QrCode className="w-5 h-5 text-[#C59B27]" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#C59B27]">
                Turon University · Andijon Filiali ARM
              </div>
              <h2
                id="qr-ticket-modal-title"
                className="text-base sm:text-lg font-serif-academic font-bold text-white truncate"
              >
                {isBook
                  ? lang === 'ru'
                    ? 'Электронный талон на получение книги'
                    : lang === 'en'
                    ? 'Digital Book Loan QR Pass'
                    : 'Kitob olish uchun QR-kodli elektron talon'
                  : lang === 'ru'
                  ? 'Электронный пропуск в читальный зал'
                  : lang === 'en'
                  ? 'Reading Hall Desk QR Pass'
                  : 'O‘quv zaliga kirish uchun QR-kodli talon'}
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

        {/* Ticket Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Top QR & Ticket Code Split */}
          <div className="bg-white border border-[#E5DEC9] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5 shadow-xs">
            {/* High-Contrast SVG QR Code */}
            <div className="p-3 bg-white border-2 border-[#0F2342] rounded-xl shrink-0 shadow-xs">
              <svg
                viewBox="0 0 21 21"
                className="w-32 h-32 sm:w-36 sm:h-36 block"
                shapeRendering="crispEdges"
                aria-label={`QR Code for ${ticketCode}`}
              >
                {qrMatrix.map((row, rIdx) =>
                  row.map((cell, cIdx) =>
                    cell ? (
                      <rect
                        key={`${rIdx}-${cIdx}`}
                        x={cIdx}
                        y={rIdx}
                        width={1}
                        height={1}
                        fill="#041E41"
                      />
                    ) : null
                  )
                )}
              </svg>
            </div>

            {/* Ticket Code & Verification Status */}
            <div className="flex-1 space-y-2.5 text-center sm:text-left min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {lang === 'ru'
                    ? 'Подтверждено системой HEMIS'
                    : lang === 'en'
                    ? 'Verified by TUAF HEMIS'
                    : 'TUAF HEMIS tizimida tasdiqlangan'}
                </span>
              </div>

              <div>
                <div className="text-[11px] text-[#57534E] uppercase tracking-wider font-semibold">
                  {lang === 'ru'
                    ? 'Уникальный номер брони:'
                    : lang === 'en'
                    ? 'Reservation Ticket Code:'
                    : 'Maxsus talon raqami:'}
                </div>
                <div className="text-xl sm:text-2xl font-mono-tabular font-bold text-[#0F2342] tracking-tight mt-0.5">
                  #{ticketCode}
                </div>
              </div>

              <p className="text-xs text-[#57534E] leading-relaxed">
                {isBook
                  ? lang === 'ru'
                    ? 'Покажите этот QR-код библиотекарю в пункте выдачи (каб. 104) для получения книги без очереди.'
                    : lang === 'en'
                    ? 'Present this QR code to the librarian at the circulation desk (Room 104) for express pickup.'
                    : 'Kutubxona topshirish punktida (104-xona) ushbu QR-kod yoki talon raqamini xodimga ko‘rsating.'
                  : lang === 'ru'
                  ? 'Покажите этот QR-код при входе в читальный зал для подтверждения вашего места.'
                  : lang === 'en'
                  ? 'Show this QR code at the reading hall entrance to claim your reserved desk.'
                  : 'O‘quv zaliga kirishda ushbu QR-kodni ko‘rsatib, band qilingan joyingizga o‘tirishingiz mumkin.'}
              </p>

              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F3EFE6] hover:bg-[#E5DEC9] text-[#0F2342] text-xs font-semibold transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Nusxalandi!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#B8860B]" />
                    <span>Kodni nusxalash</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Perforated Divider Line */}
          <div className="border-t-2 border-dashed border-[#E5DEC9] relative">
            <span className="px-2 bg-[#FBF9F5] text-[10px] font-mono-tabular uppercase tracking-widest text-[#57534E] absolute left-1/2 -translate-x-1/2 -top-2">
              Rasmiy Bandlov Ma’lumotlari
            </span>
          </div>

          {/* Detailed Pass Metadata */}
          {isBook ? (
            <div className="bg-white border border-[#E5DEC9] rounded-xl p-4 space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <BookOpen className="w-4 h-4 text-[#0099B5] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="text-[11px] text-[#57534E]">
                    Band qilingan kitob:
                  </div>
                  <div className="text-sm font-serif-academic font-bold text-[#0F2342]">
                    {ticket.loan.resourceTitle[lang]}
                  </div>
                  <div className="text-[11px] text-[#57534E] font-mono-tabular mt-0.5">
                    {ticket.loan.authors.join(', ')} · {ticket.loan.callNumber}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-[#E5DEC9]">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#B8860B] shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[10px] text-[#57534E]">Talaba:</div>
                    <div className="font-bold text-[#0F2342] truncate">
                      {ticket.loan.studentName}
                    </div>
                    <div className="text-[11px] font-mono-tabular text-[#57534E]">
                      {ticket.loan.studentId}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#0099B5] shrink-0" />
                  <div>
                    <div className="text-[10px] text-[#57534E]">
                      Bandlik muddati ({ticket.loan.durationDays || 14} kun):
                    </div>
                    <div className="font-bold font-mono-tabular text-[#0F2342]">
                      {ticket.loan.pickupDate} → {ticket.loan.dueDate}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E5DEC9] flex items-center gap-2 text-[#0F2342]">
                <MapPin className="w-4 h-4 text-[#B8860B] shrink-0" />
                <span className="font-semibold">
                  {ticket.loan.pickupLocation ||
                    '1-qavat, ARM Abonement Topshirish Punkti (104-xona)'}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#E5DEC9] rounded-xl p-4 space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <LampDesk className="w-4 h-4 text-[#B8860B] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="text-[11px] text-[#57534E]">
                    O‘quv zali va joy raqami:
                  </div>
                  <div className="text-sm font-serif-academic font-bold text-[#0F2342]">
                    {ticket.seat.hallName[lang]} — Joy:{' '}
                    <span className="text-[#0099B5] font-mono-tabular">
                      {ticket.seat.seatCode}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-[#E5DEC9]">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#0F2342] shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[10px] text-[#57534E]">Talaba:</div>
                    <div className="font-bold text-[#0F2342] truncate">
                      {ticket.seat.studentName}
                    </div>
                    <div className="text-[11px] font-mono-tabular text-[#57534E]">
                      {ticket.seat.studentId}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#0099B5] shrink-0" />
                  <div>
                    <div className="text-[10px] text-[#57534E]">
                      Sana va vaqt:
                    </div>
                    <div className="font-bold font-mono-tabular text-[#0F2342]">
                      {ticket.seat.date} · {ticket.seat.timeSlot}
                    </div>
                    {ticket.seat.durationHours && (
                      <div className="text-[11px] text-[#B8860B] font-semibold">
                        {ticket.seat.durationHours}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-[#57534E] bg-white border border-[#E5DEC9] rounded-xl hover:text-[#0F2342] cursor-pointer"
            >
              {lang === 'ru' ? 'Закрыть' : lang === 'en' ? 'Close' : 'Yopish'}
            </button>
            <button
              type="button"
              onClick={handleDownloadPdfPass}
              className="px-5 py-2.5 text-xs sm:text-sm font-bold bg-[#0F2342] hover:bg-[#173461] text-white rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4 text-[#C59B27]" />
              <span>
                {lang === 'ru'
                  ? 'Скачать талон в PDF'
                  : lang === 'en'
                  ? 'Download Pass as PDF'
                  : 'Talonni PDF shaklida yuklab olish'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
