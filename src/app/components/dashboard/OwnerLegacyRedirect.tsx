import { Navigate, useLocation } from 'react-router';

const LEGACY_MAP: Record<string, string> = {
  '/': '/dashboard/overview',
  '/overview': '/dashboard/overview',
  '/equipment': '/dashboard/equipment',
  '/equipment/add': '/dashboard/equipment/add',
  '/requests': '/dashboard/requests',
  '/rentals': '/dashboard/rentals',
  '/delivery': '/dashboard/delivery',
  '/insurance': '/dashboard/insurance',
  '/earnings': '/dashboard/earnings',
  '/contracts': '/dashboard/contracts',
  '/notifications': '/dashboard/notifications',
  '/reviews': '/dashboard/ratings',
  '/profile': '/dashboard/settings',
};

export function OwnerLegacyRedirect() {
  const location = useLocation();
  let suffix = location.pathname.replace(/^\/owner\/?/, '') || '';
  suffix = suffix ? `/${suffix.replace(/\/$/, '')}` : '/';
  if (!suffix.startsWith('/')) suffix = `/${suffix}`;
  const normalized = suffix === '//' ? '/' : suffix;
  const target = LEGACY_MAP[normalized] ?? `/dashboard${normalized === '/' ? '' : normalized}`;
  return <Navigate to={`${target}${location.search}`} replace />;
}
