import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { formatMoney } from "../../lib/money";
import type { CalendarDaySummary } from "../../types/domain";

type CalendarScreenProps = {
  days: CalendarDaySummary[];
  onMonthChange: (year: number, monthIndex: number) => void;
};

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function CalendarScreen({ days, onMonthChange }: CalendarScreenProps) {
  const today = new Date();
  const [visibleMonth, setVisibleMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(isoDate(today));
  const daysByDate = useMemo(() => new Map(days.map((day) => [day.date, day])), [days]);
  const monthLabel = new Intl.DateTimeFormat("es-AR", { month: "long", year: "numeric" }).format(visibleMonth);
  const firstDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const totalDays = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: totalDays }, (_, index) => new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), index + 1))
  ];
  const selected = daysByDate.get(selectedDate);

  function moveMonth(direction: number) {
    const nextMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + direction, 1);
    setVisibleMonth(nextMonth);
    onMonthChange(nextMonth.getFullYear(), nextMonth.getMonth());
  }

  return (
    <main className="space-y-5 pb-28 pt-5">
      <header>
        <p className="text-sm font-semibold text-ink/60">Calendario</p>
        <h1 className="mt-1 font-display text-5xl font-black leading-none text-plum">Viajes por mes</h1>
      </header>

      <section className="rounded-lg border border-clay/15 bg-white/90 p-4 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <button className="rounded-lg bg-blush px-3 py-2 font-bold text-ink" onClick={() => moveMonth(-1)}>
            <ChevronLeft size={18} />
          </button>
          <h2 className="text-lg font-bold capitalize text-ink">{monthLabel}</h2>
          <button className="rounded-lg bg-blush px-3 py-2 font-bold text-ink" onClick={() => moveMonth(1)}>
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-ink/50">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day) => <span key={day}>{day}</span>)}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1">
          {cells.map((date, index) => {
            if (!date) return <div key={`empty-${index}`} className="aspect-square" />;
            const key = isoDate(date);
            const summary = daysByDate.get(key);
            const active = key === selectedDate;
            return (
              <button
                key={key}
                className={`aspect-square rounded-lg border text-sm font-bold ${
                  active ? "border-ink bg-ink text-white" : "border-clay/10 bg-white text-ink"
                }`}
                onClick={() => setSelectedDate(key)}
              >
                <span>{date.getDate()}</span>
                {summary && <span className="mx-auto mt-1 block h-1.5 w-1.5 rounded-full bg-clay" />}
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg border border-clay/15 bg-white/90 p-4 shadow-soft">
        <p className="text-sm font-semibold text-ink/55">Dia seleccionado</p>
        <h2 className="mt-1 text-xl font-bold text-ink">{new Date(selectedDate).toLocaleDateString("es-AR")}</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div><p className="text-sm text-ink/55">Viajes</p><p className="text-2xl font-bold">{selected?.trips ?? 0}</p></div>
          <div><p className="text-sm text-ink/55">Ganancia</p><p className="text-2xl font-bold text-clay">{formatMoney(selected?.revenue ?? 0)}</p></div>
          <div><p className="text-sm text-ink/55">Gastos</p><p className="text-2xl font-bold text-honey">{formatMoney(selected?.expenses ?? 0)}</p></div>
          <div><p className="text-sm text-ink/55">Neto</p><p className="text-2xl font-bold">{formatMoney(selected?.net ?? 0)}</p></div>
        </div>
      </section>
    </main>
  );
}




