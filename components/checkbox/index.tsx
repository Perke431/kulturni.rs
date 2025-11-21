import { Check } from '@/svg';

const Checkbox = ({
  value,
  setValue,
  label,
  inverted,
}: {
  value: boolean;
  setValue: (value: boolean) => void;
  label: string;
  inverted?: boolean;
}) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none relative">
      <input
        type="checkbox"
        checked={value}
        onChange={() => setValue(!value)}
        className="peer sr-only"
      />

      <div
        className={`${
          inverted
            ? 'border border-primary peer-checked:bg-background peer-checked:border-primary'
            : 'border border-background peer-checked:bg-primary peer-checked:border-background'
        } w-5 h-5 flex items-center justify-center transition`}
      ></div>
      <Check
        className={`${
          inverted ? 'text-primary' : 'text-background'
        } w-3 h-3 text-background opacity-0 peer-checked:opacity-100 transition absolute left-1`}
      />

      <span>{label}</span>
    </label>
  );
};

export default Checkbox;
