
// TODO: Delete this file 
import { SettingsLayout } from './Main/SettingsLayout/SettingsLayout';

export function SettingsPage() {
  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <h2 className="text-2xl font-bold text-[#222222] mb-5">الإعدادات</h2>
      <SettingsLayout />
    </div>
  );
}
