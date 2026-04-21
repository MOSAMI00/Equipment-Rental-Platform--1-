import { useState, useRef } from 'react';
import { Camera, Eye, EyeOff, CheckCircle, Upload, Shield, User, CreditCard } from 'lucide-react';

type SettingsTab = 'profile' | 'security' | 'kyc';

function ProfileTab() {
  const [name, setName] = useState('أحمد محمد');
  const [phone, setPhone] = useState('+967 77x xxx xxx');
  const [email, setEmail] = useState('ahmed@example.com');
  const [city, setCity] = useState('صنعاء');
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Avatar */}
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#2D5A27] to-[#3D7A35] text-white flex items-center justify-center text-4xl font-bold shadow-lg">
            أ
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#2D5A27] text-white flex items-center justify-center shadow-md hover:bg-[#3D7A35] transition-colors"
          >
            <Camera className="w-4 h-4" />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" />
        </div>
        <p className="text-sm text-[#888888]">انقر لتغيير الصورة</p>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: 'الاسم الكامل', value: name, setter: setName, icon: '👤', type: 'text' },
          { label: 'رقم الهاتف', value: phone, setter: setPhone, icon: '📱', type: 'tel' },
          { label: 'البريد الإلكتروني', value: email, setter: setEmail, icon: '📧', type: 'email' },
          { label: 'المدينة', value: city, setter: setCity, icon: '📍', type: 'text' },
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

function SecurityTab() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const strength = newPw.length === 0 ? 0 : newPw.length < 6 ? 1 : newPw.length < 10 ? 2 : 3;
  const strengthLabels = ['', 'ضعيف', 'متوسط', 'قوي'];
  const strengthColors = ['', '#E74C3C', '#F39C12', '#27AE60'];

  return (
    <div className="flex flex-col gap-5">
      <div className="p-4 bg-[#EAF3E9] border border-[#2D5A27]/20 rounded-xl flex items-center gap-3">
        <Shield className="w-5 h-5 text-[#2D5A27]" />
        <p className="text-sm text-[#2D5A27] font-medium">حسابك محمي. آخر تسجيل دخول: اليوم الساعة 10:30 صباحاً</p>
      </div>

      <h3 className="font-bold text-[#222222]">تغيير كلمة المرور</h3>

      {[
        { label: 'كلمة المرور الحالية', value: oldPw, setter: setOldPw, show: showOld, toggle: () => setShowOld(!showOld) },
        { label: 'كلمة المرور الجديدة', value: newPw, setter: setNewPw, show: showNew, toggle: () => setShowNew(!showNew) },
        { label: 'تأكيد كلمة المرور', value: confirmPw, setter: setConfirmPw, show: showConfirm, toggle: () => setShowConfirm(!showConfirm) },
      ].map((field, i) => (
        <div key={i}>
          <label className="block text-sm font-semibold text-[#222222] mb-1.5">{field.label}</label>
          <div className="relative">
            <input
              type={field.show ? 'text' : 'password'}
              value={field.value}
              onChange={e => field.setter(e.target.value)}
              className="w-full h-11 pr-4 pl-11 rounded-xl border border-[#E0E0E0] text-sm focus:outline-none focus:border-[#2D5A27] transition-colors"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={field.toggle}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#222222]"
            >
              {field.show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {/* Strength indicator */}
          {i === 1 && newPw.length > 0 && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[1,2,3].map(s => (
                  <div key={s} className="flex-1 h-1.5 rounded-full transition-all" style={{ backgroundColor: strength >= s ? strengthColors[strength] : '#E0E0E0' }} />
                ))}
              </div>
              <p className="text-xs mt-1" style={{ color: strengthColors[strength] }}>{strengthLabels[strength]}</p>
            </div>
          )}
        </div>
      ))}

      <button
        disabled={!oldPw || !newPw || newPw !== confirmPw}
        className="h-12 bg-[#2D5A27] text-white rounded-xl font-bold text-sm hover:bg-[#3D7A35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        تغيير كلمة المرور
      </button>

      {/* Two-Factor */}
      <div className="border-t border-[#E0E0E0] pt-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-[#222222] text-sm">المصادقة الثنائية</p>
            <p className="text-xs text-[#888888] mt-0.5">حماية إضافية لحسابك</p>
          </div>
          <div className="relative">
            <input type="checkbox" id="2fa" className="sr-only" />
            <label htmlFor="2fa" className="w-11 h-6 bg-[#E0E0E0] rounded-full cursor-pointer flex items-center px-0.5 transition-colors has-[:checked]:bg-[#2D5A27]">
              <span className="w-5 h-5 bg-white rounded-full shadow transition-transform" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

