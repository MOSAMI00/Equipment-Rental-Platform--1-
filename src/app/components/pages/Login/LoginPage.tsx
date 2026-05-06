import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { makeMockUser, useAuth } from '../../../auth/AuthContext';
import { FormSection } from './FormSection/FormSection';
import { PromoSection } from './PromoSection/PromoSection';

export function LoginPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const existingUser = auth.findUserByPhone(formData.phone);
    const isOwnerLogin = formData.phone.replace(/\D/g, '').startsWith('733') || formData.phone.toLowerCase().includes('owner');
    const user = existingUser ?? makeMockUser({
      type: isOwnerLogin ? 'owner' : 'tenant',
      phone: formData.phone,
      fullName: isOwnerLogin ? 'أحمد المؤجر' : 'أحمد محمد',
    });

    auth.login(user);
    toast.success(`مرحباً ${user.fullName}`);
    navigate(user.type === 'tenant' ? '/dashboard' : '/dashboard/overview');
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
