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
