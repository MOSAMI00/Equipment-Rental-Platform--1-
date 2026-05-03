import { useState } from 'react';
import { EquipmentBanner } from './Main/EquipmentBanner';
import { StatusTabs } from './Main/StatusTabs';
import { TabContent } from './Main/TabContent/TabContent';

type Tab = 'receive' | 'in_use' | 'return';

export function DeliveryPage() {
  const [activeTab, setActiveTab] = useState<Tab>('receive');
  const [condition, setCondition] = useState('');
  const [hasDamage, setHasDamage] = useState<boolean | null>(null);
  const [objectionText, setObjectionText] = useState('');
  const [submitted, setSubmitted] = useState<Partial<Record<Tab, boolean>>>({});

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6 max-w-2xl mx-auto" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <h2 className="text-xl font-bold text-[#222222] mb-5">التسليم والإرجاع</h2>
      <EquipmentBanner />
      <StatusTabs activeTab={activeTab} setActiveTab={setActiveTab} submitted={submitted} />
      <TabContent
        activeTab={activeTab}
        condition={condition}
        setCondition={setCondition}
        hasDamage={hasDamage}
        setHasDamage={setHasDamage}
        objectionText={objectionText}
        setObjectionText={setObjectionText}
        setSubmitted={setSubmitted}
      />
    </div>
  );
}
