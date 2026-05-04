import { X, AlertTriangle, Send } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
  onSubmit?: (payload: { reason: string; details: string }) => void;
}

export function DisputeModal({ isOpen, onClose, orderId = 'OP-1048', onSubmit }: DisputeModalProps) {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setReason('');
      setDetails('');
      setSubmitted(false);
    }
  }, [isOpen, orderId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative shadow-xl max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#27AE60]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">تم رفع النزاع بنجاح</h2>
            <p className="text-muted-foreground mb-6">سيقوم فريق الدعم بمراجعة طلبك والتواصل معك قريباً.</p>
            <button onClick={onClose} className="h-12 px-8 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors">
              إغلاق
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-[#E74C3C]/10 text-[#E74C3C] rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-1">رفع نزاع أو شكوى</h2>
                <p className="text-sm text-muted-foreground">للطلب رقم: #{orderId}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold">سبب النزاع</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-border bg-white focus:outline-none focus:border-primary"
                >
                  <option value="">اختر السبب...</option>
                  <option value="damage">المعدة تالفة أو لا تعمل</option>
                  <option value="late">تأخير في التسليم</option>
                  <option value="missing">نقص في الملحقات</option>
                  <option value="other">سبب آخر</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold">تفاصيل المشكلة</label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="يرجى توضيح المشكلة بالتفصيل..."
                  className="w-full h-32 p-4 rounded-xl border border-border bg-white focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold">إرفاق صور (اختياري)</label>
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <p className="text-sm text-muted-foreground">اضغط لرفع الصور أو اسحبها هنا</p>
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-border flex gap-3">
                <button
                  onClick={() => {
                    onSubmit?.({ reason, details });
                    setSubmitted(true);
                  }}
                  disabled={!reason || !details}
                  className="flex-1 h-12 bg-[#E74C3C] text-white rounded-xl font-bold hover:bg-[#C0392B] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                  إرسال النزاع
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
