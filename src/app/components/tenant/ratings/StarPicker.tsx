import { StarRating } from './StarRating';

interface StarPickerProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
}

export function StarPicker({ id, value, onChange }: StarPickerProps) {
  return (
    <div>
      <p className="text-sm font-semibold text-[#222222] mb-2">تقييمك</p>
      <StarRating value={value} onChange={onChange} />
    </div>
  );
}
