import { router } from '@inertiajs/react';

export function visit(path, options = {}) {
  try {
    return router.visit(path, { preserveScroll: true, ...options });
  } catch {
    window.location.assign(path);
    return null;
  }
}

