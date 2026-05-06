export const DELIVERY_CONFIG = {
  tenant: {
    pageTitle: 'التسليم والإرجاع',
    containerClassName: '',
  },
  owner: {
    pageTitle: 'التسليم والإرجاع',
    containerClassName: 'p-4 md:p-6 pb-24 md:pb-6',
  },
};

export function getDeliveryConfig(role) {
  return DELIVERY_CONFIG[role] || DELIVERY_CONFIG.tenant;
}
