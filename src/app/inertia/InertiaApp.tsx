// src/app/inertia/InertiaApp.tsx
// This becomes the entry point when Laravel + Inertia is connected.
// It replaces BrowserRouter entirely.
import React from 'react';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

export function initInertiaApp() {
  createInertiaApp({
    resolve: (name) => {
      const pages = import.meta.glob('../components/**/*.tsx', { eager: true });
      return pages[`../components/${name}.tsx`] as any;
    },
    setup({ el, App, props }) {
      createRoot(el).render(<App {...props} />);
    },
  });
}
