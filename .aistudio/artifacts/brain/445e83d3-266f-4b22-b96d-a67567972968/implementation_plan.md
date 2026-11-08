# TUAF Elektron Kutubxonasi — @tuaf_arm_bot Rasmiy Telegram Bot Ekotizimi Rejasi

Turon University Andijon filiali (TUAF) Axborot-resurs markazi foydalanuvchilari uchun kutubxona xizmatlaridan 24/7 rejimda mobil telefon orqali tez va oson foydalanish imkonini beruvchi **@tuaf_arm_bot** Telegram bot tizimi. Ushbu yechim veb-platforma ichida real vaqtda sinab ko‘rish mumkin bo‘lgan **Interaktiv Telegram Bot Simulyatori** (veb-sayt ma’lumotlar bazasi bilan to‘liq sinxronlangan) hamda real serverda ishga tushirishga tayyor **Production Telegram Bot kodi va Boshqaruv markazi**ni o‘z ichiga oladi.

## Foydalanuvchi Tanlovlari va Tasdiqlangan Qarorlar

> [!IMPORTANT]
> Boshlang‘ich savol-javob bosqichida siz tomoningizdan tasdiqlangan ustuvor qarorlar:

- **Amalga oshirish formati**: **Veb-ilovada interaktiv bot simulyatori + Tayyor Telegram Bot kodi**. Talaba va kutubxonachilar botning barcha imkoniyatlarini bevosita saytning o‘zida (Telegram interfeysida) jonli sinab ko‘rishlari mumkin, dasturchi/admin esa tayyor Node.js/TypeScript bot kodini bir tugma bilan nusxalab yoki yuklab olib real `@BotFather` tokeniga ulay oladi.
- **Asosiy funksional qulayliklar**:
  1. **Kitob qidirish, PDF yuklab olish va oldindan band qilish** (3, 7, 14 yoki 30 kunga muddat tanlash bilan).
  2. **O‘quv zalidan joy band qilish va QR-chipta olish** (hududlar va vaqt smenalari bo‘yicha bo‘sh stollarni tanlash hamda `#TUAF-JOY-...` raqamli talonini olish).
  3. **Ijara muddati tugashi haqida avtomatik eslatmalar** (muddatiga 3 kun, 1 kun qolganda va muddati o‘tganda keladigan ogohlantirish xabarlari hamda botning o‘zidan turib muddatni `+7 kunga uzaytirish` tugmasi).
- **Bot ichidagi foydalanuvchi interfeysi (UX)**: **Faqat klassik inline tugmalar va matnli buyruqlar (`/start`, `/search`, `/mybooks`, `/seat`, `/reminders`, `/help`)**. Qo‘shimcha WebApp oynalarisiz, barcha eski va yangi smartfonlarda, hatto past internet tezligida ham bir zumda ishlovchi tezkor tugmali menyu.

---

## 1. Umumiy Konsepsiya va Foydalanuvchi Qiymati

- **Nima vazifa bajaradi**: Talabaga veb-brauzerga kirmasdan turib, Telegram orqali darslik yoki ilmiy dissertatsiyani 5 soniyada topish, uning elektron PDF nusxasini olish, bosma nusxasini kutubxonaga borishdan oldin o‘z nomiga band qilib qo‘yish, o‘quv zalidan bo‘sh kompyuter/stol band qilish va muddati yaqinlashgan kitoblarni jarimasiz uzaytirish imkonini beradi.
- **Kimlar uchun mo‘ljallangan**:
  - **TUAF talabalari va magistrantlari**: Tezkor qidiruv, QR-talonlar va muddat eslatmalari uchun.
  - **ARM kutubxonachilari va administratorlari**: Talabalarga avtomatik eslatmalar yuborish va bot orqali tushgan bandlovlarni ARM Admin panelida ko‘rish uchun.
- **Asosiy afzalligi**: Veb-katalog, Shaxsiy kabinet, ARM Admin paneli va Telegram bot yagona ma’lumotlar oqimida ishlaydi — botda band qilingan kitob yoki o‘quv zali joyi darhol saytdagi Shaxsiy kabinet va Admin panelda ham aks etadi.

---

