import { BarChart3, CalendarDays, Home, ListChecks } from "lucide-react";

type MainView = "dashboard" | "calendar" | "history" | "stats";

type BottomNavProps = {
  current: MainView;
  onChange: (view: MainView) => void;
};

const items = [
  { view: "dashboard" as const, label: "Inicio", icon: Home },
  { view: "calendar" as const, label: "Calendario", icon: CalendarDays },
  { view: "history" as const, label: "Historial", icon: ListChecks },
  { view: "stats" as const, label: "Stats", icon: BarChart3 }
];

export function BottomNav({ current, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-clay/15 bg-white/95 px-3 py-2 backdrop-blur">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = current === item.view;
          return (
            <button
              key={item.view}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-xs font-bold ${active ? "bg-blush text-clay" : "text-ink/55"}`}
              onClick={() => onChange(item.view)}
            >
              <Icon size={19} />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
