type Option<T extends string> = {
  label: string;
  value: T;
};

type SegmentedChoiceProps<T extends string> = {
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
};

export function SegmentedChoice<T extends string>({
  value,
  options,
  onChange
}: SegmentedChoiceProps<T>) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`min-h-12 rounded-lg border px-3 text-sm font-semibold transition ${
            value === option.value
              ? "border-ink bg-ink text-white"
              : "border-black/10 bg-white text-ink"
          }`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
