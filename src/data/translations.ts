import { FacultyId, Language, ResourceType } from '../types/library';

export const UI_TRANSLATIONS: Record<
  Language,
  {
    brandName: string;
    navCatalog: string;
    navDissertations: string;
    navMediatheque: string;
    navReadingHall: string;
    navCabinet: string;
    topBarActionStudent: string;
    topBarActionAdmin: string;
    utilityHours: string;
    utilityAccess: string;
    utilityCollection: string;
    utilityStandard: string;
    heroKicker: string;
    heroTitle: string;
    heroSubtitle: string;
    searchPlaceholder: string;
    searchButton: string;
    advancedFilters: string;
    resetFilters: string;
    facultyLabel: string;
    programLabel: string;
    resourceTypeLabel: string;
    languageLabel: string;
    sortByLabel: string;
    openAccessLabel: string;
    peerReviewedLabel: string;
    resultsFound: string;
    readOnline: string;
    citeWork: string;
    reserveBook: string;
    reservedState: string;
    bookmarkAdd: string;
    bookmarkSaved: string;
    leadCuratedKicker: string;
    featuredSectionTitle: string;
    catalogSectionTitle: string;
    programsSectionTitle: string;
    programsSectionSubtitle: string;
    dissertationsTitle: string;
    dissertationsSubtitle: string;
    mediathequeTitle: string;
    mediathequeSubtitle: string;
    readingHallTitle: string;
    readingHallSubtitle: string;
    cabinetTitle: string;
    cabinetSubtitle: string;
    roleStudent: string;
    roleLibrarian: string;
    pagesUnit: string;
    citationsUnit: string;
    copiesAvailable: string;
    openAccessText: string;
    institutionalAccessText: string;
    noResultsTitle: string;
    noResultsDesc: string;
    citationModalTitle: string;
    copyCitation: string;
    copiedText: string;
    readerChapterList: string;
    readerNotesTitle: string;
    readerNotePlaceholder: string;
    readerSaveNote: string;
    seatAvailable: string;
    seatOccupied: string;
    seatSelected: string;
    seatYours: string;
    bookSeatAction: string;
    selectDateLabel: string;
    selectTimeSlotLabel: string;
    selectPurposeLabel: string;
    adminAddResourceTitle: string;
    adminManageLoansTitle: string;
    adminManageSeatsTitle: string;
    formTitleLabel: string;
    formAuthorsLabel: string;
    formDoiLabel: string;
    formIsbnLabel: string;
    formUdcLabel: string;
    formYearLabel: string;
    formAbstractLabel: string;
    formContentLabel: string;
    formSubmitButton: string;
  }
