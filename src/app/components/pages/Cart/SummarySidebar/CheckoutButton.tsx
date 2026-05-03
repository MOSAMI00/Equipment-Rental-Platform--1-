interface CheckoutButtonProps {
  disabled?: boolean;
}

export function CheckoutButton({ disabled }: CheckoutButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="w-full h-12 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
    >
      متابعة الدفع
    </button>
  );
}
