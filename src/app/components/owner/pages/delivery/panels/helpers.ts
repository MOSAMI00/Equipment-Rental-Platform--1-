import type { RentalListItem } from '../../../../../types/owner';
import { STATUS_CONFIG } from '../../../../tenant/Dashboard/shared/OrderTypes';

export const UNKNOWN_EQUIPMENT = 'معدة غير معروفة';
export const UNKNOWN_USER = 'مستخدم غير معروف';
export const UNKNOWN_STATUS = 'غير معروف';

export type OwnerDecision = 'full_refund' | 'partial_refund' | 'no_refund';

export const CONDITION_LABELS: Record<string, string> = {
  excellent: '✨ ممتازة',
  good: '👍 جيدة',
  fair: '⚠️ مقبولة',
  poor: '❌ سيئة',
};

export const statusConfig = (status?: string) => (
  status ? STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] : undefined
) ?? { label: status ?? UNKNOWN_STATUS };

export const equipmentOf = (rental?: RentalListItem | null) => rental?.equipment ?? {};
export const tenantOf = (rental?: RentalListItem | null) => rental?.tenant ?? {};
