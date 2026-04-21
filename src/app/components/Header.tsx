import { Search, Bell, MapPin, Menu, X, ShoppingCart, LogOut, ClipboardList, Package, FileText, Star, Settings } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';

const accountMenuItems = [
  { icon: ClipboardList, label: 'طلباتي', href: '/dashboard', emoji: '📋' },
  { icon: Package, label: 'التسليم والإرجاع', href: '/dashboard/delivery', emoji: '📦' },
  { icon: FileText, label: 'عقودي', href: '/dashboard/contracts', emoji: '📄' },
  { icon: Bell, label: 'الإشعارات', href: '/dashboard/notifications', emoji: '🔔' },
  { icon: Star, label: 'تقييماتي', href: '/dashboard/ratings', emoji: '⭐' },
  { icon: Settings, label: 'الإعدادات', href: '/dashboard/settings', emoji: '⚙️' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [notificationCount] = useState(3);
  const navigate = useNavigate();
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Desktop & Tablet Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        {/* Main Header Bar */}
        <div className="hidden md:block">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-[72px]">
              {/* Right: Logo & Name */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-white font-bold text-xl">م</span>
                </div>
                <span className="font-bold text-lg text-primary">منصة تأجير المعدات</span>
              </div>

              {/* Center: Search */}
              <div className="flex-1 max-w-xl mx-8">
                <div className="relative">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="ابحث عن معدة للإيجار في اليمن..."
                    className="w-full h-12 pr-12 pl-4 rounded-lg border border-border bg-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Left: Location, Notifications, Login, Add, Account */}
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-3 h-10 rounded-lg hover:bg-muted transition-colors">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">المحافظة</span>
                </button>

                <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                  <Bell className="w-5 h-5" />
                  {notificationCount > 0 && (
                    <span className="absolute top-1 left-1 w-5 h-5 bg-destructive text-white text-xs rounded-full flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </button>

                <Link to="/cart" className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                  <ShoppingCart className="w-5 h-5 text-foreground hover:text-primary transition-colors" />
                  <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                    1
                  </span>
                </Link>

                <Link
                  to="/login"
                  className="px-4 h-10 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
                >
                  تسجيل الدخول
                </Link>

                <Link
                  to="/register"
                  className="px-6 h-12 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center"
                >
                  أضف معدتك
                </Link>

                {/* Account Avatar with Dropdown */}
                <div className="relative" ref={accountMenuRef}>
                  <button
                    id="account-avatar-btn"
                    onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                    className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm hover:bg-primary/90 transition-all ring-2 ring-transparent hover:ring-primary/30 focus:outline-none"
                    aria-label="فتح قائمة الحساب"
                  >
                    أ
                  </button>

                  {/* Account Dropdown Menu */}
                  {accountMenuOpen && (
                    <div
                      id="account-dropdown"
                      className="absolute left-0 top-14 w-56 bg-white rounded-xl shadow-xl border border-border z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
                      style={{ direction: 'rtl' }}
                    >
                      {/* User Info Header */}
                      <div className="px-4 py-3 bg-[#F4F6F9] border-b border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">أ</div>
                          <div>
                            <p className="font-semibold text-[#222222] text-sm">أحمد محمد</p>
                            <p className="text-xs text-[#888888]">ahmed@example.com</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <nav className="py-1">
                        {accountMenuItems.map((item) => (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#222222] hover:bg-[#F4F6F9] transition-colors"
                          >
                            <span className="text-base">{item.emoji}</span>
                            <span>{item.label}</span>
                          </Link>
                        ))}
                      </nav>

                      {/* Logout */}
                      <div className="border-t border-border py-1">
                        <button
                          id="logout-btn"
                          onClick={() => { setAccountMenuOpen(false); navigate('/login'); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#E74C3C] hover:bg-red-50 transition-colors"
                        >
                          <span className="text-base">🔴</span>
                          <span>تسجيل الخروج</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden">
          {/* Top Row */}
          <div className="flex items-center justify-between h-14 px-4 border-b border-border">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold">م</span>
              </div>
              <span className="font-bold text-primary">منصة تأجير المعدات</span>
            </div>

            <div className="flex items-center gap-2">
              <button className="relative p-2">
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-0 left-0 w-4 h-4 bg-destructive text-white text-[10px] rounded-full flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>
              <Link to="/cart" className="relative p-2">
                <ShoppingCart className="w-5 h-5 text-foreground" />
                <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                  1
                </span>
              </Link>
              {/* Mobile Account Avatar */}
              <Link to="/dashboard" className="p-1">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                  أ
                </div>
              </Link>
            </div>
          </div>

          {/* Search Row */}
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="ابحث عن معدة في اليمن..."
                className="w-full h-11 pr-11 pl-3 rounded-lg border border-border bg-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-[112px] bg-black/50 z-40" onClick={() => setMobileMenuOpen(false)}>
            <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-lg" onClick={e => e.stopPropagation()} style={{ direction: 'rtl' }}>
              {/* User info in mobile drawer */}
              <div className="p-4 bg-[#F4F6F9] border-b border-border flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">أ</div>
                <div>
                  <p className="font-semibold text-[#222222]">أحمد محمد</p>
                  <p className="text-xs text-[#888888]">ahmed@example.com</p>
                </div>
              </div>
              <nav className="flex flex-col p-4 gap-1">
                <p className="text-xs font-semibold text-[#888888] uppercase tracking-wide mb-2">لوحة التحكم</p>
                {accountMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F4F6F9] text-[#222222]"
                  >
                    <span>{item.emoji}</span>
                    <span className="text-sm">{item.label}</span>
                  </Link>
                ))}
                <hr className="my-3 border-border" />
                <p className="text-xs font-semibold text-[#888888] uppercase tracking-wide mb-2">عام</p>
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-lg hover:bg-muted text-sm">الرئيسية</Link>
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-lg hover:bg-muted text-sm">تصفح المعدات</Link>
                <hr className="my-3 border-border" />
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="p-3 text-right rounded-lg bg-muted block text-sm">تسجيل الدخول</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="p-3 text-right rounded-lg bg-primary text-white block text-sm">أضف معدتك</Link>
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                  className="mt-2 p-3 text-right rounded-lg text-[#E74C3C] hover:bg-red-50 text-sm flex items-center gap-2"
                >
                  <span>🔴</span> تسجيل الخروج
                </button>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Category Strip - Sticky */}
      <div className="sticky top-[72px] md:top-[72px] z-40 bg-white border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
            {[
              'الكل',
              'مولدات كهرباء',
              'بناء وأعمال',
              'زراعة',
              'تصوير',
              'فعاليات',
              'رياضة',
              'طبي',
              'أخرى'
            ].map((category, index) => (
              <button
                key={category}
                className={`px-4 h-10 rounded-full whitespace-nowrap transition-colors ${
                  index === 0
                    ? 'bg-primary text-white'
                    : 'bg-white text-muted-foreground border border-border hover:border-primary'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
