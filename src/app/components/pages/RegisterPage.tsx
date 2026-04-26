import { Link } from 'react-router';
import { useState } from 'react';
import { Eye, EyeOff, User, Phone, Mail, Lock, MapPin, Info } from 'lucide-react';
import { toast } from 'sonner';

type UserType = 'tenant' | 'owner';

const governorates = [
  'صنعاء',
  'عدن',
  'تعز',
  'الحديدة',
  'إب',
  'مأرب',
  'حضرموت',
  'المكلا',
  'ذمار',
  'لحج',
  'أبين',
  'شبوة',
  'البيضاء',
  'الجوف',
  'عمران',
  'ريمة',
  'المهرة',
  'المحويت',
  'الضالع',
  'سقطرى',
];

const equipmentCategories = [
  'مولدات',
  'بناء',
  'زراعة',
  'تصوير',
  'فعاليات',
  'طبي',
  'رياضة',
  'أخرى',
];

const paymentMethods = [
  'تحويل بنكي',
  'كاش (يدوي)',
  'محفظة إلكترونية',
];

export function RegisterPage() {
  const [userType, setUserType] = useState<UserType>('tenant');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    governorate: '',
    district: '',
    storeName: '',
    mainGovernorate: '',
    paymentMethod: '',
  });

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  const getStrengthColor = (strength: number) => {
    if (strength <= 1) return '#E74C3C';
    if (strength === 2) return '#F39C12';
    if (strength === 3) return '#F1C40F';
    return '#2D5A27';
  };

  const getStrengthLabel = (strength: number) => {
    if (strength <= 1) return 'ضعيفة';
    if (strength === 2) return 'متوسطة';
    if (strength === 3) return 'جيدة';
    return 'قوية';
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeToTerms) {
      toast.error('يرجى الموافقة على الشروط والأحكام');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('كلمة المرور غير متطابقة');
      return;
    }

    toast.success('تم إنشاء حسابك بنجاح 🎉');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row" dir="rtl">
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white order-2 md:order-1 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="text-center md:text-right mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">
              إنشاء حساب جديد 🚀
            </h2>
            <p className="text-[#888888]">انضم إلى منصة تأجير المعدات الأولى في اليمن</p>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setUserType('tenant')}
              className={`flex-1 h-14 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                userType === 'tenant'
                  ? 'border-[#2D5A27] bg-[#2D5A27]/5'
                  : 'border-[#E0E0E0] hover:border-[#2D5A27]/30'
              }`}
            >
              <span className="text-xl">🏠</span>
              <span className="text-sm font-medium">أنا مستأجر</span>
            </button>

            <button
              type="button"
              onClick={() => setUserType('owner')}
              className={`flex-1 h-14 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                userType === 'owner'
                  ? 'border-[#2D5A27] bg-[#2D5A27]/5'
                  : 'border-[#E0E0E0] hover:border-[#2D5A27]/30'
              }`}
            >
              <span className="text-xl">🔑</span>
              <span className="text-sm font-medium">أنا مؤجر</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">الاسم الكامل</label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="أدخل اسمك الكامل"
                  className="w-full pr-12 pl-4 h-12 rounded-lg border border-[#E0E0E0] focus:border-[#2D5A27] focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">رقم الجوال</label>
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#888888] flex items-center gap-1">
                  <span className="text-base">🇾🇪</span>
                  <span>+967</span>
                </div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="770 123 456"
                  className="w-full pr-12 pl-24 h-12 rounded-lg border border-[#E0E0E0] focus:border-[#2D5A27] focus:outline-none"
                  dir="ltr"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                البريد الإلكتروني{' '}
                <span className="text-[#888888] font-normal">(اختياري)</span>
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="example@email.com"
                  className="w-full pr-12 pl-4 h-12 rounded-lg border border-[#E0E0E0] focus:border-[#2D5A27] focus:outline-none"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="أدخل كلمة مرور قوية"
                  className="w-full pr-12 pl-12 h-12 rounded-lg border border-[#E0E0E0] focus:border-[#2D5A27] focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#222222] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className="h-1 flex-1 rounded-full transition-all"
                        style={{
                          backgroundColor:
                            level <= passwordStrength
                              ? getStrengthColor(passwordStrength)
                              : '#E0E0E0',
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: getStrengthColor(passwordStrength) }}>
                    قوة كلمة المرور: {getStrengthLabel(passwordStrength)}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">تأكيد كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  placeholder="أعد إدخال كلمة المرور"
                  className="w-full pr-12 pl-12 h-12 rounded-lg border border-[#E0E0E0] focus:border-[#2D5A27] focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#222222] transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">المحافظة</label>
              <div className="relative">
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
                <select
                  value={formData.governorate}
                  onChange={(e) =>
                    setFormData({ ...formData, governorate: e.target.value })
                  }
                  className="w-full pr-12 pl-4 h-12 rounded-lg border border-[#E0E0E0] focus:border-[#2D5A27] focus:outline-none appearance-none cursor-pointer"
                  required
                >
                  <option value="">اختر المحافظة</option>
                  {governorates.map((gov) => (
                    <option key={gov} value={gov}>
                      {gov}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">المديرية / الحي</label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) =>
                  setFormData({ ...formData, district: e.target.value })
                }
                placeholder="مثال: المدينة، كريتر، الوحدة..."
                className="w-full px-4 h-12 rounded-lg border border-[#E0E0E0] focus:border-[#2D5A27] focus:outline-none"
                required
              />
            </div>

            {userType === 'owner' && (
              <>
                <div className="border-t border-[#E0E0E0] pt-4 mt-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <span className="text-xl">🔑</span>
                    معلومات المؤجر
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        اسم المتجر / المؤجر
                      </label>
                      <input
                        type="text"
                        value={formData.storeName}
                        onChange={(e) =>
                          setFormData({ ...formData, storeName: e.target.value })
                        }
                        placeholder="مثال: معدات البناء الحديث"
                        className="w-full px-4 h-12 rounded-lg border border-[#E0E0E0] focus:border-[#2D5A27] focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        نوع المعدات
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {equipmentCategories.map((category) => (
                          <button
                            key={category}
                            type="button"
                            onClick={() => toggleCategory(category)}
                            className={`px-3 py-2 rounded-lg text-sm transition-all ${
                              selectedCategories.includes(category)
                                ? 'bg-[#2D5A27] text-white'
                                : 'bg-[#F8F8F8] text-[#222222] hover:bg-[#E0E0E0]'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        المحافظة الرئيسية للنشاط
                      </label>
                      <select
                        value={formData.mainGovernorate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mainGovernorate: e.target.value,
                          })
                        }
                        className="w-full px-4 h-12 rounded-lg border border-[#E0E0E0] focus:border-[#2D5A27] focus:outline-none appearance-none cursor-pointer"
                        required
                      >
                        <option value="">اختر المحافظة</option>
                        {governorates.map((gov) => (
                          <option key={gov} value={gov}>
                            {gov}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        وسيلة استلام الأرباح
                      </label>
                      <select
                        value={formData.paymentMethod}
                        onChange={(e) =>
                          setFormData({ ...formData, paymentMethod: e.target.value })
                        }
                        className="w-full px-4 h-12 rounded-lg border border-[#E0E0E0] focus:border-[#2D5A27] focus:outline-none appearance-none cursor-pointer"
                        required
                      >
                        <option value="">اختر وسيلة الدفع</option>
                        {paymentMethods.map((method) => (
                          <option key={method} value={method}>
                            {method}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-[#FFF9E6] border border-[#F39C12] rounded-lg p-4 flex gap-3">
                  <Info className="w-5 h-5 text-[#F39C12] flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-[#222222] mb-1">
                      سيُطلب منك رفع صورة بطاقة شخصية أو جواز سفر قبل إتمام أول حجز
                    </p>
                    <button
                      type="button"
                      className="text-[#F39C12] hover:underline font-medium"
                    >
                      اعرف المزيد ←
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-[#E0E0E0] text-[#2D5A27] focus:ring-[#2D5A27]"
              />
              <label htmlFor="terms" className="text-sm text-[#222222]">
                أوافق على{' '}
                <Link to="/terms" className="text-[#2D5A27] hover:underline">
                  الشروط والأحكام
                </Link>
              </label>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#2D5A27] text-white rounded-lg hover:bg-[#234518] transition-colors font-medium"
            >
              إنشاء الحساب
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E0E0E0]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-[#888888]">— أو —</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="h-12 border border-[#E0E0E0] rounded-lg hover:bg-[#F8F8F8] transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-sm">Google</span>
              </button>

              <button
                type="button"
                className="h-12 border border-[#E0E0E0] rounded-lg hover:bg-[#F8F8F8] transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-sm">Facebook</span>
              </button>
            </div>

            <div className="text-center mt-6">
              <span className="text-[#888888]">لديك حساب بالفعل؟ </span>
              <Link to="/login" className="text-[#2D5A27] font-semibold hover:underline">
                تسجيل الدخول
              </Link>
            </div>
          </form>
        </div>
      </div>

      <div className="flex-1 bg-gradient-to-br from-[#2D5A27] to-[#1a3a15] text-white p-6 md:p-12 flex items-center justify-center order-1 md:order-2 md:sticky md:top-0 md:h-screen">
        <div className="max-w-md">
          {userType === 'tenant' ? (
            <>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                ماذا تحصل عند التسجيل؟
              </h2>

              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">🔍</span>
                    <h3 className="font-semibold text-lg">تصفح المعدات في محافظتك</h3>
                  </div>
                  <p className="text-sm opacity-90 pr-12">
                    ابحث عن آلاف المعدات المتاحة بالقرب منك
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">📅</span>
                    <h3 className="font-semibold text-lg">احجز في دقائق</h3>
                  </div>
                  <p className="text-sm opacity-90 pr-12">
                    عملية حجز سريعة وسهلة بدون تعقيدات
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">🔒</span>
                    <h3 className="font-semibold text-lg">ادفع بأمان عبر Escrow</h3>
                  </div>
                  <p className="text-sm opacity-90 pr-12">
                    حماية كاملة لمدفوعاتك حتى اكتمال التأجير
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">⭐</span>
                    <h3 className="font-semibold text-lg">قيّم بعد كل تأجير</h3>
                  </div>
                  <p className="text-sm opacity-90 pr-12">
                    ساعد الآخرين باختيار المؤجرين الموثوقين
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                حوّل معداتك إلى دخل إضافي
              </h2>

              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">💰</span>
                    <h3 className="font-semibold text-lg">حدد سعرك بالريال اليمني</h3>
                  </div>
                  <p className="text-sm opacity-90 pr-12">
                    تحكم كامل في أسعارك وشروط التأجير
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">📄</span>
                    <h3 className="font-semibold text-lg">عقود رقمية تحميك</h3>
                  </div>
                  <p className="text-sm opacity-90 pr-12">
                    كل تأجير محمي بعقد موثق ومضمون
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">🏦</span>
                    <h3 className="font-semibold text-lg">
                      استلم أرباحك بعد اكتمال التأجير
                    </h3>
                  </div>
                  <p className="text-sm opacity-90 pr-12">
                    تحويل فوري وآمن لأرباحك بعد كل تأجير
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">📊</span>
                    <h3 className="font-semibold text-lg">تتبع طلباتك وأرباحك</h3>
                  </div>
                  <p className="text-sm opacity-90 pr-12">
                    لوحة تحكم شاملة لإدارة معداتك ومتابعة أرباحك
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
