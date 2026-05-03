import { Lock } from 'lucide-react';

interface SecureCheckoutCTAProps {
  onConfirm: () => void;
  disabled: boolean;
}

export function SecureCheckoutCTA({ onConfirm, disabled }: SecureCheckoutCTAProps) {
  return (
    <div className="space-y-3 mt-6">
      <button
        onClick={onConfirm}
        disabled={disabled}
        className="w-full h-12 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:bg-muted disabled:text-muted-foreground"
      >
        تأكيد الحجز والدفع
      </button>
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Lock className="w-4 h-4" />
        <span>دفع آمن ومحمي بالكامل</span>
      </div>
    </div>
  );
}
