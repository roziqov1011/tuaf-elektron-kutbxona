import {
  BookLoanReservation,
  HallId,
  LibraryResource,
  LocalizedText,
  MediaLecture,
  PersonalNote,
  ReadingRoomSeat,
  SeatReservation,
  TuafProgram,
} from '../types/library';

export const HERO_LIBRARY_IMAGE =
  '/src/assets/images/hero_bodleian_library_1794023842146.jpg';
export const COVER_QUANTUM_IMAGE =
  '/src/assets/images/cover_quantum_monograph_1794023843077.jpg';
export const COVER_SAMARKAND_IMAGE =
  '/src/assets/images/cover_samarkand_manuscript_1794023843824.jpg';
export const LECTURE_SYMPOSIUM_IMAGE =
  '/src/assets/images/lecture_hall_symposium_1794023844213.jpg';

// Official video & brand assets extracted from https://tuaf.vercel.app
export const TUAF_HERO_VIDEO_EMBED_URL =
  'https://www.youtube.com/embed/qtT53xBE3_A?autoplay=1&mute=1&loop=1&playlist=qtT53xBE3_A&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3';
export const TUAF_HERO_VIDEO_MODAL_URL =
  'https://www.youtube.com/embed/qtT53xBE3_A?autoplay=1&rel=0&modestbranding=1';
export const TUAF_HERO_VIDEO_POSTER =
  '/src/assets/images/tuaf_video_poster.jpg';
export const TUAF_OFFICIAL_LOGO =
  '/src/assets/images/tuaf_official_logo.png';

export const TUAF_OFFICIAL_PROGRAMS: TuafProgram[] = [
  // 12 Bachelor Programs from tuaf.uz
  {
    code: '60410600',
    level: 'bachelor',
    durationYears: 4,
    department: 'economics-finance',
    name: {
      uz: 'Bank ishi',
      en: 'Banking & Finance',
      ru: 'Банковское дело',
    },
  },
  {
    code: '60410200',
    level: 'bachelor',
    durationYears: 4,
    department: 'economics-finance',
    name: {
      uz: 'Buxgalteriya hisobi',
      en: 'Accounting & Audit',
      ru: 'Бухгалтерский учет',
    },
  },
  {
    code: '60410100',
    level: 'bachelor',
    durationYears: 4,
    department: 'economics-finance',
    name: {
      uz: 'Iqtisodiyot',
      en: 'Economics',
      ru: 'Экономика',
    },
  },
  {
    code: '60230100-EN',
    level: 'bachelor',
    durationYears: 4,
    department: 'pedagogy-languages',
    name: {
      uz: 'Filologiya: ingliz tili',
      en: 'Philology: English Language',
      ru: 'Филология: английский язык',
    },
  },
  {
    code: '60230100-UZ',
    level: 'bachelor',
    durationYears: 4,
    department: 'pedagogy-languages',
    name: {
      uz: 'Filologiya: o‘zbek tili',
      en: 'Philology: Uzbek Language',
      ru: 'Филология: узбекский язык',
    },
  },
  {
    code: '60230100-RU',
    level: 'bachelor',
    durationYears: 4,
    department: 'pedagogy-languages',
    name: {
      uz: 'Filologiya: rus tili',
      en: 'Philology: Russian Language',
      ru: 'Филология: русский язык',
    },
  },
  {
    code: '60510100',
    level: 'bachelor',
    durationYears: 4,
    department: 'natural-exact-sciences',
    name: {
      uz: 'Biologiya',
      en: 'Biology',
      ru: 'Биология',
    },
  },
  {
    code: '60530100',
    level: 'bachelor',
    durationYears: 4,
    department: 'natural-exact-sciences',
    name: {
      uz: 'Kimyo',
      en: 'Chemistry',
      ru: 'Химия',
    },
  },
  {
    code: '60530200',
    level: 'bachelor',
    durationYears: 4,
    department: 'natural-exact-sciences',
    name: {
      uz: 'Geografiya',
      en: 'Geography',
      ru: 'География',
    },
  },
  {
    code: '60310300',
    level: 'bachelor',
    durationYears: 4,
    department: 'humanities-social',
    name: {
      uz: 'Psixologiya',
      en: 'Psychology',
      ru: 'Психология',
    },
  },
  {
    code: '60220300',
    level: 'bachelor',
    durationYears: 4,
    department: 'humanities-social',
    name: {
      uz: 'Tarix',
      en: 'History',
      ru: 'История',
    },
  },
  {
    code: '60310200',
    level: 'bachelor',
    durationYears: 4,
    department: 'humanities-social',
    name: {
      uz: 'Xalqaro munosabatlar',
      en: 'International Relations',
      ru: 'Международные отношения',
    },
  },

  // 8 Master's Programs from tuaf.uz
  {
    code: '70410102',
    level: 'master',
    durationYears: 2,
    department: 'economics-finance',
    name: {
      uz: 'Iqtisodiyot',
      en: 'Economics',
      ru: 'Экономика',
    },
  },
  {
    code: '70230101-EN',
    level: 'master',
    durationYears: 2,
    department: 'pedagogy-languages',
    name: {
      uz: 'Lingvistika: ingliz tili',
      en: 'Linguistics: English',
      ru: 'Лингвистика: английский язык',
    },
  },
  {
    code: '70230101-UZ',
    level: 'master',
    durationYears: 2,
    department: 'pedagogy-languages',
    name: {
      uz: 'Lingvistika: o‘zbek tili',
      en: 'Linguistics: Uzbek',
      ru: 'Лингвистика: узбекский язык',
    },
  },
  {
    code: '70230101-RU',
    level: 'master',
    durationYears: 2,
    department: 'pedagogy-languages',
    name: {
      uz: 'Lingvistika: rus tili',
      en: 'Linguistics: Russian',
      ru: 'Лингвистика: русский язык',
    },
  },
  {
    code: '70230104',
    level: 'master',
    durationYears: 2,
    department: 'pedagogy-languages',
    name: {
      uz: 'Adabiyotshunoslik',
      en: 'Literary Studies',
      ru: 'Литературоведение',
    },
  },
  {
    code: '70110101',
    level: 'master',
    durationYears: 2,
    department: 'pedagogy-languages',
    name: {
      uz: 'Pedagogika nazariyasi va tarixi',
      en: 'Theory & History of Pedagogy',
      ru: 'Теория и история педагогики',
    },
  },
  {
    code: '70510101',
    level: 'master',
    durationYears: 2,
    department: 'natural-exact-sciences',
    name: {
      uz: 'Biologiya',
      en: 'Biology',
      ru: 'Биология',
    },
  },
  {
    code: '70220301',
    level: 'master',
    durationYears: 2,
    department: 'humanities-social',
    name: {
      uz: 'Tarix',
      en: 'History',
      ru: 'История',
    },
  },
];

