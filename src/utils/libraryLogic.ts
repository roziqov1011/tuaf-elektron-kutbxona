import {
  CatalogFilterState,
  CitationFormat,
  FacultyId,
  HallId,
  Language,
  LibraryResource,
  ReadingRoomSeat,
  ResourceType,
  SeatReservation,
} from '../types/library';

export function filterCatalogItems(
  items: LibraryResource[],
  filters: CatalogFilterState,
  activeLang: Language
): LibraryResource[] {
  const normalizedQuery = filters.query.trim().toLowerCase();

  const filtered = items.filter((item) => {
    if (filters.faculty !== 'all' && item.faculty !== filters.faculty) {
      return false;
    }
    if (
      filters.programCode &&
      filters.programCode !== 'all' &&
      item.programCode !== filters.programCode &&
      !item.keywords.some((kw) =>
        kw.toLowerCase().includes(filters.programCode.split('-')[0].toLowerCase())
      )
    ) {
      return false;
    }
    if (filters.type !== 'all' && item.type !== filters.type) {
      return false;
    }
    if (filters.language !== 'all' && item.language !== filters.language) {
      return false;
    }
    if (filters.openAccessOnly && !item.openAccess) {
      return false;
    }
    if (filters.peerReviewedOnly && !item.peerReviewed) {
      return false;
    }
    if (item.year < filters.yearFrom || item.year > filters.yearTo) {
      return false;
    }

    if (normalizedQuery.length > 0) {
      const titleMatch =
        item.title.uz.toLowerCase().includes(normalizedQuery) ||
        item.title.en.toLowerCase().includes(normalizedQuery) ||
        item.title.ru.toLowerCase().includes(normalizedQuery);
      const authorMatch = item.authors.some((a) =>
        a.toLowerCase().includes(normalizedQuery)
      );
      const doiMatch = item.doi.toLowerCase().includes(normalizedQuery);
      const isbnMatch = (item.isbn || '').toLowerCase().includes(normalizedQuery);
      const udcMatch = item.udc.toLowerCase().includes(normalizedQuery);
      const progMatch = (item.programCode || '')
        .toLowerCase()
        .includes(normalizedQuery);
      const keywordMatch = item.keywords.some((k) =>
        k.toLowerCase().includes(normalizedQuery)
      );
      const abstractMatch =
        item.abstract.uz.toLowerCase().includes(normalizedQuery) ||
        item.abstract.en.toLowerCase().includes(normalizedQuery) ||
        item.abstract.ru.toLowerCase().includes(normalizedQuery);

      if (
        !titleMatch &&
        !authorMatch &&
        !doiMatch &&
        !isbnMatch &&
        !udcMatch &&
        !progMatch &&
        !keywordMatch &&
        !abstractMatch
      ) {
        return false;
      }
    }

    return true;
  });

  const sorted = [...filtered];
  if (filters.sortBy === 'citations-desc') {
    sorted.sort((a, b) => b.citationsCount - a.citationsCount);
  } else if (filters.sortBy === 'year-desc') {
    sorted.sort((a, b) => b.year - a.year || b.citationsCount - a.citationsCount);
  } else if (filters.sortBy === 'title-asc') {
    sorted.sort((a, b) =>
      a.title[activeLang].localeCompare(b.title[activeLang])
    );
  }

  return sorted;
}

export function generateCitation(
  resource: LibraryResource,
  format: CitationFormat,
  lang: Language
): string {
  const title = resource.title[lang] || resource.title.en;
  const authorsJoined = resource.authors.join(', ');
  const firstAuthor = resource.authors[0] || 'Author';
  const bibKey = `${firstAuthor
    .replace(/[^a-zA-Z]/g, '')
    .toLowerCase()}${resource.year}`;

  switch (format) {
    case 'APA':
      return `${authorsJoined} (${resource.year}). ${title}. ${resource.publisher}. https://doi.org/${resource.doi}`;
    case 'MLA':
      return `${authorsJoined}. "${title}." ${resource.publisher}, ${resource.year}, pp. 1-${resource.pages}. DOI: ${resource.doi}.`;
    case 'IEEE':
      return `[1] ${authorsJoined}, "${title}," ${resource.publisher}, ${resource.year}, pp. 1-${resource.pages}, doi: ${resource.doi}.`;
    case 'HARVARD':
      return `${authorsJoined} (${resource.year}) '${title}', ${resource.publisher}, pp. 1–${resource.pages}. Available at: https://doi.org/${resource.doi}.`;
    case 'GOST':
      return `${authorsJoined}. ${title} : [${resource.type === 'dissertation' ? 'диссертация / автореферат' : 'монография / учебник'}] / ${authorsJoined}. — ${resource.publisher}, ${resource.year}. — ${resource.pages} с. — УДК ${resource.udc}. — DOI: ${resource.doi}.`;
    case 'BIBTEX':
      return `@book{${bibKey},\n  author = {${resource.authors.join(' and ')}},\n  title = {${title}},\n  year = {${resource.year}},\n  publisher = {${resource.publisher}},\n  pages = {${resource.pages}},\n  doi = {${resource.doi}}${resource.isbn ? `,\n  isbn = {${resource.isbn}}` : ''}\n}`;
  }
}

