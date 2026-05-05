import React from 'react';
import { Badge } from '../../ui/badge';

const STATUS_META = {
  available: { label: '● متاح', className: 'badge-available' },
  confirmed: { label: '● محجوز', className: 'badge-confirmed' },
  in_use: { label: '● قيد الاستخدام', className: 'badge-in-use' },
  pending: { label: '● بانتظار', className: 'badge-pending' },
  cancelled: { label: '● مخفي', className: 'badge-cancelled' },
  hidden: { label: '● مخفي', className: 'badge-cancelled' },
  completed: { label: '● مكتمل', className: 'badge-completed' },
};

const StatusBadge = ({ status }) => {
  const meta = STATUS_META[status] ?? STATUS_META.pending;
  return <Badge className={`badge ${meta.className}`}>{meta.label}</Badge>;
};

export default StatusBadge;
