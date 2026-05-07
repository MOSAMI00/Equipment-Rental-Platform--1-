import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';

interface BreadcrumbProps {
  id: string | undefined;
}

export function Breadcrumb({ id }: BreadcrumbProps) {
  const navigate = useNavigate();
  return (
    <nav className="flex items-center gap-1 text-sm text-[#888888] mb-5">
      <button onClick={() => navigate('/dashboard')} className="hover:text-[#2D5A27] transition-colors">
        طلباتي
      </button>
      <ChevronRight className="w-4 h-4 rotate-180" />
      <span className="text-[#222222] font-medium">تفاصيل الطلب #{id}</span>
    </nav>
  );
}