export const INITIAL_LIBRARY_RESOURCES: LibraryResource[] = [
  {
    id: 'tuaf-omonov-banking-monograph',
    title: {
      uz: 'Zamonaviy Bank Ishi, Raqamli Moliya Arxitekturasi va Mintaqaviy Barqaror Iqtisodiy O‘sish',
      en: 'Modern Banking, Digital Financial Architecture & Sustainable Regional Economic Growth',
      ru: 'Современное банковское дело, цифровая финансовая архитектура и устойчивый экономический рост',
    },
    subtitle: {
      uz: 'Turon universiteti Andijon filiali Iqtisodiyot (60410100, 70410102) va Bank ishi (60410600) yo‘nalishlari uchun fundamental monografiya va darslik',
      en: 'Foundational Monograph & Textbook for Banking (60410600) and Economics (60410100, 70410102) at Turon University Andijan Branch',
      ru: 'Фундаментальная монография и учебник для направлений Банковское дело (60410600) и Экономика (70410102) TUAF',
    },
    authors: ['Prof. A. Omonov (TUAF Direktori)', 'Dots. B. Xoliqov'],
    year: 2026,
    type: 'book',
    faculty: 'economics-finance',
    programCode: '60410600',
    isbn: '978-9943-89-410-2',
    doi: '10.1093/tuaf/econ.2026.001',
    udc: '336.71:338.24(575.1)',
    orcid: '0000-0002-8491-302X',
    language: 'O‘zbek',
    pages: 524,
    citationsCount: 318,
    downloadsCount: 7420,
    openAccess: true,
    peerReviewed: true,
    publisher: 'Turon University Andijon Filiali Nashriyoti (TUAF Academic Press)',
    degree: 'Monograph',
    coverImage: COVER_QUANTUM_IMAGE,
    spineColor: '#0F2342',
    availableCopies: 18,
    totalCopies: 20,
    featuredRank: 'lead',
    abstract: {
      uz: 'Turon universiteti Andijon filiali direktori, professor A. Omonov rahbarligida tayyorlangan ushbu fundamental monografiyada tijorat banklarining kapitallashuv darajasini oshirish, Bazel III/IV xalqaro likvidlik mezonlari, xalqaro moliya hisobotlari standartlari (IFRS) hamda Farg‘ona vodiysida investitsion loyihalarni moliyalashtirish mexanizmlari chuqur tahlil qilingan.',
      en: 'Authored under the leadership of Professor A. Omonov, Director of Turon University Andijan Branch, this treatise examines commercial bank capitalization, Basel III/IV liquidity ratios, IFRS integration, and green investment financing across the Fergana Valley.',
      ru: 'Фундаментальный труд под руководством директора Андижанского филиала Университета Турон профессора А. Омонова посвящен капитализации коммерческих банков, стандартам Базель III/IV и финансированию инвестиционных проектов.',
    },
    keywords: ['Bank ishi 60410600', 'Iqtisodiyot 70410102', 'Buxgalteriya 60410200', 'Basel III', 'TUAF'],
    chapters: [
      {
        number: 1,
        title: {
          uz: 'I Bob. Markaziy bank pul-kredit siyosati va tijorat banklari likvidligini boshqarish',
          en: 'Chapter I. Monetary Policy Transmission and Commercial Bank Liquidity Governance',
          ru: 'Глава I. Денежно-кредитная политика и управление ликвидностью коммерческих банков',
        },
        pageStart: 12,
        content: {
          uz: 'Zamonaviy moliya bozorida bank tizimining barqarorligi aktivlar sifati va kapital yetarliligi koeffitsiyenti (CAR >= 13%) bilan belgilanadi. Turon universiteti Andijon filialining Iqtisodiyot va moliya kafedrasida olib borilgan empirik tadqiqotlar shuni ko‘rsatadiki, raqamli skoring va FinTech ekotizimlarini joriy etish operatsion xarajatlarni 28.4% ga qisqartiradi.',
          en: 'Financial stability in modern banking hinges on asset quality and Capital Adequacy Ratios (CAR >= 13%). Empirical studies conducted at the Department of Economics and Finance of Turon University Andijan Branch demonstrate that algorithmic credit scoring reduces operational risk exposure by 28.4%.',
          ru: 'Устойчивость банковской системы определяется качеством активов и коэффициентом достаточности капитала. Исследования кафедры экономики и финансов Андижанского филиала Университета Турон подтверждают снижение операционных издержек на 28,4% при внедрении цифрового скоринга.',
        },
      },
      {
        number: 2,
        title: {
          uz: 'II Bob. Xalqaro moliyaviy hisobot standartlari (MHXS / IFRS) va Buxgalteriya hisobi (60410200)',
          en: 'Chapter II. International Financial Reporting Standards (IFRS 9) & Corporate Accounting',
          ru: 'Глава II. Международные стандарты финансовой отчетности (МСФО 9) и бухгалтерский учет',
        },
        pageStart: 164,
        content: {
          uz: 'Buxgalteriya hisobi (60410200) yo‘nalishi talabalari uchun ushbu bobda moliyaviy instrumentlarni IFRS 9 standarti bo‘yicha tasniflash va kutilayotgan kredit yo‘qotishlari (ECL) rezervini matematik modellashtirish amaliy misollar bilan yoritilgan.',
          en: 'Designed for Accounting (60410200) students, this chapter details IFRS 9 classification of financial instruments and mathematical modeling of Expected Credit Loss (ECL) provisions.',
          ru: 'Для студентов направления Бухгалтерский учет (60410200) подробно изложена классификация финансовых инструментов по МСФО 9 и расчет резервов под ожидаемые кредитные убытки.',
        },
      },
    ],
  },
  {
    id: 'tuaf-babur-andijan-heritage',
    title: {
      uz: 'Zahiriddin Muhammad Bobur va Andijon Adabiy-Tarixiy Maktabi: "Boburnoma"ning Lingvopoetik va Manbashunoslik Tadqiqi',
      en: 'Zahiriddin Muhammad Babur & The Andijan Literary-Historical School: Linguopoetic and Source Study of the Baburnama',
      ru: 'Захириддин Мухаммад Бабур и Андижанская историко-литературная школа: источниковедческое исследование «Бабурнаме»',
    },
    subtitle: {
      uz: 'Tarix (60220300, 70220301), Adabiyotshunoslik (70230104) va O‘zbek filologiyasi (60230100) yo‘nalishlari uchun nodir faksimile va ilmiy sharh',
      en: 'Critical Archival Edition for History (60220300, 70220301), Literary Studies (70230104), and Uzbek Philology (60230100)',
      ru: 'Критическое издание для направлений История (70220301), Литературоведение (70230104) и Филология (60230100)',
    },
    authors: ['Prof. D. Yusupova', 'Dots. M. Qodirov (TUAF Pedagogika va tillar kafedrasi)'],
    year: 2025,
    type: 'manuscript',
    faculty: 'humanities-social',
    programCode: '70220301',
    isbn: '978-9943-01-954-9',
    doi: '10.1093/tuaf/babur.2025.002',
    udc: '94(575.122):821.512.133',
    orcid: '0000-0001-9920-4182',
    language: 'O‘zbek',
    pages: 612,
    citationsCount: 275,
    downloadsCount: 6890,
    openAccess: true,
    peerReviewed: true,
    publisher: 'Turon University Andijon Filiali Meros Markazi & Oxford Oriental Series',
    coverImage: COVER_SAMARKAND_IMAGE,
    spineColor: '#78350F',
    availableCopies: 8,
    totalCopies: 10,
    featuredRank: 'secondary',
    abstract: {
      uz: 'Andijon zaminida voyaga yetgan buyuk mutafakkir Zahiriddin Muhammad Boburning "Boburnoma" qomusiy asaridagi tarixiy-geografik, etnografik va lingvistik ma’lumotlar Haydarobod, London (British Library) va Parij qo‘lyozma nusxalari asosida qiyosiy tahlil qilingan.',
      en: 'Comparative paleographic and linguopoetic analysis of the Baburnama by Zahiriddin Muhammad Babur of Andijan, collating the Hyderabad, British Library, and Bibliothèque nationale de France folios.',
      ru: 'Сравнительно-текстологическое и лингвопоэтическое исследование энциклопедического труда «Бабурнаме» Захириддина Мухаммада Бабура на основе Хайдарабадского и Лондонского списков.',
    },
    keywords: ['Andijon tarixi', 'Boburnoma', 'Tarix 70220301', 'Adabiyotshunoslik 70230104', 'Qo‘lyozma'],
    chapters: [
      {
        number: 1,
        title: {
          uz: 'I Bob. XV asr oxirida Farg‘ona ulusi va Andijon shahrining ijtimoiy-madaniy qiyofasi',
          en: 'Chapter I. Socio-Cultural Topography of Fergana and Andijan in the Late 15th Century',
          ru: 'Глава I. Историко-культурная топография Ферганы и Андижана в конце XV века',
        },
        pageStart: 18,
        content: {
          uz: '"Ramazon oyida, to‘qqiz yuz to‘qqizinchi tarixda Farg‘ona viloyatida o‘n ikki yoshda podshoh bo‘ldim..." Boburning Farg‘ona vodiysi va uning poytaxti Andijon haqidagi geografik, iqlimiy va tilshunoslik qaydlari XV asr turkiy nasrining eng yuksak namunasi hisoblanadi.',
          en: 'Babur’s vivid geographical, botanical, and linguistic observations of the Fergana Valley and its capital Andijan constitute an unparalleled primary source for Central Asian historiography and Chagatai Turkic philology.',
          ru: 'Географические, этнографические и лингвистические описания Ферганской долины и её столицы Андижана в «Бабурнаме» представляют собой бесценный первоисточник по истории и филологии Центральной Азии.',
        },
      },
    ],
  },
  {
    id: 'tuaf-dsc-linguistics-corpora',
    title: {
      uz: 'Qiyosiy Korpus Lingvistikasi: Ingliz, O‘zbek va Rus Tillarida Ilmiy Diskurs va Semantik Transformatsiya',
      en: 'Comparative Corpus Linguistics: Academic Discourse & Semantic Transformation in English, Uzbek, and Russian',
      ru: 'Сравнительная корпусная лингвистика: научный дискурс и семантическая трансформация в английском, узбекском и русском языках',
    },
    subtitle: {
      uz: 'Pedagogika va tillar kafedrasi: Lingvistika (70230101) magistratura va Filologiya (60230100) bakalavriat dasturlari uchun DSc dissertatsiya va o‘quv qo‘llanma',
      en: 'DSc Dissertation & Graduate Reference for Linguistics (70230101) and Philology & Language Teaching (60230100)',
      ru: 'Докторская диссертация (DSc) и пособие для магистратуры Лингвистика (70230101) и бакалавриата Филология (60230100)',
    },
    authors: ['Dr. Dilnoza Karimova (TUAF Pedagogika va tillar kafedrasi mudiri)'],
    year: 2026,
    type: 'dissertation',
    faculty: 'pedagogy-languages',
    programCode: '70230101-EN',
    isbn: '978-9943-88-319-2',
    doi: '10.5281/tuaf.ling.2026.104',
    udc: '811.111:811.512.133:811.161.1',
    orcid: '0000-0003-1184-7721',
    language: 'English',
    pages: 312,
    citationsCount: 128,
    downloadsCount: 4910,
    openAccess: true,
    peerReviewed: true,
    publisher: 'Turon University Andijon Filiali Ilmiy Kengashi (Shifr: 10.00.06)',
    degree: 'DSc',
    supervisor: 'Prof. A. Omonov / Prof. S. Ashurov',
    defenseDate: '2026-03-14',
    spineColor: '#162E52',
    availableCopies: 14,
    totalCopies: 15,
    featuredRank: 'secondary',
    abstract: {
      uz: 'Turon universiteti Andijon filialining Lingvistika (ingliz, o‘zbek, rus tillari — 70230101) magistratura talabalari hamda Filologiya (60230100) yo‘nalishi uchun mo‘ljallangan ushbu tadqiqotda 12 million so‘zlik parallel uch tilli akademik korpus asosida tarjima ekvivalentligi va kognitiv metaforalar tahlil qilingan.',
      en: 'Developed at the Department of Pedagogy and Languages of Turon University Andijan Branch for Linguistics (70230101) and Philology (60230100), this DSc research analyzes translation equivalence and syntactic alignment across a 12-million-token trilingual parallel corpus (EN-UZ-RU).',
      ru: 'Разработанное на кафедре педагогики и языков TUAF исследование для направлений Лингвистика (70230101) и Филология (60230100) анализирует синтаксическую эквивалентность на базе 12-миллионного параллельного корпуса английского, узбекского и русского языков.',
    },
    keywords: ['Lingvistika 70230101', 'Filologiya 60230100', 'Ingliz tili', 'O‘zbek tili', 'Rus tili'],
    chapters: [
      {
        number: 1,
        title: {
          uz: 'I Bob. Tipologik jihatdan har xil tillarda (flektsion va agglyutinativ) ilmiy terminologiya korpusi',
          en: 'Chapter I. Parallel Corpus Architecture Across Analytic, Inflectional, and Agglutinative Languages',
          ru: 'Глава I. Архитектура параллельного корпуса разноструктурных языков (английский, русский, узбекский)',
        },
        pageStart: 10,
        content: {
          uz: 'Ingliz (analitik), rus (flektsion) va o‘zbek (agglyutinativ) tillarini qiyosiy o‘rganishda sintaktik valentlik va leksik-semantik maydonlarning mos kelish koeffitsiyenti C1/C2 darajadagi akademik yozuv kompetensiyasini shakllantirishda hal qiluvchi ahamiyat kasb etadi.',
          en: 'Contrastive alignment across analytic English, fusional Russian, and agglutinative Uzbek reveals systematic valency shifts that directly inform C1/C2 academic writing pedagogy at TUAF.',
          ru: 'Сопоставительный анализ аналитического английского, флективного русского и агглютинативного узбекского языков позволяет выявить закономерности трансформации синтаксических структур в академическом письме.',
        },
      },
    ],
  },
  {
    id: 'tuaf-phd-pedagogy-psychology',
    title: {
      uz: 'Oliy Ta’limda Kredit-Modul Tizimi va Raqamli Pedagogika: Talabalarda Kognitiv Motivatsiyani Rivojlantirish Psixologiyasi',
      en: 'Credit-Module System & Digital Pedagogy in Higher Education: Psychology of Cognitive Motivation in Students',
      ru: 'Кредитно-модульная система и цифровая педагогика в вузе: психология развития когнитивной мотивации студентов',
    },
    subtitle: {
      uz: 'Pedagogika nazariyasi va tarixi (70110101) magistraturasi hamda Psixologiya (60310300) bakalavriat yo‘nalishi uchun PhD dissertatsiya va uslubiy majmua',
      en: 'PhD Dissertation & Curriculum Guide for Theory & History of Pedagogy (70110101) and Psychology (60310300)',
      ru: 'PhD диссертация и учебно-методический комплекс для направлений Педагогика (70110101) и Психология (60310300)',
    },
    authors: ['Dr. Gulbahor Rustamova', 'Dots. N. Abdullayeva (TUAF)'],
    year: 2026,
    type: 'dissertation',
    faculty: 'pedagogy-languages',
    programCode: '70110101',
    isbn: '978-9943-77-112-8',
    doi: '10.1038/tuaf.ped.2026.019',
    udc: '378.147:159.95',
    orcid: '0000-0002-5519-0943',
    language: 'O‘zbek',
    pages: 224,
    citationsCount: 96,
    downloadsCount: 3650,
    openAccess: true,
    peerReviewed: true,
    publisher: 'Turon University Andijon Filiali Pedagogika va Psixologiya Seriyasi',
    degree: 'PhD',
    supervisor: 'Prof. M. Toxtaxodjayeva',
    defenseDate: '2026-01-22',
    spineColor: '#14532D',
    availableCopies: 11,
    totalCopies: 12,
    abstract: {
      uz: 'Tadqiqotda Turon universiteti Andijon filialining 1000+ nafar talabasi ishtirokida HEMIS raqamli platformasi va interaktiv keys-stadi metodlarining talabalar akademik o‘zlashtirish ko‘rsatkichlariga hamda emotsional intellektiga ta’siri eksperimental asosda o‘rganilgan.',
      en: 'Empirical study involving 1,000+ students at Turon University Andijan Branch evaluating how HEMIS learning analytics, flipped-classroom pedagogy, and cognitive psychology interventions elevate student retention and academic mastery.',
      ru: 'Экспериментальное исследование с участием более 1000 студентов Андижанского филиала Университета Турон, доказывающее эффективность цифровой педагогики и когнитивно-мотивационных тренингов.',
    },
    keywords: ['Pedagogika 70110101', 'Psixologiya 60310300', 'HEMIS', 'Kredit-modul tizimi'],
    chapters: [
      {
        number: 1,
        title: {
          uz: 'I Bob. Sharq mutafakkirlari pedagogik merosi va zamonaviy konstruktivistik didaktika',
          en: 'Chapter I. Eastern Pedagogical Heritage and Modern Constructivist Didactics',
          ru: 'Глава I. Педагогическое наследие мыслителей Востока и современная конструктивистская дидактика',
        },
        pageStart: 1,
        content: {
          uz: 'Pedagogika nazariyasi va tarixi (70110101) yo‘nalishi magistrantlari uchun Abu Nasr Forobiy, Ibn Sino va Jadid ma’rifatparvarlarining didaktik qarashlari zamonaviy Bloom taksonomiyasi va kredit-modul baholash mezonlari bilan qiyosiy tahlil qilingan.',
          en: 'Synthesizes the classical didactic philosophy of Al-Farabi, Avicenna, and the Jadid educators with Bloom’s revised taxonomy and European Credit Transfer and Accumulation System (ECTS) standards.',
          ru: 'Дидактические воззрения Фараби, Ибн Сины и просветителей-джадидов сопоставлены с современной таксономией Блума и стандартами кредитно-модульной системы ECTS.',
        },
      },
    ],
  },
  {
    id: 'tuaf-natural-sciences-bio-chem-geo',
    title: {
      uz: 'Farg‘ona Vodiysi Bioekologiyasi, Tabiiy Birikmalar Kimyosi va Geoaxborot (GIS) Kartografiyasi',
      en: 'Bioecology of the Fergana Valley, Natural Products Chemistry & GIS Spatial Cartography',
      ru: 'Биоэкология Ферганской долины, химия природных соединений и ГИС-картография',
    },
    subtitle: {
      uz: 'Tabiiy, aniq va gumanitar fanlar kafedrasi: Biologiya (60510100, 70510101), Kimyo (60530100) va Geografiya (60530200) yo‘nalishlari uchun kompleks darslik',
      en: 'Integrated Textbook for Biology (60510100, 70510101), Chemistry (60530100), and Geography (60530200) at TUAF',
      ru: 'Комплексный учебник для направлений Биология (60510100, 70510101), Химия (60530100) и География (60530200) TUAF',
    },
    authors: ['Prof. I. Asqarov', 'Dr. S. Nazarov', 'Dots. R. Mamajonov (TUAF)'],
    year: 2026,
    type: 'article',
    faculty: 'natural-exact-sciences',
    programCode: '60510100',
    isbn: '978-9943-55-801-4',
    doi: '10.1126/tuaf.natsci.2026.884',
    udc: '574:547.9:911.2(575.12)',
    orcid: '0000-0001-6004-8821',
    language: 'O‘zbek',
    pages: 386,
    citationsCount: 194,
    downloadsCount: 5420,
    openAccess: true,
    peerReviewed: true,
    publisher: 'TUAF Tabiiy va Aniq Fanlar Kafedrasi Ilmiy To‘plami (Scopus Indexed)',
    degree: 'Master',
    spineColor: '#1E3A8A',
    availableCopies: 15,
    totalCopies: 15,
    abstract: {
      uz: 'Andijon va Farg‘ona vodiysi endemik dorivor o‘simliklarining molekulyar biologiyasi (60510100, 70510101), biofaol flavonoid va alkaloidlarning yuqori samarali suyuqlik xromatografiyasi (HPLC) tahlili (Kimyo — 60530100) hamda agroiqlimiy resurslarning GIS xaritalari (Geografiya — 60530200) jamlangan.',
      en: 'Covers molecular genetics of endemic medicinal flora of Andijan and the Fergana Valley (Biology 60510100, 70510101), HPLC isolation of bioactive alkaloids (Chemistry 60530100), and satellite GIS hydrological mapping (Geography 60530200).',
      ru: 'Охватывает молекулярную биологию эндемичных лекарственных растений Ферганской долины (Биология 60510100, 70510101), ВЭЖХ-анализ природных соединений (Химия 60530100) и ГИС-картографирование (География 60530200).',
    },
    keywords: ['Biologiya 60510100', 'Biologiya Magistratura 70510101', 'Kimyo 60530100', 'Geografiya 60530200'],
    chapters: [
      {
        number: 1,
        title: {
          uz: 'I Bob. Molekulyar biologiya va dorivor o‘simliklar fitokimyoviy ekstraksiyasi',
          en: 'Chapter I. Molecular Phylogenetics and Phytochemical Extraction of Valley Flora',
          ru: 'Глава I. Молекулярная биология и фитохимическая экстракция лекарственной флоры',
        },
        pageStart: 1,
        content: {
          uz: 'Farg‘ona vodiysining tog‘oldi adir mintaqalarida o‘suvchi 450 dan ortiq dorivor o‘simlik turlarining DNK barkodlash jadvali va biologik faol moddalar spektroskopiyasi Biologiya va Kimyo yo‘nalishi laboratoriya mashg‘ulotlari uchun asosiy qo‘llanma sifatida keltirilgan.',
          en: 'Provides DNA barcoding protocols and NMR/HPLC spectral profiles for over 450 medicinal plant species native to the Fergana foothill ecosystems.',
          ru: 'Приведены протоколы ДНК-баркодинга и ЯМР/ВЭЖХ-спектры более 450 видов лекарственных растений предгорных экосистем Ферганской долины.',
        },
      },
    ],
  },
  {
    id: 'tuaf-international-relations-diplomacy',
    title: {
      uz: 'Zamonaviy Xalqaro Munosabatlar, Iqtisodiy Diplomatiya va Markaziy Osiyo Geosiyosati',
      en: 'Contemporary International Relations, Economic Diplomacy & Central Asian Geopolitics',
      ru: 'Современные международные отношения, экономическая дипломатия и геополитика Центральной Азии',
    },
    subtitle: {
      uz: 'Xalqaro munosabatlar (60310200) bakalavriat va Iqtisodiyot (70410102) magistratura yo‘nalishlari uchun darslik',
      en: 'Core Textbook for International Relations (60310200) and International Economics (70410102) at TUAF',
      ru: 'Базовый учебник для направлений Международные отношения (60310200) и Экономика (70410102) TUAF',
    },
    authors: ['Prof. O. Xolmatov', 'Dr. A. Saidov (TUAF Xalqaro hamkorlik bo‘limi)'],
    year: 2025,
    type: 'book',
    faculty: 'humanities-social',
    programCode: '60310200',
    isbn: '978-9943-72-608-6',
    doi: '10.1017/tuaf.ir.2025.60310200',
    udc: '327:339.9(575)',
    language: 'O‘zbek',
    pages: 418,
    citationsCount: 142,
    downloadsCount: 4120,
    openAccess: true,
    peerReviewed: true,
    publisher: 'Turon University Andijon Filiali & Xalqaro Tadqiqotlar Markazi',
    degree: 'Monograph',
    spineColor: '#9A3412',
    availableCopies: 9,
    totalCopies: 10,
    abstract: {
      uz: 'Darslikda Xalqaro munosabatlar (60310200) yo‘nalishi talabalari uchun diplomatik protokol, BMT va mintaqaviy xalqaro tashkilotlar huquqi, transchegaraviy transport yo‘laklari (Xitoy–Qirg‘iziston–O‘zbekiston temir yo‘li va Andijon logistika xabi)ning geoiqtisodiy ahamiyati yoritilgan.',
      en: 'Examines diplomatic protocol, multilateral treaty law, and the geo-economic significance of the China–Kyrgyzstan–Uzbekistan transport corridor centered through the Andijan logistics gateway.',
      ru: 'Рассматриваются дипломатический протокол, право международных организаций и геоэкономическое значение транспортного коридора Китай — Кыргызстан — Узбекистан через Андижанский хаб.',
    },
    keywords: ['Xalqaro munosabatlar 60310200', 'Diplomatiya', 'Andijon transport koridori', 'Geosiyosat'],
    chapters: [
      {
        number: 1,
        title: {
          uz: 'I Bob. Ko‘p tomonlama diplomatiya va Yangi O‘zbekistonning tashqi siyosat doktrinasi',
          en: 'Chapter I. Multilateral Diplomacy and Pragmatic Regional Integration in Central Asia',
          ru: 'Глава I. Многосторонняя дипломатия и прагматическая региональная интеграция в Центральной Азии',
        },
        pageStart: 1,
        content: {
          uz: 'Markaziy Osiyoda yaxshi qo‘shnichilik, savdo-iqtisodiy integratsiya va xalqaro ta’lim hamkorligi (jumladan, Turon universiteti Andijon filialining 5+ xalqaro universitetlar bilan qo‘shma dasturlari) mintaqaviy barqarorlikning ustuvor omili sifatida tahlil etiladi.',
          en: 'Analyzes regional connectivity, trade facilitation, and cross-border academic partnerships—including Turon University Andijan Branch’s international cooperation agreements.',
          ru: 'Анализируются региональная взаимосвязанность, торгово-экономическая интеграция и международное академическое партнерство Университета Турон.',
        },
      },
    ],
  },
];

