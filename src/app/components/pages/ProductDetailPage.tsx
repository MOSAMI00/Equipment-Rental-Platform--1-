import { ChevronLeft, ChevronRight, Star, MapPin, Lock, FileCheck } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { products } from '../../data/products';

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === Number(id));

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'terms' | 'reviews'>('description');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">المنتج غير موجود</h2>
          <Link to="/" className="text-primary hover:underline">العودة للرئيسية</Link>
        </div>
      </div>
    );
  }

  const images = product.images || [product.image];

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 0;
  };

  const days = calculateDays();
  const dailyRate = product.price;
  const deposit = product.insurance;
  const serviceFee = days * dailyRate * 0.05;
  const totalRental = days * dailyRate;
  const grandTotal = totalRental + deposit + serviceFee;

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
              → العودة للرئيسية
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

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">الرئيسية</Link>
          <span>/</span>
          <button className="hover:text-primary">{product.category}</button>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left - Gallery & Tabs */}
          <div className="lg:col-span-8 space-y-6">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted">
                <img
                  src={images[currentImageIndex]}
                  alt="Product"
                  className="w-full h-full object-cover"
                />

                {/* Badges */}
                <div className="absolute top-4 right-4 flex gap-2">
                  {product.status === 'available' && (
                    <span className="px-4 py-2 bg-[#27AE60] text-white rounded-full flex items-center gap-2">
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                      متاح الآن
                    </span>
                  )}
                  {product.discount && (
                    <span className="px-4 py-2 bg-[#F39C12] text-white rounded-full">
                      -{product.discount}%
                    </span>
                  )}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={() => setCurrentImageIndex((currentImageIndex - 1 + images.length) % images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentImageIndex((currentImageIndex + 1) % images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-border">
              <div className="flex gap-6 border-b border-border">
                {[
                  { id: 'description', label: 'الوصف' },
                  { id: 'terms', label: 'الشروط' },
                  { id: 'reviews', label: 'التقييمات' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-2 font-semibold border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="py-6">
                {activeTab === 'description' && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg">الوصف والمواصفات</h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {product.description || 'لا يوجد وصف متاح.'}
                    </p>

                    {product.features && product.features.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-bold mb-2">المميزات:</h4>
                        <ul className="list-disc list-inside text-muted-foreground">
                          {product.features.map((feature, idx) => (
                            <li key={idx}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {product.specs && Object.keys(product.specs).length > 0 && (
                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        {Object.entries(product.specs).map(([key, value]) => (
                          <div key={key} className="flex justify-between py-3 border-b border-border">
                            <span className="text-muted-foreground">{key}</span>
                            <span className="font-semibold">{value as React.ReactNode}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'terms' && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg">سياسة الإلغاء</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex gap-2">
                        <span>•</span>
                        <span>إلغاء مجاني قبل 24 ساعة من موعد الاستلام</span>
                      </li>
                      <li className="flex gap-2">
                        <span>•</span>
                        <span>رسوم إلغاء 50% إذا كان الإلغاء خلال 24 ساعة</span>
                      </li>
                      <li className="flex gap-2">
                        <span>•</span>
                        <span>لا يمكن الإلغاء بعد استلام المعدة</span>
                      </li>
                    </ul>

                    <h3 className="font-bold text-lg mt-6">تعليمات التسليم</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex gap-2">
                        <span>•</span>
                        <span>يجب التحقق من حالة المعدة عند الاستلام</span>
                      </li>
                      <li className="flex gap-2">
                        <span>•</span>
                        <span>التوقيع على العقد الإلكتروني إلزامي</span>
                      </li>
                      <li className="flex gap-2">
                        <span>•</span>
                        <span>التصوير الفوتوغرافي للمعدة مطلوب</span>
                      </li>
                      <li className="flex gap-2">
                        <span>•</span>
                        <span>يجب إرجاع المعدة بنفس الحالة</span>
                      </li>
                    </ul>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {/* Rating Summary */}
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-primary">{product.rating}</div>
                        <div className="flex items-center gap-1 mt-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-5 h-5 ${i < product.rating ? 'fill-[#F39C12] text-[#F39C12]' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{product.reviews} تقييم</p>
                      </div>

                      <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center gap-3">
                            <span className="text-sm w-8">{rating} ⭐</span>
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#F39C12]"
                                style={{ width: `${rating === 5 ? 85 : rating === 4 ? 10 : 5}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground w-12">{rating === 5 ? 40 : rating === 4 ? 5 : 2}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-4 border-t border-border pt-6">
                      {[
                        { name: 'محمد أحمد', rating: 5, date: '2025-01-15', text: 'مولد ممتاز وبحالة ممتازة، المؤجر متعاون جداً' },
                        { name: 'سعيد علي', rating: 5, date: '2025-01-10', text: 'خدمة احترافية وسريعة، أنصح بالتعامل' },
                        { name: 'خالد حسن', rating: 4, date: '2025-01-05', text: 'جيد جداً، التسليم كان في الموعد' },
                      ].map((review, i) => (
                        <div key={i} className="border-b border-border pb-4 last:border-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">{review.name}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating ? 'fill-[#F39C12] text-[#F39C12]' : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-muted-foreground">{review.date}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-muted-foreground">{review.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right - Booking Card (Sticky) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white border border-border rounded-xl p-6 space-y-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{product.location}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">
                      {dailyRate.toLocaleString('ar-YE')} ر.ي
                    </span>
                    <span className="text-muted-foreground">/ اليوم</span>
                    {product.oldPrice && (
                      <span className="text-muted-foreground line-through">{product.oldPrice.toLocaleString('ar-YE')}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    التأمين: {deposit.toLocaleString('ar-YE')} ر.ي
                  </p>
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">📅 تاريخ الاستلام</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full h-11 px-4 rounded-lg border border-border bg-white focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">📅 تاريخ الإرجاع</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full h-11 px-4 rounded-lg border border-border bg-white focus:outline-none focus:border-primary"
                    />
                  </div>

                  {days > 0 && (
                    <div className="bg-muted rounded-lg p-3 text-sm">
                      ⏱️ المدة: <span className="font-semibold">{days} {days === 1 ? 'يوم' : 'أيام'}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">📍 المحافظة</label>
                    <select className="w-full h-11 px-4 rounded-lg border border-border bg-white focus:outline-none focus:border-primary">
                      <option>صنعاء</option>
                      <option>عدن</option>
                      <option>تعز</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">ملاحظات (اختياري)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="أي تفاصيل إضافية..."
                      className="w-full h-20 px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:border-primary resize-none"
                    />
                  </div>
                </div>

                {days > 0 && (
                  <div className="border-t border-border pt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">إيجار {days} × {dailyRate.toLocaleString('ar-YE')}:</span>
                      <span className="font-semibold">{totalRental.toLocaleString('ar-YE')} ر.ي</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">تأمين:</span>
                      <span className="font-semibold">{deposit.toLocaleString('ar-YE')} ر.ي</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">رسوم الخدمة (5%):</span>
                      <span className="font-semibold">{serviceFee.toLocaleString('ar-YE')} ر.ي</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border text-lg">
                      <span className="font-bold">الإجمالي:</span>
                      <span className="font-bold text-primary">{grandTotal.toLocaleString('ar-YE')} ر.ي</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => navigate('/cart')}
                  disabled={!startDate || !endDate || days === 0}
                  className="w-full h-13 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
                >
                  إرسال طلب الحجز ←
                </button>

                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>مدفوعاتك محمية بنظام Escrow</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>العقد يُوقَّع إلكترونياً قبل الاستلام</span>
                  </div>
                </div>
              </div>

              {/* Owner Card */}
              <div className="bg-muted rounded-xl p-6">
                <h3 className="font-bold mb-4">عن المؤجر</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-xl">
                    👤
                  </div>
                  <div>
                    <h4 className="font-semibold">أحمد علي</h4>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-[#F39C12] text-[#F39C12]" />
                      <span>4.9 (127 تقييم)</span>
                    </div>
                  </div>
                </div>
                <div className="text-sm space-y-1 text-muted-foreground">
                  <p>📍 صنعاء، اليمن</p>
                  <p>🏷️ 12 معدة متاحة</p>
                  <p>✅ موثق منذ 2023</p>
                </div>
                <button className="w-full mt-4 h-10 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
                  عرض جميع المعدات
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 shadow-lg z-50">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-lg font-bold text-primary">
              {dailyRate.toLocaleString('ar-YE')} ر.ي
            </div>
            <div className="text-xs text-muted-foreground">اليوم</div>
          </div>
          <button
            onClick={() => navigate('/cart')}
            className="flex-1 h-12 bg-primary text-white rounded-lg font-semibold"
          >
            استأجره الآن →
          </button>
        </div>
      </div>
    </div>
  );
}
