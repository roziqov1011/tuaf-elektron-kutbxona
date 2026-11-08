export interface RoadmapCallout {
  badge: string;
  title: string;
  description: string;
}

export interface RoadmapSlide {
  stepNumber: number;
  code: string;
  badgeText: string;
  title: string;
  subtitle: string;
  screenshotUrl: string;
  screenshotCaption: string;
  targetTab?:
    | 'catalog'
    | 'famous-books'
    | 'dissertations'
    | 'mediatheque'
    | 'reading-hall'
    | 'cabinet';
  triggerSpotlight?: boolean;
  actionLabel: string;
  callouts: RoadmapCallout[];
  proTip: string;
}

export const STUDENT_ROADMAP_SLIDES: RoadmapSlide[] = [
  {
    stepNumber: 1,
    code: '01 / KIRISH VA UMUMIY XARITA',
    badgeText: '1-QADAM · PLATFORMAGA KIRISH',
    title: 'Turon University ARM Raqamli Kutubxonasiga Xush Kelibsiz!',
    subtitle:
      'Talaba sifatida 5 daqiqa ichida darslik topish, 2-betli kitob mutolaa qilish, PDF yuklash va o‘quv zalidan joy band qilishning to‘liq yo‘l xaritasi.',
    screenshotUrl: '/roadmap/step-1-hero-catalog.png',
    screenshotCaption:
      '1-rasm: Bosh sahifa, jonli qidiruv paneli va «Sohalar bo‘yicha mashhur kitoblar» 3D yog‘och javoni.',
    targetTab: 'catalog',
    actionLabel: 'Bosh sahifa va Katalogga o‘tish',
    callouts: [
      {
        badge: 'A',
        title: 'Yagona Navigatsiya Paneli (TopBar)',
        description:
          'Yuqori menyudan Katalog, Mashhur kitoblar, Dissertatsiyalar, Mediateka, O‘quv zali va Shaxsiy kabinetga 1 bosishda o‘ting.',
      },
      {
        badge: 'B',
        title: 'HEMIS ID orqali Tizimga Kirish',
        description:
          'O‘ng yuqoridagi «Tizimga kirish» tugmasini bosib, HEMIS ID raqamingiz bilan kiring — bu PDF yuklash va kitob band qilishni ochadi.',
      },
      {
        badge: 'C',
        title: '3D Kutubxona Javoni',
        description:
          'Sohalar bo‘yicha saralangan qattiq muqovali 3D kitoblarni ko‘ring va to‘g‘ridan-to‘g‘ri «Mutolaa» yoki «PDF» tugmasini bosing.',
      },
    ],
    proTip:
      'Platforma UZ / RU / EN tillarida to‘liq ishlaydi hamda kompyuter, planshet va smartfon ekranlariga avtomatik moslashadi.',
  },
  {
    stepNumber: 2,
    code: '02 / INTELLEKTUAL QIDIRUV (CTRL + K)',
    badgeText: '2-QADAM · 1 SONIYADA KITOB TOPISH',
    title: 'Ctrl + K — Intellektual Tezkor Qidiruv (Spotlight)',
    subtitle:
      'Yuzlab darslik va monografiyalar ichidan kerakli manbani kitob nomi, muallif, UDK shifri yoki yo‘nalish kodi (60410100) bo‘yicha lahzada toping.',
    screenshotUrl: '/roadmap/step-2-spotlight-search.png',
    screenshotCaption:
      '2-rasm: Ctrl + K bosilganda ochiladigan Intellektual Tezkor Qidiruv oynasi va tezkor amallar.',
    targetTab: 'catalog',
    triggerSpotlight: true,
    actionLabel: 'Ctrl + K Qidiruvni sinab ko‘rish',
    callouts: [
      {
        badge: '1',
        title: 'Klaviaturada Ctrl + K (yoki Cmd + K) bosing',
        description:
          'Yoki yuqori paneldagi «Qidiruv Ctrl+K» tugmasini bosing — qidiruv oynasi sahifadan chiqmasdan darhol ochiladi.',
      },
      {
        badge: '2',
        title: 'Tur bo‘yicha Tezkor Filtrlar',
        description:
          'Qidiruv natijalarini «Barchasi», «Kitob va darsliklar» yoki «Dissertatsiyalar» bo‘yicha bir zumda saralang.',
      },
      {
        badge: '3',
        title: 'Natijadan To‘g‘ridan-to‘g‘ri Amal Bajarish',
        description:
          'Topilgan kitob ustidan «Mutolaa», «PDF» yoki «Band qilish» tugmasini darhol bosing.',
      },
    ],
    proTip:
      'Agar aniq kitob nomini bilmasangiz, «Iqtisodiyot», «60410100» yoki «Pedagogika» kabi tayyor kalit so‘z chiplaridan birini bosing.',
  },
  {
    stepNumber: 3,
    code: '03 / OLTIN FOND VA CHUQUR FILTRLASH',
    badgeText: '3-QADAM · OLTIN FOND VA KATALOG',
    title: '«ARM Oltin Fondi» 3D Vitrinasi va Akademik Filtrlar',
    subtitle:
      'Universitetning eng nodir ilmiy nashrlarini 3D ekspozitsiyada ko‘ring va kafedra, til hamda nashr yili bo‘yicha chuqur saralang.',
    screenshotUrl: '/roadmap/step-3-exhibition-3d.png',
    screenshotCaption:
      '3-rasm: «ARM Oltin Fondi Ekspozitsiyasi · 3D Vitrina» va chap tomondagi kafedralar filtri.',
    targetTab: 'catalog',
    actionLabel: 'Oltin Fond vitrinasini ko‘rish',
    callouts: [
      {
        badge: '01–04',
        title: 'Interaktiv 3D Vitrina Tanlagichi',
        description:
          '01 dan 04 gacha raqamlangan tugmalarni bosib, Oltin Fonddagi eng sara monografiyalarni yog‘och postament ustida 3D formatda ko‘ring.',
      },
      {
        badge: 'BOB',
        title: 'Boblarni Tezkor Ko‘rib Chiqish',
        description:
          'Vitrina ichida kitobning iqtibosini o‘qing va istalgan bob ustiga bosib, o‘sha bobni ochiq kitob rejimida mutolaa qiling.',
      },
      {
        badge: 'FILTR',
        title: 'Kafedra va Yo‘nalish Katalogi',
        description:
          'Chap paneldan Iqtisodiyot va moliya, Pedagogika va tillar yoki Tabiiy fanlar kafedrasini tanlab, faqat o‘z yo‘nalishingiz adabiyotlarini chiqaring.',
      },
    ],
    proTip:
      'Har bir kitob kartochkasida jami nusxalar va hozir kutubxonada bo‘sh turgan nusxalar soni (masalan, 9/14 bo‘sh) aniq ko‘rsatiladi.',
  },
  {
    stepNumber: 4,
    code: '04 / 2-BETLI OCHIQ KITOB MUTOLAASI',
    badgeText: '4-QADAM · ONLAYN MUTOLAA VA QAYDLAR',
    title: 'Ikki Betli «Varaqlanadigan Kitob» Mutolaa Oynasi',
    subtitle:
      'Haqiqiy bosma kitob hissini beruvchi 2-betli (Verso / Recto) mutolaa rejimi, 3 xil qog‘oz rangi, shaxsiy konspektlar va GOST iqtibos.',
    screenshotUrl: '/roadmap/step-4-two-page-reader.png',
    screenshotCaption:
      '4-rasm: 2-betli ochiq kitob mutolaa oynasi, ipak xatcho‘p lentasi, boblar mundarijasi va qaydlar paneli.',
    targetTab: 'catalog',
    actionLabel: 'Mutolaa oynasini ochish',
    callouts: [
      {
        badge: '2-BET',
        title: '2-Betli Kitob va 1-Betli Rejimlar',
        description:
          'Yuqori paneldan «2-Betli Kitob» yoki «1-Betli» ko‘rinishni tanlang. «Keng ekran» tugmasi yon panellarni yashirib, e’tiborni faqat matnga qaratadi.',
      },
      {
        badge: 'FON',
        title: 'Ko‘zni Charchatmaydigan 3 Xil Qog‘oz Rangi',
        description:
          'Kunduzgi o‘qish uchun «Krem», klassik kitob uchun «Sepiya» va kechki mutolaa uchun «Tungi» rejimni hamda shrift o‘lchamini (A- / A+) sozlang.',
      },
      {
        badge: 'QAYD',
        title: 'Shaxsiy Qaydlar va GOST Iqtibos',
        description:
          'O‘ng panelda o‘qiyotgan bobingiz bo‘yicha konspekt yozib saqlang yoki «Iqtibos» tugmasi orqali kurs ishi/diplom ishi uchun tayyor GOST R 7.0.5-2008 havolasini nusxalab oling.',
      },
    ],
    proTip:
      'Yozgan barcha qaydlaringiz va xatcho‘pga qo‘shgan kitoblaringiz Shaxsiy kabinetingizda avtomatik saqlanib qoladi.',
  },
  {
    stepNumber: 5,
    code: '05 / O‘QUV ZALI VA QR-CHIPTA',
    badgeText: '5-QADAM · O‘QUV ZALIDAN JOY BAND QILISH',
    title: 'O‘quv Zali Interaktiv Xaritasi va Elektron QR-Ruxsatnoma',
    subtitle:
      'Kutubxonaga kelishdan oldin Asosiy o‘quv zali, Raqamli laboratoriya yoki Magistrlar zalidan bo‘sh stolni tanlang va QR-talon oling.',
    screenshotUrl: '/roadmap/step-5-reading-hall-qr.png',
    screenshotCaption:
      '5-rasm: O‘quv zali stollari interaktiv sxemasi, bandlov formasi va elektron QR-ruxsatnoma.',
    targetTab: 'reading-hall',
    actionLabel: 'O‘quv zalidan joy band qilish',
    callouts: [
      {
        badge: 'ZAL',
        title: '3 Ta Maxsus O‘quv Zali va Jihozlar Filtri',
        description:
          '2-qavat Asosiy o‘quv zali, 3-qavat Ilmiy-tadqiqot zali yoki 1-qavat Raqamli mediatekadan o‘zingizga qulay stolni (220V rozetka, monoblok yoki sokin hudud) tanlang.',
      },
      {
        badge: 'VAQT',
        title: 'Sana va Vaqt Oralig‘ini Belgilash',
        description:
          'Yashil rangdagi bo‘sh stol ustiga bosing, o‘quv smenasini (masalan, 09:00–13:00 yoki 14:00–18:00) tanlang va «Joyni tasdiqlash» tugmasini bosing.',
      },
      {
        badge: 'QR',
        title: 'Elektron QR-Talonni Yuklab Olish',
        description:
          'Bandlov tasdiqlangach, maxsus #TUAF-JOY-... kodli elektron QR-talon hosil bo‘ladi — uni PDF shaklida yuklab olib, zalga kirishda ko‘rsating.',
      },
    ],
    proTip:
      'Rejangiz o‘zgarsa, band qilingan joyni 1 bosishda bekor qilib, boshqa talabalar uchun bo‘shatib qo‘yishingiz mumkin.',
  },
  {
    stepNumber: 6,
    code: '06 / SHAXSIY KABINET VA KITOB BRONLASH',
    badgeText: '6-QADAM · TALABA SHAXSIY KABINETI',
    title: 'Talaba Shaxsiy Kabineti, Kitob Bronlash va Muddatni Uzaytirish',
    subtitle:
      'Olgan kitoblaringizni qaytarish sanasini kuzating, ijara muddatini onlayn +7 kunga uzaytiring va elektron ruxsatnomalarni boshqaring.',
    screenshotUrl: '/roadmap/step-6-student-cabinet.png',
    screenshotCaption:
      '6-rasm: Talaba shaxsiy kabineti — faol kitob bronlari, muddatni +7 kunga uzaytirish va QR-talonlar.',
    targetTab: 'cabinet',
    actionLabel: 'Shaxsiy kabinetni ochish',
    callouts: [
      {
        badge: 'BRON',
        title: 'Kitobni 3, 7, 14 yoki 30 Kunga Band Qilish',
        description:
          'Istalgan kitob kartochkasida «Band qilish» tugmasini bosib, olib ketish sanasi va ijara muddatini tanlang — tizim sizga #TUAF-KTB-... QR-talon beradi.',
      },
      {
        badge: '+7 KUN',
        title: 'Topshirish Muddatini Onlayn Uzaytirish',
        description:
          'Kitobni o‘qib tugata olmasangiz, kutubxonaga bormasdan kabinet ichidagi «+7 kun» tugmasi orqali ijara muddatini bir zumda uzaytiring.',
      },
      {
        badge: 'ARXIV',
        title: 'Saqlangan Kitoblar va Shaxsiy Qaydlar',
        description:
          'Xatcho‘pga olingan adabiyotlar, yuklab olingan PDF fayllar va boblarga yozilgan barcha ilmiy qaydlaringiz bitta oynada jamlanadi.',
      },
    ],
    proTip:
      'Sinov uchun «Demo talaba ma’lumotlarini to‘ldirish» tugmasini bosib, barcha imkoniyatlarni darhol tekshirib ko‘rishingiz mumkin!',
  },
];
