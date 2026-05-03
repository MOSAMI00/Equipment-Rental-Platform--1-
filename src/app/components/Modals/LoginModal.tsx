import { X } from 'lucide-react';
import { useState } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [phone, setPhone] = useState('');
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-xl">
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="text-center mb-6 mt-4">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">م</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">تسجيل الدخول</h2>
          <p className="text-muted-foreground">أدخل رقم هاتفك للمتابعة</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold">رقم الهاتف</label>
            <div className="flex" dir="ltr">
              <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-border bg-muted text-muted-foreground font-semibold">
                +967
              </span>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="77xxxxxxx"
                className="flex-1 h-12 px-4 rounded-r-xl border border-border bg-white focus:outline-none focus:border-primary text-right"
                dir="rtl"
              />
            </div>
          </div>

          <button className="w-full h-12 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors">
            إرسال رمز التحقق
          </button>
        </div>
        
        <p className="text-xs text-center text-muted-foreground mt-6 leading-relaxed">
          بتسجيل الدخول، أنت توافق على <a href="#" className="text-primary hover:underline">شروط الخدمة</a> و <a href="#" className="text-primary hover:underline">سياسة الخصوصية</a>
        </p>
      </div>
    </div>
  );
}
