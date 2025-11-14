import { Check } from '@/svg';

const Checkbox = ({
  value,
  setValue,
  label,
}: {
  value: boolean;
  setValue: (value: boolean) => void;
  label: string;
}) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none relative">
      <input
        type="checkbox"
        checked={value}
        onChange={() => setValue(!value)}
        className="peer sr-only"
      />

      <div className="w-5 h-5 border border-background flex items-center justify-center transition peer-checked:bg-primary peer-checked:border-background"></div>
      <Check className="w-3 h-3 text-background opacity-0 peer-checked:opacity-100 transition absolute left-1" />

      <span>{label}</span>
    </label>
  );
};

export default Checkbox;
