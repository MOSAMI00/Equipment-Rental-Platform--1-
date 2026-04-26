import { Status, TABS, Rental } from './OrderTypes';

interface OrderTabsProps {
  activeTab: Status | 'all';
  onTabChange: (tab: Status | 'all') => void;
  rentals: Rental[];
}

export function OrderTabs({ activeTab, onTabChange, rentals }: OrderTabsProps) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-5 scrollbar-hide">
      {TABS.map(tab => {
        const count = tab.key === 'all' ? rentals.length : rentals.filter(r => r.status === tab.key).length;
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex items-center gap-1.5 px-4 h-9 rounded-full whitespace-nowrap text-sm font-medium transition-all flex-shrink-0 ${
              isActive
                ? 'bg-[#2D5A27] text-white'
                : 'bg-white border border-[#E0E0E0] text-[#888888] hover:border-[#2D5A27] hover:text-[#2D5A27]'
            }`}
          >
            {tab.label}
            {count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-[#F4F6F9] text-[#888888]'}`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
