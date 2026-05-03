import { RatingTab } from './RatingsPage';

interface FilterTabsProps {
  tabs: { key: RatingTab; label: string; count: number }[];
  activeTab: RatingTab;
  setActiveTab: (tab: RatingTab) => void;
}

export function FilterTabs({ tabs, activeTab, setActiveTab }: FilterTabsProps) {
  return (
    <div className="flex gap-1 mb-5 overflow-x-auto scrollbar-hide">
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`flex items-center gap-1.5 px-4 h-9 rounded-full whitespace-nowrap text-sm font-semibold transition-all flex-shrink-0 ${
            activeTab === tab.key
              ? 'bg-[#2D5A27] text-white'
              : 'bg-white border border-[#E0E0E0] text-[#888888] hover:border-[#2D5A27]'
          }`}
        >
          {tab.label}
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-[#F4F6F9] text-[#888888]'}`}>
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
}
