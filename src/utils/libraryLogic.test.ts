import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addDaysToDateString,
  calculateDaysBetween,
  calculateHallOccupancy,
  filterCatalogItems,
  findReservationsByQuery,
  generateBookingTicketCode,
  generateCitation,
  generateQrMatrix,
  quickSearchSpotlight,
  splitChapterIntoSpreadPages,
  validateNewResourceForm,
} from './libraryLogic';
import {
  INITIAL_BOOK_LOANS,
  INITIAL_LIBRARY_RESOURCES,
  INITIAL_READING_ROOM_SEATS,
  INITIAL_SEAT_RESERVATIONS,
} from '../data/seedLibraryData';

test('filterCatalogItems finds TUAF resource by DOI, program code (60410600), or multilingual title', () => {
  const baseFilters = {
    query: '10.1093/tuaf/econ.2026.001',
    faculty: 'all' as const,
    programCode: 'all',
    type: 'all' as const,
    language: 'all',
    openAccessOnly: false,
    peerReviewedOnly: false,
    yearFrom: 1900,
    yearTo: 2026,
    sortBy: 'relevance' as const,
  };

  const byDoi = filterCatalogItems(INITIAL_LIBRARY_RESOURCES, baseFilters, 'uz');
  assert.equal(byDoi.length, 1);
  assert.equal(byDoi[0].id, 'tuaf-omonov-banking-monograph');

  const byProgramCode = filterCatalogItems(
    INITIAL_LIBRARY_RESOURCES,
    { ...baseFilters, query: '', programCode: '70230101-EN' },
    'uz'
  );
  assert.equal(byProgramCode.length, 1);
  assert.equal(byProgramCode[0].id, 'tuaf-dsc-linguistics-corpora');

  const byRussianTitle = filterCatalogItems(
    INITIAL_LIBRARY_RESOURCES,
    { ...baseFilters, query: 'корпусная лингвистика' },
    'ru'
  );
  assert.equal(byRussianTitle.length, 1);
  assert.equal(byRussianTitle[0].id, 'tuaf-dsc-linguistics-corpora');
});

test('filterCatalogItems filters by dissertation type and sorts by citations descending', () => {
  const dissertations = filterCatalogItems(
    INITIAL_LIBRARY_RESOURCES,
    {
      query: '',
      faculty: 'all',
      programCode: 'all',
      type: 'dissertation',
      language: 'all',
      openAccessOnly: false,
      peerReviewedOnly: false,
      yearFrom: 2020,
      yearTo: 2026,
      sortBy: 'citations-desc',
    },
    'uz'
  );

  assert.equal(dissertations.length, 2);
  assert.ok(dissertations[0].citationsCount >= dissertations[1].citationsCount);
});

test('generateCitation produces valid APA, IEEE, GOST, and BibTeX formats for TUAF resources', () => {
  const item = INITIAL_LIBRARY_RESOURCES[0];
  const apa = generateCitation(item, 'APA', 'en');
  assert.ok(apa.includes('https://doi.org/10.1093/tuaf/econ.2026.001'));
  assert.ok(apa.includes('(2026)'));

  const gost = generateCitation(item, 'GOST', 'ru');
  assert.ok(gost.includes('УДК 336.71:338.24(575.1)'));

  const bibtex = generateCitation(item, 'BIBTEX', 'en');
  assert.ok(bibtex.startsWith('@book{'));
  assert.ok(bibtex.includes('doi = {10.1093/tuaf/econ.2026.001}'));
});

test('calculateHallOccupancy accurately counts available, occupied, and user-reserved seats', () => {
  const stats = calculateHallOccupancy(
    INITIAL_READING_ROOM_SEATS,
    INITIAL_SEAT_RESERVATIONS,
    'main-bodleian'
  );
  assert.equal(stats.total, 12);
  assert.equal(stats.reservedByUser, 1);
  assert.equal(stats.available + stats.occupied + stats.reservedByUser, 12);
});

