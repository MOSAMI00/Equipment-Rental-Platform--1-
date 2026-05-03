import { Search } from 'lucide-react';

interface ContractHeaderProps {
  count: number;
  search: string;
  onSearchChange: (value: string) => void;
}

export function ContractHeader({ count, search, onSearchChange }: ContractHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
      <div>
        <h2 className="text-2xl font-bold text-[#222222]">عقودي</h2>
        <p className="text-sm text-[#888888] mt-0.5">{count} عقد إجمالاً</p>
      </div>
      <div className="relative w-full sm:w-64">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
        <input
          type="text"
          placeholder="بحث في العقود..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full h-10 pr-9 pl-3 rounded-xl border border-[#E0E0E0] bg-white text-sm focus:outline-none focus:border-[#2D5A27] transition-colors"
        />
      </div>
    </div>
  );
}
