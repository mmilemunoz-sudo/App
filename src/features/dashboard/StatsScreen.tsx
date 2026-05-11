import { ArrowLeft, CalendarDays, TrendingUp } from "lucide-react";
import { StatCard } from "../../components/ui/StatCard";
import { formatMoney } from "../../lib/money";
import type { DashboardStats } from "../../types/domain";

type StatsScreenProps = {
  stats: DashboardStats;
  onBack: () => void;
};

export function StatsScreen({ stats, onBack }: StatsScreenProps) {
  return (
    <main className="space-y-6 pb-24">
      <header className="sticky top-0 z-10 -mx-4 bg-paper/95 px-4 py-4 backdrop-blur">
        <button className="flex items-center gap-2 text-sm font-semibold text-ink" onClick={onBack}>
          <ArrowLeft size={18} />
          Volver
        </button>
        <h1 className="mt-4 font-display text-5xl font-black leading-none text-plum">Estadisticas</h1>
      </header>

      <section className="rounded-lg bg-ink p-5 text-white">
        <div className="flex items-center gap-2 text-white/70">
          <TrendingUp size={18} />
          <p className="text-sm font-semibold">Balance mensual</p>
        </div>
        <p className="mt-3 text-4xl font-bold tracking-normal">
          {formatMoney(stats.monthNet)}
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <StatCard label="Semana" value={formatMoney(stats.weekRevenue)} accent="moss" />
        <StatCard label="Viajes mes" value={String(stats.monthTrips)} accent="clay" />
        <StatCard label="Gastos mes" value={formatMoney(stats.monthExpenses)} accent="honey" />
        <StatCard label="Neto hoy" value={formatMoney(stats.dayNet)} accent="ink" />
      </section>

      <section className="rounded-lg border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 text-moss">
          <CalendarDays size={18} />
          <h2 className="font-bold text-ink">Lectura rapida</h2>
        </div>
        <p className="mt-3 text-sm leading-6 text-ink/65">
          Esta vista resume lo importante para tomar decisiones simples: cuanto entro en
          la semana, cuanto se gasto en el mes y que balance queda despues de gastos.
        </p>
      </section>
    </main>
  );
}

