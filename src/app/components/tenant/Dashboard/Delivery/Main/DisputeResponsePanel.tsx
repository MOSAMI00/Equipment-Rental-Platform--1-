import { useEffect, useState } from 'react';
import { AlertTriangle, Send } from 'lucide-react';
import { formatRentalDate, type Dispute, type TenantRental } from '../../../../../data/mock-api';

interface DisputeResponsePanelProps {
  rental: TenantRental;
  dispute: Dispute;
  onSubmitResponse: (text: string) => void;
}

export function DisputeResponsePanel({ rental, dispute, onSubmitResponse }: DisputeResponsePanelProps) {
  const [text, setText] = useState(dispute.tenantClaim ?? '');

  useEffect(() => {
    setText(dispute.tenantClaim ?? '');
  }, [dispute.id, dispute.tenantClaim]);

  const isOwnerOpened = dispute.openedByRole === 'owner';
  if (!isOwnerOpened) return null;

  return (
    <div className="bg-white rounded-2xl border border-[#E74C3C]/30 p-5 shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#FDEDEC] text-[#E74C3C] flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-[#222222]">نزاع من المؤجر — الطلب #{rental.orderNum}</h3>
          <p className="text-xs text-[#888888] mt-1">{formatRentalDate(dispute.createdAt)}</p>
          <div className="mt-3 p-3 rounded-xl bg-[#F4F6F9] border border-[#E0E0E0]">
            <p className="text-xs font-semibold text-[#555555] mb-1">مبرر المؤجر</p>
            <p className="text-sm text-[#222222] whitespace-pre-wrap">{dispute.details}</p>
          </div>
        </div>
      </div>

      <label className="block text-sm font-semibold text-[#222222] mb-2">ردك واعتراضك</label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="اشرح موقفك والوقائع التي تؤيدها..."
        rows={4}
        className="w-full rounded-xl border border-[#E0E0E0] px-4 py-3 text-sm text-[#222222] focus:outline-none focus:border-[#2D5A27] mb-3"
      />
      <button
        type="button"
        disabled={!text.trim()}
        onClick={() => {
          const t = text.trim();
          if (!t) return;
          onSubmitResponse(t);
        }}
        className="w-full h-11 rounded-xl bg-[#2D5A27] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#3D7A35] transition-colors disabled:bg-[#ccc] disabled:cursor-not-allowed"
      >
        <Send className="w-4 h-4" />
        إرسال الرد للمراجعة
      </button>
      {dispute.tenantClaim && (
        <p className="text-xs text-[#27AE60] mt-3 text-center">تم حفظ ردك مسبقاً — يمكنك تعديله وإعادة الإرسال.</p>
      )}
    </div>
  );
}
