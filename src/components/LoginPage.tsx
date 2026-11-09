import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Hash,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
  UserPlus,
  X,
} from 'lucide-react';
import { Language, StudentProfile } from '../types/library';
import {
  TUAF_HERO_VIDEO_POSTER,
  TUAF_OFFICIAL_LOGO,
  TUAF_OFFICIAL_PROGRAMS,
} from '../data/seedLibraryData';

export const DEMO_STUDENT_PROFILES: StudentProfile[] = [
  {
    id: 'stu-sardorbek',
    fullName: 'Sardorbek Islomov',
    hemisId: '395241101428',
    email: 's.islomov@tuaf.uz',
    programCode: '60410600',
    programName: 'Bank ishi',
    courseYear: '3-bosqich (Bakalavriat)',
    faculty: 'economics-finance',
    avatarInitials: 'SI',
    loginMethod: 'hemis',
    lastLoginAt: '2026-11-07 09:30',
  },
  {
    id: 'stu-madinabonu',
    fullName: 'Madinabonu Karimova',
    hemisId: '395241102109',
    email: 'm.karimova@tuaf.uz',
    programCode: '60230100-EN',
    programName: 'Filologiya: ingliz tili',
    courseYear: '2-bosqich (Bakalavriat)',
    faculty: 'pedagogy-languages',
    avatarInitials: 'MK',
    loginMethod: 'hemis',
    lastLoginAt: '2026-11-07 10:15',
  },
  {
    id: 'stu-javohirbek',
    fullName: 'Javohirbek Rustamov',
    hemisId: '395251200841',
    email: 'j.rustamov@tuaf.uz',
    programCode: '70410102',
    programName: 'Iqtisodiyot (Magistratura)',
    courseYear: '1-bosqich (Magistratura)',
    faculty: 'economics-finance',
    avatarInitials: 'JR',
    loginMethod: 'sso',
    lastLoginAt: '2026-11-07 11:00',
  },
];

interface LoginPageProps {
  lang: Language;
  onLoginSuccess: (profile: StudentProfile, rememberMe: boolean) => void;
  onClose?: () => void;
  mode?: 'modal' | 'inline';
  reasonMessage?: string | null;
}

type AuthTab = 'login' | 'register' | 'forgot';
type LoginMethod = 'hemis' | 'email';

