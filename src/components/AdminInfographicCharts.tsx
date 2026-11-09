import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  BellRing,
  BookCheck,
  BookMarked,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  FolderKanban,
  Layers,
  Library,
  Search,
  Users,
} from 'lucide-react';
import {
  BookLoanReservation,
  Language,
  LibraryResource,
  ReadingRoomSeat,
  SeatReservation,
} from '../types/library';
import { FACULTY_LABELS } from '../data/translations';
import {
  AcademicLibraryGroup,
  INITIAL_ACADEMIC_GROUPS,
  LIBRARY_GENRE_CATEGORIES,
  MONTHLY_CIRCULATION_SERIES,
} from '../data/adminLibraryGroupsData';

interface AdminInfographicChartsProps {
  lang: Language;
  resources: LibraryResource[];
  loans: BookLoanReservation[];
  seats: ReadingRoomSeat[];
  seatReservations: SeatReservation[];
  onUpdateResourceCopies?: (resourceId: string, delta: number) => void;
}

type DashboardExplorerTab =
  | 'groups'
  | 'debts'
  | 'all-books'
  | 'genres'
  | 'reading-books'
  | 'free-books';

interface DonutSliceItem {
  id: string;
  label: string;
  count: number;
  percent: number;
  color: string;
}

/**
 * Generates a smooth cubic-bezier SVG path through a list of (x, y) coordinates
 */
function buildSmoothSplinePath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return path;
}

