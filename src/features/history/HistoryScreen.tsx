import { CircleDollarSign, Fuel } from "lucide-react";
import { formatShortTime } from "../../lib/date";
import { formatMoney } from "../../lib/money";
import type { HistoryEntry } from "../../types/domain";

type HistoryScreenProps = {
  entries: HistoryEntry[];
};

const expenseLabels: Record<string, string> = {
  fuel: "Combustible",
  workshop: "Taller",
  wash: "Lavado",
  insurance: "Seguro",
  other: "Otros"
};

export function HistoryScreen({ entries }: HistoryScreenProps) {
  return (
    <main className="space-y-5 pb-28 pt-5">
      <header>
        <p className="text-sm font-semibold text-ink/60">Historial</p>
        <h1 className="mt-1 font-display text-5xl font-black leading-none text-plum">Movimientos</h1>
      </header>

      <section className="grid gap-2">
        {entries.length === 0 ? (
          <div className="rounded-lg border border-dashed border-clay/20 bg-white/70 p-5 text-center text-sm text-ink/60">
            Todavia no hay movimientos guardados.
          </div>
        ) : (
          entries.map((entry) => {
            const isTrip = entry.type === "trip";
            return (
              <article className="flex items-center justify-between rounded-lg border border-clay/15 bg-white/90 p-4 shadow-soft" key={`${entry.type}-${entry.id}`}>
                <div className="flex min-w-0 items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${isTrip ? "bg-blush text-clay" : "bg-white text-honey"}`}>
                    {isTrip ? <CircleDollarSign size={20} /> : <Fuel size={20} />}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-bold text-ink">{isTrip ? entry.title : expenseLabels[entry.title] ?? entry.title}</p>
                    <p className="mt-1 text-sm text-ink/55">{formatShortTime(entry.createdAt)} · {isTrip ? entry.subtitle : "Gasto"}</p>
                  </div>
                </div>
                <p className={`ml-3 shrink-0 font-bold ${isTrip ? "text-ink" : "text-honey"}`}>
                  {isTrip ? "+" : "-"}{formatMoney(entry.amount)}
                </p>
              </article>
            );
          })
        )}
      </section>
    </main>
  );
}

