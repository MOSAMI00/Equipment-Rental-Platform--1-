import { useAuth } from '../../../../auth/AuthContext';

export function UserHeader() {
  const { user } = useAuth();

  if (!user) return null;

  const firstLetter = user.fullName.charAt(0);

  return (
    <div className="p-4 bg-[#F4F6F9] border-b border-border flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">{firstLetter}</div>
      <div>
        <p className="font-semibold text-[#222222]">{user.fullName}</p>
        <p className="text-xs text-[#888888]">{user.phone || 'بدون رقم'}</p>
      </div>
    </div>
  );
}
