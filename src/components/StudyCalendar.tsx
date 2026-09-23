import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Flame, PenLine, Calendar as CalendarIcon, CheckCircle2, X } from "lucide-react";

const MONTH_NAMES_AR = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
];

const MONTH_NAMES_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const pad = (n: number) => n.toString().padStart(2, "0");

const formatDateKey = (year: number, monthIndex: number, day: number) => {
  return `${year}-${pad(monthIndex + 1)}-${pad(day)}`;
};

interface StudyCalendarProps {
  onClose: () => void;
}

export default function StudyCalendar({ onClose }: StudyCalendarProps) {
  const now = new Date();
  // Default to September 2026 or current date
  const [currentYear, setCurrentYear] = useState<number>(now.getFullYear() >= 2026 ? now.getFullYear() : 2026);
  const [currentMonth, setCurrentMonth] = useState<number>(now.getFullYear() >= 2026 ? now.getMonth() : 8); // 8 is September (0-indexed)

  const todayKey = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  
  // Selected date key (defaults to today or 24th of the month)
  const defaultInitialKey = (now.getFullYear() === currentYear && now.getMonth() === currentMonth)
    ? todayKey
    : formatDateKey(currentYear, currentMonth, Math.min(24, new Date(currentYear, currentMonth + 1, 0).getDate()));

  const [selectedDateKey, setSelectedDateKey] = useState<string>(defaultInitialKey);

  // Persistent study days and notes
  const [studiedDays, setStudiedDays] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [saveStatus, setSaveStatus] = useState<string>("محفوظ تلقائياً ✓");

  // Load from localStorage on mount
  useEffect(() => {
    const savedStudied = localStorage.getItem("itqan_calendar_studied_days");
    if (savedStudied) {
      try {
        setStudiedDays(JSON.parse(savedStudied));
      } catch (e) {
        console.error("Failed to parse studied days", e);
      }
    } else {
      const initial = [todayKey];
      setStudiedDays(initial);
      localStorage.setItem("itqan_calendar_studied_days", JSON.stringify(initial));
    }

    const savedNotes = localStorage.getItem("itqan_calendar_notes");
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error("Failed to parse calendar notes", e);
      }
    }

    // Escape key listener to close modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, todayKey]);

  // Save changes to localStorage
  const saveStudiedDays = (newDays: string[]) => {
    setStudiedDays(newDays);
    localStorage.setItem("itqan_calendar_studied_days", JSON.stringify(newDays));
  };

  const saveNotes = (newNotes: Record<string, string>) => {
    setNotes(newNotes);
    localStorage.setItem("itqan_calendar_notes", JSON.stringify(newNotes));
    setSaveStatus("محفوظ تلقائياً ✓");
  };

  const toggleStudyDay = () => {
    if (studiedDays.includes(selectedDateKey)) {
      saveStudiedDays(studiedDays.filter(d => d !== selectedDateKey));
    } else {
      saveStudiedDays([...studiedDays, selectedDateKey]);
    }
  };

  const handleNoteChange = (text: string) => {
    setSaveStatus("جاري الحفظ...");
    const updated = { ...notes, [selectedDateKey]: text };
    saveNotes(updated);
  };

  const handleAddTag = (tagPrefix: string) => {
    const current = notes[selectedDateKey] || "";
    const updatedText = current.trim() === "" ? tagPrefix : `${current}\n${tagPrefix}`;
    handleNoteChange(updatedText);
  };

  const clearNote = () => {
    const updated = { ...notes };
    delete updated[selectedDateKey];
    saveNotes(updated);
  };

  // Month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Calendar calculations
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const isDayStudied = studiedDays.includes(selectedDateKey);
  const currentNote = notes[selectedDateKey] || "";
  const isSelectedToday = selectedDateKey === todayKey;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-scale-in text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center border border-blue-200/60 shadow-xs">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-sans">
                تقويم الممارسة والملاحظات
              </h2>
              <p className="text-[11px] text-slate-400 font-sans">
                حدّد أيام ممارستك للغة الإنجليزية ودوّن ملاحظاتك اليومية
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Body matching the user request structure */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FAFBFD] space-y-5">
          <div className="space-y-4">
            {/* Month Header and Selected Day Info */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer border border-slate-200"
                  title="الشهر السابق"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 font-arabic min-w-[170px] text-center">
                  {MONTH_NAMES_AR[currentMonth]} ({MONTH_NAMES_EN[currentMonth]}) {currentYear}
                </h3>
                <button
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer border border-slate-200"
                  title="الشهر القادم"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs font-arabic">
                <span className="text-slate-500">اليوم المختار:</span>
                <span className="font-mono font-bold text-[#214ecf] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/60" dir="ltr">
                  {selectedDateKey} {isSelectedToday ? "(اليوم)" : ""}
                </span>
              </div>
            </div>

            {/* Main 2-column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              
              {/* Calendar View Column (7 cols on lg) */}
              <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 pb-1 border-b border-slate-100">
                  <span className="font-arabic">اختر أي يوم لتدوين وقراءة ملاحظاته مباشرة:</span>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1 text-amber-700">
                      <Flame className="w-3 h-3 text-[#ea9835] fill-brand-orange" /> مذاكرة
                    </span>
                    <span className="flex items-center gap-1 text-blue-700">
                      <PenLine className="w-3 h-3 text-[#214ecf]" /> ملاحظة
                    </span>
                  </div>
                </div>

                {/* Days of week header */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 font-arabic pb-1">
                  <span>أحد</span>
                  <span>إثنين</span>
                  <span>ثلاثاء</span>
                  <span>أربعاء</span>
                  <span>خميس</span>
                  <span>جمعة</span>
                  <span>سبت</span>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1.5">
                  {/* Leading blank slots */}
                  {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                    <div key={`blank-${idx}`} className="h-14 sm:h-16 rounded-xl bg-slate-50/50" />
                  ))}

                  {/* Day slots */}
                  {Array.from({ length: daysInMonth }).map((_, idx) => {
                    const dayNumber = idx + 1;
                    const dateKey = formatDateKey(currentYear, currentMonth, dayNumber);
                    const isSelected = dateKey === selectedDateKey;
                    const hasStudied = studiedDays.includes(dateKey);
                    const hasNote = Boolean(notes[dateKey] && notes[dateKey].trim());
                    const isTodayDate = dateKey === todayKey;

                    return (
                      <button
                        key={dateKey}
                        onClick={() => setSelectedDateKey(dateKey)}
                        className={`h-14 sm:h-16 p-1.5 rounded-xl transition flex flex-col justify-between text-right cursor-pointer border relative text-xs ${
                          isSelected
                            ? "bg-blue-50 border-[#214ecf] ring-2 ring-[#214ecf]/30 text-[#214ecf] shadow-xs"
                            : "bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className={`text-xs font-bold font-mono ${isSelected ? "text-[#214ecf] font-black" : ""}`}>
                            {dayNumber}
                          </span>
                          {isTodayDate && (
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" title="اليوم" />
                          )}
                        </div>
                        <div className="flex items-center justify-between w-full mt-auto">
                          <div className="flex items-center gap-1">
                            {hasStudied && (
                              <Flame className="w-3 h-3 text-[#ea9835] fill-brand-orange" />
                            )}
                            {hasNote && (
                              <PenLine className="w-3 h-3 text-[#214ecf]" />
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Footer Summary */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-sans">
                  <span className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>إجمالي أيام الممارسة المسجلة: <strong className="text-slate-800 font-mono text-sm">{studiedDays.length}</strong> يوم</span>
                  </span>
                  <span className="text-[11px] text-slate-400">
                    انقر على أي يوم لتغيير حالته أو كتابة ملاحظاتك
                  </span>
                </div>
              </div>

              {/* Notes Column (5 cols on lg) */}
              <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-xs flex flex-col">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#214ecf] flex items-center justify-center border border-blue-200/60">
                      <PenLine className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 font-arabic">
                      ملاحظات ({selectedDateKey})
                    </span>
                  </div>
                  <button
                    onClick={toggleStudyDay}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold font-arabic transition cursor-pointer flex items-center gap-1 border ${
                      isDayStudied
                        ? "bg-amber-50 text-amber-800 border-amber-300 shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200"
                    }`}
                    title="تسجيل أو إلغاء علامة الدراسة لهذا اليوم"
                  >
                    <Flame className={`w-3 h-3 ${isDayStudied ? "text-[#ea9835] fill-brand-orange" : "text-[#ea9835]"}`} />
                    <span>{isDayStudied ? "يوم دراسة مسجل ✓" : "تسجيل كيوم دراسة"}</span>
                  </button>
                </div>

                {/* Quick Tags */}
                <div className="flex flex-wrap gap-1 text-[11px]">
                  <button
                    onClick={() => handleAddTag("💡 قاعدة: ")}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer font-arabic"
                  >
                    💡 قاعدة
                  </button>
                  <button
                    onClick={() => handleAddTag("⚠️ خطأ: ")}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer font-arabic"
                  >
                    ⚠️ خطأ
                  </button>
                  <button
                    onClick={() => handleAddTag("❓ سؤال: ")}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer font-arabic"
                  >
                    ❓ سؤال
                  </button>
                  <button
                    onClick={() => handleAddTag("📝 جملة: ")}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer font-arabic"
                  >
                    📝 جملة
                  </button>
                </div>

                {/* Notes Textarea */}
                <textarea
                  value={currentNote}
                  onChange={(e) => handleNoteChange(e.target.value)}
                  placeholder="اكتب ملاحظاتك، القواعد التي تريد تذكرها، أو أية أسئلة لهذا اليوم... يتم الحفظ تلقائياً في جهازك."
                  className="w-full min-h-[170px] bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-[#214ecf]/30 font-arabic leading-relaxed resize-none placeholder:text-slate-400"
                />

                {/* Footer with status */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <span className="text-[11px] text-emerald-600 font-bold font-arabic">{saveStatus}</span>
                  <div className="flex items-center gap-2">
                    {currentNote.trim() && (
                      <button
                        onClick={clearNote}
                        className="text-[10px] text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                      >
                        مسح الملاحظة
                      </button>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
