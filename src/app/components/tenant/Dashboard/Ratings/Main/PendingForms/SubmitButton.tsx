import { Send } from 'lucide-react';

interface SubmitButtonProps {
  disabled: boolean;
  onSubmit: () => void;
}

export function SubmitButton({ disabled, onSubmit }: SubmitButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onSubmit}
      className="w-full h-12 bg-[#2D5A27] text-white rounded-xl font-bold text-sm hover:bg-[#3D7A35] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Send className="w-4 h-4" />
      إرسال التقييم
    </button>
  );
}