export const INITIAL_MEDIA_LECTURES: MediaLecture[] = [
  {
    id: 'tuaf-lec-omonov-economics',
    title: {
      uz: 'Raqamli Iqtisodiyot, Bank Tizimi Transformatsiyasi va Magistratura Tadqiqot Metodologiyasi',
      en: 'Digital Economy, Banking Transformation & Graduate Research Methodology at TUAF',
      ru: 'Цифровая экономика, трансформация банковского сектора и методология научных исследований',
    },
    professor: 'Prof. A. Omonov (Turon universiteti Andijon filiali direktori)',
    professorTitle: {
      uz: 'Turon universiteti Andijon filiali direktori, iqtisodiyot fanlari doktori, professor',
      en: 'Director of Turon University Andijan Branch, Doctor of Economics, Professor',
      ru: 'Директор Андижанского филиала Университета Турон, д.э.н., профессор',
    },
    faculty: 'economics-finance',
    mediaType: 'video',
    duration: '48:30',
    durationSeconds: 2910,
    year: 2026,
    viewsCount: 15420,
    courseCode: 'ECON-70410102',
    thumbnailUrl: LECTURE_SYMPOSIUM_IMAGE,
    summary: {
      uz: 'Turon universiteti Andijon filiali direktori professor A. Omonovning bakalavriat (Bank ishi 60410600, Buxgalteriya 60410200, Iqtisodiyot 60410100) va magistratura (70410102) talabalari uchun ochiq ma’ruzasi: zamonaviy moliya bozorlari, ilmiy maqola va dissertatsiya yozish standartlari.',
      en: 'Keynote lecture by Professor A. Omonov, Director of TUAF, addressing Banking, Accounting, and Economics students on financial market transformation and international thesis defense standards.',
      ru: 'Открытая лекция директора Андижанского филиала Университета Турон профессора А. Омонова для студентов и магистрантов об инновациях в финансовом секторе и подготовке диссертаций.',
    },
    transcript: {
      uz: '[00:00] Hurmatli talabalar, magistrantlar va professor-o‘qituvchilar! Turon universiteti Andijon filialida biz oliy ta’limni faqat diplom olish vositasi emas, balki zamonaviy dunyoda muvaffaqiyat qozonish uchun zarur bo‘lgan bilim, kasbiy ko‘nikma va ilmiy salohiyat maskani deb bilamiz. [14:20] Bank ishi (60410600) va Iqtisodiyot (70410102) yo‘nalishida tahsil olayotgan har bir tadqiqotchi xalqaro ekonometrik modellar va real moliya hisobotlari bilan ishlashni mukammal egallashi zarur. [32:10] Axborot-resurs markazimizdagi 10 000 dan ortiq adabiyotlar va xalqaro elektron bazalar sizning ilmiy izlanishlaringiz uchun to‘liq ochiq.',
      en: '[00:00] Dear students, master’s fellows, and faculty colleagues! At Turon University Andijan Branch, we view higher education not merely as a path to a diploma, but as a transformative environment uniting academic excellence with practical innovation. [14:20] Every researcher in Banking (60410600) and Economics (70410102) must master econometric modeling and international financial standards. [32:10] Our Information Resource Center with 10,000+ volumes and 50+ workstations stands ready to support your discoveries.',
      ru: '[00:00] Уважаемые студенты, магистранты и преподаватели! В Андижанском филиале Университета Турон мы рассматриваем высшее образование как синтез академического превосходства, цифровых инноваций и практического опыта. [14:20] Исследователи направлений Банковское дело (60410600) и Экономика (70410102) должны свободно владеть эконометрическим моделированием и стандартами МСФО. [32:10] Наш Информационно-ресурсный центр открывает доступ к более чем 10 000 изданий и мировым базам данных.',
    },
    chapters: [
      {
        time: '00:00',
        seconds: 0,
        title: {
          uz: 'Kirish: Turon universiteti Andijon filiali ta’lim falsafasi va akademik mukammallik',
          en: 'Introduction: Educational Philosophy & Academic Excellence at TUAF',
          ru: 'Введение: Философия образования и академическое превосходство в TUAF',
        },
      },
      {
        time: '14:20',
        seconds: 860,
        title: {
          uz: 'Bank ishi (60410600) va Iqtisodiyotda (70410102) raqamli transformatsiya',
          en: 'Digital Transformation in Banking (60410600) & Macroeconomics (70410102)',
          ru: 'Цифровая трансформация в банковском деле (60410600) и экономике (70410102)',
        },
      },
      {
        time: '32:10',
        seconds: 1930,
        title: {
          uz: 'Magistrlik dissertatsiyasi dastlabki himoyasi va xalqaro til sertifikatlari talablari',
          en: 'Master’s Thesis Pre-Defense Standards & International Language Certifications',
          ru: 'Требования к предзащите магистерских диссертаций и международным сертификатам',
        },
      },
    ],
  },
  {
    id: 'tuaf-lec-philology-linguistics',
    title: {
      uz: 'Zamonaviy Tilshunoslik va Ingliz, O‘zbek, Rus Filologiyasida Sinxron Tarjima Texnologiyalari',
      en: 'Applied Linguistics, Academic Writing & Trilingual Translation (EN / UZ / RU)',
      ru: 'Прикладная лингвистика, академическое письмо и технологии перевода (EN / UZ / RU)',
    },
    professor: 'Dr. Dilnoza Karimova (TUAF Pedagogika va tillar kafedrasi)',
    professorTitle: {
      uz: 'Pedagogika va tillar kafedrasi mudiri, filologiya fanlari doktori (DSc)',
      en: 'Head of Department of Pedagogy & Languages, DSc in Philology',
      ru: 'Заведующая кафедрой педагогики и языков TUAF, д.ф.н. (DSc)',
    },
    faculty: 'pedagogy-languages',
    mediaType: 'video',
    duration: '42:15',
    durationSeconds: 2535,
    year: 2026,
    viewsCount: 11280,
    courseCode: 'LING-70230101',
    thumbnailUrl: HERO_LIBRARY_IMAGE,
    summary: {
      uz: 'Filologiya va tillarni o‘qitish (60230100 — ingliz, o‘zbek, rus tillari) hamda Lingvistika (70230101) va Adabiyotshunoslik (70230104) talabalari uchun IELTS C1/C2 akademik yozuv va korpus lingvistikasi bo‘yicha videodars.',
      en: 'Video lecture for Philology (60230100) and Master’s Linguistics (70230101) students covering C1/C2 academic rhetoric, corpus tools, and literary translation.',
      ru: 'Видеолекция для студентов направлений Филология (60230100), Лингвистика (70230101) и Литературоведение (70230104) по академическому письму и корпусным технологиям.',
    },
    transcript: {
      uz: '[00:00] Assalomu alaykum, Pedagogika va tillar kafedrasi talabalari! Bugun biz uchta tilda — ingliz, o‘zbek va rus tillarida ilmiy maqola va esse yozishning diskursiv qoidalarini ko‘rib chiqamiz. [16:40] CEFR C1 va IELTS 7.5+ darajasidagi akademik matnlarda leksik zichlik va bog‘lovchi konstruksiyalar qanday ishlashini parallel korpus misolida tahlil qilamiz.',
      en: '[00:00] Welcome, students of the Department of Pedagogy and Languages! Today we examine discursive conventions across English, Uzbek, and Russian scholarly prose. [16:40] Using parallel corpora, we analyze lexical density and syntactic cohesion required for CEFR C1/C2 and IELTS 7.5+ academic writing.',
      ru: '[00:00] Здравствуйте, студенты и магистранты кафедры педагогики и языков! Сегодня мы разберем дискурсивные правила научного письма на английском, узбекском и русском языках. [16:40] На примерах параллельного корпуса проанализируем лексическую плотность текстов уровня C1/C2.',
    },
    chapters: [
      {
        time: '00:00',
        seconds: 0,
        title: {
          uz: 'Filologiya (60230100) va Lingvistika (70230101) yo‘nalishlarida komparativ metod',
          en: 'Comparative Methodology in Philology (60230100) & Linguistics (70230101)',
          ru: 'Компаративный метод в филологии (60230100) и лингвистике (70230101)',
        },
      },
      {
        time: '16:40',
        seconds: 1000,
        title: {
          uz: 'CEFR C1/C2 va xalqaro til sertifikatlariga tayyorgarlik strategiyasi',
          en: 'CEFR C1/C2 Academic Rhetoric & International Certification Mastery',
          ru: 'Стратегия подготовки к международным языковым сертификатам уровня C1/C2',
        },
      },
    ],
  },
  {
    id: 'tuaf-lec-history-babur-audio',
    title: {
      uz: 'Andijon Tarixi, Boburiylar Merosi va Markaziy Osiyo Diplomatiyasi: Audio-Kurs',
      en: 'History of Andijan, Baburid Heritage & Central Asian Diplomacy: Audio Course',
      ru: 'История Андижана, наследие Бабуридов и дипломатия Центральной Азии: Аудиокурс',
    },
    professor: 'Dots. M. Qodirov (TUAF Tabiiy, aniq va gumanitar fanlar kafedrasi)',
    professorTitle: {
      uz: 'Tarix va xalqaro munosabatlar yo‘nalishi dotsenti, PhD',
      en: 'Associate Professor of History & International Relations, PhD',
      ru: 'Доцент направления истории и международных отношений TUAF, PhD',
    },
    faculty: 'humanities-social',
    mediaType: 'audio',
    duration: '36:50',
    durationSeconds: 2210,
    year: 2025,
    viewsCount: 8640,
    courseCode: 'HIST-60220300',
    thumbnailUrl: COVER_SAMARKAND_IMAGE,
    summary: {
      uz: 'Tarix (60220300, 70220301) va Xalqaro munosabatlar (60310200) talabalari uchun Qadimgi Davan davlati, Buyuk Ipak yo‘lining Andijon chorrahasi va Boburiylar davri diplomatiyasi bo‘yicha audio-ma’ruza.',
      en: 'Audio monograph for History (60220300, 70220301) and International Relations (60310200) exploring Ancient Dayuan (Fergana), Silk Road trade routes through Andijan, and Baburid diplomatic archives.',
      ru: 'Аудиолекция для студентов направлений История (60220300, 70220301) и Международные отношения (60310200) о древнем государстве Давань, Великом шелковом пути через Андижан и дипломатии Бабуридов.',
    },
    transcript: {
      uz: '[00:00] Qadimgi Xitoy yilnomalarida Davan (Farg‘ona) davlati va uning "osmon tulporlari" hamda rivojlangan shaharsozlik madaniyati alohida e’tirof etilgan. [12:15] XV–XVI asrlarda esa Andijon temuriylar renessansining sharqiy tayanchi va Zahiriddin Muhammad Bobur diplomatik maktabining beshigi bo‘lib xizmat qildi.',
      en: '[00:00] In ancient Han chronicles, Dayuan (Fergana) was celebrated for its urban civilization and diplomatic envoy exchanges along the Silk Road. [12:15] By the 15th century, Andijan flourished as an intellectual stronghold of the Timurid Renaissance and the birthplace of Zahiriddin Muhammad Babur.',
      ru: '[00:00] В древних хрониках государство Давань (Фергана) славилось развитой городской культурой и дипломатическими связями на Великом шелковом пути. [12:15] В XV веке Андижан стал восточным оплотом Тимуридского Ренессанса и родиной Захириддина Мухаммада Бабура.',
    },
    chapters: [
      {
        time: '00:00',
        seconds: 0,
        title: {
          uz: 'Buyuk Ipak yo‘lida Farg‘ona va Andijonning geosiyosiy o‘rni',
          en: 'Geopolitical Role of Fergana and Andijan on the Silk Road',
          ru: 'Геополитическая роль Ферганы и Андижана на Великом шелковом пути',
        },
      },
      {
        time: '12:15',
        seconds: 735,
        title: {
          uz: 'Boburnoma va XV–XVI asrlar xalqaro elchilik aloqalari manbashunosligi',
          en: 'Diplomatic Envoy Records & Primary Sources in the Baburnama',
          ru: 'Дипломатические источники и посольские связи в «Бабурнаме»',
        },
      },
    ],
  },
];

