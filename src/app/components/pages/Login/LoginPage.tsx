import { useState } from 'react';
import { FormSection } from './FormSection/FormSection';
import { PromoSection } from './PromoSection/PromoSection';

export function LoginPage() {
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login submitted:', formData);
  };

  return (
    <main className="min-h-screen flex">
      <FormSection
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
      />
      <PromoSection />
    </main>
  );
}
