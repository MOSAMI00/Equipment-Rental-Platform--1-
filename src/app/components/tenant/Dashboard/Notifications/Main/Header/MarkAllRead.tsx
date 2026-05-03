import { CheckCheck } from 'lucide-react';

interface MarkAllReadProps {
  onClick: () => void;
}

export function MarkAllRead({ onClick }: MarkAllReadProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-sm text-[#2D5A27] hover:underline font-medium"
    >
      <CheckCheck className="w-4 h-4" />
      تعليم الكل كمقروء
    </button>
  );
}