function KYCTab() {
  const [frontUploaded, setFrontUploaded] = useState(false);
  const [backUploaded, setBackUploaded] = useState(false);
  const [selfieUploaded, setSelfieUploaded] = useState(false);

  const steps = [
    { label: 'رفع الهوية (الأمامي)', uploaded: frontUploaded, setter: setFrontUploaded, icon: '🪪' },
    { label: 'رفع الهوية (الخلفي)', uploaded: backUploaded, setter: setBackUploaded, icon: '🪪' },
    { label: 'صورة سيلفي', uploaded: selfieUploaded, setter: setSelfieUploaded, icon: '🤳' },
  ];

  const allDone = frontUploaded && backUploaded && selfieUploaded;

  return (
    <div className="flex flex-col gap-5">
      {/* KYC Status */}
      <div className="p-4 rounded-xl border border-[#F39C12]/30 bg-[#FEF9E7] flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#FEF9E7] border border-[#F39C12] flex items-center justify-center text-xl flex-shrink-0">⏳</div>
        <div>
          <p className="font-bold text-[#F39C12] text-sm">التحقق من الهوية قيد الانتظار</p>
          <p className="text-xs text-[#888888] mt-0.5">يرجى رفع المستندات المطلوبة لتفعيل حسابك بالكامل</p>
        </div>
      </div>

      <div className="p-4 bg-white border border-[#E0E0E0] rounded-xl">
        <h3 className="font-bold text-[#222222] mb-1">لماذا نحتاج التحقق؟</h3>
        <p className="text-sm text-[#888888]">للحفاظ على أمان المنصة وضمان حقوق جميع المستخدمين، نحتاج التحقق من هويتك.</p>
      </div>

      <h3 className="font-bold text-[#222222]">المستندات المطلوبة</h3>

      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white border border-[#E0E0E0] rounded-xl">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${step.uploaded ? 'bg-[#EAFAF1]' : 'bg-[#F4F6F9]'}`}>
            {step.uploaded ? '✅' : step.icon}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-[#222222] text-sm">{step.label}</p>
            <p className="text-xs text-[#888888]">{step.uploaded ? 'تم الرفع' : 'لم يتم الرفع بعد'}</p>
          </div>
          <button
            onClick={() => step.setter(true)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              step.uploaded
                ? 'bg-[#EAFAF1] text-[#27AE60] border border-[#27AE60]/30'
                : 'bg-[#2D5A27] text-white hover:bg-[#3D7A35]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            {step.uploaded ? 'تم' : 'رفع'}
          </button>
        </div>
      ))}

      {allDone && (
        <div className="p-4 bg-[#EAF3E9] border border-[#2D5A27]/20 rounded-xl flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-[#27AE60]" />
          <p className="text-sm text-[#2D5A27] font-medium">تم رفع جميع المستندات! سيتم مراجعتها خلال 24 ساعة.</p>
        </div>
      )}

      <button
        disabled={!allDone}
        className="h-12 bg-[#2D5A27] text-white rounded-xl font-bold text-sm hover:bg-[#3D7A35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        تقديم طلب التحقق
      </button>
    </div>
  );
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  const tabs: { key: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { key: 'profile', label: 'الملف الشخصي', icon: <User className="w-4 h-4" /> },
    { key: 'security', label: 'الأمان', icon: <Shield className="w-4 h-4" /> },
    { key: 'kyc', label: 'التحقق من الهوية KYC', icon: <CreditCard className="w-4 h-4" /> },
  ];

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <h2 className="text-2xl font-bold text-[#222222] mb-5">الإعدادات</h2>

      <div className="flex flex-col md:flex-row gap-5">
        {/* Tab Nav (sidebar on desktop, horizontal on mobile) */}
        <div className="md:w-52 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-[#E0E0E0] p-2 flex md:flex-col gap-1">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-right flex-1 md:flex-none ${
                  activeTab === tab.key
                    ? 'bg-[#2D5A27] text-white'
                    : 'text-[#888888] hover:bg-[#F4F6F9] hover:text-[#222222]'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 bg-white rounded-2xl border border-[#E0E0E0] p-5">
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'security' && <SecurityTab />}
          {activeTab === 'kyc' && <KYCTab />}
        </div>
      </div>
    </div>
  );
}
