export type Language = 'uz' | 'en' | 'ru';

export type ResourceType = 'book' | 'dissertation' | 'article' | 'manuscript';

export type FacultyId =
  | 'all'
  | 'economics-finance'
  | 'pedagogy-languages'
  | 'natural-exact-sciences'
  | 'humanities-social'
  | 'digital-innovation';

export type AcademicDegree = 'PhD' | 'DSc' | 'Master' | 'Monograph';

export interface LocalizedText {
  uz: string;
  en: string;
  ru: string;
}

export interface TuafProgram {
  code: string;
  level: 'bachelor' | 'master';
  durationYears: number;
  department: Exclude<FacultyId, 'all'>;
  name: LocalizedText;
}

export interface BookChapter {
  number: number;
  title: LocalizedText;
  pageStart: number;
  content: LocalizedText;
}

export interface LibraryResource {
  id: string;
  title: LocalizedText;
  subtitle?: LocalizedText;
  authors: string[];
  year: number;
  type: ResourceType;
  faculty: Exclude<FacultyId, 'all'>;
  programCode?: string;
  isbn?: string;
  doi: string;
  udc: string;
  orcid?: string;
  language: 'O‘zbek' | 'English' | 'Русский' | 'Arab / Fors (Transkripsiya)';
  pages: number;
  citationsCount: number;
  downloadsCount: number;
  openAccess: boolean;
  peerReviewed: boolean;
  publisher: string;
  degree?: AcademicDegree;
  supervisor?: string;
  defenseDate?: string;
  coverImage?: string;
  pdfUrl?: string;
  spineColor: string;
  availableCopies: number;
  totalCopies: number;
  abstract: LocalizedText;
  keywords: string[];
  chapters: BookChapter[];
  featuredRank?: 'lead' | 'secondary' | 'standard';
}

export interface LectureChapter {
  time: string;
  seconds: number;
  title: LocalizedText;
}

export interface MediaLecture {
  id: string;
  title: LocalizedText;
  professor: string;
  professorTitle: LocalizedText;
  faculty: Exclude<FacultyId, 'all'>;
  mediaType: 'video' | 'audio';
  duration: string;
  durationSeconds: number;
  year: number;
  viewsCount: number;
  courseCode: string;
  thumbnailUrl?: string;
  summary: LocalizedText;
  transcript: LocalizedText;
  chapters: LectureChapter[];
}

export type HallId =
  | 'main-bodleian'
  | 'stem-silent'
  | 'digital-media-pod'
  | 'rare-manuscripts';

export interface ReadingRoomSeat {
  id: string;
  hallId: HallId;
  seatCode: string;
  row: number;
  col: number;
  zoneLabel: string;
  features: ('monitor' | 'power' | 'lamp' | 'magnifier' | 'lan')[];
  defaultStatus: 'available' | 'occupied';
}

export type LoanDurationDays = 3 | 7 | 14 | 30;
export type LoanDeliveryFormat =
  | 'physical-pickup'
  | 'reading-hall-desk'
  | 'digital-license';

export interface SeatReservation {
  id: string;
  seatId: string;
  seatCode: string;
  hallId: HallId;
  hallName: LocalizedText;
  studentName: string;
  studentId: string;
  date: string;
  timeSlot: string;
  durationHours?: string;
  ticketCode?: string;
  purpose: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface BookLoanReservation {
  id: string;
  resourceId: string;
  resourceTitle: LocalizedText;
  authors: string[];
  callNumber: string;
  studentName: string;
  studentId: string;
  pickupDate: string;
  dueDate: string;
  durationDays?: number;
  ticketCode?: string;
  pickupLocation?: string;
  note?: string;
  format: LoanDeliveryFormat;
  status: 'active' | 'ready-for-pickup' | 'returned';
}

export interface PersonalNote {
  id: string;
  resourceId: string;
  resourceTitle: LocalizedText;
  chapterNumber: number;
  text: string;
  createdAt: string;
}

export type CitationFormat =
  | 'APA'
  | 'MLA'
  | 'IEEE'
  | 'HARVARD'
  | 'GOST'
  | 'BIBTEX';

export interface CatalogFilterState {
  query: string;
  faculty: FacultyId;
  programCode: string;
  type: ResourceType | 'all';
  language: string;
  openAccessOnly: boolean;
  peerReviewedOnly: boolean;
  yearFrom: number;
  yearTo: number;
  sortBy: 'relevance' | 'citations-desc' | 'year-desc' | 'title-asc';
}

export interface StudentProfile {
  id: string;
  fullName: string;
  hemisId: string;
  email: string;
  programCode: string;
  programName: string;
  courseYear: string;
  faculty: Exclude<FacultyId, 'all'>;
  avatarInitials: string;
  loginMethod: 'hemis' | 'email' | 'sso';
  lastLoginAt: string;
}

export type QrPassTicketItem =
  | { kind: 'book'; loan: BookLoanReservation }
  | { kind: 'seat'; seat: SeatReservation };

export interface AdminStaffProfile {
  id: string;
  fullName: string;
  roleTitle: string;
  staffId: string;
  email: string;
  department: string;
}


