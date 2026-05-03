import { Link, useNavigate } from 'react-router';

interface AuthActionsProps {
  setMobileMenuOpen: (open: boolean) => void;
}

export function AuthActions({ setMobileMenuOpen }: AuthActionsProps) {
  const navigate = useNavigate();
  return (
    <>
      <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="p-3 text-right rounded-lg bg-muted block text-sm">تسجيل الدخول</Link>
      <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="p-3 text-right rounded-lg bg-primary text-white block text-sm">أضف معدتك</Link>
      <button
        onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
        className="mt-2 p-3 text-right rounded-lg text-[#E74C3C] hover:bg-red-50 text-sm flex items-center gap-2 w-full"
      >
        <span>🔴</span> تسجيل الخروج
      </button>
    </>
  );
}
