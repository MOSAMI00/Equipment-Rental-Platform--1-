import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router';

export function CartBreadcrumb() {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
      <Link to="/" className="hover:text-primary">الرئيسية</Link>
      <ChevronLeft className="w-4 h-4" />
      <span className="text-foreground font-medium">سلة المعدات والدفع</span>
    </div>
  );
}
