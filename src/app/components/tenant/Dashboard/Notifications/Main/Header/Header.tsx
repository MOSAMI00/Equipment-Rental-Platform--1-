import { Title } from './Title';
import { MarkAllRead } from './MarkAllRead';

interface HeaderProps {
  unreadCount: number;
  markAllRead: () => void;
}

export function Header({ unreadCount, markAllRead }: HeaderProps) {
  return (
    <div className="flex items-center justify-between mb-5">
      <Title unreadCount={unreadCount} />
      {unreadCount > 0 && (
        <MarkAllRead onClick={markAllRead} />
      )}
    </div>
  );
}