export const AdminInfographicCharts: React.FC<AdminInfographicChartsProps> = ({
  lang,
  resources,
  loans,
  onUpdateResourceCopies,
}) => {
  // Interactive state for Academic Groups & Student Debts
  const [groups, setGroups] = useState<AcademicLibraryGroup[]>(
    INITIAL_ACADEMIC_GROUPS
  );
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [groupStudentFilter, setGroupStudentFilter] = useState<
    'all' | 'reading' | 'overdue'
  >('all');

  // Explorer active tab & filters
  const [explorerTab, setExplorerTab] =
    useState<DashboardExplorerTab>('groups');
  const [selectedGenreId, setSelectedGenreId] = useState<string>('all');
  const [bookSearchQuery, setBookSearchQuery] = useState<string>('');

  // Chart interactive states
  const [hoveredMonthIndex, setHoveredMonthIndex] = useState<number | null>(4); // May 26 peak default highlight
  const [donutMode, setDonutMode] = useState<'status' | 'genre'>('status');

  // Compute aggregate library metrics
  const libraryMetrics = useMemo(() => {
    const totalTitles = resources.length;
    const totalCopies = resources.reduce((sum, r) => sum + r.totalCopies, 0);
    const freeCopies = resources.reduce((sum, r) => sum + r.availableCopies, 0);
    const checkedOutFromCatalog = Math.max(0, totalCopies - freeCopies);

    // Group student books & overdue debts
    let groupReadingBooksCount = 0;
    let overdueRecordsCount = 0;
    let overdueStudentsCount = 0;
    let totalPenaltyUzs = 0;

    groups.forEach((grp) => {
      grp.students.forEach((st) => {
        let studentHasOverdue = false;
        st.activeBooks.forEach((b) => {
          if (b.status === 'reading') {
            groupReadingBooksCount += 1;
          } else if (b.status === 'overdue') {
            groupReadingBooksCount += 1;
            overdueRecordsCount += 1;
            totalPenaltyUzs += b.penaltyAmountUzs;
            studentHasOverdue = true;
          }
        });
        if (studentHasOverdue) {
          overdueStudentsCount += 1;
        }
      });
    });

    const activeLoansCount =
      loans.filter((l) => l.status !== 'returned').length +
      groupReadingBooksCount;
    const totalReadingBooks = Math.max(checkedOutFromCatalog, activeLoansCount);

    return {
      totalTitles,
      totalCopies,
      freeCopies,
      totalReadingBooks,
      overdueRecordsCount,
      overdueStudentsCount,
      totalPenaltyUzs,
      totalGroups: groups.length,
      totalStudentsInGroups: groups.reduce((s, g) => s + g.totalStudents, 0),
    };
  }, [resources, loans, groups]);

  // All overdue debt items flattened across all groups
  const allOverdueItems = useMemo(() => {
    const list: {
      groupId: string;
      groupCode: string;
      programName: string;
      studentId: string;
      studentName: string;
      hemisId: string;
      phone: string;
      recordId: string;
      bookTitle: string;
      genre: string;
      callNumber: string;
      borrowedDate: string;
      dueDate: string;
      daysOverdue: number;
      penaltyAmountUzs: number;
      reminderSent?: boolean;
    }[] = [];

    groups.forEach((grp) => {
      grp.students.forEach((st) => {
        st.activeBooks.forEach((rec) => {
          if (rec.status === 'overdue') {
            list.push({
              groupId: grp.id,
              groupCode: grp.groupCode,
              programName: grp.programName,
              studentId: st.id,
              studentName: st.fullName,
              hemisId: st.hemisId,
              phone: st.phone,
              recordId: rec.id,
              bookTitle: rec.bookTitle,
              genre: rec.genre,
              callNumber: rec.callNumber,
              borrowedDate: rec.borrowedDate,
              dueDate: rec.dueDate,
              daysOverdue: rec.daysOverdue,
              penaltyAmountUzs: rec.penaltyAmountUzs,
              reminderSent: rec.reminderSent,
            });
          }
        });
      });
    });

    return list.sort((a, b) => b.daysOverdue - a.daysOverdue);
  }, [groups]);

  // All currently reading books flattened (both from groups and active loans)
  const allReadingBooksList = useMemo(() => {
    const items: {
      id: string;
      bookTitle: string;
      genre: string;
      callNumber: string;
      readerName: string;
      hemisId: string;
      groupCode: string;
      borrowedDate: string;
      dueDate: string;
      isOverdue: boolean;
      daysOverdue: number;
      groupId?: string;
      studentId?: string;
    }[] = [];

    groups.forEach((grp) => {
      grp.students.forEach((st) => {
        st.activeBooks.forEach((rec) => {
          if (rec.status === 'reading' || rec.status === 'overdue') {
            items.push({
              id: rec.id,
              bookTitle: rec.bookTitle,
              genre: rec.genre,
              callNumber: rec.callNumber,
              readerName: st.fullName,
              hemisId: st.hemisId,
              groupCode: grp.groupCode,
              borrowedDate: rec.borrowedDate,
              dueDate: rec.dueDate,
              isOverdue: rec.status === 'overdue',
              daysOverdue: rec.daysOverdue,
              groupId: grp.id,
              studentId: st.id,
            });
          }
        });
      });
    });

    loans
      .filter((l) => l.status !== 'returned')
      .forEach((loan) => {
        items.push({
          id: loan.id,
          bookTitle: loan.resourceTitle[lang],
          genre:
            loan.status === 'ready-for-pickup'
              ? '104-xonada tayyor (Bron)'
              : 'Muddatli abonement',
          callNumber: loan.callNumber,
          readerName: loan.studentName,
          hemisId: loan.studentId,
          groupCode: 'IQ-22-01',
          borrowedDate: loan.pickupDate,
          dueDate: loan.dueDate,
          isOverdue: false,
          daysOverdue: 0,
        });
      });

    return items;
  }, [groups, loans, lang]);

  // Handlers for clearing debt or sending notification
  const handleReturnStudentDebtBook = (
    groupId: string,
    studentId: string,
    recordId: string
  ) => {
    setGroups((prev) =>
      prev.map((grp) => {
        if (grp.id !== groupId) return grp;
        return {
          ...grp,
          students: grp.students.map((st) => {
            if (st.id !== studentId) return st;
            return {
              ...st,
              activeBooks: st.activeBooks.filter((b) => b.id !== recordId),
            };
          }),
        };
      })
    );
  };

  const handleSendDebtReminder = (
    groupId: string,
    studentId: string,
    recordId: string
  ) => {
    setGroups((prev) =>
      prev.map((grp) => {
        if (grp.id !== groupId) return grp;
        return {
          ...grp,
          students: grp.students.map((st) => {
            if (st.id !== studentId) return st;
            return {
              ...st,
              activeBooks: st.activeBooks.map((b) =>
                b.id === recordId ? { ...b, reminderSent: true } : b
              ),
            };
          }),
        };
      })
    );
  };

  // Donut Chart Slices (either by Book Status or by Book Genre) matching the reference screenshot style
  const donutSlices: DonutSliceItem[] = useMemo(() => {
    if (donutMode === 'status') {
      const free = libraryMetrics.freeCopies;
      const reading = Math.max(
        1,
        libraryMetrics.totalReadingBooks - libraryMetrics.overdueRecordsCount
      );
      const reserved = Math.max(
        2,
        loans.filter((l) => l.status === 'ready-for-pickup').length + 8
      );
      const overdue = Math.max(1, libraryMetrics.overdueRecordsCount);
      const sum = Math.max(1, free + reading + reserved + overdue);

      const pFree = Math.round((free / sum) * 100);
      const pReading = Math.round((reading / sum) * 100);
      const pReserved = Math.round((reserved / sum) * 100);
      const pOverdue = Math.max(1, 100 - pFree - pReading - pReserved);

      return [
        {
          id: 'free',
          label: 'Bo‘sh kitoblar',
          count: free,
          percent: pFree,
          color: '#3B82F6', // Bright Blue like "Bajarilgan 66%"
        },
        {
          id: 'overdue',
          label: 'Qarzdorlik',
          count: overdue,
          percent: pOverdue,
          color: '#10B981', // Green like "Qoralama"
        },
        {
          id: 'reading',
          label: 'O‘qilayotgan',
          count: reading,
          percent: pReading,
          color: '#8B5CF6', // Purple like "Qabul qilishga 30%"
        },
        {
          id: 'reserved',
          label: 'Bron va tekshiruvda',
          count: reserved,
          percent: pReserved,
          color: '#F59E0B', // Amber/Orange like "Qabul qilish va hisob-faktura"
        },
      ];
    }

    // Genre breakdown mode
    const counts = LIBRARY_GENRE_CATEGORIES.map((cat) => {
      const matched = resources.filter((r) =>
        (cat.matchTypes as readonly string[]).includes(r.type)
      );
      const copies = matched.reduce((s, r) => s + r.totalCopies, 0);
      return {
        id: cat.id,
        label: cat.shortName,
        count: Math.max(copies, matched.length * 10 + 12),
        color: cat.color,
      };
    });

    const total = Math.max(
      1,
      counts.reduce((s, c) => s + c.count, 0)
    );

    let running = 0;
    return counts.map((c, idx) => {
      const pct =
        idx === counts.length - 1
          ? Math.max(1, 100 - running)
          : Math.round((c.count / total) * 100);
      running += pct;
      return {
        ...c,
        percent: pct,
      };
    });
  }, [donutMode, libraryMetrics, loans, resources]);

  // Geometry for Left Smooth Area Chart (viewBox 0 0 680 270)
  const areaChartGeometry = useMemo(() => {
    const padLeft = 54;
    const padRight = 22;
    const padTop = 18;
    const padBottom = 42;
    const width = 680;
    const height = 270;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;
    const maxY = 1000;

    const borrowedPts = MONTHLY_CIRCULATION_SERIES.map((item, idx) => {
      const x =
        padLeft +
        (idx / Math.max(1, MONTHLY_CIRCULATION_SERIES.length - 1)) * plotW;
      const y = padTop + plotH - (item.borrowedBooks / maxY) * plotH;
      return { x, y, item, idx };
    });

    const overduePts = MONTHLY_CIRCULATION_SERIES.map((item, idx) => {
      const x =
        padLeft +
        (idx / Math.max(1, MONTHLY_CIRCULATION_SERIES.length - 1)) * plotW;
      const y = padTop + plotH - (item.overdueCount / maxY) * plotH;
      return { x, y, item, idx };
    });

    const smoothLine = buildSmoothSplinePath(borrowedPts);
    const baselineY = padTop + plotH;
    const areaPath = `${smoothLine} L ${borrowedPts[borrowedPts.length - 1].x.toFixed(1)} ${baselineY} L ${borrowedPts[0].x.toFixed(1)} ${baselineY} Z`;
    const overdueLine = buildSmoothSplinePath(overduePts);

    return {
      width,
      height,
      padLeft,
      padRight,
      padTop,
      padBottom,
      plotW,
      plotH,
      baselineY,
      borrowedPts,
      overduePts,
      smoothLine,
      areaPath,
      overdueLine,
      yTicks: [0, 250, 500, 750, 1000],
    };
  }, []);

  // Geometry for Right Donut Chart with Callout Lines (viewBox 0 0 560 270)
  const donutGeometry = useMemo(() => {
    const cx = 275;
    const cy = 122;
    const r = 68;
    const strokeWidth = 30;
    const circumference = 2 * Math.PI * r;

    // Start at -15 degrees so the big blue slice spans top/left like the screenshot
    let currentAngleDeg = -5;

    const segments = donutSlices.map((slice) => {
      const sweepDeg = (slice.percent / 100) * 360;
      const startDeg = currentAngleDeg;
      const midDeg = startDeg + sweepDeg / 2;
      currentAngleDeg += sweepDeg;

      const dashLength = Math.max(2, (slice.percent / 100) * circumference - 3);
      const dashOffset = -((startDeg + 90) / 360) * circumference;

      // Calculate callout line coordinates from outer edge of the donut
      const rad = (midDeg * Math.PI) / 180;
      const outerR = r + strokeWidth / 2;
      const elbowR = outerR + 18;

      const x1 = cx + Math.cos(rad) * outerR;
      const y1 = cy + Math.sin(rad) * outerR;
      const x2 = cx + Math.cos(rad) * elbowR;
      const y2 = cy + Math.sin(rad) * elbowR;

      const isRightSide = Math.cos(rad) >= 0;
      const x3 = isRightSide ? x2 + 18 : x2 - 18;
      const y3 = y2;

      return {
        ...slice,
        dashLength,
        dashOffset,
        x1,
        y1,
        x2,
        y2,
        x3,
        y3,
        isRightSide,
      };
    });

    return { cx, cy, r, strokeWidth, circumference, segments };
  }, [donutSlices]);

  // Filtered books for "Hamma kitoblar", "Janrlar", "Bo'sh kitoblar"
  const filteredCatalogBooks = useMemo(() => {
    return resources.filter((res) => {
      if (explorerTab === 'free-books' && res.availableCopies <= 0) {
        return false;
      }
      if (selectedGenreId !== 'all') {
        const genreObj = LIBRARY_GENRE_CATEGORIES.find(
          (g) => g.id === selectedGenreId
        );
        if (
          genreObj &&
          !(genreObj.matchTypes as readonly string[]).includes(res.type)
        ) {
          return false;
        }
      }
      if (bookSearchQuery.trim()) {
        const q = bookSearchQuery.toLowerCase();
        const matchTitle = res.title[lang].toLowerCase().includes(q);
        const matchAuthor = res.authors.some((a) =>
          a.toLowerCase().includes(q)
        );
        const matchUdc = res.udc.toLowerCase().includes(q);
        return matchTitle || matchAuthor || matchUdc;
      }
      return true;
    });
  }, [resources, explorerTab, selectedGenreId, bookSearchQuery, lang]);

  const activeGroup = useMemo(
    () => groups.find((g) => g.id === selectedGroupId) || null,
    [groups, selectedGroupId]
  );

  return (
    <section
      aria-label="Kutubxona paneli va Infografika"
      className="space-y-6"
    >
      {/* =====================================================================
          1. TOP HEADER & 4 KPI CARDS (Exact Visual Match to Reference Image)
          ===================================================================== */}
      <div className="bg-white border border-[#E5DEC9] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-6">
        {/* Title Row like "Xaridlar paneli" -> "Kutubxona paneli" */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <BarChart3 className="w-6 h-6 text-[#2563EB] shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
                Kutubxona paneli
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Kutubxona fondi, janrlar, o‘qilayotgan kitoblar, akademik guruhlar
              va o‘quvchilar qarzdorligi tahlili
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold text-[#334155]">
              Jami janrlar: <strong className="text-[#2563EB]">4 ta asosiy</strong>
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold text-[#334155]">
              Akademik guruhlar:{' '}
              <strong className="text-[#7C3AED]">
                {libraryMetrics.totalGroups} ta ({libraryMetrics.totalStudentsInGroups} talaba)
              </strong>
            </span>
          </div>
        </div>

        {/* 4 White KPI Cards with Right Circular Pastel Icons (Matching Reference Image) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Hamma kitoblar va Janrlar (Blue Circle) */}
          <button
            type="button"
            onClick={() => {
              setExplorerTab('all-books');
              setSelectedGenreId('all');
            }}
            className={`text-left bg-white rounded-xl p-5 border transition-all cursor-pointer flex items-center justify-between gap-3 ${
              explorerTab === 'all-books' || explorerTab === 'genres'
                ? 'border-[#3B82F6] ring-2 ring-[#3B82F6]/15 shadow-sm'
                : 'border-[#E2E8F0] hover:border-[#94A3B8] shadow-2xs'
            }`}
          >
            <div className="space-y-1.5 min-w-0">
              <div className="text-xs font-medium text-[#64748B]">
                Jami kitoblar fondi
              </div>
              <div className="text-xl sm:text-2xl font-bold text-[#0F172A] font-mono-tabular truncate">
                {libraryMetrics.totalCopies.toLocaleString()} nusxa
              </div>
              <div className="text-[11px] text-[#3B82F6] font-semibold">
                {libraryMetrics.totalTitles} nomda · 4 ta janr →
              </div>
            </div>
            <div className="w-11 h-11 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
              <Library className="w-5 h-5" />
            </div>
          </button>

          {/* Card 2: O'qilayotgan va Qarzdorlik (Orange Circle) */}
          <button
            type="button"
            onClick={() => setExplorerTab('debts')}
            className={`text-left bg-white rounded-xl p-5 border transition-all cursor-pointer flex items-center justify-between gap-3 ${
              explorerTab === 'debts'
                ? 'border-[#F97316] ring-2 ring-[#F97316]/15 shadow-sm'
                : 'border-[#E2E8F0] hover:border-[#94A3B8] shadow-2xs'
            }`}
          >
            <div className="space-y-1.5 min-w-0">
              <div className="text-xs font-medium text-[#64748B]">
                Qarzdor o‘quvchilar (Muddati o‘tgan)
              </div>
              <div className="text-xl sm:text-2xl font-bold text-[#0F172A] font-mono-tabular truncate">
                {libraryMetrics.overdueRecordsCount} ta kitob
              </div>
              <div className="text-[11px] text-[#EA580C] font-semibold">
                {libraryMetrics.overdueStudentsCount} nafar talaba ·{' '}
                {libraryMetrics.totalPenaltyUzs.toLocaleString()} so‘m →
              </div>
            </div>
            <div className="w-11 h-11 rounded-full bg-[#FFF7ED] text-[#EA580C] flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </button>

          {/* Card 3: Bo'sh kitoblar (Green Circle) */}
          <button
            type="button"
            onClick={() => setExplorerTab('free-books')}
            className={`text-left bg-white rounded-xl p-5 border transition-all cursor-pointer flex items-center justify-between gap-3 ${
              explorerTab === 'free-books'
                ? 'border-[#10B981] ring-2 ring-[#10B981]/15 shadow-sm'
                : 'border-[#E2E8F0] hover:border-[#94A3B8] shadow-2xs'
            }`}
          >
            <div className="space-y-1.5 min-w-0">
              <div className="text-xs font-medium text-[#64748B]">
                Bo‘sh kitoblar (Javonda mavjud)
              </div>
              <div className="text-xl sm:text-2xl font-bold text-[#0F172A] font-mono-tabular truncate">
                {libraryMetrics.freeCopies}
              </div>
              <div className="text-[11px] text-[#059669] font-semibold">
                O‘qilayotgan kitoblar: {libraryMetrics.totalReadingBooks} ta →
              </div>
            </div>
            <div className="w-11 h-11 rounded-full bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0">
              <BookCheck className="w-5 h-5" />
            </div>
          </button>

          {/* Card 4: Guruhlar va O'quvchilar (Purple Circle) */}
          <button
            type="button"
            onClick={() => {
              setExplorerTab('groups');
              setSelectedGroupId(null);
            }}
            className={`text-left bg-white rounded-xl p-5 border transition-all cursor-pointer flex items-center justify-between gap-3 ${
              explorerTab === 'groups'
                ? 'border-[#8B5CF6] ring-2 ring-[#8B5CF6]/15 shadow-sm'
                : 'border-[#E2E8F0] hover:border-[#94A3B8] shadow-2xs'
            }`}
          >
            <div className="space-y-1.5 min-w-0">
              <div className="text-xs font-medium text-[#64748B]">
                Jami guruhlar va kitobxonlar
              </div>
              <div className="text-xl sm:text-2xl font-bold text-[#0F172A] font-mono-tabular truncate">
                {libraryMetrics.totalGroups} ta guruh
              </div>
              <div className="text-[11px] text-[#7C3AED] font-semibold">
                Guruhga kirib o‘quvchilarni ko‘rish →
              </div>
            </div>
            <div className="w-11 h-11 rounded-full bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
          </button>
        </div>

        {/* ===================================================================
            2. TWO SIDE-BY-SIDE CHARTS (1:1 Style with Reference Image)
            =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* LEFT CHART: Smooth Area Spline Chart ("Oylik kitob aylanmasi") */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 flex flex-col justify-between shadow-2xs">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#0F172A]">
                  Oylik kitob aylanmasi
                </h3>
                <p className="text-xs text-[#64748B]">
                  Vaqt bo‘yicha o‘qilgan kitoblar va qarzdorlik ko‘rsatkichi
                </p>
              </div>
              {hoveredMonthIndex !== null &&
                MONTHLY_CIRCULATION_SERIES[hoveredMonthIndex] && (
                  <div className="px-3 py-1 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-mono-tabular text-[#1E40AF]">
                    <strong>
                      {MONTHLY_CIRCULATION_SERIES[hoveredMonthIndex].month}:
                    </strong>{' '}
                    {
                      MONTHLY_CIRCULATION_SERIES[hoveredMonthIndex]
                        .borrowedBooks
                    }{' '}
                    ta o‘qilgan ·{' '}
                    <span className="text-emerald-700 font-bold">
                      {
                        MONTHLY_CIRCULATION_SERIES[hoveredMonthIndex]
                          .overdueCount
                      }{' '}
                      ta qarzdor
                    </span>
                  </div>
                )}
            </div>

            {/* SVG Smooth Spline Area Chart */}
            <div className="w-full overflow-x-auto">
              <svg
                viewBox={`0 0 ${areaChartGeometry.width} ${areaChartGeometry.height}`}
                className="w-full h-auto min-w-[460px] select-none"
              >
                <defs>
                  <linearGradient
                    id="tuafBlueAreaGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.34" />
                    <stop offset="75%" stopColor="#3B82F6" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Y-Axis & Horizontal Grid Ticks */}
                <line
                  x1={areaChartGeometry.padLeft}
                  y1={areaChartGeometry.padTop}
                  x2={areaChartGeometry.padLeft}
                  y2={areaChartGeometry.baselineY}
                  stroke="#64748B"
                  strokeWidth="1"
                />
                {areaChartGeometry.yTicks.map((val) => {
                  const y =
                    areaChartGeometry.padTop +
                    areaChartGeometry.plotH -
                    (val / 1000) * areaChartGeometry.plotH;
                  return (
                    <g key={val}>
                      <line
                        x1={areaChartGeometry.padLeft - 4}
                        y1={y}
                        x2={areaChartGeometry.padLeft}
                        y2={y}
                        stroke="#64748B"
                        strokeWidth="1"
                      />
                      {val > 0 && (
                        <line
                          x1={areaChartGeometry.padLeft}
                          y1={y}
                          x2={
                            areaChartGeometry.width - areaChartGeometry.padRight
                          }
                          y2={y}
                          stroke="#F1F5F9"
                          strokeWidth="1"
                        />
                      )}
                      <text
                        x={areaChartGeometry.padLeft - 7}
                        y={y + 3.5}
                        textAnchor="end"
                        className="fill-[#64748B] text-[10px]"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* X-Axis Baseline */}
                <line
                  x1={areaChartGeometry.padLeft}
                  y1={areaChartGeometry.baselineY}
                  x2={areaChartGeometry.width - areaChartGeometry.padRight}
                  y2={areaChartGeometry.baselineY}
                  stroke="#64748B"
                  strokeWidth="1"
                />

                {/* Smooth Gradient Area Under Borrowed Books Curve */}
                <path
                  d={areaChartGeometry.areaPath}
                  fill="url(#tuafBlueAreaGrad)"
                />

                {/* Smooth Blue Spline Curve (O'qilgan kitoblar) */}
                <path
                  d={areaChartGeometry.smoothLine}
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                />

                {/* Green Line Along Bottom (Qarzdorlik / Kechikkan kitoblar) */}
                <path
                  d={areaChartGeometry.overdueLine}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2"
                />

                {/* Month Ticks, Labels & Interactive Hover Circles */}
                {areaChartGeometry.borrowedPts.map((pt) => {
                  const isActive = hoveredMonthIndex === pt.idx;
                  return (
                    <g
                      key={pt.item.month}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredMonthIndex(pt.idx)}
                      onClick={() => setHoveredMonthIndex(pt.idx)}
                    >
                      <line
                        x1={pt.x}
                        y1={areaChartGeometry.baselineY}
                        x2={pt.x}
                        y2={areaChartGeometry.baselineY + 5}
                        stroke="#64748B"
                        strokeWidth="1"
                      />
                      <text
                        x={pt.x}
                        y={areaChartGeometry.baselineY + 18}
                        textAnchor="middle"
                        className={`text-[10px] ${
                          isActive
                            ? 'fill-[#0F172A] font-bold'
                            : 'fill-[#64748B]'
                        }`}
                      >
                        {pt.item.month}
                      </text>
                      {/* Invisible wider hit target */}
                      <rect
                        x={pt.x - 18}
                        y={areaChartGeometry.padTop}
                        width="36"
                        height={areaChartGeometry.plotH}
                        fill="transparent"
                      />
                      {isActive && (
                        <>
                          <line
                            x1={pt.x}
                            y1={areaChartGeometry.padTop}
                            x2={pt.x}
                            y2={areaChartGeometry.baselineY}
                            stroke="#93C5FD"
                            strokeDasharray="3 3"
                            strokeWidth="1"
                          />
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r="4.5"
                            fill="#FFFFFF"
                            stroke="#2563EB"
                            strokeWidth="2.5"
                          />
                        </>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Bottom Legend matching "-o- Xarajat  -o- To'langan" */}
            <div className="flex items-center justify-center gap-6 pt-2 text-xs font-medium">
              <div className="flex items-center gap-1.5 text-[#3B82F6]">
                <span className="inline-flex items-center">
                  <span className="w-2 h-0.5 bg-[#3B82F6]" />
                  <span className="w-2 h-2 rounded-full border-2 border-[#3B82F6] bg-white" />
                  <span className="w-2 h-0.5 bg-[#3B82F6]" />
                </span>
                <span>O‘qilgan kitoblar</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#10B981]">
                <span className="inline-flex items-center">
                  <span className="w-2 h-0.5 bg-[#10B981]" />
                  <span className="w-2 h-2 rounded-full border-2 border-[#10B981] bg-white" />
                  <span className="w-2 h-0.5 bg-[#10B981]" />
                </span>
                <span>Qarzdorlik (Muddati o‘tgan)</span>
              </div>
            </div>
          </div>

          {/* RIGHT CHART: Donut Chart with Callout Lines ("Kitoblar holati / Janrlar") */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 flex flex-col justify-between shadow-2xs">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#0F172A]">
                  {donutMode === 'status'
                    ? 'Kitoblar holati'
                    : 'Janrlar bo‘yicha taqsimot'}
                </h3>
                <p className="text-xs text-[#64748B]">
                  {donutMode === 'status'
                    ? 'Kutubxona kitoblari holat bo‘yicha ulushi'
                    : 'Kutubxona adabiyotlari janrlar bo‘yicha ulushi'}
                </p>
              </div>

              {/* Switch between Status & Genres */}
              <div className="inline-flex rounded-lg bg-[#F1F5F9] p-0.5 border border-[#E2E8F0] text-xs">
                <button
                  type="button"
                  onClick={() => setDonutMode('status')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                    donutMode === 'status'
                      ? 'bg-white text-[#0F172A] shadow-2xs'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  Holat bo‘yicha
                </button>
                <button
                  type="button"
                  onClick={() => setDonutMode('genre')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                    donutMode === 'genre'
                      ? 'bg-white text-[#0F172A] shadow-2xs'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  Janrlar bo‘yicha
                </button>
              </div>
            </div>

            {/* SVG Donut with Outward Leader Lines & Colored Labels */}
            <div className="w-full overflow-x-auto flex items-center justify-center">
              <svg
                viewBox="0 0 560 250"
                className="w-full h-auto max-w-[540px] select-none"
              >
                {/* Donut Segments */}
                {donutGeometry.segments.map((seg) => (
                  <g key={seg.id}>
                    <circle
                      cx={donutGeometry.cx}
                      cy={donutGeometry.cy}
                      r={donutGeometry.r}
                      fill="transparent"
                      stroke={seg.color}
                      strokeWidth={donutGeometry.strokeWidth}
                      strokeDasharray={`${seg.dashLength} ${donutGeometry.circumference}`}
                      strokeDashoffset={seg.dashOffset}
                      className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                    />
                    {/* Callout Polyline */}
                    <polyline
                      points={`${seg.x1.toFixed(1)},${seg.y1.toFixed(1)} ${seg.x2.toFixed(1)},${seg.y2.toFixed(1)} ${seg.x3.toFixed(1)},${seg.y3.toFixed(1)}`}
                      fill="none"
                      stroke={seg.color}
                      strokeWidth="1.3"
                    />
                    {/* External Callout Label */}
                    <text
                      x={seg.isRightSide ? seg.x3 + 5 : seg.x3 - 5}
                      y={seg.y3 + 4}
                      textAnchor={seg.isRightSide ? 'start' : 'end'}
                      fill={seg.color}
                      className="text-[12px] font-medium"
                    >
                      {seg.label} {seg.percent}%
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Bottom Square Swatch Legend matching Reference Image */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-2 text-xs font-medium">
              {donutSlices.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-1.5"
                  style={{ color: s.color }}
                >
                  <span
                    className="w-3 h-3 rounded-2xs shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  <span>
                    {s.label} ({s.count} ta)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          3. INTERACTIVE ADMIN EXPLORER:
             - Guruhlar va O'quvchilar (with Group -> Student & Debt drill-down)
             - O'quvchilar qarzdorliklari
             - Hamma kitoblar
             - Janrlar
             - O'qilayotgan kitoblar
             - Bo'sh kitoblar
          ===================================================================== */}
      <div className="bg-white border border-[#E5DEC9] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
        {/* Navigation Pills for the 6 Requested Views */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E5DEC9] pb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
              KUTUBXONA BATAFSIL BAZASI VA GURUHLAR NAZORATI
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#0F2342] mt-0.5">
              Kitoblar, Janrlar, Guruhlar va O‘quvchilar Qarzdorligi Ro‘yxati
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-[#F8FAFC] p-1.5 rounded-xl border border-[#E2E8F0]">
            {[
              {
                id: 'groups' as const,
                label: `Guruhlar (${libraryMetrics.totalGroups})`,
                icon: Users,
              },
              {
                id: 'debts' as const,
                label: `Qarzdorliklar (${allOverdueItems.length})`,
                icon: AlertTriangle,
              },
              {
                id: 'all-books' as const,
                label: `Hamma kitoblar (${resources.length})`,
                icon: Library,
              },
              {
                id: 'genres' as const,
                label: 'Janrlar (4)',
                icon: FolderKanban,
              },
              {
                id: 'reading-books' as const,
                label: `O‘qilayotgan (${allReadingBooksList.length})`,
                icon: BookOpen,
              },
              {
                id: 'free-books' as const,
                label: `Bo‘sh kitoblar (${libraryMetrics.freeCopies})`,
                icon: BookCheck,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = explorerTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setExplorerTab(tab.id);
                    if (tab.id !== 'groups') {
                      setSelectedGroupId(null);
                    }
                  }}
                  className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    active
                      ? 'bg-[#0F2342] text-white shadow-xs'
                      : 'text-[#475569] hover:text-[#0F2342] hover:bg-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* -------------------------------------------------------------------
            VIEW 1: GURUHLAR VA GURUH ICHIDAGI O'QUVCHILAR / QARZDORLIKLAR
            ------------------------------------------------------------------- */}
        {explorerTab === 'groups' && (
          <div className="space-y-5">
            {!activeGroup ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5">
                  <div className="text-xs sm:text-sm text-[#334155]">
                    <strong>Guruhni tanlang:</strong> Guruh ustiga bossangiz,
                    shu guruhdagi barcha o‘quvchilar, ular o‘qiyotgan kitoblar
                    va muddati o‘tgan qarzdorliklar ochiladi.
                  </div>
                  <span className="text-xs font-bold text-[#2563EB] shrink-0">
                    Jami {groups.length} ta akademik guruh
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groups.map((grp) => {
                    const readingCount = grp.students.reduce(
                      (s, st) => s + st.activeBooks.length,
                      0
                    );
                    const overdueCount = grp.students.reduce(
                      (s, st) =>
                        s +
                        st.activeBooks.filter((b) => b.status === 'overdue')
                          .length,
                      0
                    );
                    const debtUzs = grp.students.reduce(
                      (s, st) =>
                        s +
                        st.activeBooks.reduce(
                          (acc, b) => acc + b.penaltyAmountUzs,
                          0
                        ),
                      0
                    );

                    return (
                      <div
                        key={grp.id}
                        onClick={() => {
                          setSelectedGroupId(grp.id);
                          setGroupStudentFilter('all');
                        }}
                        className="group bg-[#FBF9F5] hover:bg-white border border-[#E5DEC9] hover:border-[#2563EB] rounded-xl p-4 transition-all cursor-pointer shadow-2xs hover:shadow-md flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="px-2.5 py-1 rounded-lg bg-[#0F2342] text-white text-xs font-extrabold font-mono-tabular">
                              {grp.groupCode}
                            </span>
                            <span className="text-[11px] font-semibold text-[#64748B]">
                              {grp.courseYear} · {grp.totalStudents} nafar talaba
                            </span>
                          </div>

                          <h4 className="text-sm sm:text-base font-bold text-[#0F2342] group-hover:text-[#2563EB] transition-colors">
                            {grp.programName}
                          </h4>
                          <div className="text-xs text-[#57534E]">
                            Tyutor / Mas’ul: <strong>{grp.tutorName}</strong>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E5DEC9] text-xs font-mono-tabular">
                          <div className="bg-blue-50 border border-blue-200 text-blue-900 px-2.5 py-1.5 rounded-lg">
                            O‘qilmoqda: <strong>{readingCount} ta kitob</strong>
                          </div>
                          <div
                            className={`px-2.5 py-1.5 rounded-lg border ${
                              overdueCount > 0
                                ? 'bg-red-50 border-red-200 text-red-800 font-bold'
                                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            }`}
                          >
                            Qarzdorlik:{' '}
                            <strong>
                              {overdueCount > 0
                                ? `${overdueCount} ta (${(debtUzs / 1000).toFixed(1)}k)`
                                : 'Yo‘q'}
                            </strong>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs font-bold text-[#2563EB] pt-1">
                          <span>O‘quvchilar va qarzdorliklarni ko‘rish</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              /* INSIDE A SELECTED GROUP: Students & Their Book Debts */
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0F2342] text-white rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedGroupId(null)}
                      className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Barcha guruhlar</span>
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-[#C59B27] text-[#041E41] text-xs font-extrabold">
                          {activeGroup.groupCode}
                        </span>
                        <span className="text-xs text-stone-300">
                          {activeGroup.courseYear} · Tyutor:{' '}
                          {activeGroup.tutorName}
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-bold mt-0.5">
                        {activeGroup.programName} — Guruh o‘quvchilari va
                        qarzdorliklar
                      </h4>
                    </div>
                  </div>

                  {/* Filter students inside group */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { id: 'all' as const, label: 'Barcha o‘quvchilar' },
                      { id: 'reading' as const, label: 'Kitob o‘qiyotganlar' },
                      {
                        id: 'overdue' as const,
                        label: 'Qarzdorlar (Muddati o‘tgan)',
                      },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setGroupStudentFilter(f.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                          groupStudentFilter === f.id
                            ? 'bg-[#C59B27] text-[#041E41]'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Group Students List */}
                <div className="space-y-3">
                  {activeGroup.students
                    .filter((st) => {
                      if (groupStudentFilter === 'reading') {
                        return st.activeBooks.length > 0;
                      }
                      if (groupStudentFilter === 'overdue') {
                        return st.activeBooks.some(
                          (b) => b.status === 'overdue'
                        );
                      }
                      return true;
                    })
                    .map((student) => {
                      const hasOverdue = student.activeBooks.some(
                        (b) => b.status === 'overdue'
                      );
                      return (
                        <div
                          key={student.id}
                          className={`rounded-xl border p-4 space-y-3 ${
                            hasOverdue
                              ? 'bg-red-50/40 border-red-200'
                              : 'bg-[#FBF9F5] border-[#E5DEC9]'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm sm:text-base font-bold text-[#0F2342]">
                                  {student.fullName}
                                </span>
                                <span className="px-2 py-0.5 rounded bg-white border border-[#E5DEC9] text-[11px] font-mono-tabular text-[#57534E]">
                                  HEMIS: {student.hemisId}
                                </span>
                                <span className="text-xs text-[#57534E] font-mono-tabular">
                                  {student.phone}
                                </span>
                              </div>
                            </div>

                            <div>
                              {hasOverdue ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-600 text-white text-xs font-bold">
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                  <span>Qarzdorligi bor (Muddati o‘tgan)</span>
                                </span>
                              ) : student.activeBooks.length > 0 ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold">
                                  <BookOpen className="w-3.5 h-3.5" />
                                  <span>
                                    {student.activeBooks.length} ta kitob
                                    o‘qimoqda
                                  </span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Qarzdorlik yo‘q</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Books held by this student */}
                          {student.activeBooks.length > 0 && (
                            <div className="space-y-2 pt-2 border-t border-[#E5DEC9]">
                              {student.activeBooks.map((rec) => (
                                <div
                                  key={rec.id}
                                  className="bg-white border border-[#E5DEC9] rounded-lg p-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3"
                                >
                                  <div className="space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="text-xs sm:text-sm font-bold text-[#0F2342]">
                                        {rec.bookTitle}
                                      </span>
                                      <span className="px-2 py-0.5 rounded bg-[#F1F5F9] text-[#334155] text-[11px] font-semibold">
                                        {rec.genre}
                                      </span>
                                      <span className="text-[11px] font-mono-tabular text-[#64748B]">
                                        Shifr: {rec.callNumber}
                                      </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#57534E] font-mono-tabular">
                                      <span>Olingan: {rec.borrowedDate}</span>
                                      <span>
                                        Topshirish muddati:{' '}
                                        <strong>{rec.dueDate}</strong>
                                      </span>
                                      {rec.status === 'overdue' && (
                                        <span className="text-red-700 font-bold">
                                          • {rec.daysOverdue} kun kechikkan (
                                          {rec.penaltyAmountUzs.toLocaleString()}{' '}
                                          so‘m qarzdorlik)
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                                    {rec.status === 'overdue' && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleSendDebtReminder(
                                            activeGroup.id,
                                            student.id,
                                            rec.id
                                          )
                                        }
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                                          rec.reminderSent
                                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                            : 'bg-amber-500 hover:bg-amber-600 text-white'
                                        }`}
                                      >
                                        <BellRing className="w-3.5 h-3.5" />
                                        <span>
                                          {rec.reminderSent
                                            ? 'Ogohlantirish yuborildi ✓'
                                            : 'Talabani ogohlantirish'}
                                        </span>
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleReturnStudentDebtBook(
                                          activeGroup.id,
                                          student.id,
                                          rec.id
                                        )
                                      }
                                      className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>
                                        Kitobni qabul qilish (Qarzdorlikni
                                        yopish)
                                      </span>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------------------------
            VIEW 2: O'QUVCHILAR QARZDORLIKLARI (Barcha guruhlar bo'yicha)
            ------------------------------------------------------------------- */}
        {explorerTab === 'debts' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-red-50 border border-red-200 rounded-xl p-4">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-red-950">
                  Muddati o‘tgan kitoblar va qarzdor o‘quvchilar ro‘yxati
                </h4>
                <p className="text-xs text-red-800">
                  Topshirish muddati o‘tib ketgan talabalarga eslatma yuborish
                  yoki kitob qaytarilganda qarzdorlikni bir tugma bilan yopish
                  mumkin.
                </p>
              </div>
              <div className="text-right font-mono-tabular">
                <div className="text-xs text-red-800">Jami qarzdorlik:</div>
                <div className="text-lg font-extrabold text-red-900">
                  {libraryMetrics.totalPenaltyUzs.toLocaleString()} so‘m
                </div>
              </div>
            </div>

            {allOverdueItems.length === 0 ? (
              <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 font-bold">
                Barcha o‘quvchilar kitoblarni o‘z vaqtida topshirgan. Qarzdorliklar
                mavjud emas!
              </div>
            ) : (
              <div className="space-y-2.5">
                {allOverdueItems.map((item) => (
                  <div
                    key={item.recordId}
                    className="bg-white border border-red-200 rounded-xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setExplorerTab('groups');
                            setSelectedGroupId(item.groupId);
                          }}
                          className="px-2.5 py-0.5 rounded bg-[#0F2342] text-white text-xs font-bold hover:bg-[#2563EB] cursor-pointer"
                        >
                          {item.groupCode}
                        </button>
                        <span className="text-sm font-bold text-[#0F2342]">
                          {item.studentName}
                        </span>
                        <span className="text-xs font-mono-tabular text-[#64748B]">
                          HEMIS: {item.hemisId} · {item.phone}
                        </span>
                      </div>

                      <div className="text-xs sm:text-sm font-semibold text-[#1E293B]">
                        Kitob: «{item.bookTitle}» ({item.genre})
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs font-mono-tabular text-[#64748B]">
                        <span>Olingan: {item.borrowedDate}</span>
                        <span>Muddati: {item.dueDate}</span>
                        <span className="text-red-600 font-bold">
                          Kechikish: {item.daysOverdue} kun · Qarzdorlik:{' '}
                          {item.penaltyAmountUzs.toLocaleString()} so‘m
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          handleSendDebtReminder(
                            item.groupId,
                            item.studentId,
                            item.recordId
                          )
                        }
                        className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                          item.reminderSent
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-amber-500 hover:bg-amber-600 text-white'
                        }`}
                      >
                        <BellRing className="w-3.5 h-3.5" />
                        <span>
                          {item.reminderSent
                            ? 'Ogohlantirish yuborildi ✓'
                            : 'Ogohlantirish yuborish'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleReturnStudentDebtBook(
                            item.groupId,
                            item.studentId,
                            item.recordId
                          )
                        }
                        className="px-3 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Qarzdorlikni yopish</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------------------------
            VIEW 3: JANRLAR BO'YICHA KITOBLAR
            ------------------------------------------------------------------- */}
        {explorerTab === 'genres' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {LIBRARY_GENRE_CATEGORIES.map((genre) => {
                const matchedBooks = resources.filter((r) =>
                  (genre.matchTypes as readonly string[]).includes(r.type)
                );
                const totalCopies = matchedBooks.reduce(
                  (s, r) => s + r.totalCopies,
                  0
                );
                const freeCopies = matchedBooks.reduce(
                  (s, r) => s + r.availableCopies,
                  0
                );
                const isSelected = selectedGenreId === genre.id;

                return (
                  <button
                    key={genre.id}
                    type="button"
                    onClick={() => {
                      setSelectedGenreId(genre.id);
                      setExplorerTab('all-books');
                    }}
                    className={`text-left rounded-xl p-4 border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-[#0F2342] text-white border-[#0F2342]'
                        : 'bg-[#FBF9F5] hover:bg-white border-[#E5DEC9] hover:border-[#2563EB]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ backgroundColor: genre.color }}
                      />
                      <span className="text-xs font-mono-tabular font-bold">
                        {matchedBooks.length} nomda · {totalCopies} nusxa
                      </span>
                    </div>
                    <div className="text-sm font-bold">{genre.name}</div>
                    <p
                      className={`text-xs ${
                        isSelected ? 'text-stone-300' : 'text-[#57534E]'
                      }`}
                    >
                      {genre.description}
                    </p>
                    <div className="pt-1 text-xs font-bold text-[#2563EB] flex items-center justify-between">
                      <span>Bo‘sh: {freeCopies} nusxa</span>
                      <span>Kitoblarni ko‘rish →</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------
            VIEW 4: O'QILAYOTGAN KITOBLAR RO'YXATI
            ------------------------------------------------------------------- */}
        {explorerTab === 'reading-books' && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-blue-50 border border-blue-200 rounded-xl p-3.5 text-xs sm:text-sm text-blue-950">
              <span>
                Hozirda talabalar qo‘lida o‘qilayotgan va band qilingan barcha
                kitoblar ro‘yxati:
              </span>
              <strong>Jami {allReadingBooksList.length} ta faol yozuv</strong>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {allReadingBooksList.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#FBF9F5] border border-[#E5DEC9] rounded-xl p-4 flex flex-col justify-between gap-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#0F2342] text-white text-[11px] font-bold">
                        {item.groupCode}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          item.isOverdue
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {item.isOverdue
                          ? `Qarzdor (${item.daysOverdue} kun)`
                          : 'O‘qilmoqda'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[#0F2342]">
                      {item.bookTitle}
                    </h4>
                    <div className="text-xs text-[#57534E]">
                      O‘quvchi: <strong>{item.readerName}</strong> (HEMIS:{' '}
                      {item.hemisId})
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[#E5DEC9] flex items-center justify-between text-[11px] font-mono-tabular text-[#64748B]">
                    <span>Shifr: {item.callNumber}</span>
                    <span>Muddati: {item.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------
            VIEW 5 & 6: HAMMA KITOBLAR VA BO'SH KITOBLAR RO'YXATI
            ------------------------------------------------------------------- */}
        {(explorerTab === 'all-books' || explorerTab === 'free-books') && (
          <div className="space-y-4">
            {/* Search and Genre Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={bookSearchQuery}
                  onChange={(e) => setBookSearchQuery(e.target.value)}
                  placeholder="Kitob nomi, muallif yoki UDK shifri bo‘yicha qidirish..."
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F2342]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedGenreId('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                    selectedGenreId === 'all'
                      ? 'bg-[#2563EB] text-white'
                      : 'bg-[#F1F5F9] text-[#475569] hover:text-[#0F2342]'
                  }`}
                >
                  Barcha janrlar
                </button>
                {LIBRARY_GENRE_CATEGORIES.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedGenreId(g.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                      selectedGenreId === g.id
                        ? 'bg-[#2563EB] text-white'
                        : 'bg-[#F1F5F9] text-[#475569] hover:text-[#0F2342]'
                    }`}
                  >
                    {g.shortName}
                  </button>
                ))}
              </div>
            </div>

            {/* Books Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredCatalogBooks.map((book) => {
                const readingCount = Math.max(
                  0,
                  book.totalCopies - book.availableCopies
                );
                return (
                  <div
                    key={book.id}
                    className="bg-[#FBF9F5] border border-[#E5DEC9] rounded-xl p-4 flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2 text-[11px] font-mono-tabular">
                        <span className="px-2 py-0.5 rounded bg-white border border-[#E5DEC9] text-[#0F2342] font-bold">
                          UDK: {book.udc}
                        </span>
                        <span className="text-[#64748B]">
                          {FACULTY_LABELS[book.faculty][lang]}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#0F2342] line-clamp-2">
                        {book.title[lang]}
                      </h4>
                      <div className="text-xs text-[#57534E] truncate">
                        {book.authors.join(', ')} · {book.year}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E5DEC9] flex items-center justify-between gap-2 text-xs font-mono-tabular">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-900 font-bold">
                          Bo‘sh: {book.availableCopies}
                        </span>
                        <span className="px-2 py-1 rounded bg-blue-100 text-blue-900 font-bold">
                          O‘qilmoqda: {readingCount}
                        </span>
                      </div>
                      <span className="text-[#57534E] font-bold">
                        Jami: {book.totalCopies}
                      </span>
                    </div>

                    {onUpdateResourceCopies && (
                      <div className="flex items-center justify-end gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => onUpdateResourceCopies(book.id, -1)}
                          className="px-2.5 py-1 rounded bg-white border border-[#E5DEC9] hover:bg-stone-100 text-xs font-bold text-[#0F2342] cursor-pointer"
                        >
                          -1 nusxa
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateResourceCopies(book.id, 1)}
                          className="px-2.5 py-1 rounded bg-[#0F2342] hover:bg-[#173461] text-xs font-bold text-white cursor-pointer"
                        >
                          +1 nusxa
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
