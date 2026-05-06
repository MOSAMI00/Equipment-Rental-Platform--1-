const CONTRACT_CONFIGS = {
  tenant: {
    pageTitle: 'عقودي',
    searchPlaceholder: 'بحث برقم العقد أو اسم المؤجر أو المعدة...',
    partnerColumnHeader: 'اسم المؤجر',
    amountColumnHeader: 'المبلغ',
    statusColumnHeader: 'الحالة',
    tabs: ['الكل', 'نشط', 'مكتمل', 'منتهي'],
    statusesByTab: {
      الكل: [],
      نشط: ['active'],
      مكتمل: ['completed'],
      منتهي: ['expired'],
    },
    actions: {
      canDispute: true,
      canConfirmReceipt: true,
      canConfirmDelivery: false,
    },
    actionLabels: {
      confirmReceipt: 'تأكيد الاستلام',
      confirmDelivery: 'تأكيد التسليم',
      dispute: 'فتح نزاع',
    },
  },
  owner: {
    pageTitle: 'عقود التأجير',
    searchPlaceholder: 'بحث برقم العقد أو اسم المستأجر أو المعدة...',
    partnerColumnHeader: 'اسم المستأجر',
    amountColumnHeader: 'إجمالي العقد',
    statusColumnHeader: 'الحالة',
    tabs: ['الكل', 'بانتظار الموافقة', 'نشط', 'مكتمل'],
    statusesByTab: {
      الكل: [],
      'بانتظار الموافقة': ['pending'],
      نشط: ['active'],
      مكتمل: ['completed'],
    },
    actions: {
      canDispute: true,
      canConfirmReceipt: false,
      canConfirmDelivery: true,
    },
    actionLabels: {
      confirmReceipt: 'تأكيد الاستلام',
      confirmDelivery: 'تأكيد التسليم',
      dispute: 'فتح نزاع',
    },
  },
};

export function getContractConfig(role) {
  return CONTRACT_CONFIGS[role] || CONTRACT_CONFIGS.tenant;
}