export function calculateHallOccupancy(
  seats: ReadingRoomSeat[],
  reservations: SeatReservation[],
  hallId: HallId
): {
  total: number;
  available: number;
  occupied: number;
  reservedByUser: number;
} {
  const hallSeats = seats.filter((s) => s.hallId === hallId);
  const activeSeatIds = new Set(
    reservations
      .filter((r) => r.hallId === hallId && r.status === 'confirmed')
      .map((r) => r.seatId)
  );

  let available = 0;
  let occupied = 0;
  let reservedByUser = 0;

  for (const seat of hallSeats) {
    if (activeSeatIds.has(seat.id)) {
      reservedByUser += 1;
    } else if (seat.defaultStatus === 'occupied') {
      occupied += 1;
    } else {
      available += 1;
    }
  }

  return {
    total: hallSeats.length,
    available,
    occupied,
    reservedByUser,
  };
}

export interface NewResourceFormInput {
  title: string;
  authors: string;
  doi: string;
  isbn: string;
  udc: string;
  year: string;
  type: ResourceType;
  faculty: Exclude<FacultyId, 'all'>;
  language: 'O‘zbek' | 'English' | 'Русский';
  pages: string;
  publisher: string;
  abstract: string;
  chapterContent: string;
  openAccess: boolean;
  peerReviewed: boolean;
}

export function validateNewResourceForm(
  input: NewResourceFormInput
): { valid: boolean; errorKey?: string } {
  if (!input.title || input.title.trim().length < 4) {
    return { valid: false, errorKey: 'title' };
  }
  if (!input.authors || input.authors.trim().length < 3) {
    return { valid: false, errorKey: 'authors' };
  }
  if (!input.doi || !input.doi.includes('10.')) {
    return { valid: false, errorKey: 'doi' };
  }
  if (!input.udc || input.udc.trim().length < 2) {
    return { valid: false, errorKey: 'udc' };
  }
  const yearNum = Number(input.year);
  if (!Number.isInteger(yearNum) || yearNum < 1400 || yearNum > 2030) {
    return { valid: false, errorKey: 'year' };
  }
  if (!input.abstract || input.abstract.trim().length < 15) {
    return { valid: false, errorKey: 'abstract' };
  }
  return { valid: true };
}

export function addDaysToDateString(dateStr: string, days: number): string {
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    return dateStr;
  }
  const [year, month, day] = parts;
  const dt = new Date(Date.UTC(year, month - 1, day));
  dt.setUTCDate(dt.getUTCDate() + days);
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const d = String(dt.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function calculateDaysBetween(
  startDateStr: string,
  endDateStr: string
): number {
  const startParts = startDateStr.split('-').map(Number);
  const endParts = endDateStr.split('-').map(Number);
  if (
    startParts.length !== 3 ||
    endParts.length !== 3 ||
    startParts.some(Number.isNaN) ||
    endParts.some(Number.isNaN)
  ) {
    return 14;
  }
  const startUtc = Date.UTC(startParts[0], startParts[1] - 1, startParts[2]);
  const endUtc = Date.UTC(endParts[0], endParts[1] - 1, endParts[2]);
  const diffDays = Math.round((endUtc - startUtc) / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays);
}

export function generateBookingTicketCode(
  prefix: 'KTB' | 'KITOB' | 'JOY',
  seedNum?: number
): string {
  const num =
    seedNum !== undefined
      ? (Math.abs(seedNum) % 9000) + 1000
      : Math.floor(1000 + Math.random() * 9000);
  return `TUAF-${prefix}-${num}`;
}

/**
 * Generates a deterministic 21x21 QR-Code Version 1 boolean matrix
 * with standard 7x7 finder patterns in top-left, top-right, and bottom-left,
 * timing patterns, and payload-derived data cells.
 */
export function generateQrMatrix(payload: string, size = 21): boolean[][] {
  const matrix: boolean[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => false)
  );
  const reserved: boolean[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => false)
  );

  const placeFinderPattern = (r0: number, c0: number) => {
    for (let dr = -1; dr <= 7; dr++) {
      for (let dc = -1; dc <= 7; dc++) {
        const r = r0 + dr;
        const c = c0 + dc;
        if (r < 0 || r >= size || c < 0 || c >= size) continue;
        reserved[r][c] = true;
        const isBorder =
          dr >= 0 &&
          dr <= 6 &&
          dc >= 0 &&
          dc <= 6 &&
          (dr === 0 || dr === 6 || dc === 0 || dc === 6);
        const isInner = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
        matrix[r][c] = isBorder || isInner;
      }
    }
  };

  placeFinderPattern(0, 0);
  placeFinderPattern(0, size - 7);
  placeFinderPattern(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    reserved[6][i] = true;
    matrix[6][i] = i % 2 === 0;
    reserved[i][6] = true;
    matrix[i][6] = i % 2 === 0;
  }

  // Deterministic hash stream from payload
  const cleanPayload = payload || 'TUAF-PASS-2026';
  let seed = 2166136261;
  for (let i = 0; i < cleanPayload.length; i++) {
    seed ^= cleanPayload.charCodeAt(i);
    seed = Math.imul(seed, 16777619);
  }

  let step = 1;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (reserved[r][c]) continue;
      const charCode = cleanPayload.charCodeAt(step % cleanPayload.length);
      const val =
        (Math.imul(seed ^ (r * 31 + c * 17 + charCode * step), 2654435761) >>>
          0) %
        10;
      matrix[r][c] = val < 5;
      step++;
    }
  }

  return matrix;
}

