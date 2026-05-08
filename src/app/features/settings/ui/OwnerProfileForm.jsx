import React, { useState, useRef } from 'react';
import { Camera, CheckCircle } from 'lucide-react';
import { useAuth } from '../../../auth/AuthContext';

export function OwnerProfileForm() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.fullName || 'أحمد عبدالله المؤجر');
  const [storeName, setStoreName] = useState('متجر المعدات');
  const [phone, setPhone] = useState('+967 771234567');
  const [email, setEmail] = useState(user?.email || 'ahmed@example.com');
  const [city, setCity] = useState('صنعاء');
  const [address, setAddress] = useState('صنعاء - شارع الستين');
  const [saved, setSaved] = useState(false);
  const fileRef = useRef(null);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const ownerInitial = name.charAt(0) || 'أ';

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#2D5A27] to-[#3D7A35] text-white flex items-center justify-center text-4xl font-bold shadow-lg">
            {ownerInitial}
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#2D5A27] text-white flex items-center justify-center shadow-md hover:bg-[#3D7A35] transition-colors"
          >
            <Camera className="w-4 h-4" />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" />
        </div>
        <p className="text-sm text-[#888888]">شعار النشاط / صورة المؤجر</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: 'الاسم الكامل', value: name, setter: setName, icon: '👤', type: 'text' },
          { label: 'اسم المتجر / النشاط', value: storeName, setter: setStoreName, icon: '🏪', type: 'text' },
          { label: 'البريد الإلكتروني', value: email, setter: setEmail, icon: '📧', type: 'email' },
          { label: 'رقم الهاتف', value: phone, setter: setPhone, icon: '📱', type: 'tel' },
          { label: 'المحافظة', value: city, setter: setCity, icon: '📍', type: 'text' },
          { label: 'العنوان التفصيلي', value: address, setter: setAddress, icon: '🏠', type: 'text' },
        ].map(field => (
          <div key={field.label}>
            <label className="block text-sm font-semibold text-[#222222] mb-1.5">{field.label}</label>
            <div className="relative">
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base">{field.icon}</span>
              <input
                type={field.type}
                value={field.value}
                onChange={e => field.setter(e.target.value)}
                className="w-full h-11 pr-10 pl-4 rounded-xl border border-[#E0E0E0] text-sm focus:outline-none focus:border-[#2D5A27] transition-colors"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        className={`h-12 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
          saved ? 'bg-[#27AE60] text-white' : 'bg-[#2D5A27] text-white hover:bg-[#3D7A35]'
        }`}
      >
        {saved ? <><CheckCircle className="w-4 h-4" /> تم الحفظ!</> : 'حفظ التغييرات'}
      </button>
    </div>
  );
}
export default OwnerProfileForm;
