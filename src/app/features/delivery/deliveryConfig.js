export const DELIVERY_CONFIG = {
  tenant: {
    pageTitle: 'التسليم والإرجاع',
    description: 'متابعة عمليات الاستلام والإرجاع والنزاعات من واجهة موحدة.',
    tabs: [
      { id: 'all', label: 'الكل' },
      { id: 'delivery', label: 'بانتظار التسليم' },
      { id: 'handover', label: 'قيد التسليم' },
      { id: 'in_use', label: 'قيد الاستخدام' },
      { id: 'return', label: 'بانتظار الإرجاع' },
      { id: 'disputes', label: 'النزاعات' },
    ],
    containerClassName: 'p-4 md:p-6 pb-24 md:pb-6',
  },
  owner: {
    pageTitle: 'التسليم والإرجاع',
    description: 'متابعة عمليات التسليم والإرجاع والنزاعات من واجهة موحدة.',
    tabs: [
      { id: 'all', label: 'الكل' },
      { id: 'delivery', label: 'بانتظار التسليم' },
      { id: 'handover', label: 'قيد التسليم' },
      { id: 'in_use', label: 'قيد الاستخدام' },
      { id: 'return', label: 'بانتظار الإرجاع' },
      { id: 'disputes', label: 'النزاعات' },
    ],
    containerClassName: 'p-4 md:p-6 pb-24 md:pb-6',
  },
};

export function getDeliveryConfig(role) {
  return DELIVERY_CONFIG[role] || DELIVERY_CONFIG.tenant;
}