export function findReservationsByQuery<
  L extends {
    ticketCode?: string;
    studentName: string;
    studentId: string;
    callNumber: string;
    resourceTitle: { uz: string; ru: string; en: string };
  },
  S extends {
    ticketCode?: string;
    studentName: string;
    studentId: string;
    seatCode: string;
    hallName: { uz: string; ru: string; en: string };
  },
>(
  query: string,
  loans: L[],
  seats: S[]
): { matchedLoans: L[]; matchedSeats: S[] } {
  const q = query.trim().toLowerCase().replace(/^#/, '');
  if (!q) {
    return { matchedLoans: loans, matchedSeats: seats };
  }

  const matchedLoans = loans.filter(
    (l) =>
      (l.ticketCode && l.ticketCode.toLowerCase().includes(q)) ||
      l.studentName.toLowerCase().includes(q) ||
      l.studentId.toLowerCase().includes(q) ||
      l.callNumber.toLowerCase().includes(q) ||
      l.resourceTitle.uz.toLowerCase().includes(q) ||
      l.resourceTitle.ru.toLowerCase().includes(q) ||
      l.resourceTitle.en.toLowerCase().includes(q)
  );

  const matchedSeats = seats.filter(
    (s) =>
      (s.ticketCode && s.ticketCode.toLowerCase().includes(q)) ||
      s.studentName.toLowerCase().includes(q) ||
      s.studentId.toLowerCase().includes(q) ||
      s.seatCode.toLowerCase().includes(q) ||
      s.hallName.uz.toLowerCase().includes(q) ||
      s.hallName.ru.toLowerCase().includes(q) ||
      s.hallName.en.toLowerCase().includes(q)
  );

  return { matchedLoans, matchedSeats };
}

export function quickSearchSpotlight(
  resources: LibraryResource[],
  query: string,
  lang: Language,
  limit = 6
): LibraryResource[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return resources.slice(0, limit);
  }

  const scored = resources
    .map((item) => {
      let score = 0;
      const titleLang = item.title[lang].toLowerCase();
      const titleAll =
        `${item.title.uz} ${item.title.ru} ${item.title.en}`.toLowerCase();
      const authorsStr = item.authors.join(' ').toLowerCase();
      const udcStr = item.udc.toLowerCase();
      const progStr = (item.programCode || '').toLowerCase();
      const kwStr = item.keywords.join(' ').toLowerCase();

      if (titleLang.startsWith(q)) score += 100;
      else if (titleLang.includes(q)) score += 70;
      else if (titleAll.includes(q)) score += 55;

      if (authorsStr.includes(q)) score += 50;
      if (udcStr.includes(q) || progStr.includes(q)) score += 45;
      if (kwStr.includes(q)) score += 30;
      if (item.doi.toLowerCase().includes(q)) score += 40;

      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || b.item.citationsCount - a.item.citationsCount
    );

  return scored.slice(0, limit).map((entry) => entry.item);
}

export function splitChapterIntoSpreadPages(
  chapterContent: string,
  abstractText: string
): { leftPageParagraphs: string[]; rightPageParagraphs: string[] } {
  const cleanChapter = (chapterContent || '').trim();
  const cleanAbstract = (abstractText || '').trim();

  const sentences = cleanChapter
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sentences.length <= 2) {
    return {
      leftPageParagraphs: [cleanChapter],
      rightPageParagraphs: [cleanAbstract || cleanChapter],
    };
  }

  const mid = Math.ceil(sentences.length / 2);
  const firstHalf = sentences.slice(0, mid).join(' ');
  const secondHalf = sentences.slice(mid).join(' ');

  return {
    leftPageParagraphs: [firstHalf],
    rightPageParagraphs: [secondHalf, cleanAbstract].filter(Boolean),
  };
}


