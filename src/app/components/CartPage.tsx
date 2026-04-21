import { useState } from 'react';
import { Check, ChevronRight, Trash2, Edit, CreditCard, Smartphone, Wallet, Lock, FileCheck, RefreshCw, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router';

type Step = 1 | 2 | 3;
type PaymentMethod = 'card' | 'wallet' | 'cash' | null;
type TimeSlot = 'morning' | 'afternoon' | 'evening' | null;

export function CartPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [timeSlot, setTimeSlot] = useState<TimeSlot>(null);
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'مولد كهرباء 10KVA',
      image: 'https://images.unsplash.com/photo-1759692071712-adc78a8516c8?w=150&h=150&fit=crop',
      owner: 'أحمد علي',
      location: 'صنعاء',
      startDate: '01/02/2025',
      endDate: '04/02/2025',
      days: 3,
      dailyRate: 15000,
      deposit: 50000,
    }
  ]);
  const [agreeToContract, setAgreeToContract] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({
    governorate: 'صنعاء',
    district: '',
    address: '',
    phone: '',
  });

  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  // Calculate totals based on cart items
  const rentalCost = cartItems.reduce((acc, item) => acc + (item.dailyRate * item.days), 0);
  const deposit = cartItems.reduce((acc, item) => acc + item.deposit, 0);
  const serviceFee = rentalCost * 0.05;
  const total = rentalCost + deposit + serviceFee;

  const handleDelete = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleConfirm = () => {
    console.log('Order confirmed!');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <div className="border-b border-border sticky top-0 z-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 text-primary hover:underline"
            >
              → إلغاء والعودة
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold">م</span>
              </div>
              <span className="font-bold text-primary">منصة تأجير المعدات</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-muted border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
              {[
                { step: 1, label: 'مراجعة الطلب' },
                { step: 2, label: 'بيانات التسليم' },
                { step: 3, label: 'الدفع والتأكيد' },
              ].map((item, index) => (
                <div key={item.step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                        currentStep > item.step
                          ? 'bg-primary text-white'
                          : currentStep === item.step
                          ? 'bg-primary text-white'
                          : 'bg-white text-muted-foreground border-2 border-border'
                      }`}
                    >
                      {currentStep > item.step ? <Check className="w-5 h-5" /> : item.step}
                    </div>
                    <span
                      className={`text-sm mt-2 max-sm:text-xs ${
                        currentStep >= item.step ? 'text-foreground font-semibold' : 'text-muted-foreground'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                  {index < 2 && (
                    <div
                      className={`h-1 flex-1 mx-2 rounded-full transition-colors ${
                        currentStep > item.step ? 'bg-primary' : 'bg-border'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left - Step Content */}
            <div className="lg:col-span-8">
              {/* Step 1 - Review Order */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold mb-6">مراجعة الطلب</h2>

                  {cartItems.length === 0 ? (
                    <div className="bg-white border border-border rounded-xl p-12 text-center">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">سلة المشتريات فارغة</h3>
                      <p className="text-muted-foreground mb-6">لم تقم بإضافة أي معدات إلى السلة بعد.</p>
                      <Link to="/" className="inline-flex h-12 px-6 bg-primary text-white rounded-lg font-semibold items-center justify-center hover:bg-primary/90 transition-colors">
                        تصفح المعدات
                      </Link>
                    </div>
                  ) : (
                    <>
                      {cartItems.map((item) => (
                        <div key={item.id} className="bg-white border border-border rounded-xl p-6 mb-4">
                          <div className="flex gap-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="flex-1">
                              <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <p className="flex items-center gap-2">
                                  <span>📍</span>
                                  <span>{item.location}</span>
                                </p>
                                <p className="flex items-center gap-2">
                                  <span>👤</span>
                                  <span>{item.owner}</span>
                                </p>
                                <p className="flex items-center gap-2">
                                  <span>📅</span>
                                  <span>{item.startDate} → {item.endDate}</span>
                                </p>
                                <p className="flex items-center gap-2">
                                  <span>⏱️</span>
                                  <span>{item.days} أيام</span>
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                                <Edit className="w-5 h-5 text-primary" />
                              </button>
                              <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                                <Trash2 className="w-5 h-5 text-destructive" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={() => setCurrentStep(2)}
                        className="w-full h-12 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                      >
                        متابعة للخطوة التالية ←
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Step 2 - Delivery Info */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">بيانات التسليم</h2>

                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">المحافظة</label>
                        <select
                          value={deliveryInfo.governorate}
                          onChange={(e) => setDeliveryInfo({ ...deliveryInfo, governorate: e.target.value })}
                          className="w-full h-12 px-4 rounded-lg border border-border bg-white focus:outline-none focus:border-primary"
                        >
                          <option value="صنعاء">صنعاء</option>
                          <option value="عدن">عدن</option>
                          <option value="تعز">تعز</option>
                          <option value="إب">إب</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium">المديرية / الحي</label>
                        <input
                          type="text"
                          value={deliveryInfo.district}
                          onChange={(e) => setDeliveryInfo({ ...deliveryInfo, district: e.target.value })}
                          placeholder="مثال: الوحدة"
                          className="w-full h-12 px-4 rounded-lg border border-border bg-white focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium">العنوان التفصيلي</label>
                      <textarea
                        value={deliveryInfo.address}
                        onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                        placeholder="رقم المنزل، اسم الشارع، علامات مميزة..."
                        className="w-full h-24 px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:border-primary resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium">رقم الجوال</label>
                      <div className="relative">
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-sm text-muted-foreground">
                          <span>🇾🇪</span>
                          <span>+967</span>
                        </div>
                        <input
                          type="tel"
                          value={deliveryInfo.phone}
                          onChange={(e) => setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })}
                          placeholder="777 123 456"
                          className="w-full h-12 pr-24 pl-4 rounded-lg border border-border bg-white focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium">الوقت المفضل للاستلام</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: 'morning', label: '☀️ صباحاً', time: '8ص - 12م' },
                          { value: 'afternoon', label: '🌤️ ظهراً', time: '12م - 4م' },
                          { value: 'evening', label: '🌙 مساءً', time: '4م - 8م' },
                        ].map((slot) => (
                          <button
                            key={slot.value}
                            type="button"
                            onClick={() => setTimeSlot(slot.value as TimeSlot)}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              timeSlot === slot.value
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <div className="font-semibold text-sm">{slot.label}</div>
                            <div className="text-xs text-muted-foreground mt-1">{slot.time}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 h-12 border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                      → رجوع
                    </button>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="flex-1 h-12 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                    >
                      متابعة للدفع ←
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3 - Payment */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">وسيلة الدفع</h2>

                  <div className="space-y-3">
                    {[
                      { value: 'card', icon: CreditCard, label: 'بطاقة بنكية', desc: 'Visa, Mastercard' },
                      { value: 'wallet', icon: Smartphone, label: 'محفظة إلكترونية', desc: 'كاش يمن، سبأفون، فلوسك' },
                      { value: 'cash', icon: Wallet, label: 'دفع عند الاستلام', desc: 'كاش' },
                    ].map(({ value, icon: Icon, label, desc }) => (
                      <button
                        key={value}
                        onClick={() => setPaymentMethod(value as PaymentMethod)}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-right flex items-center gap-4 ${
                          paymentMethod === value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === value ? 'border-primary' : 'border-border'
                          }`}
                        >
                          {paymentMethod === value && <div className="w-3 h-3 rounded-full bg-primary" />}
                        </div>
                        <Icon className="w-6 h-6 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="font-semibold">{label}</div>
                          <div className="text-sm text-muted-foreground">{desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="border border-border rounded-xl p-6 space-y-4 bg-muted/30">
                      <h3 className="font-bold text-lg">بيانات البطاقة البنكية</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">رقم البطاقة</label>
                          <input
                            type="text"
                            value={cardDetails.number}
                            onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                            placeholder="0000 0000 0000 0000"
                            className="w-full h-12 px-4 rounded-lg border border-border bg-white focus:outline-none focus:border-primary"
                            dir="ltr"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium">تاريخ الانتهاء</label>
                            <input
                              type="text"
                              value={cardDetails.expiry}
                              onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                              placeholder="MM/YY"
                              className="w-full h-12 px-4 rounded-lg border border-border bg-white focus:outline-none focus:border-primary"
                              dir="ltr"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium">CVV</label>
                            <input
                              type="text"
                              value={cardDetails.cvv}
                              onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                              placeholder="123"
                              className="w-full h-12 px-4 rounded-lg border border-border bg-white focus:outline-none focus:border-primary"
                              dir="ltr"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">الاسم على البطاقة</label>
                          <input
                            type="text"
                            value={cardDetails.name}
                            onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                            placeholder="الاسم الكامل"
                            className="w-full h-12 px-4 rounded-lg border border-border bg-white focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Contract Section */}
                  <div className="border border-border rounded-xl p-6 space-y-4">
                    <h3 className="font-bold text-lg">عقد التأجير الإلكتروني</h3>
                    <div className="bg-muted rounded-lg p-4 text-sm text-muted-foreground max-h-48 overflow-y-auto">
                      <p className="mb-3">
                        هذا العقد يُبرم بين المستأجر والمؤجر عبر منصة تأجير المعدات، ويتضمن:
                      </p>
                      <ul className="space-y-2 mr-4">
                        <li>• مدة التأجير من 01/02/2025 حتى 04/02/2025 (3 أيام)</li>
                        <li>• قيمة الإيجار اليومي: 15,000 ر.ي</li>
                        <li>• مبلغ التأمين: 50,000 ر.ي (قابل للاسترداد)</li>
                        <li>• المستأجر مسؤول عن المعدة خلال فترة التأجير</li>
                        <li>• يُعاد التأمين خلال 5 أيام عمل بعد إرجاع المعدة سليمة</li>
                        <li>• أي أضرار تحدث للمعدة تُخصم من مبلغ التأمين</li>
                        <li>• التأخير في الإرجاع يُحسب بسعر مضاعف</li>
                      </ul>
                    </div>

                    <button className="text-primary hover:underline text-sm">قراءة العقد كاملاً ←</button>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreeToContract}
                        onChange={(e) => setAgreeToContract(e.target.checked)}
                        className="mt-1 w-5 h-5 rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-sm">
                        أوافق على شروط عقد التأجير وسياسة الإلغاء الخاصة بالمنصة
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="flex-1 h-12 border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                      → رجوع
                    </button>
                    <button
                      onClick={handleConfirm}
                      disabled={!paymentMethod || !agreeToContract}
                      className="flex-1 h-12 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
                    >
                      تأكيد الحجز ودفع ←
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right - Order Summary (Sticky) */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 bg-white border border-border rounded-xl p-6 space-y-4">
                <h3 className="font-bold text-lg border-b border-border pb-3">ملخص الطلب</h3>

                <div className="space-y-3">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center gap-3 pb-3 border-b border-border">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">{item.days} أيام × {item.dailyRate.toLocaleString('ar-YE')} ر.ي</p>
                      </div>
                    </div>
                  ))}

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">قيمة الإيجار:</span>
                      <span className="font-semibold">{rentalCost.toLocaleString('ar-YE')} ر.ي</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">التأمين:</span>
                      <span className="font-semibold">{deposit.toLocaleString('ar-YE')} ر.ي</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">رسوم الخدمة:</span>
                      <span className="font-semibold">{serviceFee.toLocaleString('ar-YE')} ر.ي</span>
                    </div>
                  </div>

                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold">الإجمالي:</span>
                      <span className="text-2xl font-bold text-primary">{total.toLocaleString('ar-YE')} ر.ي</span>
                    </div>
                  </div>
                </div>

                {/* Info boxes */}
                <div className="space-y-3 pt-3 border-t border-border">
                  <div className="bg-[#E8F5E9] rounded-lg p-3 flex items-start gap-3">
                    <Lock className="w-5 h-5 text-[#27AE60] flex-shrink-0" />
                    <div className="text-xs text-foreground">
                      <p className="font-semibold mb-1">💡 التأمين يُحتجز في Escrow</p>
                      <p className="text-muted-foreground">ويُعاد بعد اكتمال التأجير</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <FileCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>عقد موثق إلكترونياً</span>
                  </div>

                  <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <RefreshCw className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>استرداد التأمين خلال 5 أيام عمل</span>
                  </div>

                  <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>دفع آمن 100%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