test('validateNewResourceForm rejects invalid DOI or short title and accepts valid TUAF input', () => {
  const invalidDoi = validateNewResourceForm({
    title: 'Bank ishi va xalqaro moliya standartlari',
    authors: 'Prof. A. Omonov',
    doi: 'invalid-doi',
    isbn: '978-9943-00-111-2',
    udc: '60410600',
    year: '2026',
    type: 'book',
    faculty: 'economics-finance',
    language: 'O‘zbek',
    pages: '320',
    publisher: 'TUAF Academic Press',
    abstract: 'Turon universiteti Andijon filiali talabalari uchun yangi o‘quv qo‘llanma.',
    chapterContent: 'Chapter 1 full text.',
    openAccess: true,
    peerReviewed: true,
  });
  assert.equal(invalidDoi.valid, false);
  assert.equal(invalidDoi.errorKey, 'doi');

  const valid = validateNewResourceForm({
    title: 'Bank ishi va xalqaro moliya standartlari',
    authors: 'Prof. A. Omonov',
    doi: '10.1093/tuaf/2026.99',
    isbn: '978-9943-00-111-2',
    udc: '60410600',
    year: '2026',
    type: 'book',
    faculty: 'economics-finance',
    language: 'O‘zbek',
    pages: '320',
    publisher: 'TUAF Academic Press',
    abstract: 'Turon universiteti Andijon filiali talabalari uchun yangi o‘quv qo‘llanma.',
    chapterContent: 'Chapter 1 full text.',
    openAccess: true,
    peerReviewed: true,
  });
  assert.equal(valid.valid, true);
});

test('addDaysToDateString, calculateDaysBetween, and generateBookingTicketCode handle loan duration math accurately', () => {
  assert.equal(addDaysToDateString('2026-11-08', 3), '2026-11-11');
  assert.equal(addDaysToDateString('2026-11-08', 7), '2026-11-15');
  assert.equal(addDaysToDateString('2026-11-08', 14), '2026-11-22');
  assert.equal(addDaysToDateString('2026-11-08', 30), '2026-12-08');

  assert.equal(calculateDaysBetween('2026-11-08', '2026-11-22'), 14);
  assert.equal(calculateDaysBetween('2026-11-08', '2026-12-08'), 30);

  const bookTicket = generateBookingTicketCode('KTB', 123456);
  assert.equal(bookTicket, 'TUAF-KTB-7456');

  const seatTicket = generateBookingTicketCode('JOY', 9900);
  assert.equal(seatTicket, 'TUAF-JOY-1900');
});

test('generateQrMatrix builds valid 21x21 QR finder patterns and findReservationsByQuery matches ticket codes', () => {
  const matrix = generateQrMatrix('TUAF-KTB-4821', 21);
  assert.equal(matrix.length, 21);
  assert.equal(matrix[0].length, 21);
  // Top-left finder corner outer border and inner center must be true
  assert.equal(matrix[0][0], true);
  assert.equal(matrix[3][3], true);
  // Top-right finder corner
  assert.equal(matrix[0][20], true);
  // Bottom-left finder corner
  assert.equal(matrix[20][0], true);

  const byTicket = findReservationsByQuery(
    '#TUAF-KTB-4821',
    INITIAL_BOOK_LOANS,
    INITIAL_SEAT_RESERVATIONS
  );
  assert.equal(byTicket.matchedLoans.length, 1);
  assert.equal(byTicket.matchedLoans[0].id, 'tuaf-loan-201');
  assert.equal(byTicket.matchedSeats.length, 0);

  const bySeatTicket = findReservationsByQuery(
    'TUAF-JOY-1108',
    INITIAL_BOOK_LOANS,
    INITIAL_SEAT_RESERVATIONS
  );
  assert.equal(bySeatTicket.matchedSeats.length, 1);
  assert.equal(bySeatTicket.matchedSeats[0].seatCode, 'A-03');
});

test('quickSearchSpotlight ranks matching resources by title, author, and UDC and splitChapterIntoSpreadPages splits text cleanly', () => {
  const matches = quickSearchSpotlight(INITIAL_LIBRARY_RESOURCES, 'Omonov', 'uz', 4);
  assert.ok(matches.length >= 1);
  assert.equal(matches[0].id, 'tuaf-omonov-banking-monograph');

  const spread = splitChapterIntoSpreadPages(
    'Birinchi jumla bank tizimi haqida. Ikkinchi jumla pul-kredit siyosatini yoritadi. Uchinchi jumla xalqaro standartlarni tahlil qiladi. To‘rtinchi jumla xulosani beradi.',
    'Annotatsiya matni.'
  );
  assert.equal(spread.leftPageParagraphs.length, 1);
  assert.equal(spread.rightPageParagraphs.length, 2);
  assert.ok(spread.leftPageParagraphs[0].includes('Birinchi jumla'));
  assert.ok(spread.rightPageParagraphs[0].includes('Uchinchi jumla'));
});



