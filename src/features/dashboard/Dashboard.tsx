import { BarChart3, CircleDollarSign, Fuel, Plus, Route, Sparkles } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { StatCard } from "../../components/ui/StatCard";
import { formatShortTime } from "../../lib/date";
import { formatMoney } from "../../lib/money";
import type { DashboardStats, QuickDestination, Trip } from "../../types/domain";

type DashboardProps = {
  stats: DashboardStats;
  quickDestinations: QuickDestination[];
  recentTrips: Trip[];
  onNewTrip: () => void;
  onNewExpense: () => void;
  onRepeatTrip: (trip: QuickDestination) => void;
  onOpenStats: () => void;
};

export function Dashboard({
  stats,
  quickDestinations,
  recentTrips,
  onNewTrip,
  onNewExpense,
  onRepeatTrip,
  onOpenStats
}: DashboardProps) {
  return (
    <main className="space-y-6 pb-10">
      <header className="pt-5">
        <p className="text-sm font-semibold text-clay">Que tengas un lindo dia</p>
        <h1 className="mt-1 font-display text-5xl font-black leading-none text-plum">Hola, Mariela ♥</h1>
      </header>

      <section className="rounded-lg border border-clay/15 bg-blush/70 p-4 shadow-soft">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 shrink-0 text-clay" size={18} />
          <div>
            <p className="font-display text-2xl font-black leading-none text-plum">Todo listo para empezar</p>
            <p className="mt-1 text-sm leading-5 text-ink/60">Tus viajes, gastos y cuentas del dia quedan ordenados en un solo lugar.</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <StatCard label="Viajes" value={String(stats.dayTrips)} accent="moss" />
        <StatCard label="Ganancias" value={formatMoney(stats.dayRevenue)} accent="clay" />
        <StatCard label="Gastos" value={formatMoney(stats.dayExpenses)} accent="honey" />
        <StatCard label="Neto" value={formatMoney(stats.dayNet)} accent="ink" />
      </section>

      <section className="grid grid-cols-2 gap-3">
        <Button className="flex items-center justify-center gap-2" onClick={onNewTrip}>
          <Plus size={20} />
          Nuevo viaje
        </Button>
        <Button
          className="flex items-center justify-center gap-2"
          variant="secondary"
          onClick={onNewExpense}
        >
          <Fuel size={20} />
          Nuevo gasto
        </Button>
      </section>

      {quickDestinations.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">Destinos frecuentes</h2>
          </div>
          <div className="grid gap-2">
            {quickDestinations.map((trip) => (
              <button
                key={trip.destination}
                className="flex min-h-14 items-center justify-between rounded-lg border border-clay/15 bg-white/90 px-4 text-left"
                onClick={() => onRepeatTrip(trip)}
              >
                <span className="font-semibold text-ink">{trip.destination}</span>
                <span className="text-sm font-semibold text-ink/60">
                  {formatMoney(trip.amount)}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">Ultimos viajes</h2>
          <button
            className="flex items-center gap-1 text-sm font-semibold text-moss"
            onClick={onOpenStats}
          >
            <BarChart3 size={16} />
            Estadisticas
          </button>
        </div>

        {recentTrips.length === 0 ? (
          <div className="rounded-lg border border-dashed border-clay/20 bg-white/70 p-5 text-center text-sm text-ink/60">
            Todavia no hay viajes cargados.
          </div>
        ) : (
          <div className="grid gap-2">
            {recentTrips.map((trip) => (
              <article
                className="flex items-center justify-between rounded-lg border border-clay/15 bg-white/90 p-4"
                key={trip.id}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Route size={16} className="shrink-0 text-moss" />
                    <p className="truncate font-semibold text-ink">{trip.destination}</p>
                  </div>
                  <p className="mt-1 text-sm text-ink/55">
                    {formatShortTime(trip.createdAt)} ·{" "}
                    {trip.paymentMethod === "cash" ? "Efectivo" : "Transferencia"}
                  </p>
                </div>
                <p className="ml-3 shrink-0 font-bold text-ink">
                  {formatMoney(trip.amount)}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      <button
        className="fixed bottom-5 right-5 flex h-16 w-16 items-center justify-center rounded-full bg-clay text-white shadow-soft"
        onClick={onNewTrip}
        aria-label="Nuevo viaje"
      >
        <CircleDollarSign size={28} />
      </button>
    </main>
  );
}




