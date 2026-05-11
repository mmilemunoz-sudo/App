import { ArrowLeft, Check } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { Button } from "../../components/ui/Button";
import { SegmentedChoice } from "../../components/ui/SegmentedChoice";
import { formatMoney, parseMoneyInput } from "../../lib/money";
import type { PaymentMethod, QuickDestination } from "../../types/domain";

type TripFormProps = {
  initialTrip?: QuickDestination | null;
  onCancel: () => void;
  onSave: (trip: {
    destination: string;
    amount: number;
    paymentMethod: PaymentMethod;
    notes?: string;
  }) => Promise<void>;
};

export function TripForm({ initialTrip, onCancel, onSave }: TripFormProps) {
  const [destination, setDestination] = useState(initialTrip?.destination ?? "");
  const [amountInput, setAmountInput] = useState(
    initialTrip?.amount ? String(initialTrip.amount) : ""
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    initialTrip?.paymentMethod ?? "cash"
  );
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const amount = useMemo(() => parseMoneyInput(amountInput), [amountInput]);
  const canSave = destination.trim().length > 0 && amount > 0 && !isSaving;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSave) return;
    setIsSaving(true);
    await onSave({ destination, amount, paymentMethod, notes });
    setIsSaving(false);
  }

  return (
    <main className="pb-24">
      <header className="sticky top-0 z-10 -mx-4 bg-paper/95 px-4 py-4 backdrop-blur">
        <button className="flex items-center gap-2 text-sm font-semibold text-ink" onClick={onCancel}>
          <ArrowLeft size={18} />
          Volver
        </button>
        <h1 className="mt-4 text-3xl font-bold text-ink">Nuevo viaje</h1>
      </header>

      <form className="mt-4 space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-semibold text-ink/70">Destino</span>
          <input
            autoFocus
            className="mt-2 h-14 w-full rounded-lg border border-black/10 bg-white px-4 text-lg font-semibold text-ink outline-none ring-clay/30 focus:ring-4"
            placeholder="Ej: Centro"
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-ink/70">Monto</span>
          <input
            inputMode="decimal"
            className="mt-2 h-16 w-full rounded-lg border border-black/10 bg-white px-4 text-3xl font-bold text-ink outline-none ring-clay/30 focus:ring-4"
            placeholder="$0"
            value={amountInput}
            onChange={(event) => setAmountInput(event.target.value)}
          />
          <p className="mt-2 text-sm font-semibold text-clay">{formatMoney(amount)}</p>
        </label>

        <div>
          <p className="mb-2 text-sm font-semibold text-ink/70">Metodo de pago</p>
          <SegmentedChoice
            value={paymentMethod}
            onChange={setPaymentMethod}
            options={[
              { label: "Efectivo", value: "cash" },
              { label: "Transferencia", value: "transfer" }
            ]}
          />
        </div>

        <label className="block">
          <span className="text-sm font-semibold text-ink/70">Notas opcionales</span>
          <textarea
            className="mt-2 min-h-24 w-full rounded-lg border border-black/10 bg-white p-4 text-base text-ink outline-none ring-clay/30 focus:ring-4"
            placeholder="Espera, equipaje, referencia..."
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
          Guardar viaje
        </Button>
      </form>
    </main>
  );
}
