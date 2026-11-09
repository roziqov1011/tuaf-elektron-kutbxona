import { FacultyId } from '../types/library';

export interface StudentBookDebtRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  genre: string;
  callNumber: string;
  borrowedDate: string;
  dueDate: string;
  status: 'reading' | 'overdue' | 'returned';
  daysOverdue: number;
  penaltyAmountUzs: number;
  reminderSent?: boolean;
}

export interface GroupStudentMember {
  id: string;
  fullName: string;
  hemisId: string;
  phone: string;
  courseYear: string;
  activeBooks: StudentBookDebtRecord[];
}

export interface AcademicLibraryGroup {
  id: string;
  groupCode: string;
  programName: string;
  faculty: Exclude<FacultyId, 'all'>;
  courseYear: string;
  tutorName: string;
  totalStudents: number;
  students: GroupStudentMember[];
}

export interface MonthlyCirculationPoint {
  month: string;
  borrowedBooks: number;
  returnedBooks: number;
  overdueCount: number;
}

export const MONTHLY_CIRCULATION_SERIES: MonthlyCirculationPoint[] = [
  { month: 'Jan 26', borrowedBooks: 340, returnedBooks: 310, overdueCount: 12 },
  { month: 'Feb 26', borrowedBooks: 660, returnedBooks: 590, overdueCount: 18 },
  { month: 'Mar 26', borrowedBooks: 710, returnedBooks: 645, overdueCount: 15 },
  { month: 'Apr 26', borrowedBooks: 480, returnedBooks: 455, overdueCount: 9 },
  { month: 'May 26', borrowedBooks: 960, returnedBooks: 870, overdueCount: 24 },
  { month: 'Jun 26', borrowedBooks: 410, returnedBooks: 395, overdueCount: 8 },
  { month: 'Jul 26', borrowedBooks: 320, returnedBooks: 312, overdueCount: 5 },
  { month: 'Aug 26', borrowedBooks: 530, returnedBooks: 490, overdueCount: 11 },
  { month: 'Sep 26', borrowedBooks: 780, returnedBooks: 710, overdueCount: 14 },
  { month: 'Oct 26', borrowedBooks: 845, returnedBooks: 790, overdueCount: 16 },
  { month: 'Nov 26', borrowedBooks: 690, returnedBooks: 640, overdueCount: 11 },
];

export const LIBRARY_GENRE_CATEGORIES = [
  {
    id: 'textbook',
    name: 'Darslik va o‘quv qo‘llanmalar',
    shortName: 'Darsliklar',
    color: '#3B82F6',
    matchTypes: ['book'],
    facultyFilter: null,
    description: 'Bakalavriat va magistratura fanlari bo‘yicha asosiy darsliklar',
  },
  {
    id: 'dissertation',
    name: 'Ilmiy dissertatsiya va monografiyalar',
    shortName: 'Dissertatsiya',
    color: '#8B5CF6',
    matchTypes: ['dissertation'],
    facultyFilter: null,
    description: 'PhD va DSc ilmiy tadqiqot ishlari hamda avtoreferatlar',
  },
  {
    id: 'article',
    name: 'Ilmiy maqola va xalqaro jurnallar',
    shortName: 'Ilmiy maqolalar',
    color: '#10B981',
    matchTypes: ['article'],
    facultyFilter: null,
    description: 'Scopus, Web of Science va OAK ro‘yxatidagi ilmiy maqolalar',
  },
  {
    id: 'manuscript',
    name: 'Oltin meros, tarixiy va badiiy asarlar',
    shortName: 'Oltin meros / Badiiy',
    color: '#F59E0B',
    matchTypes: ['manuscript'],
    facultyFilter: null,
    description: 'Nodir qo‘lyozmalar, Boburiylar merosi va klassik adabiyotlar',
  },
] as const;

