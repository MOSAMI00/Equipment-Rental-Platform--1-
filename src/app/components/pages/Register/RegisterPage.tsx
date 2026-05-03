import { useState } from 'react';
import { toast } from 'sonner';
import { FormSection } from './FormSection/FormSection';
import { InfoSection } from './InfoSection/InfoSection';

type UserType = 'tenant' | 'owner';

export function RegisterPage() {
  const [userType, setUserType] = useState<UserType>('tenant');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    governorate: '',
    district: '',
    storeName: '',
    mainGovernorate: '',
    paymentMethod: '',
  });

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeToTerms) {
      toast.error('يرجى الموافقة على الشروط والأحكام');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('كلمة المرور غير متطابقة');
      return;
    }

    toast.success('تم إنشاء حسابك بنجاح');
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row" dir="rtl">
      <FormSection
        userType={userType}
        setUserType={setUserType}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        agreeToTerms={agreeToTerms}
        setAgreeToTerms={setAgreeToTerms}
      />
      <InfoSection userType={userType} />
    </main>
  );
}
