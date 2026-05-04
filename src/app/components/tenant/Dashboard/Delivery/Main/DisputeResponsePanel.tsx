import { useEffect, useState } from 'react';
import { AlertTriangle, Send, CheckCircle, XCircle } from 'lucide-react';
import { formatRentalDate, formatCurrency, type Dispute, type TenantRental } from '../../../../../data/mock-api';

interface DisputeResponsePanelProps {
  rental: TenantRental;
  dispute: Dispute;
  onAcceptDispute: () => void;
  onRejectDispute: (text: string) => void;
}

export function DisputeResponsePanel({ rental, dispute, onAcceptDispute, onRejectDispute }: DisputeResponsePanelProps) {
  const [text, setText] = useState(dispute.tenantClaim ?? '');

  useEffect(() => {
    setText(dispute.tenantClaim ?? '');
  }, [dispute.id, dispute.tenantClaim]);

  const isOwnerOpened = dispute.openedByRole === 'owner';
  if (!isOwnerOpened) return null;

  if (dispute.status === 'resolved') {
    return (
      <div className="bg-[#EAF3E9] rounded-2xl border border-[#27AE60]/30 p-5 shadow-sm mt-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#27AE60]/20 text-[#27AE60] flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-[#222222]">نزاع محلول — الطلب #{rental.orderNum}</h3>
            <p className="text-sm text-[#555555] mt-1">لقد قمت بالموافقة على تسوية المؤجر. تم إغلاق النزاع.</p>
          </div>
        </div>
      </div>
    );
  }

  if (dispute.status === 'under_review') {
    return (
      <div className="bg-[#FFF4E5] rounded-2xl border border-[#F39C12]/30 p-5 shadow-sm mt-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F39C12]/20 text-[#D68910] flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-[#222222]">نزاع قيد المراجعة — الطلب #{rental.orderNum}</h3>
            <p className="text-sm text-[#555555] mt-1">قمت برفض التسوية. النزاع الآن قيد المراجعة من قبل الإدارة.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E74C3C]/30 p-5 shadow-sm mt-5">
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
          {dispute.requestedAmount !== undefined && (
            <div className="mt-3 p-3 rounded-xl bg-[#FEF9E7] border border-[#F39C12]/30 flex justify-between items-center">
              <span className="text-sm font-bold text-[#8A5A00]">مبلغ الخصم المطلوب:</span>
              <span className="text-sm font-bold text-[#E74C3C]">{formatCurrency(dispute.requestedAmount)} ر.ي</span>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-[#E0E0E0] pt-4 mt-2">
        <label className="block text-sm font-semibold text-[#222222] mb-2">ردك واعتراضك (في حال الرفض)</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="اشرح موقفك للرفض والوقائع التي تؤيدها..."
          rows={3}
          className="w-full rounded-xl border border-[#E0E0E0] px-4 py-3 text-sm text-[#222222] focus:outline-none focus:border-[#2D5A27] mb-3"
        />
        
        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={onAcceptDispute}
            className="flex-1 h-11 rounded-xl bg-[#27AE60] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#219653] transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            موافق على الخصم
          </button>
          
          <button
            type="button"
            disabled={!text.trim()}
            onClick={() => {
              const t = text.trim();
              if (!t) return;
              onRejectDispute(t);
            }}
            className="flex-1 h-11 rounded-xl bg-[#E74C3C] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#C0392B] transition-colors disabled:bg-[#ccc] disabled:cursor-not-allowed"
          >
            <XCircle className="w-4 h-4" />
            رفض وتصعيد للإدارة
          </button>
        </div>
      </div>
    </div>
  );
}