## 2. Foydalanuvchi Tajribasi (UX) va Vizual Dizayn

### A. Asosiy Foydalanuvchi Oqimlari (Bot Ssenariylari)

1. **`/start` va HEMIS Avtorizatsiya Oqimi**:
   - Foydalanuvchi `/start` tugmasini bosadi.
   - Bot TUAF ARM rasmiy salomlashuv xabarini chiqaradi va agar talaba tizimga kirmagan bo‘lsa, **«🎓 HEMIS ID orqali ulash»** inline tugmasini ko‘rsatadi (agar saytda allaqachon kirgan bo‘lsa, profil avtomatik bog‘lanadi).
   - Asosiy 6 ta inline tugmali Bosh menyu ochiladi:
     - `🔍 Kitob qidirish va PDF`
     - `📚 Kitob band qilish`
     - `💺 O‘quv zalidan joy band qilish`
     - `🎫 Mening bandlovlarim va QR-talon`
     - `⏰ Muddat eslatmalari (+7 kun uzaytirish)`
     - `ℹ️ ARM ish vaqti va aloqa`

2. **Kitob Qidirish, PDF Yuklash va Oldindan Band Qilish Oqimi**:
   - Talaba chatga istalgan kalit so‘zni (masalan, *"Bank ishi"*, *"Omonov"*, *"Pedagogika"*, *"Navoiy"*) yozadi yoki `🔍 Kitob qidirish` tugmasini bosib yo‘nalishni tanlaydi.
   - Bot topilgan kitoblar ro‘yxatini muallifi, UDK kodi, bo‘sh nusxalar soni bilan chiqaradi va har bir kitob ostida 3 ta inline tugma beradi:
     - `[📥 PDF yuklab olish]` — kitobning rasmiy PDF faylini darhol yuklab beradi.
     - `[📌 Band qilish (3/7/14/30 kun)]` — bosilganda bot muddat tanlash inline tugmalarini (`3 kun`, `7 kun`, `14 kun`, `30 kun`) chiqaradi. Muddat tanlangach, `#TUAF-KTB-...` QR-talonini generatsiya qiladi.
     - `[📖 Annotatsiya va Iqtibos]` — kitob haqida to‘liq ma’lumot va GOST/APA iqtibosini ko‘rsatadi.

3. **O‘quv Zalidan Joy Band Qilish Oqimi (`/seat`)**:
   - Talaba `💺 O‘quv zalidan joy band qilish` tugmasini bosadi.
   - **1-qadam (Hudud tanlash)**: Inline tugmalar orqali 3 ta hududdan biri tanlanadi (`Sokin mutolaa zali`, `Raqamli kompyuter markazi`, `Guruh bo‘lib ishlash zali`).
   - **2-qadam (Vaqt smenasi)**: Inline tugmalar orqali vaqt oralig‘i tanlanadi (`09:00–11:00`, `11:00–13:00`, `14:00–16:00`, `16:00–18:00`).
   - **3-qadam (Bo‘sh stol tanlash)**: Tanlangan hudud va vaqtda bo‘sh bo‘lgan stollar (`A-01`, `D-03`, `G-01` va h.k.) inline tugma sifatida chiqadi. Stol bosilishi bilan joy band qilinadi va `#TUAF-JOY-...` raqamli QR-taloni chatga yuboriladi.

4. **Ijara Muddati Tugashi Eslatmalari va Uzaytirish Oqimi (`/reminders`)**:
   - Bot talabaning barcha faol kitob bandlovlarini tekshiradi va qolgan kunlarni hisoblaydi.
   - Eslatma xabarida har bir kitobning topshirish sanasi, qolgan kunlar soni va bevosita xabar ostida:
     - `[🔄 Muddatni +7 kunga uzaytirish]`
     - `[🎫 QR-talonni ochish]`
     - `[❌ Bandlovni bekor qilish]`
     inline tugmalari joylashadi. Admin yoki talaba "Yangi eslatma simulyatsiyasi" tugmasi orqali muddati yaqinlashgan kitob bo‘yicha avtomatik push-xabarnoma kelishini jonli tekshirib ko‘rishi mumkin.

### B. Vizual Identifikatsiya va Joylashuv

