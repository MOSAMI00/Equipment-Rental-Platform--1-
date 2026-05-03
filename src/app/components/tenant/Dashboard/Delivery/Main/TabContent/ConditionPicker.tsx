const CONDITION_OPTIONS = [
  { value: 'excellent', label: '✅ ممتاز – بحالة مثالية' },
  { value: 'good', label: '👍 جيد – يعمل بشكل صحيح' },
  { value: 'fair', label: '⚠️ مقبول – يوجد تلف طفيف' },
  { value: 'damaged', label: '❌ تالف – يوجد ضرر واضح' },
];

interface ConditionPickerProps {
  condition: string;
  setCondition: (condition: string) => void;
}

export function ConditionPicker({ condition, setCondition }: ConditionPickerProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {CONDITION_OPTIONS.map(opt => (
        <button
          key={opt.value}
          onClick={() => setCondition(opt.value)}
          className={`p-3 rounded-xl border text-sm text-right transition-all ${
            condition === opt.value
              ? 'border-[#2D5A27] bg-[#EAF3E9] font-semibold text-[#2D5A27]'
              : 'border-[#E0E0E0] text-[#888888] hover:border-[#2D5A27]'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
