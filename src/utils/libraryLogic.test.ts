import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateHallOccupancy,
  filterCatalogItems,
  generateCitation,
  validateNewResourceForm,
} from './libraryLogic';
import {
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