export const READING_HALL_INFO: Record<
  HallId,
  {
    name: LocalizedText;
    floor: LocalizedText;
    ambiance: LocalizedText;
    capacity: number;
  }
> = {
  'main-bodleian': {
    name: {
      uz: 'TUAF Bosh Akademik O‘quv Zali (200+ o‘rinli markaziy zal)',
      en: 'TUAF Main Academic Reading Hall (200+ Seat Central Wing)',
      ru: 'Главный академический читальный зал ИРЦ TUAF (200+ мест)',
    },
    floor: {
      uz: 'Bosh bino, 2-qavat · A.Yuldashev ko‘chasi, 58-a-uy',
      en: 'Main Campus, 2nd Floor · 58-a A.Yuldashev Street, Andijan',
      ru: 'Главный корпус, 2-й этаж · г. Андижан, ул. А.Юлдашева, 58-а',
    },
    ambiance: {
      uz: '10 000+ bosma darsliklar fondi · Sukunat zonasi, individual yoritkichlar va elektr rozetkalari',
      en: 'Direct access to 10,000+ textbooks · Silent study tables, banker lamps & AC/USB-C outlets',
      ru: 'Открытый фонд 10 000+ учебников · Зона тишины, индивидуальные лампы и розетки',
    },
    capacity: 12,
  },
  'stem-silent': {
    name: {
      uz: '50+ Zamonaviy Kompyuterlar va Raqamli Resurslar Zali (HEMIS / Scopus)',
      en: '50+ Modern PC Workstations & Digital Resources Wing (HEMIS / Scopus)',
      ru: 'Зал 50+ современных компьютеров и цифровых ресурсов (HEMIS / Scopus)',
    },
    floor: {
      uz: 'Bosh bino, 2-qavat · Raqamli Axborot-resurs markazi qanoti',
      en: 'Main Campus, 2nd Floor · Digital IRC Wing',
      ru: 'Главный корпус, 2-й этаж · Цифровое крыло ИРЦ',
    },
    ambiance: {
      uz: 'Talabalar foydalanishi uchun 50 dan ortiq zamonaviy kompyuterlar, yuqori tezlikdagi internet va elektron kutubxona terminallari',
      en: '50+ high-performance student PCs, fiber-optic internet, HEMIS portal & international database access',
      ru: 'Более 50 современных компьютеров для студентов, скоростной интернет и терминалы электронных баз',
    },
    capacity: 8,
  },
  'digital-media-pod': {
    name: {
      uz: 'Magistratura (8 yo‘nalish) va Ilmiy Tadqiqotchilar Kollaboratsiya Zali',
      en: 'Master’s Fellows (8 Programs) & Faculty Research Collaboration Hall',
      ru: 'Зал магистрантов (8 программ) и научно-исследовательской работы',
    },
    floor: {
      uz: '3-qavat · Integratsiyalashgan fanlar fakulteti ilmiy qanoti',
      en: '3rd Floor · Faculty of Integrated Sciences Research Wing',
      ru: '3-й этаж · Научное крыло факультета интегрированных наук',
    },
    ambiance: {
      uz: 'Magistrlik dissertatsiyalari muhokamasi, lingvistik korpus laboratoriyasi va interaktiv ekranlar',
      en: 'Designed for Master’s thesis pre-defense preparation, linguistics lab & group seminars',
      ru: 'Для подготовки магистерских диссертаций, лингвистических исследований и научных семинаров',
    },
    capacity: 8,
  },
  'rare-manuscripts': {
    name: {
      uz: 'Boburiylar Merosi, Tarix va Nodir Adabiyotlar Maxsus Zali',
      en: 'Baburid Heritage, History & Special Collections Room',
      ru: 'Специальный зал наследия Бабуридов, истории и редких изданий',
    },
    floor: {
      uz: '1-qavat · Ma’naviyat va tarixiy qo‘lyozmalar bo‘limi',
      en: '1st Floor · Historical Archives & Special Collections',
      ru: '1-й этаж · Отдел исторического наследия и редких книг',
    },
    ambiance: {
      uz: 'Tarix (60220300, 70220301) va Adabiyotshunoslik (70230104) uchun nodir manbalar va faksimile nashrlar',
      en: 'Curated historical atlases, Baburnama facsimiles & diplomatic archives with optical magnifiers',
      ru: 'Редкие исторические атласы, факсимиле «Бабурнаме» и дипломатические архивы',
    },
    capacity: 8,
  },
};

