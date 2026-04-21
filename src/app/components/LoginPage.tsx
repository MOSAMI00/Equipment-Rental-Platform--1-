import { Eye, EyeOff, Mail, Lock, Phone } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login submitted:', formData);
  };

  return (
    <div className="min-h-screen flex">
      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">م</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">مرحباً بعودتك 👋</h1>
            <p className="text-muted-foreground">سجّل دخولك للمتابعة</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Phone Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">رقم الجوال</label>
              <div className="relative">
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>🇾🇪</span>
                  <span>+967</span>
                </div>
                <input
                  type="tel"
                  placeholder="777 123 456"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full h-12 pr-12 pl-24 rounded-lg border border-border bg-white focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full h-12 pr-12 pl-12 rounded-lg border border-border bg-white focus:outline-none focus:border-primary transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-left">
              <button type="button" className="text-primary hover:underline text-sm">
                نسيت كلمة المرور؟
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-12 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              تسجيل الدخول
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-muted-foreground">أو</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <button
                type="button"
                className="w-full h-12 border border-border rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-3"
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
                <span>الدخول بحساب Google</span>
              </button>

              <button
                type="button"
                className="w-full h-12 border border-border rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>الدخول بحساب Facebook</span>
              </button>
            </div>

            {/* Register Link */}
            <p className="text-center text-sm text-muted-foreground">
              ليس لديك حساب؟{' '}
              <Link
                to="/register"
                className="text-primary font-semibold hover:underline"
              >
                إنشاء حساب جديد
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Left Side - Promotional */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#2D5A27] to-[#1a3a15] p-12 items-center justify-center">
        <div className="max-w-lg text-white space-y-8">
          <h2 className="text-4xl font-bold leading-tight">استأجر ما تحتاج في محافظتك</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                ✓
              </div>
              <div>
                <h3 className="font-semibold mb-1">موثوق من آلاف المستخدمين في اليمن</h3>
                <p className="text-white/80 text-sm">أكثر من 3,500 مستخدم نشط في جميع المحافظات</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                📄
              </div>
              <div>
                <h3 className="font-semibold mb-1">عقود رقمية موثقة</h3>
                <p className="text-white/80 text-sm">جميع عمليات التأجير محمية بعقود إلكترونية ملزمة</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                🔒
              </div>
              <div>
                <h3 className="font-semibold mb-1">نظام Escrow لحماية أموالك</h3>
                <p className="text-white/80 text-sm">التأمين محتجز بأمان ويُعاد بعد الإرجاع</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                📍
              </div>
              <div>
                <h3 className="font-semibold mb-1">متاح في صنعاء، عدن، تعز وأكثر</h3>
                <p className="text-white/80 text-sm">تغطية شاملة لجميع المحافظات اليمنية</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