> = {
  uz: {
    brandName: 'Turon University · ARM',
    navCatalog: 'Katalog',
    navDissertations: 'Ilmiy ishlar',
    navMediatheque: 'Mediateka',
    navReadingHall: 'O‘quv zali',
    navCabinet: 'Kabinet',
    topBarActionStudent: 'Kabinet',
    topBarActionAdmin: 'Boshqaruv',
    utilityHours: 'Dush–Shan: 09:00–18:00 (Elektron baza 24/7)',
    utilityAccess: 'hemis.tuaf.uz · qabul.tuaf.uz',
    utilityCollection:
      '10,000+ o‘quv adabiyotlari · 50+ kompyuterlar · 200+ o‘quv o‘rni',
    utilityStandard: '+998 74 200 00 25 · turonuniversityandijan@gmail.com',
    heroKicker: 'TURON UNIVERSITETI ANDIJON FILIALI · ELEKTRON KUTUBXONA',
    heroTitle: 'Turon universiteti Andijon filiali',
    heroSubtitle:
      'Kelajagingizni Turon University bilan quring — 10,000+ darsliklar, ilmiy tadqiqotlar va zamonaviy axborot-resurs markazi.',
    searchPlaceholder:
      'Kitob nomi, muallif yoki yo‘nalishni yozing...',
    searchButton: 'Qidirish',
    advancedFilters: 'Filtrlar',
    resetFilters: 'Tozalash',
    facultyLabel: 'Kafedra',
    programLabel: 'Ta’lim yo‘nalishi',
    resourceTypeLabel: 'Adabiyot turi',
    languageLabel: 'Til',
    sortByLabel: 'Saralash',
    openAccessLabel: 'Ochiq manba (Open Access)',
    peerReviewedLabel: 'Ilmiy kengash tasdiqlagan',
    resultsFound: 'ta adabiyot topildi',
    readOnline: 'O‘qish',
    citeWork: 'Iqtibos',
    reserveBook: 'Band qilish',
    reservedState: 'Band qilingan',
    bookmarkAdd: 'Saqlash',
    bookmarkSaved: 'Saqlangan',
    leadCuratedKicker: 'TAVSIYA ETILGAN NASHRLAR',
    featuredSectionTitle: 'Asosiy darslik va monografiyalar',
    catalogSectionTitle: 'Elektron kutubxona katalogi',
    programsSectionTitle: 'Yo‘nalishlar bo‘yicha adabiyotlar',
    programsSectionSubtitle:
      'Yo‘nalishingizni tanlang va tegishli darsliklarni ko‘ring',
    dissertationsTitle: 'Dissertatsiyalar va ilmiy maqolalar',
    dissertationsSubtitle:
      'Magistrlik, PhD va DSc dissertatsiyalari hamda ilmiy to‘plamlar arxivi.',
    mediathequeTitle: 'Video va audio ma’ruzalar',
    mediathequeSubtitle:
      'Universitet professor-o‘qituvchilarining ma’ruzalari va dars konspektlari.',
    readingHallTitle: 'O‘quv zali va kompyuter xonasidan joy band qilish',
    readingHallSubtitle:
      'Axborot-resurs markazidagi 200+ o‘quv o‘rni va 50+ kompyuter stansiyalaridan bo‘sh joy tanlang.',
    cabinetTitle: 'Shaxsiy kabinet',
    cabinetSubtitle:
      'Band qilingan kitoblar, o‘quv zali talonlari va saqlangan qaydlar.',
    roleStudent: 'Talaba',
    roleLibrarian: 'Kutubxonachi (Admin)',
    pagesUnit: 'bet',
    citationsUnit: 'iqtibos',
    copiesAvailable: 'nusxa bor',
    openAccessText: 'Ochiq manba',
    institutionalAccessText: 'Universitet tarmog‘ida',
    noResultsTitle: 'So‘rovingiz bo‘yicha adabiyot topilmadi',
    noResultsDesc:
      'Qidiruv so‘zini o‘zgartiring yoki filtrlarni tozalab ko‘ring.',
    citationModalTitle: 'Ilmiy iqtibos nusxasini olish',
    copyCitation: 'Nusxa olish',
    copiedText: 'Nusxalandi',
    readerChapterList: 'Mundarija',
    readerNotesTitle: 'Shaxsiy qaydlar',
    readerNotePlaceholder: 'Mavzu bo‘yicha qayd yozing...',
    readerSaveNote: 'Saqlash',
    seatAvailable: 'Bo‘sh',
    seatOccupied: 'Band',
    seatSelected: 'Tanlandi',
    seatYours: 'Sizniki',
    bookSeatAction: 'Joyni band qilish',
    selectDateLabel: 'Sana',
    selectTimeSlotLabel: 'Vaqt',
    selectPurposeLabel: 'Maqsad',
    adminAddResourceTitle: 'Yangi adabiyot qo‘shish',
    adminManageLoansTitle: 'Band qilingan kitoblar',
    adminManageSeatsTitle: 'Band qilingan o‘quv o‘rinlari',
    formTitleLabel: 'Kitob yoki ilmiy ish nomi',
    formAuthorsLabel: 'Muallif(lar)',
    formDoiLabel: 'DOI raqami',
    formIsbnLabel: 'ISBN raqami',
    formUdcLabel: 'Yo‘nalish shifri / UDK',
    formYearLabel: 'Nashr yili',
    formAbstractLabel: 'Qisqacha mazmuni (Annotatsiya)',
    formContentLabel: 'Birinchi bob matni',
    formSubmitButton: 'Katalogga qo‘shish',
  },
  en: {
    brandName: 'Turon University · IRC',
    navCatalog: 'Catalog',
    navDissertations: 'Research',
    navMediatheque: 'Media',
    navReadingHall: 'Reading Hall',
    navCabinet: 'Cabinet',
    topBarActionStudent: 'My Cabinet',
    topBarActionAdmin: 'Admin',
    utilityHours: 'Mon–Sat: 09:00–18:00 (24/7 Digital Library)',
    utilityAccess: 'hemis.tuaf.uz · qabul.tuaf.uz',
    utilityCollection:
      '10,000+ Textbooks · 50+ PCs · 200+ Study Seats',
    utilityStandard: '+998 74 200 00 25 · turonuniversityandijan@gmail.com',
    heroKicker: 'TURON UNIVERSITY ANDIJAN BRANCH · DIGITAL LIBRARY',
    heroTitle: 'Turon University Andijan Branch',
    heroSubtitle:
      'Build your future with Turon University — 10,000+ textbooks, academic papers, and modern study spaces.',
    searchPlaceholder:
      'Search by book title, author, or subject...',
    searchButton: 'Search',
    advancedFilters: 'Filters',
    resetFilters: 'Reset',
    facultyLabel: 'Department',
    programLabel: 'Degree Program',
    resourceTypeLabel: 'Format',
    languageLabel: 'Language',
    sortByLabel: 'Sort By',
    openAccessLabel: 'Open Access',
    peerReviewedLabel: 'Peer-Reviewed',
    resultsFound: 'resources found',
    readOnline: 'Read',
    citeWork: 'Cite',
    reserveBook: 'Reserve',
    reservedState: 'Reserved',
    bookmarkAdd: 'Save',
    bookmarkSaved: 'Saved',
    leadCuratedKicker: 'FEATURED EDITIONS',
    featuredSectionTitle: 'Essential Textbooks & Monographs',
    catalogSectionTitle: 'Library Catalog',
    programsSectionTitle: 'Resources by Degree Program',
    programsSectionSubtitle:
      'Choose your program to view recommended textbooks and theses',
    dissertationsTitle: 'Dissertations & Research Papers',
    dissertationsSubtitle:
      'Full-text archive of Master’s, PhD, and DSc theses and scholarly articles.',
    mediathequeTitle: 'Video & Audio Lectures',
    mediathequeSubtitle:
      'Recorded university lectures with chapter timestamps and transcripts.',
    readingHallTitle: 'Reading Hall & Computer Desk Reservation',
    readingHallSubtitle:
      'Select an available study desk or computer workstation at the Information Resource Center.',
    cabinetTitle: 'Personal Cabinet',
    cabinetSubtitle:
      'Manage your reserved books, study hall passes, and saved reading notes.',
    roleStudent: 'Student',
    roleLibrarian: 'Librarian (Admin)',
    pagesUnit: 'pp.',
    citationsUnit: 'citations',
    copiesAvailable: 'available',
    openAccessText: 'Open Access',
    institutionalAccessText: 'Campus Access',
    noResultsTitle: 'No matching resources found',
    noResultsDesc:
      'Try adjusting your search keywords or resetting the filters.',
    citationModalTitle: 'Copy Academic Citation',
    copyCitation: 'Copy',
    copiedText: 'Copied',
    readerChapterList: 'Contents',
    readerNotesTitle: 'My Notes',
    readerNotePlaceholder: 'Write a study note for this chapter...',
    readerSaveNote: 'Save',
    seatAvailable: 'Free',
    seatOccupied: 'Busy',
    seatSelected: 'Selected',
    seatYours: 'Yours',
    bookSeatAction: 'Reserve Desk',
    selectDateLabel: 'Date',
    selectTimeSlotLabel: 'Time Slot',
    selectPurposeLabel: 'Purpose',
    adminAddResourceTitle: 'Add New Publication',
    adminManageLoansTitle: 'Active Book Loans',
    adminManageSeatsTitle: 'Active Desk Bookings',
    formTitleLabel: 'Publication Title',
    formAuthorsLabel: 'Author(s)',
    formDoiLabel: 'DOI Identifier',
    formIsbnLabel: 'ISBN',
    formUdcLabel: 'Program Code / UDC',
    formYearLabel: 'Year',
    formAbstractLabel: 'Abstract',
    formContentLabel: 'Opening Chapter Text',
    formSubmitButton: 'Add to Catalog',
  },
  ru: {
    brandName: 'Turon University · ИРЦ',
    navCatalog: 'Каталог',
    navDissertations: 'Научные труды',
    navMediatheque: 'Медиатека',
    navReadingHall: 'Читальный зал',
    navCabinet: 'Кабинет',
    topBarActionStudent: 'Кабинет',
    topBarActionAdmin: 'Управление',
    utilityHours: 'Пн–Сб: 09:00–18:00 (Электронная база 24/7)',
    utilityAccess: 'hemis.tuaf.uz · qabul.tuaf.uz',
    utilityCollection:
      '10 000+ учебных пособий · 50+ компьютеров · 200+ мест',
    utilityStandard: '+998 74 200 00 25 · turonuniversityandijan@gmail.com',
    heroKicker: 'АНДИЖАНСКИЙ ФИЛИАЛ УНИВЕРСИТЕТА ТУРОН · БИБЛИОТЕКА',
    heroTitle: 'Университет Турон Андижанский филиал',
    heroSubtitle:
      'Стройте будущее вместе с Turon University — 10 000+ учебников, научных трудов и современный читальный зал.',
    searchPlaceholder:
      'Введите название книги, автора или тему...',
    searchButton: 'Найти',
    advancedFilters: 'Фильтры',
    resetFilters: 'Сбросить',
    facultyLabel: 'Кафедра',
    programLabel: 'Направление обучения',
    resourceTypeLabel: 'Тип издания',
    languageLabel: 'Язык',
    sortByLabel: 'Сортировка',
    openAccessLabel: 'Открытый доступ',
    peerReviewedLabel: 'Рецензируемые издания',
    resultsFound: 'источников найдено',
    readOnline: 'Читать',
    citeWork: 'Цитировать',
    reserveBook: 'Забронировать',
    reservedState: 'В брони',
    bookmarkAdd: 'Сохранить',
    bookmarkSaved: 'Сохранено',
    leadCuratedKicker: 'РЕКОМЕНДУЕМЫЕ ИЗДАНИЯ',
    featuredSectionTitle: 'Основные учебники и монографии',
    catalogSectionTitle: 'Каталог электронной библиотеки',
    programsSectionTitle: 'Литература по направлениям',
    programsSectionSubtitle:
      'Выберите направление обучения для просмотра профильных учебников',
    dissertationsTitle: 'Диссертации и научные статьи',
    dissertationsSubtitle:
      'Архив магистерских, кандидатских и докторских диссертаций филиала.',
    mediathequeTitle: 'Видео- и аудиолекции',
    mediathequeSubtitle:
      'Записи лекций преподавателей университета с тайм-кодами и конспектами.',
    readingHallTitle: 'Бронирование мест в читальном зале',
    readingHallSubtitle:
      'Выберите свободный стол или компьютерную станцию в Информационно-ресурсном центре.',
    cabinetTitle: 'Личный кабинет',
    cabinetSubtitle:
      'Управление забронированными книгами, местами в зале и заметками.',
    roleStudent: 'Студент',
    roleLibrarian: 'Библиотекарь (Админ)',
    pagesUnit: 'стр.',
    citationsUnit: 'цит.',
    copiesAvailable: 'экз.',
    openAccessText: 'Открытый доступ',
    institutionalAccessText: 'Доступ в кампусе',
    noResultsTitle: 'По вашему запросу ничего не найдено',
    noResultsDesc:
      'Попробуйте изменить поисковый запрос или сбросить фильтры.',
    citationModalTitle: 'Скопировать библиографическую ссылку',
    copyCitation: 'Копировать',
    copiedText: 'Скопировано',
    readerChapterList: 'Оглавление',
    readerNotesTitle: 'Мои заметки',
    readerNotePlaceholder: 'Напишите заметку по главе...',
    readerSaveNote: 'Сохранить',
    seatAvailable: 'Свободно',
    seatOccupied: 'Занято',
    seatSelected: 'Выбрано',
    seatYours: 'Ваша бронь',
    bookSeatAction: 'Забронировать место',
    selectDateLabel: 'Дата',
    selectTimeSlotLabel: 'Время',
    selectPurposeLabel: 'Цель',
    adminAddResourceTitle: 'Добавить новое издание',
    adminManageLoansTitle: 'Забронированные книги',
    adminManageSeatsTitle: 'Брони мест в зале',
    formTitleLabel: 'Название книги или труда',
    formAuthorsLabel: 'Автор(ы)',
    formDoiLabel: 'DOI номер',
    formIsbnLabel: 'ISBN номер',
    formUdcLabel: 'Шифр направления / УДК',
    formYearLabel: 'Год издания',
    formAbstractLabel: 'Краткая аннотация',
    formContentLabel: 'Текст первой главы',
    formSubmitButton: 'Добавить в каталог',
  },
};