export const INITIAL_READING_ROOM_SEATS: ReadingRoomSeat[] = [
  // TUAF Main Academic Hall (12 seats)
  { id: 'mb-1', hallId: 'main-bodleian', seatCode: 'A-01', row: 1, col: 1, zoneLabel: 'Iqtisodiyot va Moliya Sektori', features: ['lamp', 'power'], defaultStatus: 'available' },
  { id: 'mb-2', hallId: 'main-bodleian', seatCode: 'A-02', row: 1, col: 2, zoneLabel: 'Iqtisodiyot va Moliya Sektori', features: ['lamp', 'power'], defaultStatus: 'occupied' },
  { id: 'mb-3', hallId: 'main-bodleian', seatCode: 'A-03', row: 1, col: 3, zoneLabel: 'Iqtisodiyot va Moliya Sektori', features: ['lamp', 'power', 'lan'], defaultStatus: 'available' },
  { id: 'mb-4', hallId: 'main-bodleian', seatCode: 'A-04', row: 1, col: 4, zoneLabel: 'Iqtisodiyot va Moliya Sektori', features: ['lamp', 'power'], defaultStatus: 'available' },
  { id: 'mb-5', hallId: 'main-bodleian', seatCode: 'B-01', row: 2, col: 1, zoneLabel: 'Pedagogika va Tillar Sektori', features: ['lamp', 'power', 'lan'], defaultStatus: 'occupied' },
  { id: 'mb-6', hallId: 'main-bodleian', seatCode: 'B-02', row: 2, col: 2, zoneLabel: 'Pedagogika va Tillar Sektori', features: ['lamp', 'power', 'lan'], defaultStatus: 'available' },
  { id: 'mb-7', hallId: 'main-bodleian', seatCode: 'B-03', row: 2, col: 3, zoneLabel: 'Pedagogika va Tillar Sektori', features: ['lamp', 'power', 'lan'], defaultStatus: 'available' },
  { id: 'mb-8', hallId: 'main-bodleian', seatCode: 'B-04', row: 2, col: 4, zoneLabel: 'Pedagogika va Tillar Sektori', features: ['lamp', 'power'], defaultStatus: 'occupied' },
  { id: 'mb-9', hallId: 'main-bodleian', seatCode: 'C-01', row: 3, col: 1, zoneLabel: 'Tabiiy va Aniq Fanlar Sektori', features: ['lamp', 'power', 'monitor'], defaultStatus: 'available' },
  { id: 'mb-10', hallId: 'main-bodleian', seatCode: 'C-02', row: 3, col: 2, zoneLabel: 'Tabiiy va Aniq Fanlar Sektori', features: ['lamp', 'power', 'monitor'], defaultStatus: 'available' },
  { id: 'mb-11', hallId: 'main-bodleian', seatCode: 'C-03', row: 3, col: 3, zoneLabel: 'Tabiiy va Aniq Fanlar Sektori', features: ['lamp', 'power'], defaultStatus: 'occupied' },
  { id: 'mb-12', hallId: 'main-bodleian', seatCode: 'C-04', row: 3, col: 4, zoneLabel: 'Tabiiy va Aniq Fanlar Sektori', features: ['lamp', 'power'], defaultStatus: 'available' },

  // 50+ Modern PC Workstations Hall (8 representative clusters)
  { id: 'st-1', hallId: 'stem-silent', seatCode: 'PC-01', row: 1, col: 1, zoneLabel: 'HEMIS & FinTech Terminal', features: ['monitor', 'lan', 'power'], defaultStatus: 'available' },
  { id: 'st-2', hallId: 'stem-silent', seatCode: 'PC-02', row: 1, col: 2, zoneLabel: 'HEMIS & FinTech Terminal', features: ['monitor', 'lan', 'power'], defaultStatus: 'available' },
  { id: 'st-3', hallId: 'stem-silent', seatCode: 'PC-03', row: 1, col: 3, zoneLabel: 'HEMIS & FinTech Terminal', features: ['monitor', 'lan', 'power'], defaultStatus: 'occupied' },
  { id: 'st-4', hallId: 'stem-silent', seatCode: 'PC-04', row: 1, col: 4, zoneLabel: 'HEMIS & FinTech Terminal', features: ['monitor', 'lan', 'power'], defaultStatus: 'available' },
  { id: 'st-5', hallId: 'stem-silent', seatCode: 'PC-05', row: 2, col: 1, zoneLabel: 'Scopus & GIS Workstation', features: ['monitor', 'lan', 'power', 'lamp'], defaultStatus: 'occupied' },
  { id: 'st-6', hallId: 'stem-silent', seatCode: 'PC-06', row: 2, col: 2, zoneLabel: 'Scopus & GIS Workstation', features: ['monitor', 'lan', 'power', 'lamp'], defaultStatus: 'available' },
  { id: 'st-7', hallId: 'stem-silent', seatCode: 'PC-07', row: 2, col: 3, zoneLabel: 'Scopus & GIS Workstation', features: ['monitor', 'lan', 'power', 'lamp'], defaultStatus: 'available' },
  { id: 'st-8', hallId: 'stem-silent', seatCode: 'PC-08', row: 2, col: 4, zoneLabel: 'Scopus & GIS Workstation', features: ['monitor', 'lan', 'power'], defaultStatus: 'available' },

  // Master's & Research Hall (8 seats)
  { id: 'dm-1', hallId: 'digital-media-pod', seatCode: 'M-101', row: 1, col: 1, zoneLabel: 'Lingvistika 70230101 Sektor', features: ['monitor', 'lan', 'power'], defaultStatus: 'available' },
  { id: 'dm-2', hallId: 'digital-media-pod', seatCode: 'M-102', row: 1, col: 2, zoneLabel: 'Lingvistika 70230101 Sektor', features: ['monitor', 'lan', 'power'], defaultStatus: 'occupied' },
  { id: 'dm-3', hallId: 'digital-media-pod', seatCode: 'M-103', row: 1, col: 3, zoneLabel: 'Iqtisodiyot 70410102 Sektor', features: ['monitor', 'lan', 'power'], defaultStatus: 'available' },
  { id: 'dm-4', hallId: 'digital-media-pod', seatCode: 'M-104', row: 1, col: 4, zoneLabel: 'Iqtisodiyot 70410102 Sektor', features: ['monitor', 'lan', 'power'], defaultStatus: 'available' },
  { id: 'dm-5', hallId: 'digital-media-pod', seatCode: 'M-201', row: 2, col: 1, zoneLabel: 'Pedagogika 70110101 Sektor', features: ['power', 'lamp'], defaultStatus: 'available' },
  { id: 'dm-6', hallId: 'digital-media-pod', seatCode: 'M-202', row: 2, col: 2, zoneLabel: 'Biologiya 70510101 Sektor', features: ['power', 'lamp'], defaultStatus: 'available' },
  { id: 'dm-7', hallId: 'digital-media-pod', seatCode: 'M-203', row: 2, col: 3, zoneLabel: 'Tarix 70220301 Sektor', features: ['monitor', 'lan', 'power'], defaultStatus: 'occupied' },
  { id: 'dm-8', hallId: 'digital-media-pod', seatCode: 'M-204', row: 2, col: 4, zoneLabel: 'Adabiyotshunoslik 70230104', features: ['monitor', 'lan', 'power'], defaultStatus: 'available' },

  // Baburid Heritage & Special Collections (8 seats)
  { id: 'rm-1', hallId: 'rare-manuscripts', seatCode: 'B-01', row: 1, col: 1, zoneLabel: 'Boburnoma Faksimile Stoli', features: ['magnifier', 'lamp', 'power'], defaultStatus: 'available' },
  { id: 'rm-2', hallId: 'rare-manuscripts', seatCode: 'B-02', row: 1, col: 2, zoneLabel: 'Boburnoma Faksimile Stoli', features: ['magnifier', 'lamp', 'power'], defaultStatus: 'occupied' },
  { id: 'rm-3', hallId: 'rare-manuscripts', seatCode: 'B-03', row: 1, col: 3, zoneLabel: 'Farg‘ona Tarixi Arxivi', features: ['magnifier', 'lamp', 'power'], defaultStatus: 'available' },
  { id: 'rm-4', hallId: 'rare-manuscripts', seatCode: 'B-04', row: 1, col: 4, zoneLabel: 'Farg‘ona Tarixi Arxivi', features: ['magnifier', 'lamp'], defaultStatus: 'available' },
  { id: 'rm-5', hallId: 'rare-manuscripts', seatCode: 'B-05', row: 2, col: 1, zoneLabel: 'Sharq Qo‘lyozmalari Stoli', features: ['magnifier', 'lamp', 'monitor'], defaultStatus: 'available' },
  { id: 'rm-6', hallId: 'rare-manuscripts', seatCode: 'B-06', row: 2, col: 2, zoneLabel: 'Sharq Qo‘lyozmalari Stoli', features: ['magnifier', 'lamp', 'monitor'], defaultStatus: 'available' },
  { id: 'rm-7', hallId: 'rare-manuscripts', seatCode: 'B-07', row: 2, col: 3, zoneLabel: 'Xalqaro Diplomatiya Fondi', features: ['magnifier', 'lamp'], defaultStatus: 'occupied' },
  { id: 'rm-8', hallId: 'rare-manuscripts', seatCode: 'B-08', row: 2, col: 4, zoneLabel: 'Xalqaro Diplomatiya Fondi', features: ['magnifier', 'lamp'], defaultStatus: 'available' },
];

