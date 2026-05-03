interface PriceSummaryProps {
  rentalCost: number;
  deposit: number;
  serviceFee: number;
  total: number;
}

export function PriceSummary({ rentalCost, deposit, serviceFee, total }: PriceSummaryProps) {
  return (
    <div className="space-y-3 border-b border-border pb-4 mb-4">
      <h3 className="font-bold text-lg">ملخص الطلب</h3>
      <div className="flex justify-between text-muted-foreground">
        <span>تكلفة الإيجار</span>
        <span className="font-semibold text-foreground">{rentalCost.toLocaleString('ar-YE')} ر.ي</span>
      </div>
      <div className="flex justify-between text-muted-foreground">
        <span>مبلغ التأمين (مسترد)</span>
        <span className="font-semibold text-foreground">{deposit.toLocaleString('ar-YE')} ر.ي</span>
      </div>
      <div className="flex justify-between text-muted-foreground">
        <span>رسوم الخدمة</span>
        <span className="font-semibold text-foreground">{serviceFee.toLocaleString('ar-YE')} ر.ي</span>
      </div>
      <div className="flex justify-between pt-3 border-t border-border mt-3">
        <span className="font-bold text-lg">الإجمالي</span>
        <span className="font-bold text-lg text-primary">{total.toLocaleString('ar-YE')} ر.ي</span>
      </div>
    </div>
  );
}
