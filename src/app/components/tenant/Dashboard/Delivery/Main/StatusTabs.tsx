import { CheckCircle } from 'lucide-react';

type Tab = 'receive' | 'in_use' | 'return';

interface StatusTabsProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  submitted: Partial<Record<Tab, boolean>>;
}

export function StatusTabs({ activeTab, setActiveTab, submitted }: StatusTabsProps) {
  const tabs: { key: Tab; label: string; emoji: string }[] = [
    { key: 'receive', label: 'استلام', emoji: '📦' },
    ...(submitted.receive ? [
      { key: 'in_use' as Tab, label: 'قيد الاستخدام', emoji: '🔧' },
      { key: 'return' as Tab, label: 'إرجاع', emoji: '🔄' },
    ] : []),
  ];

  return (
    <div className="flex gap-2 mb-5 bg-[#F4F6F9] p-1 rounded-xl">
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === tab.key ? 'bg-white text-[#222222] shadow-sm' : 'text-[#888888] hover:text-[#222222]'
          }`}
        >
          <span>{tab.emoji}</span>
          {tab.label}
          {submitted[tab.key] && <CheckCircle className="w-3.5 h-3.5 text-[#27AE60]" />}
        </button>
      ))}
    </div>
  );
}