export const INITIAL_SEAT_RESERVATIONS: SeatReservation[] = [
  {
    id: 'tuaf-rsv-101',
    seatId: 'mb-3',
    seatCode: 'A-03',
    hallId: 'main-bodleian',
    hallName: READING_HALL_INFO['main-bodleian'].name,
    studentName: 'Sardorbek Islomov (TUAF 70410102 Iqtisodiyot magistranti)',
    studentId: 'HEMIS-TUAF-2026-8841',
    date: '2026-11-08',
    timeSlot: '09:00 – 12:30',
    durationHours: '3.5 soat (Ertalabki smena)',
    ticketCode: 'TUAF-JOY-1108',
    purpose: 'Iqtisodiyot (70410102) magistrlik dissertatsiyasi dastlabki himoyasiga tayyorgarlik',
    status: 'confirmed',
    createdAt: '2026-11-07 14:20',
  },
];

export const INITIAL_BOOK_LOANS: BookLoanReservation[] = [
  {
    id: 'tuaf-loan-201',
    resourceId: 'tuaf-omonov-banking-monograph',
    resourceTitle: INITIAL_LIBRARY_RESOURCES[0].title,
    authors: INITIAL_LIBRARY_RESOURCES[0].authors,
    callNumber: '60410600 · UDK 336.71',
    studentName: 'Sardorbek Islomov (TUAF Magistranti)',
    studentId: 'HEMIS-TUAF-2026-8841',
    pickupDate: '2026-11-06',
    dueDate: '2026-11-20',
    durationDays: 14,
    ticketCode: 'TUAF-KTB-4821',
    pickupLocation: '2-qavat, ARM Elektron va Bosma Fond Bo‘limi',
    format: 'digital-license',
    status: 'active',
  },
  {
    id: 'tuaf-loan-202',
    resourceId: 'tuaf-dsc-linguistics-corpora',
    resourceTitle: INITIAL_LIBRARY_RESOURCES[2].title,
    authors: INITIAL_LIBRARY_RESOURCES[2].authors,
    callNumber: '70230101 · UDK 811.111',
    studentName: 'Sardorbek Islomov (TUAF Magistranti)',
    studentId: 'HEMIS-TUAF-2026-8841',
    pickupDate: '2026-11-05',
    dueDate: '2026-11-19',
    durationDays: 14,
    ticketCode: 'TUAF-KTB-5190',
    pickupLocation: '1-qavat, ARM Abonement Topshirish Punkti (104-xona)',
    format: 'physical-pickup',
    status: 'ready-for-pickup',
  },
];

export const INITIAL_PERSONAL_NOTES: PersonalNote[] = [
  {
    id: 'tuaf-note-1',
    resourceId: 'tuaf-omonov-banking-monograph',
    resourceTitle: INITIAL_LIBRARY_RESOURCES[0].title,
    chapterNumber: 1,
    text: 'Prof. A. Omonov monografiyasidan: Tijorat banklarida raqamli kredit skoring tizimi operatsion xarajatlarni 28.4% ga qisqartiradi va CAR >= 13% mezonini ta’minlaydi.',
    createdAt: '2026-11-06',
  },
];
