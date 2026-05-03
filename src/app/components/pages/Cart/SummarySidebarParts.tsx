import { Lock, FileCheck, RefreshCw } from 'lucide-react';

interface ItemsListProps {
  cartItems: any[];
}

export function ItemsList({ cartItems }: ItemsListProps) {
  return (
    <div className="space-y-3">
      {cartItems.map(item => (
        <div key={item.id} className="flex items-center gap-3 pb-3 border-b border-border">
          <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{item.name}</h4>
            <p className="text-xs text-muted-foreground">{item.days} أيام × {item.dailyRate.toLocaleString('ar-YE')} ر.ي</p>
          </div>
        </div>
      ))}
    </div>
  );
}

interface PricingBreakdownProps {
  rentalCost: number;
  deposit: number;
  serviceFee: number;
}

export function PricingBreakdown({ rentalCost, deposit, serviceFee }: PricingBreakdownProps) {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-muted-foreground">قيمة الإيجار:</span>
        <span className="font-semibold">{rentalCost.toLocaleString('ar-YE')} ر.ي</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">التأمين:</span>
        <span className="font-semibold">{deposit.toLocaleString('ar-YE')} ر.ي</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">رسوم الخدمة:</span>
        <span className="font-semibold">{serviceFee.toLocaleString('ar-YE')} ر.ي</span>
      </div>
    </div>
  );
}

interface TotalProps {
  total: number;
}

export function Total({ total }: TotalProps) {
  return (
    <div className="border-t border-border pt-3">
      <div className="flex justify-between items-baseline">
        <span className="font-bold">الإجمالي:</span>
        <span className="text-2xl font-bold text-primary">{total.toLocaleString('ar-YE')} ر.ي</span>
      </div>
    </div>
  );
}

export function TrustInfo() {
  return (
    <div className="space-y-3 pt-3 border-t border-border">
      <div className="bg-[#E8F5E9] rounded-lg p-3 flex items-start gap-3">
        <Lock className="w-5 h-5 text-[#27AE60] flex-shrink-0" />
        <div className="text-xs text-foreground">
          <p className="font-semibold mb-1">💡 التأمين يُحتجز في Escrow</p>
          <p className="text-muted-foreground">ويُعاد بعد اكتمال التأجير</p>
        </div>
      </div>
      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <FileCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>عقد موثق إلكترونياً</span>
      </div>
      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <RefreshCw className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>استرداد التأمين خلال 5 أيام عمل</span>
      </div>
      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>دفع آمن 100%</span>
      </div>
    </div>
  );
}
