interface TitleProps {
  unreadCount: number;
}

export function Title({ unreadCount }: TitleProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#222222]">الإشعارات</h2>
      {unreadCount > 0 && (
        <p className="text-sm text-[#888888] mt-0.5">{unreadCount} إشعار غير مقروء</p>
      )}
    </div>
  );
}
