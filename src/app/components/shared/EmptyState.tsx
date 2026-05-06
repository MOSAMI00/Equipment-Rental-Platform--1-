import * as React from 'react';
import { cn } from '../ui/utils';
import { AppButton } from './AppButton';

type EmptyStateType = 'empty' | 'noResults' | 'error';

const copy: Record<EmptyStateType, { icon: React.ReactNode; title: string; description: string }> = {
  empty: {
    icon: '📭',
    title: 'لا توجد بيانات',
    description: 'ستظهر البيانات هنا عند توفرها.',
  },
  noResults: {
    icon: '🔎',
    title: 'لا توجد نتائج مطابقة',
    description: 'جرّب تعديل البحث أو الفلاتر.',
  },
  error: {
    icon: '⚠️',
    title: 'تعذر تحميل البيانات',
    description: 'حدث خطأ غير متوقع. حاول مرة أخرى.',
  },
};

export interface EmptyStateProps {
  type?: EmptyStateType;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function EmptyState({
  type = 'empty',
  icon,
  title,
  description,
  actionLabel,
  onAction,
  compact = false,
  className,
  children,
}: EmptyStateProps) {
  const fallback = copy[type];

  return (
    <div
      className={cn(
        'rounded-xl border border-[#E0E0E0] bg-white text-center',
        compact ? 'p-6' : 'p-10',
        className,
      )}
    >
      <div className={cn('mx-auto mb-3 flex items-center justify-center text-3xl', compact ? 'h-9' : 'h-12')}>
        {icon ?? fallback.icon}
      </div>
      <h3 className="mb-2 text-lg font-bold text-[#222222]">{title ?? fallback.title}</h3>
      <p className="mx-auto mb-0 max-w-md text-sm text-[#888888]">{description ?? fallback.description}</p>
      {actionLabel && onAction ? (
        <AppButton className="mt-5" onClick={onAction}>
          {actionLabel}
        </AppButton>
      ) : null}
      {children}
    </div>
  );
}
