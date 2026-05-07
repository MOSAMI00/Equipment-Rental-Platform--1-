import { Stats } from './Stats';
import { SearchBar } from './SearchBar';

interface OrderHeaderProps {
  count: number;
  search: string;
  onSearchChange: (val: string) => void;
}

export function OrderHeader({ count, search, onSearchChange }: OrderHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
      <Stats count={count} />
      <SearchBar search={search} onSearchChange={onSearchChange} />
    </div>
  );
}