export const INITIAL_ACADEMIC_GROUPS: AcademicLibraryGroup[] = [
  {
    id: 'grp-iq-22-01',
    groupCode: 'IQ-22-01',
    programName: 'Iqtisodiyot (tarmoqlar va sohalar bo‘yicha)',
    faculty: 'economics-finance',
    courseYear: '3-kurs',
    tutorName: 'Dots. S. Xolmirzayev',
    totalStudents: 28,
    students: [
      {
        id: 'st-101',
        fullName: 'Karimov Javohir Rustam o‘g‘li',
        hemisId: '395221100412',
        phone: '+998 90 214 55 18',
        courseYear: '3-kurs',
        activeBooks: [
          {
            id: 'debt-1',
            bookId: 'res-econ-1',
            bookTitle: 'Raqamli Iqtisodiyot va Moliya Bozorlari Tahlili',
            genre: 'Darslik va o‘quv qo‘llanma',
            callNumber: '336.71(575.1) K-24',
            borrowedDate: '2026-10-08',
            dueDate: '2026-10-22',
            status: 'overdue',
            daysOverdue: 17,
            penaltyAmountUzs: 25500,
          },
          {
            id: 'debt-2',
            bookId: 'res-econ-2',
            bookTitle: 'Xalqaro Moliya Standartlari va Bank Auditi',
            genre: 'Ilmiy monografiya',
            callNumber: '657.6(575.1) M-19',
            borrowedDate: '2026-11-01',
            dueDate: '2026-11-15',
            status: 'reading',
            daysOverdue: 0,
            penaltyAmountUzs: 0,
          },
        ],
      },
      {
        id: 'st-102',
        fullName: 'Olimova Mohinur Farhod qizi',
        hemisId: '395221100428',
        phone: '+998 91 482 19 04',
        courseYear: '3-kurs',
        activeBooks: [
          {
            id: 'debt-3',
            bookId: 'res-econ-1',
            bookTitle: 'Makroiqtisodiy Barqarorlik va Investitsiya Siyosati',
            genre: 'Darslik va o‘quv qo‘llanma',
            callNumber: '330.101.541 O-41',
            borrowedDate: '2026-11-02',
            dueDate: '2026-11-16',
            status: 'reading',
            daysOverdue: 0,
            penaltyAmountUzs: 0,
          },
        ],
      },
      {
        id: 'st-103',
        fullName: 'Tursunov Bekzod Shuhrat o‘g‘li',
        hemisId: '395221100455',
        phone: '+998 93 711 80 22',
        courseYear: '3-kurs',
        activeBooks: [
          {
            id: 'debt-4',
            bookId: 'res-ai-1',
            bookTitle: 'Ekonometrika va Statistik Tahlil Asoslari',
            genre: 'Darslik va o‘quv qo‘llanma',
            callNumber: '330.43 T-88',
            borrowedDate: '2026-10-15',
            dueDate: '2026-10-29',
            status: 'overdue',
            daysOverdue: 10,
            penaltyAmountUzs: 15000,
          },
        ],
      },
      {
        id: 'st-104',
        fullName: 'Abdurahmonova Dilnoza Anvar qizi',
        hemisId: '395221100479',
        phone: '+998 99 305 64 11',
        courseYear: '3-kurs',
        activeBooks: [],
      },
    ],
  },
  {
    id: 'grp-bm-23-02',
    groupCode: 'BM-23-02',
    programName: 'Bank ishi, moliya va buxgalteriya hisobi',
    faculty: 'economics-finance',
    courseYear: '2-kurs',
    tutorName: 'Katta o‘qit. N. Yusupova',
    totalStudents: 26,
    students: [
      {
        id: 'st-201',
        fullName: 'Yoqubov Sardorbek Ulug‘bek o‘g‘li',
        hemisId: '395231100811',
        phone: '+998 90 540 12 77',
        courseYear: '2-kurs',
        activeBooks: [
          {
            id: 'debt-5',
            bookId: 'res-econ-2',
            bookTitle: 'Tijorat Banklarida Kredit Risklarini Boshqarish',
            genre: 'Darslik va o‘quv qo‘llanma',
            callNumber: '336.717 Y-71',
            borrowedDate: '2026-10-12',
            dueDate: '2026-10-26',
            status: 'overdue',
            daysOverdue: 13,
            penaltyAmountUzs: 19500,
          },
        ],
      },
      {
        id: 'st-202',
        fullName: 'Ergasheva Sevinch Komil qizi',
        hemisId: '395231100834',
        phone: '+998 94 118 90 33',
        courseYear: '2-kurs',
        activeBooks: [
          {
            id: 'debt-6',
            bookId: 'res-econ-1',
            bookTitle: 'Moliyaviy Hisobotning Xalqaro Standartlari (MHXS)',
            genre: 'Darslik va o‘quv qo‘llanma',
            callNumber: '657.1 E-64',
            borrowedDate: '2026-11-04',
            dueDate: '2026-11-18',
            status: 'reading',
            daysOverdue: 0,
            penaltyAmountUzs: 0,
          },
        ],
      },
      {
        id: 'st-203',
        fullName: 'Qosimov Dostonbek Bahodir o‘g‘li',
        hemisId: '395231100859',
        phone: '+998 97 230 44 10',
        courseYear: '2-kurs',
        activeBooks: [],
      },
    ],
  },
  {
    id: 'grp-at-24-01',
    groupCode: 'AT-24-01',
    programName: 'Axborot tizimlari va sun’iy intellekt muhandisligi',
    faculty: 'digital-innovation',
    courseYear: '2-kurs',
    tutorName: 'PhD A. Nurmatov',
    totalStudents: 30,
    students: [
      {
        id: 'st-301',
        fullName: 'Mirzayev Asadbek Akmal o‘g‘li',
        hemisId: '395241200105',
        phone: '+998 90 129 88 45',
        courseYear: '2-kurs',
        activeBooks: [
          {
            id: 'debt-7',
            bookId: 'res-ai-1',
            bookTitle: 'Sun’iy Intellekt Algoritmlari va Chuqur O‘rganish (Deep Learning)',
            genre: 'Darslik va o‘quv qo‘llanma',
            callNumber: '004.89 M-54',
            borrowedDate: '2026-10-05',
            dueDate: '2026-10-19',
            status: 'overdue',
            daysOverdue: 20,
            penaltyAmountUzs: 30000,
          },
        ],
      },
      {
        id: 'st-302',
        fullName: 'Saidova Madinabonu Otabek qizi',
        hemisId: '395241200119',
        phone: '+998 93 644 71 20',
        courseYear: '2-kurs',
        activeBooks: [
          {
            id: 'debt-8',
            bookId: 'res-ai-2',
            bookTitle: 'Ma’lumotlar Tuzilmasi va Zamonaviy Python Dasturlash',
            genre: 'Darslik va o‘quv qo‘llanma',
            callNumber: '004.438 S-18',
            borrowedDate: '2026-11-03',
            dueDate: '2026-11-17',
            status: 'reading',
            daysOverdue: 0,
            penaltyAmountUzs: 0,
          },
        ],
      },
      {
        id: 'st-303',
        fullName: 'Xoliqov Abdulloh Jamshid o‘g‘li',
        hemisId: '395241200142',
        phone: '+998 91 602 15 99',
        courseYear: '2-kurs',
        activeBooks: [
          {
            id: 'debt-9',
            bookId: 'res-ai-1',
            bookTitle: 'Kiberxavfsizlik va Tarmoq Arxitekturasi',
            genre: 'Ilmiy monografiya',
            callNumber: '004.056 X-73',
            borrowedDate: '2026-10-18',
            dueDate: '2026-11-01',
            status: 'overdue',
            daysOverdue: 7,
            penaltyAmountUzs: 10500,
          },
        ],
      },
    ],
  },
  {
    id: 'grp-xt-22-04',
    groupCode: 'XT-22-04',
    programName: 'Xorijiy til va adabiyoti (Ingliz tili va IELTS)',
    faculty: 'pedagogy-languages',
    courseYear: '3-kurs',
    tutorName: 'Dots. G. Mahmudova',
    totalStudents: 25,
    students: [
      {
        id: 'st-401',
        fullName: 'usmonova Rayhona Davron qizi',
        hemisId: '395221300304',
        phone: '+998 99 815 32 60',
        courseYear: '3-kurs',
        activeBooks: [
          {
            id: 'debt-10',
            bookId: 'res-lang-1',
            bookTitle: 'Academic Writing & Advanced C1/C2 Lexical Resource',
            genre: 'Darslik va o‘quv qo‘llanma',
            callNumber: '811.111 U-82',
            borrowedDate: '2026-11-01',
            dueDate: '2026-11-15',
            status: 'reading',
            daysOverdue: 0,
            penaltyAmountUzs: 0,
          },
        ],
      },
      {
        id: 'st-402',
        fullName: 'Nazarov Shoxrux Bozorboy o‘g‘li',
        hemisId: '395221300318',
        phone: '+998 90 388 41 07',
        courseYear: '3-kurs',
        activeBooks: [
          {
            id: 'debt-11',
            bookId: 'res-lang-2',
            bookTitle: 'Qiyosiy Tilshunoslik va Tarjima Nazariyasi',
            genre: 'Ilmiy dissertatsiya va monografiyalar',
            callNumber: '81’25 N-31',
            borrowedDate: '2026-10-14',
            dueDate: '2026-10-28',
            status: 'overdue',
            daysOverdue: 11,
            penaltyAmountUzs: 16500,
          },
        ],
      },
    ],
  },
  {
    id: 'grp-pb-23-01',
    groupCode: 'PB-23-01',
    programName: 'Pedagogika va psixologiya (Boshlang‘ich ta’lim)',
    faculty: 'pedagogy-languages',
    courseYear: '2-kurs',
    tutorName: 'PhD M. Tojiboyeva',
    totalStudents: 27,
    students: [
      {
        id: 'st-501',
        fullName: 'Rahmonova Zilola Sobir qizi',
        hemisId: '395231400512',
        phone: '+998 91 290 73 45',
        courseYear: '2-kurs',
        activeBooks: [
          {
            id: 'debt-12',
            bookId: 'res-ped-1',
            bookTitle: 'Zamonaviy Pedagogik Texnologiyalar va STEAM Ta’lim',
            genre: 'Darslik va o‘quv qo‘llanma',
            callNumber: '37.013 R-19',
            borrowedDate: '2026-11-05',
            dueDate: '2026-11-19',
            status: 'reading',
            daysOverdue: 0,
            penaltyAmountUzs: 0,
          },
        ],
      },
      {
        id: 'st-502',
        fullName: 'Hamdamov Umidjon Ne’mat o‘g‘li',
        hemisId: '395231400540',
        phone: '+998 93 412 09 88',
        courseYear: '2-kurs',
        activeBooks: [],
      },
    ],
  },
  {
    id: 'grp-tr-21-03',
    groupCode: 'TR-21-03',
    programName: 'Tarix, sharqshunoslik va madaniy meros',
    faculty: 'humanities-social',
    courseYear: '4-kurs',
    tutorName: 'Prof. H. Bobobekov',
    totalStudents: 24,
    students: [
      {
        id: 'st-601',
        fullName: 'Sultonov Boburmirzo Alisher o‘g‘li',
        hemisId: '395211500201',
        phone: '+998 94 505 17 29',
        courseYear: '4-kurs',
        activeBooks: [
          {
            id: 'debt-13',
            bookId: 'res-hist-1',
            bookTitle: 'Boburnoma: Farg‘ona va Andijon Tarixi Qo‘lyozmalar Tahlili',
            genre: 'Oltin meros, tarixiy va badiiy asarlar',
            callNumber: '94(575.1) B-72',
            borrowedDate: '2026-10-10',
            dueDate: '2026-10-24',
            status: 'overdue',
            daysOverdue: 15,
            penaltyAmountUzs: 22500,
          },
        ],
      },
      {
        id: 'st-602',
        fullName: 'Jalilova Gulruhsor Shuhrat qizi',
        hemisId: '395211500224',
        phone: '+998 97 912 66 03',
        courseYear: '4-kurs',
        activeBooks: [
          {
            id: 'debt-14',
            bookId: 'res-hist-2',
            bookTitle: 'Markaziy Osiyo Uyg‘onish Davri Ilmiy Merosi',
            genre: 'Oltin meros, tarixiy va badiiy asarlar',
            callNumber: '930.85 J-21',
            borrowedDate: '2026-11-04',
            dueDate: '2026-11-18',
            status: 'reading',
            daysOverdue: 0,
            penaltyAmountUzs: 0,
          },
        ],
      },
    ],
  },
];
