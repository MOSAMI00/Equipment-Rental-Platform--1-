import React from 'react';
import { AlertTriangle, CheckCircle, Lock } from 'lucide-react';

export const insuranceSummaryCards = [
  {
    label: 'محتجز',
    value: '50,000 ر.ي',
    icon: <Lock />,
    iconStyle: { color: 'var(--color-confirmed)', backgroundColor: 'rgba(52, 152, 219, 0.1)' },
  },
  {
    label: 'مُسترَد',
    value: '320,000 ر.ي',
    valueClassName: 'text-success',
    icon: <CheckCircle />,
    iconStyle: { color: 'var(--color-completed)', backgroundColor: 'rgba(39, 174, 96, 0.1)' },
  },
  {
    label: 'متنازع عليه',
    value: '2 حالات',
    valueClassName: 'text-danger',
    icon: <AlertTriangle />,
    iconStyle: { color: 'var(--color-disputed)', backgroundColor: 'rgba(231, 76, 60, 0.1)' },
  },
];

export const insuranceRows = [
  {
    id: 'insurance-1047',
    order: '#OP-1047',
    tenant: 'أحمد محمد',
    amount: '50,000 ر.ي',
    status: 'held',
    statusLabel: 'محتجز',
    statusMeta: { color: '#3498DB', bg: 'rgba(52,152,219,0.12)' },
    deduction: 'لا',
  },
  {
    id: 'insurance-1041',
    order: '#OP-1041',
    tenant: 'سارة أحمد',
    amount: '30,000 ر.ي',
    status: 'disputed',
    statusLabel: 'متنازع',
    statusMeta: { color: '#E74C3C', bg: 'rgba(231,76,60,0.12)' },
    deduction: '15,000 ر.ي',
    isDeductionHighlighted: true,
    action: 'details',
  },
  {
    id: 'insurance-1039',
    order: '#OP-1039',
    tenant: 'خالد ناصر',
    amount: '50,000 ر.ي',
    status: 'released',
    statusLabel: 'مُسترد',
    statusMeta: { color: '#27AE60', bg: 'rgba(39,174,96,0.12)' },
    deduction: 'لا',
  },
  {
    id: 'insurance-1035',
    order: '#OP-1035',
    tenant: 'ياسر علي',
    amount: '20,000 ر.ي',
    status: 'released',
    statusLabel: 'مُسترد',
    statusMeta: { color: '#27AE60', bg: 'rgba(39,174,96,0.12)' },
    deduction: 'لا',
    action: 'claim',
  },
];
