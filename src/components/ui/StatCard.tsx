type StatCardProps = {
  label: string;
  value: string;
  accent?: "clay" | "moss" | "honey" | "ink";
};

const accentClasses = {
  clay: "text-clay",
  moss: "text-moss",
  honey: "text-honey",
  ink: "text-ink"
};

export function StatCard({ label, value, accent = "ink" }: StatCardProps) {
  return (
    <section className="rounded-lg border border-black/10 bg-white p-4">
      <p className="text-sm text-ink/60">{label}</p>
      <p className={`mt-2 text-2xl font-bold tracking-normal ${accentClasses[accent]}`}>
        {value}
      </p>
    </section>
  );
}