- **Kirish nuqtalari**:
  - Yuqori navigatsiya panelida (`TopBar`) va Bosh sahifa tezkor xizmatlar qatorida **«Telegram Bot (@tuaf_arm_bot)»** bo‘limi.
  - Talaba shaxsiy kabinetida va ARM Admin panelida Telegram bot holati va tezkor o‘tish kartasi.
- **Ikki ustunli Muhandislik va Simulyatsiya Ish Maydoni (1440px Desktop)**:
  - **Chap ustun (Interaktiv Telegram Bot Simulyatori)**: Haqiqiy Telegram Desktop / Mobile uslubidagi zamonaviy chat oynasi — yuqorida `@tuaf_arm_bot` rasmiy tasdiqlangan (verified) sarlavhasi, o‘rtada jonli xabarlar tarixi va har bir bot javobi ostida **klassik inline klaviatura tugmalari (`InlineKeyboardMarkup`)**, pastda esa tezkor buyruqlar (`/start`, `/search`, `/seat`, `/mybooks`, `/reminders`) hamda matn kiritish maydoni.
  - **O‘ng ustun (Arxitektura, Jonli Sinxronizatsiya va Tayyor Bot Kodi)**:
    - **1-tab («Jonli Sinxronizatsiya va Ssenariylar»)**: Bir bosishda tayyor ssenariylarni ishga tushirish (masalan: *"Muddati tugayotgan kitob eslatmasini yuborish"*, *"O‘quv zalidan joy band qilishni sinash"*, *"Kitob qidirib PDF olish"*), bot orqali bajarilgan amallarning sayt bazasidagi jonli statistikasi.
    - **2-tab («Tayyor Node.js Bot Kodi & O‘rnatish»)**: `Telegraf` / `grammy` kutubxonasi asosida yozilgan, barcha inline tugmalar va webhook/polling mantiqiga ega to‘liq tayyor `bot.ts` kodi, `.env` namunasi va `@BotFather` orqali 3 qadamda serverga (Railway / Render / VPS) o‘rnatish yo‘riqnomasi (bir tugmada nusxalash va `.ts` fayl sifatida yuklab olish bilan).

---

## 3. Muhim Arxitektura Qarorlari va Asoslar

- **1-Qaror: Klassik Inline Tugmalar (`InlineKeyboardMarkup`) + Matnli Qidiruv**
  - *Tanlangan yechim*: Barcha amallar (muddat tanlash, hudud va stol tanlash, muddatni uzaytirish, QR-talon ko‘rish) chat xabarining o‘ziga biriktirilgan inline tugmalar orqali boshqariladi.
  - *Sababi*: Foydalanuvchi hech qanday murakkab buyruq yozishi shart emas — faqat kerakli tugmani bosadi yoki kitob nomini yozadi. Bu xatoliklarni 0% ga tushiradi va barcha qurilmalarda birdek tez ishlaydi.
- **2-Qaror: Veb-Ilova va Bot Simulyatori O‘rtasida Yagona Real-Vaqt Xotirasi (Single Source of Truth)**
  - *Tanlangan yechim*: Bot simulyatorida band qilingan kitob yoki o‘quv zali joyi to‘g‘ridan-to‘g‘ri ilovaning asosiy `loans`, `seatReservations` va `resources` holatini yangilaydi hamda haqiqiy QR-talon (`QrTicketModal`) va PDF fayllarni (`downloadResourcePdf`) ishga tushiradi.
  - *Sababi*: Bot shunchaki quruq rasm yoki statik matn emas, balki kutubxona tizimining to‘laqonli ishlaydigan moduli sifatida xizmat qiladi.

---

## 4. Texnik Arxitektura va Ma’lumotlar Oqimi

### A. Tizim Arxitekturasi va Komponentlar Diagrammasi

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                     TUAF ELEKTRON KUTUBXONASI (Yagona State)                 │
│     resources (Fond)  │  loans (Kitob bandlovlari)  │  seatReservations      │
└───────────────┬───────────────────────┬─────────────────────────┬────────────┘
                │                       │                         │
                ▼                       ▼                         ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                  TELEGRAM BOT DVIGATELI (Pure Logic Engine)                  │
