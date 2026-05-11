import { BarChart3, CalendarDays, Home, ListChecks } from "lucide-react";

type MainView = "dashboard" | "calendar" | "history" | "stats";

type TopNavProps = {
  current: MainView;
  onChange: (view: MainView) => void;
};

const items = [
  { view: "dashboard" as const, label: "Inicio", icon: Home },
  { view: "calendar" as const, label: "Calendario", icon: CalendarDays },
  { view: "history" as const, label: "Historial", icon: ListChecks },
  { view: "stats" as const, label: "Stats", icon: BarChart3 }
];

export function TopNav({ current, onChange }: TopNavProps) {
  return (
    <header className="sticky top-0 z-20 -mx-4 border-b border-clay/10 bg-paper/95 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-full border border-clay/25 bg-blush font-black text-clay">
          M
        </div>
        <div>
          <p className="font-display text-2xl font-black leading-none text-plum">Remis de Mariela</p>
          <p className="text-xs text-ink/45">Todo organizado, sin apuro</p>
        </div>
      </div>
      <nav className="mt-3 grid grid-cols-4 gap-1 rounded-full border border-clay/15 bg-white/70 p-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = current === item.view;
          return (
            <button
              key={item.view}
              className={`flex min-h-9 items-center justify-center gap-1 rounded-full text-xs font-bold ${
                active ? "bg-plum text-white shadow-soft" : "text-ink/55"
              }`}
              onClick={() => onChange(item.view)}
            >
              <Icon className="hidden sm:block" size={14} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}

