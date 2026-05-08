import { UserTypeToggle } from './UserTypeToggle';
import { Form } from './Form/Form';

interface FormSectionProps {
  userType: 'tenant' | 'owner';
  setUserType: (type: 'tenant' | 'owner') => void;
  formData: any;
  setFormData: (data: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  agreeToTerms: boolean;
  setAgreeToTerms: (val: boolean) => void;
}

export function FormSection({
  userType,
  setUserType,
  formData,
  setFormData,
  handleSubmit,
  selectedCategories,
  toggleCategory,
  agreeToTerms,
  setAgreeToTerms,
}: FormSectionProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white order-2 md:order-1 overflow-y-auto">
      <div className="w-full max-w-md">
        <div className="text-center md:text-right mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-2">
            إنشاء حساب جديد 🚀
          </h2>
          <p className="text-[#888888]">انضم إلى منصة تأجير المعدات الأولى في اليمن</p>
        </div>

        <UserTypeToggle userType={userType} setUserType={setUserType} />

        <Form
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          userType={userType}
          selectedCategories={selectedCategories}
          toggleCategory={toggleCategory}
          agreeToTerms={agreeToTerms}
          setAgreeToTerms={setAgreeToTerms}
        />
      </div>
    </div>
  );
}