function computePasswordStrength(pwd: string): {
  score: number;
  labelUz: string;
  labelRu: string;
  labelEn: string;
  colorClass: string;
} {
  if (!pwd) {
    return {
      score: 0,
      labelUz: 'Parol kiritilmagan',
      labelRu: 'Пароль не введен',
      labelEn: 'Enter password',
      colorClass: 'bg-stone-300',
    };
  }
  let score = 1;
  if (pwd.length >= 6) score++;
  if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score++;
  if (pwd.length >= 10 || /[^A-Za-z0-9]/.test(pwd)) score++;

  if (score === 1) {
    return {
      score: 1,
      labelUz: 'Zaif parol',
      labelRu: 'Слабый пароль',
      labelEn: 'Weak',
      colorClass: 'bg-red-500',
    };
  }
  if (score === 2) {
    return {
      score: 2,
      labelUz: 'O‘rtacha',
      labelRu: 'Средний',
      labelEn: 'Fair',
      colorClass: 'bg-amber-500',
    };
  }
  if (score === 3) {
    return {
      score: 3,
      labelUz: 'Yaxshi himoyalangan',
      labelRu: 'Хороший',
      labelEn: 'Good',
      colorClass: 'bg-blue-600',
    };
  }
  return {
    score: 4,
    labelUz: 'Mustahkam parol',
    labelRu: 'Надежный пароль',
    labelEn: 'Strong',
    colorClass: 'bg-emerald-600',
  };
}

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'TU';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function LoginPage({
  lang,
  onLoginSuccess,
  onClose,
  mode = 'modal',
  reasonMessage,
}: LoginPageProps) {
  const [authTab, setAuthTab] = useState<AuthTab>('login');
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('hemis');

  // Login state
  const [identifier, setIdentifier] = useState('395241101428');
  const [password, setPassword] = useState('tuaf2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register state
  const [regFullName, setRegFullName] = useState('');
  const [regHemisId, setRegHemisId] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regProgramCode, setRegProgramCode] = useState('60410600');
  const [regCourseYear, setRegCourseYear] = useState('1-bosqich (Bakalavriat)');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Forgot password state
  const [forgotInput, setForgotInput] = useState('');
  const [forgotStep, setForgotStep] = useState<'request' | 'verify'>('request');
  const [recoveryCode, setRecoveryCode] = useState('2026');
  const [newPassword, setNewPassword] = useState('');

  // Feedback & loading
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pwdStrength = computePasswordStrength(regPassword);

  const handleQuickDemoLogin = (demoProfile: StudentProfile) => {
    setErrorMsg(null);
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(
        {
          ...demoProfile,
          lastLoginAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
        },
        true
      );
    }, 150);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setStatusMsg(null);

    const cleanId = identifier.trim();
    const cleanPwd = password.trim();

    if (cleanId.length < 3) {
      setErrorMsg(
        lang === 'ru'
          ? 'Пожалуйста, введите корректный HEMIS ID или Email.'
          : lang === 'en'
          ? 'Please enter a valid HEMIS ID or student email.'
          : 'HEMIS ID raqamingizni yoki talaba emailingizni to‘g‘ri kiriting.'
      );
      return;
    }

    if (cleanPwd.length < 4) {
      setErrorMsg(
        lang === 'ru'
          ? 'Пароль должен содержать не менее 4 символов.'
          : lang === 'en'
          ? 'Password must be at least 4 characters.'
          : 'Parol kamida 4 ta belgidan iborat bo‘lishi kerak.'
      );
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);

      // Match demo student or construct authenticated profile from input
      const matchedDemo = DEMO_STUDENT_PROFILES.find(
        (p) =>
          p.hemisId.toLowerCase() === cleanId.toLowerCase() ||
          p.email.toLowerCase() === cleanId.toLowerCase() ||
          p.fullName.toLowerCase().includes(cleanId.toLowerCase())
      );

      if (matchedDemo) {
        onLoginSuccess(
          {
            ...matchedDemo,
            loginMethod,
            lastLoginAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
          },
          rememberMe
        );
        return;
      }

      const isEmailInput = cleanId.includes('@');
      const displayName = isEmailInput
        ? cleanId
            .split('@')[0]
            .replace(/[._-]+/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase())
        : `Talaba (${cleanId})`;

      const customProfile: StudentProfile = {
        id: `stu-${Date.now()}`,
        fullName: displayName,
        hemisId: isEmailInput ? '395261100945' : cleanId,
        email: isEmailInput ? cleanId : `${cleanId.toLowerCase()}@tuaf.uz`,
        programCode: '60410600',
        programName: 'Bank ishi',
        courseYear: '2-bosqich (Bakalavriat)',
        faculty: 'economics-finance',
        avatarInitials: getInitials(displayName),
        loginMethod,
        lastLoginAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };

      onLoginSuccess(customProfile, rememberMe);
    }, 180);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setStatusMsg(null);

    if (regFullName.trim().length < 4) {
      setErrorMsg(
        lang === 'ru'
          ? 'Введите полное имя и фамилию студента.'
          : lang === 'en'
          ? 'Please enter your full name.'
          : 'Ism va familiyangizni to‘liq kiriting.'
      );
      return;
    }

    if (regHemisId.trim().length < 5) {
      setErrorMsg(
        lang === 'ru'
          ? 'Введите корректный HEMIS ID (минимум 5 символов).'
          : lang === 'en'
          ? 'Please enter a valid HEMIS Student ID.'
          : 'HEMIS ID yoki talabalik raqamingizni kiriting (kamida 5 ta belgi).'
      );
      return;
    }

    if (regPassword.trim().length < 6) {
      setErrorMsg(
        lang === 'ru'
          ? 'Пароль должен содержать минимум 6 символов.'
          : lang === 'en'
          ? 'Password must be at least 6 characters.'
          : 'Xavfsizlik uchun parol kamida 6 ta belgidan iborat bo‘lishi shart.'
      );
      return;
    }

    const selectedProg =
      TUAF_OFFICIAL_PROGRAMS.find((p) => p.code === regProgramCode) ||
      TUAF_OFFICIAL_PROGRAMS[0];

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const newProfile: StudentProfile = {
        id: `stu-reg-${Date.now()}`,
        fullName: regFullName.trim(),
        hemisId: regHemisId.trim(),
        email:
          regEmail.trim() ||
          `${regHemisId.trim().toLowerCase()}@student.tuaf.uz`,
        programCode: selectedProg.code,
        programName: selectedProg.name[lang],
        courseYear: regCourseYear,
        faculty: selectedProg.department,
        avatarInitials: getInitials(regFullName),
        loginMethod: 'hemis',
        lastLoginAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };
      onLoginSuccess(newProfile, true);
    }, 180);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (forgotStep === 'request') {
      if (forgotInput.trim().length < 4) {
        setErrorMsg(
          lang === 'ru'
            ? 'Введите ваш HEMIS ID или Email.'
            : lang === 'en'
            ? 'Please enter your HEMIS ID or Email.'
            : 'HEMIS ID raqamingizni yoki emailingizni kiriting.'
        );
        return;
      }
      setForgotStep('verify');
      setStatusMsg(
        lang === 'ru'
          ? 'Код подтверждения отправлен (тестовый код: 2026).'
          : lang === 'en'
          ? 'Verification code sent (demo code: 2026).'
          : 'Tasdiqlash kodi yuborildi (sinov kodi: 2026). Yangi parolni o‘rnating.'
      );
      return;
    }

    if (recoveryCode.trim().length < 4 || newPassword.trim().length < 4) {
      setErrorMsg(
        lang === 'ru'
          ? 'Введите код подтверждения и новый пароль.'
          : lang === 'en'
          ? 'Please enter the verification code and a new password.'
          : 'Tasdiqlash kodi va yangi parolni kiriting.'
      );
      return;
    }

    onLoginSuccess(
      {
        ...DEMO_STUDENT_PROFILES[0],
        hemisId: forgotInput.trim(),
        lastLoginAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      },
      true
    );
  };

  const cardContent = (
    <div className="bg-[#FBF9F5] border border-[#E5DEC9] rounded-2xl shadow-2xl overflow-hidden w-full max-w-5xl mx-auto my-auto">
      {/* Contextual Reason Banner (e.g. when triggered by PDF Download) */}
      {reasonMessage && (
        <div className="bg-[#0F2342] border-b border-white/15 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 text-xs text-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <BookOpen className="w-4 h-4 text-[#C59B27] shrink-0" />
            <span className="font-medium break-words">{reasonMessage}</span>
          </div>
          <span className="text-[11px] text-[#C59B27] font-mono-tabular whitespace-nowrap hidden sm:inline">
            TUAF · HEMIS Auth
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* LEFT COLUMN: Institutional Branding, Campus Visual & 1-Click Demo Profiles */}
        <div className="lg:col-span-5 relative bg-[#041E41] text-white p-5 sm:p-8 lg:p-9 flex flex-col justify-between overflow-hidden order-2 lg:order-1">
          <img
            src={TUAF_HERO_VIDEO_POSTER}
            alt="Turon University Andijon Filiali"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none select-none"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#041E41]/90 via-[#041E41]/95 to-[#041E41] pointer-events-none" />

          <div className="relative z-10 space-y-5">
            {/* Official TUAF Emblem */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl border-2 border-[#C59B27] bg-white p-1 flex items-center justify-center shrink-0 shadow-lg overflow-hidden">
                <img
                  src={TUAF_OFFICIAL_LOGO}
                  alt="TUAF Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-[#C59B27] font-semibold">
                  Turon University · Andijon
                </div>
                <div className="text-lg font-serif-academic font-bold text-white leading-tight">
                  {lang === 'ru'
                    ? 'Единый студенческий портал ARM'
                    : lang === 'en'
                    ? 'Student Digital Library Portal'
                    : 'Talaba Elektron Kutubxona Portali'}
                </div>
              </div>
            </div>

            {/* Key Benefits List */}
            <div className="space-y-3 pt-2 border-t border-white/15 text-xs text-stone-200">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                <span>
                  {lang === 'ru'
                    ? 'Бесплатное скачивание книг и учебников в формате PDF'
                    : lang === 'en'
                    ? 'Full PDF textbook & monograph downloads for registered students'
                    : 'Ro‘yxatdan o‘tgan talabalar uchun darslik va mashhur kitoblarni PDF formatda yuklab olish'}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                <span>
                  {lang === 'ru'
                    ? 'Онлайн-бронирование мест в читальном зале (200+ мест и 50+ ПК)'
                    : lang === 'en'
                    ? 'Instant seat & PC workstation booking in the 200+ seat reading hall'
                    : '200+ o‘rinli o‘quv zali va 50+ kompyuter xonasidan onlayn joy band qilish'}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                <span>
                  {lang === 'ru'
                    ? 'Синхронизация с профилем HEMIS (hemis.tuaf.uz)'
                    : lang === 'en'
                    ? 'Direct synchronization with your HEMIS academic profile'
                    : 'HEMIS (hemis.tuaf.uz) talabalik profili va shaxsiy konspektlar sinxronizatsiyasi'}
                </span>
              </div>
            </div>
          </div>

          {/* 1-Click Demo Student Profiles for Instant Testing */}
          <div className="relative z-10 pt-6 mt-6 border-t border-white/15 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#C59B27] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {lang === 'ru'
                  ? 'Быстрый вход (Тестовые профили):'
                  : lang === 'en'
                  ? '1-Click Instant Student Login:'
                  : 'Tezkor kirish (1-bosishda talaba profili):'}
              </span>
            </div>

            <div className="space-y-2">
              {DEMO_STUDENT_PROFILES.map((demo) => (
                <button
                  key={demo.id}
                  type="button"
                  onClick={() => handleQuickDemoLogin(demo)}
                  className="w-full p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-left transition-colors flex items-center justify-between gap-3 group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-8 h-8 rounded-lg bg-[#0099B5] text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {demo.avatarInitials}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate">
                        {demo.fullName}
                      </div>
                      <div className="text-[11px] text-stone-300 font-mono-tabular truncate">
                        HEMIS: {demo.hemisId} · {demo.programName}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#38BDF8] group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Multi-Mode Interactive Auth Forms */}
        <div className="lg:col-span-7 p-5 sm:p-8 lg:p-9 bg-[#FBF9F5] flex flex-col justify-between order-1 lg:order-2">
          <div className="space-y-5 sm:space-y-6">
            {/* Top Mode Switcher + Close Button */}
            <div className="flex items-center justify-between gap-2 sm:gap-4 border-b border-[#E5DEC9] pb-3.5 sm:pb-4">
              <div
                role="tablist"
                aria-label="Autentifikatsiya turi"
                className="flex items-center gap-1 p-1 bg-[#F3EFE6] border border-[#E5DEC9] rounded-xl flex-1 sm:flex-initial"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={authTab === 'login'}
                  onClick={() => {
                    setAuthTab('login');
                    setErrorMsg(null);
                    setStatusMsg(null);
                  }}
                  className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    authTab === 'login'
                      ? 'bg-[#0F2342] text-white shadow-sm'
                      : 'text-[#57534E] hover:text-[#0F2342]'
                  }`}
                >
                  {lang === 'ru'
                    ? 'Вход в кабинет'
                    : lang === 'en'
                    ? 'Sign In'
                    : 'Tizimga kirish'}
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={authTab === 'register'}
                  onClick={() => {
                    setAuthTab('register');
                    setErrorMsg(null);
                    setStatusMsg(null);
                  }}
                  className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    authTab === 'register'
                      ? 'bg-[#0F2342] text-white shadow-sm'
                      : 'text-[#57534E] hover:text-[#0F2342]'
                  }`}
                >
                  {lang === 'ru'
                    ? 'Регистрация'
                    : lang === 'en'
                    ? 'Register'
                    : 'Ro‘yxatdan o‘tish'}
                </button>
              </div>

              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Yopish"
                  className="p-2 rounded-lg text-[#57534E] hover:text-[#0F2342] hover:bg-[#F3EFE6] transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Alert & Status Messages */}
            {errorMsg && (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 flex items-center gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {statusMsg && (
              <div
                role="status"
                className="p-3.5 rounded-xl bg-[#F7F1E1] border border-[#B8860B] text-xs text-[#0F2342] flex items-center gap-2.5 font-medium"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{statusMsg}</span>
              </div>
            )}

            {/* MODE 1: LOGIN FORM */}
            {authTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div className="space-y-1">
                  <h2 className="text-2xl font-serif-academic font-bold text-[#0F2342]">
                    {lang === 'ru'
                      ? 'Добро пожаловать в кабинет студента'
                      : lang === 'en'
                      ? 'Welcome to Your Student Cabinet'
                      : 'Talaba shaxsiy kabinetiga kirish'}
                  </h2>
                  <p className="text-xs text-[#57534E]">
                    {lang === 'ru'
                      ? 'Войдите через HEMIS ID или корпоративную почту университета'
                      : lang === 'en'
                      ? 'Sign in with your HEMIS ID or university email address'
                      : 'HEMIS ID raqamingiz yoki universitet emailingiz orqali tizimga kiring'}
                  </p>
                </div>

                {/* Login Method Selector (HEMIS ID vs Email) */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMethod('hemis');
                      setIdentifier('395241101428');
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                      loginMethod === 'hemis'
                        ? 'bg-white border-[#0F2342] text-[#0F2342] shadow-sm'
                        : 'bg-[#F3EFE6]/60 border-[#E5DEC9] text-[#57534E] hover:text-[#0F2342]'
                    }`}
                  >
                    <Hash className="w-3.5 h-3.5 text-[#B8860B]" />
                    <span>HEMIS ID orqali</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLoginMethod('email');
                      setIdentifier('s.islomov@tuaf.uz');
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                      loginMethod === 'email'
                        ? 'bg-white border-[#0F2342] text-[#0F2342] shadow-sm'
                        : 'bg-[#F3EFE6]/60 border-[#E5DEC9] text-[#57534E] hover:text-[#0F2342]'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 text-[#B8860B]" />
                    <span>Email / Login orqali</span>
                  </button>
                </div>

                {/* Identifier Field */}
                <div>
                  <label
                    htmlFor="student-login-id"
                    className="block text-xs font-semibold text-[#0F2342] mb-1.5"
                  >
                    {loginMethod === 'hemis'
                      ? lang === 'ru'
                        ? 'HEMIS ID студента'
                        : lang === 'en'
                        ? 'Student HEMIS ID'
                        : 'Talaba HEMIS ID raqami'
                      : lang === 'ru'
                      ? 'Корпоративный Email или логин'
                      : lang === 'en'
                      ? 'University Email or Username'
                      : 'Talaba Email manzili yoki login'}
                  </label>
                  <div className="relative">
                    {loginMethod === 'hemis' ? (
                      <Hash className="w-4 h-4 text-[#57534E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    ) : (
                      <Mail className="w-4 h-4 text-[#57534E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    )}
                    <input
                      id="student-login-id"
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={
                        loginMethod === 'hemis'
                          ? '395241101428'
                          : 'talaba@tuaf.uz'
                      }
                      className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-[#E5DEC9] rounded-xl text-[#1C1917] font-mono-tabular focus:outline-none focus:border-[#0F2342]"
                      required
                    />
                  </div>
                </div>

                {/* Password Field with Visibility Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="student-login-password"
                      className="text-xs font-semibold text-[#0F2342]"
                    >
                      {lang === 'ru'
                        ? 'Пароль'
                        : lang === 'en'
                        ? 'Password'
                        : 'Parol'}
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthTab('forgot');
                        setErrorMsg(null);
                      }}
                      className="text-xs text-[#0099B5] hover:underline font-medium cursor-pointer"
                    >
                      {lang === 'ru'
                        ? 'Забыли пароль?'
                        : lang === 'en'
                        ? 'Forgot password?'
                        : 'Parolni unutdingizmi?'}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#57534E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="student-login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-11 py-3 text-sm bg-white border border-[#E5DEC9] rounded-xl text-[#1C1917] focus:outline-none focus:border-[#0F2342]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword ? 'Parolni yashirish' : 'Parolni ko‘rsatish'
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#57534E] hover:text-[#0F2342] cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between text-xs">
                  <label className="inline-flex items-center gap-2 text-[#57534E] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-[#E5DEC9] text-[#0F2342] focus:ring-[#0F2342]"
                    />
                    <span>
                      {lang === 'ru'
                        ? 'Запомнить меня на этом устройстве'
                        : lang === 'en'
                        ? 'Keep me signed in on this device'
                        : 'Ushbu qurilmada meni eslab qolish'}
                    </span>
                  </label>
                </div>

                {/* Submit & HEMIS SSO Buttons */}
                <div className="space-y-2.5 pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 bg-[#0F2342] hover:bg-[#173461] text-white text-sm font-semibold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <span>
                      {isSubmitting
                        ? lang === 'ru'
                          ? 'Вход в систему...'
                          : lang === 'en'
                          ? 'Signing in...'
                          : 'Tizimga kirilmoqda...'
                        : lang === 'ru'
                        ? 'Войти в личный кабинет'
                        : lang === 'en'
                        ? 'Sign In to Student Cabinet'
                        : 'Kabinetga kirish'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleQuickDemoLogin(DEMO_STUDENT_PROFILES[0])
                    }
                    className="w-full py-3 px-5 bg-[#F3EFE6] hover:bg-[#E5DEC9]/75 text-[#0F2342] border border-[#E5DEC9] text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <GraduationCap className="w-4 h-4 text-[#0099B5]" />
                    <span>
                      {lang === 'ru'
                        ? 'Быстрый вход через HEMIS SSO (hemis.tuaf.uz)'
                        : lang === 'en'
                        ? 'One-Click Sign In with HEMIS SSO (hemis.tuaf.uz)'
                        : 'HEMIS (hemis.tuaf.uz) orqali bir tugmada kirish'}
                    </span>
                  </button>
                </div>
              </form>
            )}

            {/* MODE 2: STUDENT REGISTRATION FORM */}
            {authTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-serif-academic font-bold text-[#0F2342]">
                    {lang === 'ru'
                      ? 'Регистрация читательского билета'
                      : lang === 'en'
                      ? 'Create Student Library Account'
                      : 'Yangi talaba sifatida ro‘yxatdan o‘tish'}
                  </h2>
                  <p className="text-xs text-[#57534E]">
                    {lang === 'ru'
                      ? 'Заполните данные для получения доступа к PDF-фонду библиотеки'
                      : lang === 'en'
                      ? 'Complete your student profile to unlock full PDF textbook downloads'
                      : 'PDF darsliklarni yuklab olish va o‘quv zalidan joy band qilish uchun ro‘yxatdan o‘ting'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label
                      htmlFor="reg-fullname"
                      className="block text-xs font-semibold text-[#0F2342] mb-1"
                    >
                      {lang === 'ru'
                        ? 'Ф.И.О. студента *'
                        : lang === 'en'
                        ? 'Full Name *'
                        : 'Ism va familiyangiz *'}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#57534E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="reg-fullname"
                        type="text"
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        placeholder="Masalan: Azizbek Toshmatov"
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-[#E5DEC9] rounded-xl text-[#1C1917] focus:outline-none focus:border-[#0F2342]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="reg-hemis"
                      className="block text-xs font-semibold text-[#0F2342] mb-1"
                    >
                      {lang === 'ru'
                        ? 'HEMIS ID / № студ. билета *'
                        : lang === 'en'
                        ? 'HEMIS Student ID *'
                        : 'HEMIS ID raqamingiz *'}
                    </label>
                    <div className="relative">
                      <Hash className="w-4 h-4 text-[#57534E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="reg-hemis"
                        type="text"
                        value={regHemisId}
                        onChange={(e) => setRegHemisId(e.target.value)}
                        placeholder="395261100450"
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-[#E5DEC9] rounded-xl text-[#1C1917] font-mono-tabular focus:outline-none focus:border-[#0F2342]"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label
                      htmlFor="reg-program"
                      className="block text-xs font-semibold text-[#0F2342] mb-1"
                    >
                      {lang === 'ru'
                        ? 'Направление обучения'
                        : lang === 'en'
                        ? 'Degree Program'
                        : 'Ta’lim yo‘nalishingiz'}
                    </label>
                    <select
                      id="reg-program"
                      value={regProgramCode}
                      onChange={(e) => setRegProgramCode(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs bg-white border border-[#E5DEC9] rounded-xl text-[#1C1917] focus:outline-none focus:border-[#0F2342]"
                    >
                      {TUAF_OFFICIAL_PROGRAMS.map((prog) => (
                        <option key={prog.code} value={prog.code}>
                          {prog.name[lang]} ({prog.code.split('-')[0]})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="reg-course-year"
                      className="block text-xs font-semibold text-[#0F2342] mb-1"
                    >
                      {lang === 'ru'
                        ? 'Курс обучения'
                        : lang === 'en'
                        ? 'Academic Year'
                        : 'O‘quv bosqichi'}
                    </label>
                    <select
                      id="reg-course-year"
                      value={regCourseYear}
                      onChange={(e) => setRegCourseYear(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs bg-white border border-[#E5DEC9] rounded-xl text-[#1C1917] focus:outline-none focus:border-[#0F2342]"
                    >
                      <option value="1-bosqich (Bakalavriat)">
                        1-bosqich (Bakalavriat)
                      </option>
                      <option value="2-bosqich (Bakalavriat)">
                        2-bosqich (Bakalavriat)
                      </option>
                      <option value="3-bosqich (Bakalavriat)">
                        3-bosqich (Bakalavriat)
                      </option>
                      <option value="4-bosqich (Bakalavriat)">
                        4-bosqich (Bakalavriat)
                      </option>
                      <option value="1-bosqich (Magistratura)">
                        1-bosqich (Magistratura)
                      </option>
                      <option value="2-bosqich (Magistratura)">
                        2-bosqich (Magistratura)
                      </option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label
                      htmlFor="reg-email"
                      className="block text-xs font-semibold text-[#0F2342] mb-1"
                    >
                      {lang === 'ru'
                        ? 'Email (необязательно)'
                        : lang === 'en'
                        ? 'Email (optional)'
                        : 'Email manzilingiz'}
                    </label>
                    <input
                      id="reg-email"
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="talaba@tuaf.uz"
                      className="w-full px-3 py-2.5 text-xs bg-white border border-[#E5DEC9] rounded-xl text-[#1C1917] focus:outline-none focus:border-[#0F2342]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="reg-password"
                      className="block text-xs font-semibold text-[#0F2342] mb-1"
                    >
                      {lang === 'ru'
                        ? 'Создайте пароль *'
                        : lang === 'en'
                        ? 'Create Password *'
                        : 'Parol yarating *'}
                    </label>
                    <div className="relative">
                      <input
                        id="reg-password"
                        type={showRegPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Kamida 6 ta belgi"
                        className="w-full pl-3 pr-9 py-2.5 text-xs bg-white border border-[#E5DEC9] rounded-xl text-[#1C1917] focus:outline-none focus:border-[#0F2342]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword((prev) => !prev)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#57534E] hover:text-[#0F2342]"
                      >
                        {showRegPassword ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Live Password Strength Indicator */}
                <div className="space-y-1">
                  <div className="grid grid-cols-4 gap-1.5 h-1.5">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`rounded-full transition-colors ${
                          pwdStrength.score >= level
                            ? pwdStrength.colorClass
                            : 'bg-[#E5DEC9]'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-[11px] text-[#57534E] flex items-center justify-between">
                    <span>
                      {lang === 'ru'
                        ? pwdStrength.labelRu
                        : lang === 'en'
                        ? pwdStrength.labelEn
                        : pwdStrength.labelUz}
                    </span>
                    <span>Kamida 6 belgi, harf va raqam</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 bg-[#0099B5] hover:bg-[#008199] text-white text-sm font-semibold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>
                    {lang === 'ru'
                      ? 'Зарегистрироваться и открыть доступ к PDF'
                      : lang === 'en'
                      ? 'Register & Unlock PDF Downloads'
                      : 'Ro‘yxatdan o‘tish va kabinetni ochish'}
                  </span>
                </button>
              </form>
            )}

            {/* MODE 3: FORGOT PASSWORD FLOW */}
            {authTab === 'forgot' && (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-serif-academic font-bold text-[#0F2342] flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-[#B8860B]" />
                    <span>
                      {lang === 'ru'
                        ? 'Восстановление доступа'
                        : lang === 'en'
                        ? 'Reset Student Password'
                        : 'Talaba parolini tiklash'}
                    </span>
                  </h2>
                  <p className="text-xs text-[#57534E]">
                    {lang === 'ru'
                      ? 'Введите ваш HEMIS ID для получения кода восстановления'
                      : lang === 'en'
                      ? 'Enter your HEMIS ID to reset your library password'
                      : 'HEMIS ID raqamingizni kiriting va yangi parol o‘rnating'}
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="forgot-hemis"
                    className="block text-xs font-semibold text-[#0F2342] mb-1"
                  >
                    HEMIS ID yoki Email
                  </label>
                  <input
                    id="forgot-hemis"
                    type="text"
                    value={forgotInput}
                    onChange={(e) => setForgotInput(e.target.value)}
                    placeholder="395241101428"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5DEC9] rounded-xl text-[#1C1917] font-mono-tabular"
                    required
                  />
                </div>

                {forgotStep === 'verify' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label
                        htmlFor="forgot-code"
                        className="block text-xs font-semibold text-[#0F2342] mb-1"
                      >
                        Tasdiqlash kodi
                      </label>
                      <input
                        id="forgot-code"
                        type="text"
                        value={recoveryCode}
                        onChange={(e) => setRecoveryCode(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5DEC9] rounded-xl text-[#1C1917] font-mono-tabular"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="forgot-new-pwd"
                        className="block text-xs font-semibold text-[#0F2342] mb-1"
                      >
                        Yangi parol
                      </label>
                      <input
                        id="forgot-new-pwd"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Yangi parol"
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5DEC9] rounded-xl text-[#1C1917]"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 px-5 bg-[#0F2342] hover:bg-[#173461] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    {forgotStep === 'request'
                      ? 'Tasdiqlash kodini olish'
                      : 'Parolni yangilash va kirish'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthTab('login')}
                    className="py-3 px-4 bg-[#F3EFE6] text-[#0F2342] text-xs font-semibold rounded-xl hover:bg-[#E5DEC9] transition-colors cursor-pointer"
                  >
                    Orqaga
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Bottom Security Footer */}
          <div className="pt-5 mt-6 border-t border-[#E5DEC9] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#57534E]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>
                {lang === 'ru'
                  ? 'Защищенная авторизация TUAF ARM'
                  : lang === 'en'
                  ? 'Protected by TUAF Digital Library Auth'
                  : 'Turon University ARM xavfsiz avtorizatsiya tizimi'}
              </span>
            </span>
            <span className="font-mono-tabular">hemis.tuaf.uz</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (mode === 'inline') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10">
        {cardContent}
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Talaba tizimga kirish oynasi"
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2.5 sm:p-6 bg-[#041E41]/80 backdrop-blur-sm overflow-y-auto"
    >
      {cardContent}
    </div>
  );
}