export const FACULTY_LABELS: Record<FacultyId, Record<Language, string>> = {
  all: {
    uz: 'Barcha kafedralar',
    en: 'All Departments',
    ru: 'Все кафедры',
  },
  'economics-finance': {
    uz: 'Iqtisodiyot va moliya kafedrasi',
    en: 'Economics & Finance',
    ru: 'Кафедра экономики и финансов',
  },
  'pedagogy-languages': {
    uz: 'Pedagogika va tillar kafedrasi',
    en: 'Pedagogy & Languages',
    ru: 'Кафедра педагогики и языков',
  },
  'natural-exact-sciences': {
    uz: 'Tabiiy va aniq fanlar kafedrasi',
    en: 'Natural & Exact Sciences',
    ru: 'Кафедра естественных и точных наук',
  },
  'humanities-social': {
    uz: 'Gumanitar va ijtimoiy fanlar',
    en: 'Humanities & Social Sciences',
    ru: 'Гуманитарные и социальные науки',
  },
  'digital-innovation': {
    uz: 'Raqamli ta’lim va ilmiy meros',
    en: 'Digital Education & Heritage',
    ru: 'Цифровое образование и наследие',
  },
};

export const RESOURCE_TYPE_LABELS: Record<
  ResourceType | 'all',
  Record<Language, string>
> = {
  all: {
    uz: 'Barcha turlar',
    en: 'All Types',
    ru: 'Все типы',
  },
  book: {
    uz: 'Darslik va monografiya',
    en: 'Textbook & Monograph',
    ru: 'Учебник и монография',
  },
  dissertation: {
    uz: 'Dissertatsiya',
    en: 'Dissertation',
    ru: 'Диссертация',
  },
  article: {
    uz: 'Ilmiy maqola',
    en: 'Research Article',
    ru: 'Научная статья',
  },
  manuscript: {
    uz: 'Nodir qo‘lyozma',
    en: 'Rare Manuscript',
    ru: 'Редкая рукопись',
  },
};
