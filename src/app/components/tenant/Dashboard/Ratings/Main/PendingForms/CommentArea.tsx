interface CommentAreaProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
}

export function CommentArea({ value, onChange }: CommentAreaProps) {
  return (
    <div>
      <p className="text-sm font-semibold text-[#222222] mb-2">تعليقك</p>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="شاركنا تجربتك مع هذه المعدة..."
        rows={3}
        className="w-full p-3 rounded-xl border border-[#E0E0E0] text-sm focus:outline-none focus:border-[#2D5A27] resize-none transition-colors"
      />
    </div>
  );
}
