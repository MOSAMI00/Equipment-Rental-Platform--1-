import { CheckCircle } from 'lucide-react';
import { PhotoUploader } from './PhotoUploader';
import { SignatureBox } from './SignatureBox';
import { ConditionPicker } from './ConditionPicker';
import { DamageCheck } from './DamageCheck';
import { ObjectionForm } from './ObjectionForm';
import { StatusTimeline } from './StatusTimeline';
import type { TenantRental } from '../../../../../../data/mock-api';

type Tab = 'receive' | 'in_use' | 'return';

interface TabContentProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  rental: TenantRental;
  condition: string;
  setCondition: (condition: string) => void;
  hasDamage: boolean | null;
  setHasDamage: (hasDamage: boolean) => void;
  objectionText: string;
  setObjectionText: (text: string) => void;
  onConfirmReceive: () => void;
  onConfirmReturn: () => void;
  onSubmitObjection: () => void;
  ownerDeliveryDone?: boolean;
  tenantReceiveDone: boolean;
  tenantReturnDone: boolean;
  receivePhotos: string[];
  setReceivePhotos: (photos: string[]) => void;
  returnPhotos: string[];
  setReturnPhotos: (photos: string[]) => void;
}

function StepLabel({ number, label }: { number: number; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-6 h-6 rounded-full bg-[#EAF3E9] flex items-center justify-center text-[#2D5A27] text-sm font-bold">
        {number}
      </div>
      <h3 className="font-bold text-[#222222]">{label}</h3>
    </div>
  );
}

export function TabContent({
  activeTab,
  setActiveTab,
  rental,
  condition,
  setCondition,
  hasDamage,
  setHasDamage,
  objectionText,
  setObjectionText,
  onConfirmReceive,
  onConfirmReturn,
  onSubmitObjection,
  ownerDeliveryDone = false,
  tenantReceiveDone,
  tenantReturnDone,
  receivePhotos,
  setReceivePhotos,
  returnPhotos,
  setReturnPhotos,
}: TabContentProps) {
  if (activeTab === 'receive') {
    if (tenantReceiveDone) {
      return (
        <div className="bg-white rounded-2xl border border-[#E0E0E0] p-6 flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-[#EAF3E9] flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-[#27AE60]" />
          </div>
          <h3 className="font-bold text-[#222222] text-lg">تم تأكيد الاستلام</h3>
          <p className="text-sm text-[#888888] max-w-sm">
            تم تسجيل استلامك للمعدة. انتقل إلى «قيد الاستخدام» لمتابعة الفترة أو سجّل الإرجاع لاحقاً من تبويب «إرجاع».
          </p>
          <button
            type="button"
            onClick={() => setActiveTab('in_use')}
            className="mt-2 h-11 px-6 rounded-xl bg-[#2D5A27] text-white font-bold text-sm hover:bg-[#3D7A35]"
          >
            عرض «قيد الاستخدام»
          </button>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-2xl border border-[#E0E0E0] p-5 flex flex-col gap-5">
        {!ownerDeliveryDone && (
          <div className="bg-[#FEF9E7] border border-[#F39C12]/30 rounded-xl p-3 text-sm text-[#8A5A00]">
            بانتظار تسليم المؤجر للمعدة أولاً مع صورة التوثيق.
          </div>
        )}
        <div>
          <StepLabel number={1} label="رفع صور المعدة" />
          <PhotoUploader label="صور حالة المعدة عند الاستلام" onChange={setReceivePhotos} />
        </div>
        <div>
          <StepLabel number={2} label="تقييم الحالة" />
          <ConditionPicker condition={condition} setCondition={setCondition} />
        </div>
        <div>
          <StepLabel number={3} label="التوقيع" />
          <SignatureBox />
        </div>
        <button
          type="button"
          onClick={onConfirmReceive}
          disabled={!ownerDeliveryDone || !condition || receivePhotos.length === 0}
          className="w-full h-12 bg-[#2D5A27] text-white rounded-xl font-bold text-sm hover:bg-[#3D7A35] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCircle className="w-4 h-4" />
          تأكيد الاستلام
        </button>
      </div>
    );
  }

  if (activeTab === 'in_use') {
    return <StatusTimeline rental={rental} />;
  }

  if (activeTab === 'return') {
    if (tenantReturnDone) {
      return (
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-[#27AE60]/30 p-6 flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[#EAF3E9] flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-[#27AE60]" />
            </div>
            <h3 className="font-bold text-[#222222] text-lg">تم تسجيل طلب الإرجاع</h3>
            <p className="text-sm text-[#888888] max-w-sm">
              تم إرسال توثيق الإرجاع للمؤجر للمراجعة. ستصلك إشعاراً عند اعتماد الإرجاع أو عند وجوب متابعة إضافية.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        <div className="bg-white rounded-2xl border border-[#E0E0E0] p-5 flex flex-col gap-5">
          <div>
            <StepLabel number={1} label="صور الإرجاع" />
            <PhotoUploader label="صور حالة المعدة عند الإرجاع" onChange={setReturnPhotos} />
          </div>
          <div>
            <StepLabel number={2} label="هل يوجد ضرر؟" />
            <DamageCheck hasDamage={hasDamage} setHasDamage={setHasDamage} />
          </div>
          <button
            type="button"
            onClick={onConfirmReturn}
            disabled={hasDamage === null || returnPhotos.length === 0}
            className="w-full h-12 bg-[#2D5A27] text-white rounded-xl font-bold text-sm hover:bg-[#3D7A35] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle className="w-4 h-4" />
            تأكيد الإرجاع
          </button>
        </div>

        <ObjectionForm
          objectionText={objectionText}
          setObjectionText={setObjectionText}
          onSubmit={onSubmitObjection}
        />
      </div>
    );
  }

  return null;
}
