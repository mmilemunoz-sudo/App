import { useEffect, useState } from "react";
import { TopNav } from "../components/TopNav";
import {
  createExpense,
  createTrip,
  getDashboardStats,
  initDatabase,
  listCalendarMonth,
  listHistoryEntries,
  listQuickDestinations,
  listRecentTrips
} from "../data/database";
import { CalendarScreen } from "../features/calendar/CalendarScreen";
import { Dashboard } from "../features/dashboard/Dashboard";
import { StatsScreen } from "../features/dashboard/StatsScreen";
import { ExpenseForm } from "../features/expenses/ExpenseForm";
import { HistoryScreen } from "../features/history/HistoryScreen";
import { TripForm } from "../features/trips/TripForm";
import type { CalendarDaySummary, DashboardStats, HistoryEntry, QuickDestination, Trip } from "../types/domain";

type MainView = "dashboard" | "calendar" | "history" | "stats";
type View = MainView | "new-trip" | "new-expense";

const emptyStats: DashboardStats = {
  dayTrips: 0,
  dayRevenue: 0,
  dayExpenses: 0,
  dayNet: 0,
  weekRevenue: 0,
  monthTrips: 0,
  monthExpenses: 0,
  monthNet: 0
};

export function App() {
  const today = new Date();
  const [view, setView] = useState<View>("dashboard");
  const [isReady, setIsReady] = useState(false);
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [recentTrips, setRecentTrips] = useState<Trip[]>([]);
  const [quickDestinations, setQuickDestinations] = useState<QuickDestination[]>([]);
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);
  const [calendarDays, setCalendarDays] = useState<CalendarDaySummary[]>([]);
  const [calendarMonth, setCalendarMonth] = useState({ year: today.getFullYear(), monthIndex: today.getMonth() });
  const [repeatTrip, setRepeatTrip] = useState<QuickDestination | null>(null);
  const [toast, setToast] = useState("");

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 1700);
  }

  function refresh(year = calendarMonth.year, monthIndex = calendarMonth.monthIndex) {
    setStats(getDashboardStats());
    setRecentTrips(listRecentTrips());
    setQuickDestinations(listQuickDestinations());
    setHistoryEntries(listHistoryEntries());
    setCalendarDays(listCalendarMonth(year, monthIndex));
  }

  useEffect(() => {
    initDatabase().then(() => {
      refresh(today.getFullYear(), today.getMonth());
      setIsReady(true);
    });
  }, []);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-6 text-center text-ink">
        <div>
          <div className="mx-auto h-10 w-10 animate-pulse rounded-lg bg-clay" />
          <p className="mt-4 font-semibold">Preparando la app de Mariela...</p>
      </div>

      {toast && (
        <div className="fixed bottom-5 left-1/2 z-30 w-[min(360px,calc(100%-36px))] -translate-x-1/2 rounded-full border border-clay/20 bg-white/95 px-4 py-3 text-center font-bold text-plum shadow-soft">
          {toast}
        </div>
      )}
    </div>
  );
  }

  const mainView: MainView = view === "new-trip" || view === "new-expense" ? "dashboard" : view;

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="mx-auto min-h-screen w-full max-w-md px-4">
        {view !== "new-trip" && view !== "new-expense" && <TopNav current={mainView} onChange={setView} />}
        {view === "dashboard" && (
          <Dashboard
            stats={stats}
            quickDestinations={quickDestinations}
            recentTrips={recentTrips}
            onNewTrip={() => {
              setRepeatTrip(null);
              setView("new-trip");
            }}
            onNewExpense={() => setView("new-expense")}
            onRepeatTrip={(trip) => {
              setRepeatTrip(trip);
              setView("new-trip");
            }}
            onOpenStats={() => setView("stats")}
          />
        )}

        {view === "calendar" && (
          <CalendarScreen
            days={calendarDays}
            onMonthChange={(year, monthIndex) => {
              setCalendarMonth({ year, monthIndex });
              refresh(year, monthIndex);
            }}
          />
        )}

        {view === "history" && <HistoryScreen entries={historyEntries} />}

        {view === "new-trip" && (
          <TripForm
            initialTrip={repeatTrip}
            onCancel={() => setView("dashboard")}
            onSave={async (trip) => {
              await createTrip(trip);
              showToast("Viaje guardado ✨");
              refresh();
              setRepeatTrip(null);
              setView("dashboard");
            }}
          />
        )}

        {view === "new-expense" && (
          <ExpenseForm
            onCancel={() => setView("dashboard")}
            onSave={async (expense) => {
              await createExpense(expense);
              showToast("Gasto guardado. Todo organizado");
              refresh();
              setView("dashboard");
            }}
          />
        )}

        {view === "stats" && <StatsScreen stats={stats} onBack={() => setView("dashboard")} />}
      </div>

      {toast && (
        <div className="fixed bottom-5 left-1/2 z-30 w-[min(360px,calc(100%-36px))] -translate-x-1/2 rounded-full border border-clay/20 bg-white/95 px-4 py-3 text-center font-bold text-plum shadow-soft">
          {toast}
        </div>
      )}
    </div>
  );
}




