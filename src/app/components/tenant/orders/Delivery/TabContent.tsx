import { CheckCircle } from 'lucide-react';
import { PhotoUploader } from '../PhotoUploader';
import { SignatureBox } from '../SignatureBox';
import { ConditionPicker } from './ConditionPicker';
import { DamageCheck } from './DamageCheck';
import { ObjectionForm } from './ObjectionForm';
import { StatusTimeline } from './StatusTimeline';

type Tab = 'receive' | 'in_use' | 'return';

interface TabContentProps {
  activeTab: Tab;
  condition: string;
  setCondition: (condition: string) => void;
  hasDamage: boolean | null;
  setHasDamage: (hasDamage: boolean) => void;
  objectionText: string;
  setObjectionText: (text: string) => void;
  setSubmitted: React.Dispatch<React.SetStateAction<Partial<Record<Tab, boolean>>>>;
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
  condition,
  setCondition,
  hasDamage,
  setHasDamage,
  objectionText,
  setObjectionText,
  setSubmitted,
}: TabContentProps) {
  if (activeTab === 'receive') {
    return (
      <div className="bg-white rounded-2xl border border-[#E0E0E0] p-5 flex flex-col gap-5">
        <div>
          <StepLabel number={1} label="رفع صور المعدة" />
          <PhotoUploader label="صور حالة المعدة عند الاستلام" />
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
          onClick={() => setSubmitted(s => ({ ...s, receive: true }))}
          className="w-full h-12 bg-[#2D5A27] text-white rounded-xl font-bold text-sm hover:bg-[#3D7A35] transition-colors flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          تأكيد الاستلام
        </button>
      </div>
    );
  }

  if (activeTab === 'in_use') {
    return <StatusTimeline />;
  }

  if (activeTab === 'return') {
    return (
      <div className="flex flex-col gap-4">
        <div className="bg-white rounded-2xl border border-[#E0E0E0] p-5 flex flex-col gap-5">
          <div>
            <StepLabel number={1} label="صور الإرجاع" />
            <PhotoUploader label="صور حالة المعدة عند الإرجاع" />
          </div>
          <div>
            <StepLabel number={2} label="هل يوجد ضرر؟" />
            <DamageCheck hasDamage={hasDamage} setHasDamage={setHasDamage} />
          </div>
          <button
            onClick={() => setSubmitted(s => ({ ...s, return: true }))}
            className="w-full h-12 bg-[#2D5A27] text-white rounded-xl font-bold text-sm hover:bg-[#3D7A35] transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            تأكيد الإرجاع
          </button>
        </div>

        <ObjectionForm objectionText={objectionText} setObjectionText={setObjectionText} />
      </div>
    );
  }

  return null;
}
