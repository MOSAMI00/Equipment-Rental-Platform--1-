import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('./app/Pages/**/*.jsx', { eager: true });
    const page = pages[`./app/Pages/${name}.jsx`];
    if (!page) {
      throw new Error(`Page not found: ${name}`);
    }
    return page;
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
});
