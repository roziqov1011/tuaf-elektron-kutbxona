import React, { useEffect, useState } from 'react';
import {
  Clock,
  FastForward,
  FileText,
  Headphones,
  Pause,
  Play,
  Video,
  Volume2,
} from 'lucide-react';
import { Language, MediaLecture } from '../types/library';
import { FACULTY_LABELS, UI_TRANSLATIONS } from '../data/translations';

interface MediathequeViewProps {
  lectures: MediaLecture[];
  lang: Language;
}

export const MediathequeView: React.FC<MediathequeViewProps> = ({
  lectures,
  lang,
}) => {
  const [selectedLectureId, setSelectedLectureId] = useState<string>(
    lectures[0]?.id || ''
  );
  const [mediaFilter, setMediaFilter] = useState<'all' | 'video' | 'audio'>(
    'all'
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.25 | 1.5 | 2>(1);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [brokenThumbs, setBrokenThumbs] = useState<Record<string, boolean>>({});

  const t = UI_TRANSLATIONS[lang];

  const filteredLectures = lectures.filter((l) =>
    mediaFilter === 'all' ? true : l.mediaType === mediaFilter
  );

  const activeLecture =
    lectures.find((l) => l.id === selectedLectureId) ||
    filteredLectures[0] ||
    lectures[0];

  useEffect(() => {
    if (!isPlaying || !activeLecture) return;
    const timer = setInterval(() => {
      setCurrentSeconds((prev) => {
        const next = prev + 1;
        if (next >= activeLecture.durationSeconds) {
          setIsPlaying(false);
          return 0;
        }
        return next;
      });
    }, Math.round(1000 / playbackSpeed));
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, activeLecture]);

  if (!activeLecture) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleJumpToChapter = (idx: number, seconds: number) => {
    setActiveChapterIndex(idx);
    setCurrentSeconds(seconds);
    setIsPlaying(true);
  };

  const filterLabels: Record<'all' | 'video' | 'audio', string> = {
    all: lang === 'ru' ? 'Все' : lang === 'en' ? 'All' : 'Barchasi',
    video: lang === 'ru' ? 'Видео' : lang === 'en' ? 'Video' : 'Video darslar',
    audio: lang === 'ru' ? 'Аудио' : lang === 'en' ? 'Audio' : 'Audio darslar',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* Clean Header */}
      <div className="border-b border-[#E5DEC9] pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif-academic font-bold text-[#0F2342]">
            {t.mediathequeTitle}
          </h1>
          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
            {t.mediathequeSubtitle}
          </p>
        </div>

        <div
          role="group"
          aria-label="Media formati"
          className="flex flex-wrap items-center gap-1 p-1 bg-[#F3EFE6] border border-[#E5DEC9] rounded-lg self-start max-w-full"
        >
          {(['all', 'video', 'audio'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setMediaFilter(type)}
              className={`px-3.5 sm:px-4 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                mediaFilter === type
                  ? 'bg-[#0F2342] text-[#FBF9F5] font-semibold'
                  : 'text-[#57534E] hover:text-[#0F2342]'
              }`}
            >
              {filterLabels[type]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Player & Playlist Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        <div className="lg:col-span-8 space-y-5 sm:space-y-6">
          <div className="bg-[#0F2342] border border-[#E5DEC9] rounded-xl overflow-hidden text-[#FBF9F5]">
            <div className="relative aspect-video bg-[#081326] overflow-hidden">
              {activeLecture.thumbnailUrl &&
              !brokenThumbs[activeLecture.id] ? (
                <img
                  src={activeLecture.thumbnailUrl}
                  alt={activeLecture.title[lang]}
                  referrerPolicy="no-referrer"
                  onError={() =>
                    setBrokenThumbs((prev) => ({
                      ...prev,
                      [activeLecture.id]: true,
                    }))
                  }
                  className="w-full h-full object-cover opacity-80"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-6 sm:p-8">
                  <span className="font-serif-academic text-lg sm:text-2xl text-[#C59B27]">
                    {activeLecture.title[lang]}
                  </span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#081326] via-[#081326]/55 to-transparent flex flex-col justify-end p-4 sm:p-6">
                <div className="space-y-1 sm:space-y-2">
                  <p className="text-[11px] sm:text-xs text-[#C59B27] font-semibold line-clamp-1">
                    {
                      (
                        activeLecture.chapters[activeChapterIndex] ||
                        activeLecture.chapters[0]
                      ).title[lang]
                    }
                  </p>
                  <h2 className="text-lg sm:text-2xl lg:text-3xl font-serif-academic font-bold text-white leading-snug line-clamp-2">
                    {activeLecture.title[lang]}
                  </h2>
                  <p className="text-[11px] sm:text-xs text-[#E5DEC9] truncate">
                    {activeLecture.professor} —{' '}
                    {activeLecture.professorTitle[lang]}
                  </p>
                </div>
              </div>
            </div>

            {/* Player Controls */}
            <div className="p-3.5 sm:p-4 bg-[#0F2342] border-t border-[#1E3A68] space-y-3">
              <div className="space-y-1">
                <input
                  type="range"
                  aria-label="Vaqt chizig‘i"
                  min={0}
                  max={activeLecture.durationSeconds}
                  value={currentSeconds}
                  onChange={(e) => setCurrentSeconds(Number(e.target.value))}
                  className="w-full accent-[#C59B27] cursor-pointer h-1.5 bg-[#1E3A68] rounded"
                />
                <div className="flex justify-between text-xs text-[#D6CEBE] font-mono-tabular">
                  <span>{formatTime(currentSeconds)}</span>
                  <span>{activeLecture.duration}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPlaying((prev) => !prev)}
                    className="px-4 py-2 text-xs font-semibold bg-[#C59B27] text-[#0F2342] rounded-lg hover:bg-[#d6ab33] flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        {lang === 'ru'
                          ? 'Пауза'
                          : lang === 'en'
                          ? 'Pause'
                          : 'To‘xtatish'}
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        {lang === 'ru'
                          ? 'Слушать'
                          : lang === 'en'
                          ? 'Play'
                          : 'Ko‘rish'}
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentSeconds((prev) =>
                        Math.min(activeLecture.durationSeconds, prev + 60)
                      )
                    }
                    className="px-3 py-2 text-xs font-medium bg-[#162E52] text-[#E5DEC9] rounded-lg hover:text-white flex items-center gap-1 font-mono-tabular whitespace-nowrap shrink-0"
                  >
                    <FastForward className="w-3.5 h-3.5" />
                    +1m
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-[#C59B27]" />
                  <div
                    role="group"
                    aria-label="Tezlik"
                    className="flex items-center gap-1 bg-[#162E52] p-1 rounded-lg border border-[#254575] font-mono-tabular"
                  >
                    {([1, 1.25, 1.5, 2] as const).map((spd) => (
                      <button
                        key={spd}
                        type="button"
                        onClick={() => setPlaybackSpeed(spd)}
                        className={`px-2 py-0.5 text-xs rounded whitespace-nowrap shrink-0 ${
                          playbackSpeed === spd
                            ? 'bg-[#C59B27] text-[#0F2342] font-bold'
                            : 'text-[#D6CEBE] hover:text-white'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Clean Lecture Summary & Transcript */}
          <div className="bg-white border border-[#E5DEC9] rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5DEC9] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#B8860B]" />
                <h3 className="text-lg font-serif-academic font-bold text-[#0F2342]">
                  {lang === 'ru'
                    ? 'Конспект лекции'
                    : lang === 'en'
                    ? 'Lecture Notes & Transcript'
                    : 'Ma’ruza konspekti va matni'}
                </h3>
              </div>
              <span className="text-xs text-[#57534E]">
                {FACULTY_LABELS[activeLecture.faculty][lang]}
              </span>
            </div>

            <p className="text-sm text-[#1C1917] leading-relaxed">
              {activeLecture.transcript[lang]}
            </p>
          </div>
        </div>

        {/* Right: Chapters & Playlist */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#E5DEC9] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5DEC9] pb-3">
              <h3 className="text-lg font-serif-academic font-bold text-[#0F2342]">
                {lang === 'ru'
                  ? 'Главы лекции'
                  : lang === 'en'
                  ? 'Chapters'
                  : 'Mavzu qismlari'}
              </h3>
              <Clock className="w-4 h-4 text-[#B8860B]" />
            </div>

            <div className="space-y-2">
              {activeLecture.chapters.map((ch, idx) => {
                const isCurrent = activeChapterIndex === idx;
                return (
                  <button
                    key={ch.time}
                    type="button"
                    onClick={() => handleJumpToChapter(idx, ch.seconds)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors flex items-start gap-3 ${
                      isCurrent
                        ? 'bg-[#0F2342] text-[#FBF9F5] border-[#0F2342]'
                        : 'bg-[#FBF9F5] text-[#1C1917] border-[#E5DEC9] hover:border-[#0F2342]'
                    }`}
                  >
                    <span
                      className={`text-xs font-mono-tabular font-semibold shrink-0 mt-0.5 ${
                        isCurrent ? 'text-[#C59B27]' : 'text-[#0F2342]'
                      }`}
                    >
                      {ch.time}
                    </span>
                    <span className="text-xs leading-snug">{ch.title[lang]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-[#F3EFE6] border border-[#E5DEC9] rounded-xl p-5 space-y-4">
            <h3 className="text-lg font-serif-academic font-bold text-[#0F2342]">
              {lang === 'ru'
                ? `Все лекции (${filteredLectures.length})`
                : lang === 'en'
                ? `All Lectures (${filteredLectures.length})`
                : `Barcha ma’ruzalar (${filteredLectures.length})`}
            </h3>
            <div className="space-y-3">
              {filteredLectures.map((lec) => {
                const isSelected = lec.id === activeLecture.id;
                return (
                  <button
                    key={lec.id}
                    type="button"
                    onClick={() => {
                      setSelectedLectureId(lec.id);
                      setCurrentSeconds(0);
                      setActiveChapterIndex(0);
                      setIsPlaying(false);
                    }}
                    className={`w-full text-left p-4 rounded-lg border transition-colors space-y-1.5 ${
                      isSelected
                        ? 'bg-white border-[#B8860B] shadow-xs'
                        : 'bg-white/70 border-[#E5DEC9] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-[#57534E]">
                      <span className="inline-flex items-center gap-1.5 text-[#0F2342] font-semibold">
                        {lec.mediaType === 'video' ? (
                          <Video className="w-3.5 h-3.5 text-[#B8860B]" />
                        ) : (
                          <Headphones className="w-3.5 h-3.5 text-[#B8860B]" />
                        )}
                        {lec.professor}
                      </span>
                      <span className="font-mono-tabular">{lec.duration}</span>
                    </div>
                    <div className="text-sm font-serif-academic font-bold text-[#0F2342] leading-snug">
                      {lec.title[lang]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
