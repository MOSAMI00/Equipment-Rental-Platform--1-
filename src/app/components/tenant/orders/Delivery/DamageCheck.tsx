interface DamageCheckProps {
  hasDamage: boolean | null;
  setHasDamage: (hasDamage: boolean) => void;
}

export function DamageCheck({ hasDamage, setHasDamage }: DamageCheckProps) {
  return (
    <div className="flex gap-3">
      {[{ v: false, label: '✅ لا يوجد ضرر' }, { v: true, label: '⚠️ يوجد ضرر' }].map(opt => (
        <button
          key={String(opt.v)}
          onClick={() => setHasDamage(opt.v)}
          className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all ${
            hasDamage === opt.v
              ? opt.v ? 'border-[#E74C3C] bg-[#FDEDEC] text-[#E74C3C]' : 'border-[#27AE60] bg-[#EAFAF1] text-[#27AE60]'
              : 'border-[#E0E0E0] text-[#888888] hover:border-[#2D5A27]'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
