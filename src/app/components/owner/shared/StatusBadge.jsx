import React from 'react';
import { StatusBadge as SharedStatusBadge } from '../../shared/StatusBadge';

const OWNER_LABELS = {
  available: '● متاح',
  confirmed: '● محجوز',
  in_use: '● قيد الاستخدام',
  pending: '● بانتظار',
  cancelled: '● مخفي',
  hidden: '● مخفي',
  completed: '● مكتمل',
};

const StatusBadge = ({ status }) => (
  <SharedStatusBadge status={status} label={OWNER_LABELS[status]} />
);

export default StatusBadge;
