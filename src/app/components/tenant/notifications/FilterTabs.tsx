interface FilterTabsProps {
  activeTab: 'all' | 'unread';
  setActiveTab: (tab: 'all' | 'unread') => void;
  allCount: number;
  unreadCount: number;
}

export function FilterTabs({ activeTab, setActiveTab, allCount, unreadCount }: FilterTabsProps) {
  return (
    <div className="flex gap-2 mb-5">
      {[
        { key: 'all' as const, label: 'الكل', count: allCount },
        { key: 'unread' as const, label: 'غير مقروء', count: unreadCount },
      ].map(tab => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`flex items-center gap-2 px-5 h-9 rounded-full text-sm font-semibold transition-all ${
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
