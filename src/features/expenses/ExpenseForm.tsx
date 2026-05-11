import { ArrowLeft, Check } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { Button } from "../../components/ui/Button";
import { formatMoney, parseMoneyInput } from "../../lib/money";
import type { ExpenseCategory } from "../../types/domain";

const categories: Array<{ value: ExpenseCategory; label: string }> = [
  { value: "fuel", label: "Combustible" },
  { value: "workshop", label: "Taller" },
  { value: "wash", label: "Lavado" },
  { value: "insurance", label: "Seguro" },
  { value: "other", label: "Otros" }
];

type ExpenseFormProps = {
  onCancel: () => void;
  onSave: (expense: {
    category: ExpenseCategory;
    amount: number;
    notes?: string;
  }) => Promise<void>;
};

export function ExpenseForm({ onCancel, onSave }: ExpenseFormProps) {
  const [category, setCategory] = useState<ExpenseCategory>("fuel");
  const [amountInput, setAmountInput] = useState("");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const amount = useMemo(() => parseMoneyInput(amountInput), [amountInput]);
  const canSave = amount > 0 && !isSaving;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSave) return;
    setIsSaving(true);
    await onSave({ category, amount, notes });
    setIsSaving(false);
  }

  return (
    <main className="pb-24">
      <header className="sticky top-0 z-10 -mx-4 bg-paper/95 px-4 py-4 backdrop-blur">
        <button className="flex items-center gap-2 text-sm font-semibold text-ink" onClick={onCancel}>
          <ArrowLeft size={18} />
          Volver
        </button>
        <h1 className="mt-4 text-3xl font-bold text-ink">Nuevo gasto</h1>
      </header>

      <form className="mt-4 space-y-5" onSubmit={handleSubmit}>
        <div>
          <p className="mb-2 text-sm font-semibold text-ink/70">Categoria</p>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((item) => (
              <button
                key={item.value}
                type="button"
                className={`min-h-14 rounded-lg border px-3 text-sm font-semibold transition ${
                  category === item.value
                    ? "border-ink bg-ink text-white"
                    : "border-black/10 bg-white text-ink"
                }`}
                onClick={() => setCategory(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <label className="block">
          <span className="text-sm font-semibold text-ink/70">Monto</span>
          <input
            autoFocus
            inputMode="decimal"
            className="mt-2 h-16 w-full rounded-lg border border-black/10 bg-white px-4 text-3xl font-bold text-ink outline-none ring-clay/30 focus:ring-4"
            placeholder="$0"
            value={amountInput}
            onChange={(event) => setAmountInput(event.target.value)}
          />
          <p className="mt-2 text-sm font-semibold text-clay">{formatMoney(amount)}</p>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-ink/70">Notas opcionales</span>
          <textarea
            className="mt-2 min-h-24 w-full rounded-lg border border-black/10 bg-white p-4 text-base text-ink outline-none ring-clay/30 focus:ring-4"
            placeholder="Detalle del gasto..."
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </label>

        <Button
          className="fixed bottom-5 left-4 right-4 flex items-center justify-center gap-2"
          disabled={!canSave}
          type="submit"
        >
          <Check size={20} />
          Guardar gasto
        </Button>
      </form>
    </main>
  );
}
