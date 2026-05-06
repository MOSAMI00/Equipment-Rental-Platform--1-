export const SETTINGS_CONFIG = {
  tenant: {
    pageTitle: 'الإعدادات',
    tabs: [
      { id: 'profile', name: 'الملف الشخصي', iconName: 'User' },
      { id: 'security', name: 'الأمان', iconName: 'Shield' },
      { id: 'kyc', name: 'التحقق من الهوية KYC', iconName: 'CreditCard' },
      { id: 'insurance', name: 'التأمينات', iconName: 'CreditCard' },
    ]
  },
  owner: {
    pageTitle: 'ملفي الشخصي',
    tabs: [
      { id: 'profile', name: 'الملف الشخصي', iconName: 'User' },
      { id: 'security', name: 'الأمان وكلمة المرور', iconName: 'Shield' },
      { id: 'payment', name: 'وسائل استلام الأرباح', iconName: 'CreditCard' },
      { id: 'notifications', name: 'الإشعارات والتفضيلات', iconName: 'Bell' },
    ]
  }
};

export function getSettingsConfig(role) {
  return SETTINGS_CONFIG[role] || SETTINGS_CONFIG.tenant;
}
