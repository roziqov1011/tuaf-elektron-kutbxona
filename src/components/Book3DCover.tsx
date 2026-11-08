import React, { useState } from 'react';
import { Language, LibraryResource } from '../types/library';

interface Book3DCoverProps {
  resource: LibraryResource;
  lang: Language;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  showRibbon?: boolean;
  className?: string;
}

const PALETTE_BY_FACULTY: Record<
  string,
  { bg: string; spine: string; accent: string }
> = {
  'economics-finance': {
    bg: 'from-[#0B2D5C] via-[#0F2342] to-[#06152D]',
    spine: '#06152D',
    accent: '#C59B27',
  },
  'pedagogy-languages': {
    bg: 'from-[#144233] via-[#0E3125] to-[#071F17]',
    spine: '#071F17',
    accent: '#D4AF37',
  },
  'natural-exact-sciences': {
    bg: 'from-[#0C3B4E] via-[#092938] to-[#051A24]',
    spine: '#051A24',
    accent: '#38BDF8',
  },
  'humanities-social': {
    bg: 'from-[#4A1D1F] via-[#361315] to-[#220B0C]',
    spine: '#220B0C',
    accent: '#E2B857',
  },
  'digital-innovation': {
    bg: 'from-[#1E293B] via-[#0F172A] to-[#090D16]',
    spine: '#090D16',
    accent: '#38BDF8',
  },
};

export const Book3DCover: React.FC<Book3DCoverProps> = ({
  resource,
  lang,
  size = 'md',
  onClick,
  showRibbon = true,
  className = '',
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  const palette = PALETTE_BY_FACULTY[resource.faculty] || {
    bg: 'from-[#0F2342] via-[#09182E] to-[#041020]',
    spine: '#041020',
    accent: '#C59B27',
  };

  const sizeDimensions: Record<
    NonNullable<Book3DCoverProps['size']>,
    string
  > = {
    xs: 'w-14 h-20 rounded-r-md rounded-l-[2px]',
    sm: 'w-20 sm:w-24 aspect-[3/4] rounded-r-lg rounded-l-[3px]',
    md: 'w-28 sm:w-32 aspect-[3/4] rounded-r-lg rounded-l-[3px]',
    lg: 'w-36 sm:w-44 aspect-[3/4] rounded-r-xl rounded-l-[4px]',
    xl: 'w-44 sm:w-52 lg:w-56 aspect-[3/4] rounded-r-xl rounded-l-[4px]',
  };

  const hasCover = Boolean(resource.coverImage) && !imgFailed;

  const content = (
    <div
      className={`tuaf-3d-book-stage inline-block select-none pr-3 pb-2 ${className}`}
    >
      <div
        className={`tuaf-3d-book relative overflow-visible ${sizeDimensions[size]}`}
      >
        {/* Front Hardcover Surface */}
        <div
          className={`relative w-full h-full overflow-hidden border border-[#C59B27]/45 bg-gradient-to-br ${palette.bg} ${
            size === 'xs'
              ? 'rounded-r-md rounded-l-[2px]'
              : 'rounded-r-lg rounded-l-[3px]'
          }`}
        >
          {/* Left Hardcover Spine Hinge Crease */}
          <div className="tuaf-book-spine-crease" />

          {/* Gold-Foil Decorative Inner Frame */}
          {size !== 'xs' && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-2 sm:inset-2.5 border border-[#C59B27]/35 rounded-r-sm z-10"
            />
          )}

          {hasCover ? (
            <>
              <img
                src={resource.coverImage}
                alt={resource.title[lang]}
                referrerPolicy="no-referrer"
                onError={() => setImgFailed(true)}
                className="w-full h-full object-cover"
              />
              {/* Subtle Archival Vignette Scrim */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#041E41]/85 via-[#041E41]/15 to-black/25" />
              {size !== 'xs' && (
                <div className="pointer-events-none absolute inset-x-2.5 bottom-2.5 z-10 text-left">
                  <div className="text-[9px] font-mono-tabular uppercase tracking-wider text-[#FDE68A] drop-shadow-xs truncate">
                    {resource.year} · UDK {resource.udc.split(':')[0]}
                  </div>
                  <div
                    className={`font-serif-academic font-bold text-white leading-tight line-clamp-2 drop-shadow-sm ${
                      size === 'sm'
                        ? 'text-[11px]'
                        : size === 'md'
                        ? 'text-xs'
                        : 'text-sm sm:text-base'
                    }`}
                  >
                    {resource.title[lang]}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Rich Embossed Leather & Gold Foil Academic Hardcover Fallback */
            <div className="relative z-10 w-full h-full p-2.5 sm:p-4 flex flex-col justify-between text-left text-[#FBF9F5]">
              <div className="flex items-center justify-between gap-1 border-b border-[#C59B27]/35 pb-1">
                <span className="text-[9px] font-mono-tabular tracking-wider uppercase text-[#FDE68A] truncate">
                  TUAF · {resource.year}
                </span>
                {size !== 'xs' && size !== 'sm' && (
                  <span className="text-[8px] font-mono-tabular text-white/70 truncate">
                    {resource.pages}p
                  </span>
                )}
              </div>

              <div className="my-auto py-1">
                <div
                  className={`font-serif-academic font-bold text-white leading-snug line-clamp-3 ${
                    size === 'xs'
                      ? 'text-[9px]'
                      : size === 'sm'
                      ? 'text-[11px]'
                      : size === 'md'
                      ? 'text-xs sm:text-sm'
                      : 'text-base sm:text-lg'
                  }`}
                >
                  {resource.title[lang]}
                </div>
              </div>

              {size !== 'xs' && (
                <div className="pt-1 border-t border-[#C59B27]/30 text-[9px] sm:text-[10px] text-[#E5DEC9] truncate">
                  {resource.authors[0]}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Crimson & Gold Silk Bookmark Ribbon Tail Peeking at Bottom */}
        {showRibbon && size !== 'xs' && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-2 right-4 w-2.5 h-3.5 bg-gradient-to-b from-[#991B1B] to-[#7F1D1D] shadow-sm z-20"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 72%, 0 100%)',
            }}
          />
        )}
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`${resource.title[lang]} — Mutolaa qilish`}
        className="text-left focus:outline-none cursor-pointer group"
      >
        {content}
      </button>
    );
  }

  return content;
};
