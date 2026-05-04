export type NotifType = 'payment' | 'order' | 'return' | 'review' | 'dispute' | 'system';

export const TYPE_COLORS: Record<NotifType, string> = {
  payment:  '#F39C12',
  order:    '#27AE60',
  return:   '#3498DB',
  review:   '#9B59B6',
  dispute:  '#E74C3C',
  system:   '#888888',
};
