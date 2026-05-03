import { useState } from 'react';
import { CheckCircle } from 'lucide-react';

export function SignatureBox() {
  const [signed, setSigned] = useState(false);
  return (
    <div>
      <p className="text-sm font-semibold text-[#222222] mb-2">التوقيع</p>
      <div
        onClick={() => setSigned(true)}
        className={`h-24 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all ${
          signed ? 'border-[#27AE60] bg-[#EAFAF1]' : 'border-[#E0E0E0] hover:border-[#2D5A27] bg-[#F4F6F9]'
        }`}
      >
        {signed ? (
          <div className="flex items-center gap-2 text-[#27AE60]">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium text-sm">تم التوقيع</span>
          </div>
        ) : (
          <span className="text-[#888888] text-sm">انقر للتوقيع</span>
        )}
      </div>
    </div>
  );
}
