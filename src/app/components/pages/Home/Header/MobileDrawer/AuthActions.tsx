import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../../../../auth/AuthContext';

interface AuthActionsProps {
  setMobileMenuOpen: (open: boolean) => void;
}

export function AuthActions({ setMobileMenuOpen }: AuthActionsProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      {!user ? (
        <>
          <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="p-3 text-right rounded-lg bg-muted block text-sm">تسجيل الدخول</Link>
          <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="p-3 text-right rounded-lg bg-primary text-white block text-sm mt-2">سجل الآن</Link>
        </>
      ) : (
        <button
          onClick={() => { 
            setMobileMenuOpen(false); 
            logout();
            navigate('/login'); 
          }}
          className="p-3 text-right rounded-lg text-[#E74C3C] hover:bg-red-50 text-sm flex items-center gap-2 w-full"
        >
          <span>🔴</span> تسجيل الخروج
        </button>
      )}
    </>
  );
}