│  • Buyruqlar parseri (/start, /search, /seat, /mybooks, /reminders, /help)   │
│  • CallbackQuery qayta ishlagich (reserve_book:id:days, book_seat:code:slot) │
│  • Avtomatik muddat eslatmalari generatori (3 kun, 1 kun, muddati o'tgan)    │
└──────────────────────────┬─────────────────────────────┬─────────────────────┘
                           │                             │
                           ▼                             ▼
┌─────────────────────────────────────────┐ ┌──────────────────────────────────┐
│   INTERAKTIV TELEGRAM BOT SIMULYATORI   │ │  TAYYOR NODE.JS BOT KODI & DOCS  │
│  • Jonli chat oqimi + Inline tugmalar   │ │  • To'liq Telegraf/Grammy kodi   │
│  • PDF yuklash va QR-talon modal ulanishi│ │  • @BotFather buyruqlar ro'yxati │
│  • Push-eslatма simulyatsiya tugmalari  │ │  • 1-klikda nusxalash va yuklash │
└─────────────────────────────────────────┘ └──────────────────────────────────┘
```

### B. Ma’lumotlar Modeli va Bot Holati (State)

- **`TelegramChatMessage`**:
  - `id`: Xabar identifikatori
  - `sender`: `'bot' | 'user'`
  - `text`: Formatlangan xabar matni (kitob ma’lumotlari, talon kodi, muddat holati)
  - `timestamp`: Vaqt belgisi (`HH:mm`)
  - `inlineKeyboard`: Qatorlar va ustunlardan iborat inline tugmalar massivi (`{ label: string; callbackData: string; badge?: string }[][]`)
  - `attachedTicket`: Agar xabarda bandlov tasdiqlangan bo‘lsa, QR-talonni bevosita ochish uchun `QrPassTicketItem` havolasi
  - `attachedResource`: PDF yuklab olish yoki mutolaa oynasini ochish uchun kitob havolasi
- **`CallbackData` Protokoli**:
  - `menu:main`, `menu:search`, `menu:seats`, `menu:mybooks`, `menu:reminders`, `menu:info`
  - `book:view:<resourceId>` — kitob kartasini va amal tugmalarini chiqarish
  - `book:pdf:<resourceId>` — PDF faylni yuklab olish
  - `book:ask_days:<resourceId>` — 3, 7, 14, 30 kunlik muddat tugmalarini ko‘rsatish
  - `book:reserve:<resourceId>:<days>` — kitobni tanlangan muddatga band qilish va `#TUAF-KTB-...` talonini yaratish
  - `loan:extend:<loanId>:7` — kitob topshirish muddatini +7 kunga uzaytirish
  - `loan:qr:<loanId>` — kitob QR-talonini ekranda ko‘rsatish
  - `seat:zone:<zoneId>` -> `seat:slot:<zoneId>:<slot>` -> `seat:book:<seatId>:<slot>` — 3 qadamda o‘quv zalidan joy band qilish va `#TUAF-JOY-...` talonini yaratish

### C. Interaktiv Komponentlar va Boshqaruv Xaritasi

- **Matnli qidiruv va buyruqlar kiritish**: Foydalanuvchi chat inputiga `/start` yozsa yoki pastdagi tezkor buyruq tugmasini bossa, bot darhol javob va inline klaviaturani qaytaradi; agar oddiy matn yozsa (masalan, *"Moliya"*), katalog bo‘ylab jonli qidiruv bajarilib, mos kitoblar inline tugmalar bilan chiqadi.
- **Inline tugma bosilishi (`onCallbackQuery`)**: Har bir inline tugma bosilganda real state o‘zgaradi (masalan, kitob band qilinganda bo‘sh nusxalar soni `-1` ga kamayadi, `loans` ro‘yxatiga yangi yozuv tushadi, muddat uzaytirilganda `dueDate` yangilanadi) va bot javob xabarini chatga qo‘shadi.
- **Avtomatik eslatma simulyatori**: Maxsus **«🔔 Muddat eslatmasini tekshirish»** tugmasi bosilganda, bot talabaning eng yaqin topshiriladigan kitobini topib, ogohlantirish xabarini va `[🔄 +7 kunga uzaytirish]` tugmasini yuboradi.
