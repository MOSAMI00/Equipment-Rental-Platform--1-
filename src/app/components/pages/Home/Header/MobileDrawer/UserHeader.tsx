export function UserHeader() {
  return (
    <div className="p-4 bg-[#F4F6F9] border-b border-border flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">أ</div>
      <div>
        <p className="font-semibold text-[#222222]">أحمد محمد</p>
        <p className="text-xs text-[#888888]">ahmed@example.com</p>
      </div>
    </div>
  );
}
