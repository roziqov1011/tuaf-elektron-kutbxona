import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  Download,
  ExternalLink,
  FileDown,
  Lightbulb,
  Presentation,
  Sparkles,
  X,
} from 'lucide-react';
import { STUDENT_ROADMAP_SLIDES } from '../data/studentRoadmapData';
import { ActiveTab } from './TopBar';

interface StudentRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenSpotlightSearch: () => void;
}

export const StudentRoadmapModal: React.FC<StudentRoadmapModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenSpotlightSearch,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [downloadedNotice, setDownloadedNotice] = useState(false);

  const slides = STUDENT_ROADMAP_SLIDES;
  const activeSlide = slides[currentIndex] || slides[0];

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, slides.length]);

  if (!isOpen) return null;

  const handleDownloadPdfFile = () => {
    const link = document.createElement('a');
    link.href = '/TUAF_ARM_Talaba_Yol_Xaritasi.pdf';
    link.download = 'TUAF_ARM_Talaba_Yol_Xaritasi.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadedNotice(true);
    setTimeout(() => setDownloadedNotice(false), 4000);
  };

  const handleTryStepAction = () => {
    if (activeSlide.triggerSpotlight) {
      onClose();
      onOpenSpotlightSearch();
      return;
    }
    if (activeSlide.targetTab) {
      onNavigateTab(activeSlide.targetTab);
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Talabalar uchun platformadan foydalanish yo‘l xaritasi (Slayd va PDF)"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-2 sm:p-4 lg:p-6 overflow-y-auto"
    >
      <div className="w-full max-w-6xl bg-[#FAF7F2] border-2 border-[#C59B27] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Institutional Slide Deck Header */}
        <div className="bg-[#041E41] text-white px-4 sm:px-6 py-3.5 border-b-2 border-[#C59B27] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#C59B27]/20 border border-[#C59B27] flex items-center justify-center shrink-0">
              <Presentation className="w-5 h-5 text-[#FDE68A]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono-tabular uppercase tracking-widest text-[#FDE68A] font-bold">
                  TALABA YO‘L XARITASI · SLAYD TAQDIMOT VA PDF QO‘LLANMA
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold font-serif-academic truncate">
                Turon University ARM Platformasidan Foydalanish Bo‘yicha Vizual Yo‘riqnoma
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleDownloadPdfFile}
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-[#C59B27] hover:bg-[#d4a92f] text-[#041E41] font-extrabold text-xs flex items-center gap-2 shadow-md transition-colors cursor-pointer"
            >
              <FileDown className="w-4 h-4 shrink-0" />
              <span>PDF Slaydni Yuklab Olish (.pdf)</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Yo‘l xaritasini yopish"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Progress Strip */}
        <div className="bg-[#0B2D5C] px-3 sm:px-6 py-2.5 border-b border-white/15 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {slides.map((slide, idx) => {
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={slide.stepNumber}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-mono-tabular transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    isCurrent
                      ? 'bg-[#FDE68A] text-[#041E41] font-extrabold shadow-xs'
                      : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-[#041E41]/20 flex items-center justify-center text-[10px] font-bold">
                    {slide.stepNumber}
                  </span>
                  <span className="hidden md:inline">
                    {slide.stepNumber}-Qadam
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-[11px] font-mono-tabular text-[#FDE68A] whitespace-nowrap hidden sm:block">
            Slayd {currentIndex + 1} / {slides.length} · ← → tugmalari orqali varaqlang
          </div>
        </div>

        {/* Download Confirmation Banner */}
        {downloadedNotice && (
          <div className="bg-emerald-900 text-emerald-100 px-4 sm:px-6 py-2 text-xs flex items-center justify-between gap-2 border-b border-emerald-500/30 shrink-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>TUAF_ARM_Talaba_Yol_Xaritasi.pdf</strong> (7 sahifali illyustratsiyali slayd-qo‘llanma) qurilmangizga yuklab olindi! Shuningdek, loyiha papkasida ham mavjud.
              </span>
            </div>
          </div>
        )}

        {/* Main 16:9 Slide Canvas Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Slide Title Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#E5DEC9]">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#041E41] text-[#FDE68A] text-[11px] font-mono-tabular font-bold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5" />
                <span>{activeSlide.badgeText}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif-academic text-[#041E41]">
                {activeSlide.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#57534E] max-w-3xl">
                {activeSlide.subtitle}
              </p>
            </div>

            <button
              type="button"
              onClick={handleTryStepAction}
              className="px-4 py-2.5 rounded-xl bg-[#0099B5] hover:bg-[#008199] text-white text-xs font-bold flex items-center gap-2 self-start md:self-center shrink-0 shadow-sm transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              <span>{activeSlide.actionLabel}</span>
            </button>
          </div>

          {/* 2-Column Visual Slide Content: Real Platform Screenshot + Annotated Callouts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left 7 Cols: High-Res Real Platform Screenshot with Frame */}
            <div className="lg:col-span-7 flex flex-col justify-between bg-[#041E41] p-2.5 sm:p-3.5 rounded-2xl border-2 border-[#C59B27] shadow-xl">
              <div className="flex items-center justify-between px-2 pb-2 text-[11px] font-mono-tabular text-white/80">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                  <span className="ml-2 text-[#FDE68A] font-semibold">
                    {activeSlide.code}
                  </span>
                </div>
                <span className="text-white/60">tuaf.uz · ARM Platformasi</span>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-white/15 bg-[#0B2D5C]">
                <img
                  src={activeSlide.screenshotUrl}
                  alt={activeSlide.title}
                  className="w-full h-[240px] sm:h-[340px] lg:h-[370px] object-cover object-top"
                />
              </div>

              <div className="pt-2.5 px-2 flex items-center justify-between gap-2 text-xs text-[#FDE68A]">
                <span className="font-medium">{activeSlide.screenshotCaption}</span>
              </div>
            </div>

            {/* Right 5 Cols: Step-by-Step Annotated Callout Cards + Pro-Tip */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-4">
              <div className="space-y-3">
                <div className="text-xs font-mono-tabular uppercase tracking-wider font-bold text-[#041E41] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>Qanday bajariladi (Ketma-ketlik):</span>
                </div>

                {activeSlide.callouts.map((callout) => (
                  <div
                    key={callout.badge}
                    className="bg-white border border-[#E5DEC9] border-l-4 border-l-[#041E41] rounded-xl p-3.5 sm:p-4 shadow-xs flex items-start gap-3"
                  >
                    <span className="px-2.5 py-1 rounded-lg bg-[#041E41] text-[#FDE68A] font-mono-tabular font-extrabold text-xs shrink-0">
                      {callout.badge}
                    </span>
                    <div className="space-y-1 min-w-0">
                      <h4 className="text-sm font-bold text-[#041E41]">
                        {callout.title}
                      </h4>
                      <p className="text-xs text-[#57534E] leading-relaxed">
                        {callout.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pro Tip Box */}
              <div className="bg-amber-50/90 border border-amber-300 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-amber-950">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Talabalar uchun maslahat: </span>
                  <span>{activeSlide.proTip}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Slide Controls & File Path Info */}
        <div className="bg-[#F3EFE6] border-t border-[#E5DEC9] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] font-mono-tabular text-[#57534E] flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-[#041E41] shrink-0" />
            <span>
              Loyiha ichidagi tayyor fayl manzili:{' '}
              <code className="px-1.5 py-0.5 rounded bg-white border border-[#E5DEC9] text-[#041E41] font-bold">
                /TUAF_ARM_Talaba_Yol_Xaritasi.pdf
              </code>
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={() =>
                setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
              }
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#E5DEC9]/40 border border-[#D6D0C4] text-[#041E41] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Oldingi slayd</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)}
              className="px-4 py-2 rounded-xl bg-[#041E41] hover:bg-[#0B2D5C] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Keyingi slayd</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleDownloadPdfFile}
              className="px-3.5 py-2 rounded-xl bg-[#0099B5] hover:bg-[#008199] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PDF Yuklab Olish</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
