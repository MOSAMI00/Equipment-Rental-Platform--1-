import { ProductCardProps } from '../components/ProductCard';

export const products: ProductCardProps[] = [
  {
    id: 1,
    name: 'مولد كهرباء 10KVA',
    images: [
      'https://images.unsplash.com/photo-1759692071712-adc78a8516c8?w=600',
    ],
    image: 'https://images.unsplash.com/photo-1759692071712-adc78a8516c8?w=600',
    location: 'صنعاء - الوحدة',
    category: 'كهرباء',
    rating: 5,
    reviews: 47,
    price: 15000,
    oldPrice: 20000,
    insurance: 50000,
    discount: 25,
    status: 'available',
    description:
      'مولد كهرباء قوي مناسب للاستخدام المنزلي والمشاريع الصغيرة، يوفر طاقة مستقرة مع كفاءة عالية في استهلاك الوقود.',
    features: [
      'قدرة تشغيل 10KVA',
      'استهلاك وقود اقتصادي',
      'مناسب للاستخدام المستمر',
      'سهل التشغيل والصيانة',
    ],
    specs: {
      الوقود: 'ديزل',
      الوزن: '120 كجم',
      الجهد: '220V',
    },
  },

  {
    id: 2,
    name: 'خلاطة خرسانة صناعية',
    images: [
      'https://images.unsplash.com/photo-1637296001293-43ec1ac4e5ed?w=600',
    ],
    image: 'https://images.unsplash.com/photo-1637296001293-43ec1ac4e5ed?w=600',
    location: 'عدن - كريتر',
    category: 'بناء',
    rating: 4,
    reviews: 32,
    price: 8000,
    insurance: 30000,
    status: 'available',
    description:
      'خلاطة خرسانة عالية الجودة مناسبة للمشاريع الإنشائية، توفر خلط متجانس وسريع.',
    features: [
      'سعة كبيرة للخلط',
      'محرك قوي',
      'تصميم متين',
      'مناسبة للاستخدام اليومي',
    ],
    specs: {
      السعة: '200 لتر',
      الطاقة: 'كهرباء',
    },
  },

  {
    id: 3,
    name: 'كاميرا Sony A7 III',
    images: [
      'https://images.unsplash.com/photo-1606462245328-7118c9fa0b3f?w=600',
    ],
    image: 'https://images.unsplash.com/photo-1606462245328-7118c9fa0b3f?w=600',
    location: 'تعز - المظفر',
    category: 'تصوير',
    rating: 5,
    reviews: 89,
    price: 12000,
    insurance: 80000,
    status: 'available',
    description:
      'كاميرا احترافية للتصوير الفوتوغرافي والفيديو بجودة عالية، مناسبة للمصورين المحترفين.',
    features: [
      'دقة 24MP',
      'تصوير 4K',
      'أداء ممتاز في الإضاءة المنخفضة',
      'بطارية طويلة العمر',
    ],
    specs: {
      الشركة: 'Sony',
      الدقة: '24 ميجابكسل',
    },
  },

  {
    id: 4,
    name: 'مضخة مياه زراعية',
    images: [
      'https://images.unsplash.com/photo-1674655798804-b739c31b6cf5?w=600',
    ],
    image: 'https://images.unsplash.com/photo-1674655798804-b739c31b6cf5?w=600',
    location: 'إب - المدينة',
    category: 'زراعة',
    rating: 4,
    reviews: 23,
    price: 5000,
    insurance: 20000,
    status: 'available',
    description:
      'مضخة مياه قوية للري الزراعي، تعمل بكفاءة عالية وتتحمل الاستخدام الطويل.',
    features: [
      'ضغط مياه عالي',
      'موفرة للطاقة',
      'مناسبة للمزارع',
    ],
    specs: {
      القدرة: '5 حصان',
    },
  },

  {
    id: 5,
    name: 'ونش رفع صناعي',
    images: [
      'https://images.unsplash.com/photo-1589225925761-1f31d7ea5468?w=600',
    ],
    image: 'https://images.unsplash.com/photo-1589225925761-1f31d7ea5468?w=600',
    location: 'صنعاء - حدة',
    category: 'بناء',
    rating: 5,
    reviews: 56,
    price: 18000,
    oldPrice: 22000,
    insurance: 70000,
    discount: 18,
    status: 'available',
    description:
      'ونش رفع قوي مناسب لرفع الأحمال الثقيلة في مواقع البناء.',
    features: [
      'قدرة رفع عالية',
      'نظام أمان متكامل',
      'سهل التحكم',
    ],
  },

  {
    id: 6,
    name: 'طاولة بلياردو احترافية',
    images: [
      'https://images.unsplash.com/photo-1566888596782-c7f41cc184c5?w=600',
    ],
    image: 'https://images.unsplash.com/photo-1566888596782-c7f41cc184c5?w=600',
    location: 'عدن - المعلا',
    category: 'رياضة',
    rating: 4,
    reviews: 15,
    price: 10000,
    insurance: 40000,
    status: 'reserved',
    description:
      'طاولة بلياردو احترافية مناسبة للفعاليات والمنازل.',
    features: [
      'مقاس رسمي',
      'جودة عالية',
    ],
  },

  {
    id: 7,
    name: 'مولد كهرباء 20KVA',
    images: [
      'https://images.unsplash.com/photo-1658260867231-535a1f7c98b9?w=600',
    ],
    image: 'https://images.unsplash.com/photo-1658260867231-535a1f7c98b9?w=600',
    location: 'الحديدة - الحوك',
    category: 'كهرباء',
    rating: 5,
    reviews: 71,
    price: 25000,
    insurance: 90000,
    status: 'available',
    description:
      'مولد كهرباء عالي القدرة مناسب للمصانع والمشاريع الكبيرة.',
    features: [
      'قدرة 20KVA',
      'تشغيل مستمر',
      'تحمل عالي',
    ],
  },

  {
    id: 8,
    name: 'كرين متحرك صغير',
    images: [
      'https://images.unsplash.com/photo-1723134128804-46fa7c59d0d9?w=600',
    ],
    image: 'https://images.unsplash.com/photo-1723134128804-46fa7c59d0d9?w=600',
    location: 'مأرب - المدينة',
    category: 'بناء',
    rating: 4,
    reviews: 28,
    price: 35000,
    insurance: 150000,
    status: 'available',
    description:
      'كرين صغير ومتنقل مناسب للأعمال الخفيفة والمتوسطة.',
    features: [
      'سهل النقل',
      'تحكم مرن',
      'مناسب للمواقع الضيقة',
    ],
  },
];
