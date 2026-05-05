import React from 'react';

const EMPTY_STATE_COPY = {
  empty: {
    icon: '📭',
    title: 'لا توجد بيانات',
    description: 'ستظهر البيانات هنا عند توفرها.',
  },
  noResults: {
    icon: '🔎',
    title: 'لا توجد نتائج مطابقة',
    description: 'جرّب تغيير البحث أو الفلاتر.',
  },
  error: {
    icon: '⚠️',
    title: 'تعذر عرض البيانات',
    description: 'هذه مساحة جاهزة لرسائل الأخطاء لاحقاً.',
  },
};

const EmptyState = (props) => {
  const { icon, title, description, action, type = 'empty', compact = false } = props;
  const fallback = EMPTY_STATE_COPY[type] ?? EMPTY_STATE_COPY.empty;

  return (
    <div className="owner-card text-center" style={{ padding: compact ? 24 : 40 }}>
      <div style={{ fontSize: compact ? 32 : 40, marginBottom: 12 }}>{icon ?? fallback.icon}</div>
      <h3 style={{ marginTop: 0, marginBottom: 8 }}>{title ?? fallback.title}</h3>
      <p className="text-muted" style={{ margin: 0 }}>{description ?? fallback.description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
};

export default EmptyState;
