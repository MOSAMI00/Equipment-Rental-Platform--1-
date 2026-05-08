import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useNotifications } from '../notifications/store';
import { products } from '../../data/products';

const RentalsContext = createContext(null);

const STORAGE_KEYS = {
  rentals: 'equipment-platform.rentals',
  handovers: 'equipment-platform.handovers',
  disputes: 'equipment-platform.disputes',
  compensationRequests: 'equipment-platform.compensation-requests',
  reviews: 'equipment-platform.reviews',
};

const DEFAULT_TENANT_ID = 'tenant-1';
const SERVICE_FEE_RATE = 0.05;

const DEMO_OWNER_BLOCK = {
  ownerId: 'owner-1',
  ownerName: 'أحمد المؤجر',
  ownerPhone: '+967 733 123 456',
  ownerRating: 4.8,
};

const OWNER_BY_EQUIPMENT = {
  1: DEMO_OWNER_BLOCK,
  2: DEMO_OWNER_BLOCK,
  3: DEMO_OWNER_BLOCK,
  4: DEMO_OWNER_BLOCK,
  5: DEMO_OWNER_BLOCK,
  6: DEMO_OWNER_BLOCK,
  7: DEMO_OWNER_BLOCK,
  8: DEMO_OWNER_BLOCK,
};

const FALLBACK_OWNER = DEMO_OWNER_BLOCK;

function readStorage(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function numericId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function getProductById(equipmentId) {
  return products.find((product) => Number(product.id) === Number(equipmentId)) ?? products[0];
}

export function getEquipmentSnapshot(equipmentId) {
  const product = getProductById(equipmentId);
  const owner = OWNER_BY_EQUIPMENT[Number(equipmentId)] ?? FALLBACK_OWNER;

  return {
    equipmentId: Number(product.id),
    name: product.name,
    image: product.image,
    location: product.location,
    category: product.category,
    rating: product.rating,
    dailyRate: product.price,
    insuranceAmount: product.insurance,
    ...owner,
  };
}

export function getTenantProfile(tenantId) {
  return {
    id: tenantId ?? 'tenant-1',
    name: 'أحمد محمد',
    phone: '+967 777 123 456',
    email: 'ahmed@example.com',
    rating: 4.9,
    rentalsCount: 12,
  };
}

export function getOwnerEquipmentSnapshots(ownerId) {
  return products.map((p) => getEquipmentSnapshot(p.id));
}


export function calculateRentalDays(startDate, endDate) {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = end.getTime() - start.getTime();
  if (Number.isNaN(diff) || diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function formatCurrency(value) {
  return Math.round(value).toLocaleString('ar-YE');
}

export function formatRentalDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('ar-YE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatRentalDateRange(startDate, endDate) {
  return `${formatRentalDate(startDate)} ← ${formatRentalDate(endDate)}`;
}

export function isRentalStartingSoon(rental) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(rental.startDate);
  start.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 2;
}

function nextOrderNum(existing) {
  const currentMax = existing.reduce((max, rental) => {
    const match = rental.orderNum.match(/OP-(\d+)/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 1040);
  return `OP-${currentMax + 1}`;
}

function nextNumericRentalId(existing) {
  const currentMax = existing.reduce((max, rental) => {
    const parsed = Number(rental.id);
    return Number.isFinite(parsed) ? Math.max(max, parsed) : max;
  }, 0);
  return String(currentMax + 1);
}

function createSeedRental(input) {
  const equipment = getEquipmentSnapshot(input.equipmentId);
  const durationDays = calculateRentalDays(input.startDate, input.endDate);
  const rentalAmount = durationDays * equipment.dailyRate;
  const serviceFee = Math.round(rentalAmount * SERVICE_FEE_RATE);
  const paymentStatus = input.paymentStatus ?? (input.status === 'pending' ? 'unpaid' : 'paid');

  return {
    id: input.id,
    orderNum: input.orderNum,
    tenantId: DEFAULT_TENANT_ID,
    ownerId: equipment.ownerId,
    equipmentId: equipment.equipmentId,
    startDate: input.startDate,
    endDate: input.endDate,
    durationDays,
    rentalAmount,
    insuranceAmount: equipment.insuranceAmount,
    serviceFee,
    totalAmount: rentalAmount + equipment.insuranceAmount + serviceFee,
    status: input.status,
    dailyRate: equipment.dailyRate,
    paymentStatus,
    escrowStatus: input.escrowStatus ?? (paymentStatus === 'paid' ? 'held' : 'not_started'),
    deliveryInfo: {
      governorate: equipment.location.split(' - ')[0] ?? 'صنعاء',
      district: equipment.location.split(' - ')[1] ?? '',
      address: equipment.location,
      phone: '777 123 456',
    },
    timeSlot: 'morning',
    createdAt: input.createdAt,
  };
}

const INITIAL_RENTALS = [
  createSeedRental({
    id: '1',
    orderNum: 'OP-1047',
    equipmentId: 1,
    startDate: '2026-05-06',
    endDate: '2026-05-09',
    status: 'confirmed',
    paymentStatus: 'unpaid',
    escrowStatus: 'not_started',
    createdAt: '2026-05-03T09:30:00.000Z',
  }),
  createSeedRental({
    id: '2',
    orderNum: 'OP-1048',
    equipmentId: 2,
    startDate: '2026-05-01',
    endDate: '2026-05-06',
    status: 'in_use',
    createdAt: '2026-04-28T10:10:00.000Z',
  }),
  createSeedRental({
    id: '3',
    orderNum: 'OP-1049',
    equipmentId: 3,
    startDate: '2026-05-12',
    endDate: '2026-05-13',
    status: 'pending',
    paymentStatus: 'unpaid',
    escrowStatus: 'not_started',
    createdAt: '2026-05-04T07:45:00.000Z',
  }),
  createSeedRental({
    id: '4',
    orderNum: 'OP-1045',
    equipmentId: 5,
    startDate: '2026-04-20',
    endDate: '2026-04-25',
    status: 'completed',
    escrowStatus: 'released',
    createdAt: '2026-04-18T12:00:00.000Z',
  }),
  createSeedRental({
    id: '5',
    orderNum: 'OP-1044',
    equipmentId: 7,
    startDate: '2026-04-15',
    endDate: '2026-04-17',
    status: 'cancelled',
    paymentStatus: 'refunded',
    escrowStatus: 'refunded',
    createdAt: '2026-04-12T11:15:00.000Z',
  }),
  createSeedRental({
    id: '6',
    orderNum: 'OP-1043',
    equipmentId: 8,
    startDate: '2026-04-10',
    endDate: '2026-04-14',
    status: 'disputed',
    createdAt: '2026-04-08T08:25:00.000Z',
  }),
  createSeedRental({
    id: '7',
    orderNum: 'OP-1042',
    equipmentId: 4,
    startDate: '2026-04-05',
    endDate: '2026-04-06',
    status: 'completed',
    escrowStatus: 'released',
    createdAt: '2026-04-02T15:20:00.000Z',
  }),
  createSeedRental({
    id: '8',
    orderNum: 'OP-1041',
    equipmentId: 6,
    startDate: '2026-03-28',
    endDate: '2026-03-30',
    status: 'completed',
    escrowStatus: 'released',
    createdAt: '2026-03-26T13:05:00.000Z',
  }),
];

const INITIAL_HANDOVERS = [
  {
    id: 'handover-1',
    rentalOpId: '2',
    phase: 'delivery',
    submittedById: DEFAULT_TENANT_ID,
    submittedByRole: 'tenant',
    conditionStatus: 'good',
    hasIssues: false,
    createdAt: '2026-05-01T08:35:00.000Z',
  },
  {
    id: 'handover-2',
    rentalOpId: '4',
    phase: 'delivery',
    submittedById: DEFAULT_TENANT_ID,
    submittedByRole: 'tenant',
    conditionStatus: 'excellent',
    hasIssues: false,
    createdAt: '2026-04-20T08:05:00.000Z',
    confirmedById: 'owner-1',
    confirmedByRole: 'owner',
    confirmedAt: '2026-04-20T09:00:00.000Z',
  },
  {
    id: 'handover-3',
    rentalOpId: '4',
    phase: 'return',
    submittedById: DEFAULT_TENANT_ID,
    submittedByRole: 'tenant',
    hasIssues: false,
    hasDamage: false,
    ownerDecision: 'full_refund',
    createdAt: '2026-04-25T17:40:00.000Z',
  },
  {
    id: 'handover-4',
    rentalOpId: '6',
    phase: 'return',
    submittedById: DEFAULT_TENANT_ID,
    submittedByRole: 'tenant',
    hasIssues: true,
    hasDamage: true,
    notes: 'اعتراض على تقدير التلفيات عند الإرجاع.',
    proposedDeduction: 15000,
    ownerDecision: 'partial_refund',
    createdAt: '2026-04-14T18:10:00.000Z',
  },
];

const INITIAL_DISPUTES = [
  {
    id: 'dispute-1',
    rentalOpId: '6',
    equipmentHandoverId: 'handover-4',
    openedById: DEFAULT_TENANT_ID,
    openedByRole: 'tenant',
    reason: 'damage',
    details: 'تم تسجيل تلفيات إضافية غير موجودة في تقرير الاستلام.',
    tenantClaim: 'المعدة كانت بحالة ممتازة عند الاستلام ولا يوجد ما يثبت التلفيات.',
    requestedAmount: 0,
    status: 'under_review',
    ownerNotes: 'توجد تلفيات واضحة في الجزء السفلي للمعدة.',
    createdAt: '2026-04-14T18:20:00.000Z',
  },
];

const INITIAL_REVIEWS = [
  {
    id: 'review-1',
    reviewerId: DEFAULT_TENANT_ID,
    targetType: 'user',
    targetId: 'owner-1',
    rentalOpId: '4',
    rating: 3,
    reviewText: 'المعدة جيدة لكن التواصل كان بطيئا.',
    createdAt: '2026-04-26T10:00:00.000Z',
  },
  {
    id: 'review-2',
    reviewerId: DEFAULT_TENANT_ID,
    targetType: 'user',
    targetId: 'owner-1',
    rentalOpId: '8',
    rating: 5,
    reviewText: 'تجربة ممتازة والتسليم كان في الوقت المحدد.',
    createdAt: '2026-03-31T09:15:00.000Z',
  },
];

export function getTenantRentals() {
  const rentals = readStorage(STORAGE_KEYS.rentals, INITIAL_RENTALS);
  return rentals.filter(r => r.orderNum !== 'OP-1043' && r.id !== '6');
}

export function RentalsProvider({ children }) {
  const { addNotification, addOwnerNotification } = useNotifications();
  const [rentals, setRentals] = useState(() => getTenantRentals());
  const [handoverReports, setHandoverReports] = useState(() => {
    const raw = readStorage(STORAGE_KEYS.handovers, INITIAL_HANDOVERS);
    return raw.filter(r => r.rentalOpId !== '6');
  });
  const [disputes, setDisputes] = useState(() => {
    const raw = readStorage(STORAGE_KEYS.disputes, INITIAL_DISPUTES);
    return raw.filter(d => d.rentalOpId !== '6');
  });
  const [compensationRequests, setCompensationRequests] = useState(() =>
    readStorage(STORAGE_KEYS.compensationRequests, [])
  );
  const [reviews, setReviews] = useState(() => readStorage(STORAGE_KEYS.reviews, INITIAL_REVIEWS));

  useEffect(() => {
    writeStorage(STORAGE_KEYS.rentals, rentals);
  }, [rentals]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.handovers, handoverReports);
  }, [handoverReports]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.disputes, disputes);
  }, [disputes]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.compensationRequests, compensationRequests);
  }, [compensationRequests]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.reviews, reviews);
  }, [reviews]);

  useEffect(() => {
    const handler = (event) => {
      if (!event.key) return;
      if (event.key === STORAGE_KEYS.rentals) {
        const raw = readStorage(STORAGE_KEYS.rentals, INITIAL_RENTALS);
        setRentals(raw.filter(r => r.orderNum !== 'OP-1043' && r.id !== '6'));
      }
      if (event.key === STORAGE_KEYS.handovers) {
        const raw = readStorage(STORAGE_KEYS.handovers, INITIAL_HANDOVERS);
        setHandoverReports(raw.filter(r => r.rentalOpId !== '6'));
      }
      if (event.key === STORAGE_KEYS.disputes) {
        const raw = readStorage(STORAGE_KEYS.disputes, INITIAL_DISPUTES);
        setDisputes(raw.filter(d => d.rentalOpId !== '6'));
      }
      if (event.key === STORAGE_KEYS.compensationRequests) {
        setCompensationRequests(readStorage(STORAGE_KEYS.compensationRequests, []));
      }
      if (event.key === STORAGE_KEYS.reviews) {
        setReviews(readStorage(STORAGE_KEYS.reviews, INITIAL_REVIEWS));
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const getRentalByIdFromState = (id) => {
    if (!id) return undefined;
    return rentals.find((rental) => rental.id === id || rental.orderNum === id);
  };

  const getHandoverReportsForRental = (rentalOpId) => {
    if (!rentalOpId) return [];
    return handoverReports.filter((report) => report.rentalOpId === rentalOpId);
  };

  const getDisputesForRental = (rentalOpId) => {
    if (!rentalOpId) return [];
    return disputes.filter((dispute) => dispute.rentalOpId === rentalOpId);
  };

  const getCompensationForRental = (rentalOpId) => {
    if (!rentalOpId) return undefined;
    return compensationRequests.find((compensation) => compensation.rentalOpId === rentalOpId);
  };

  const getReviewsForRental = (rentalOpId) => {
    if (!rentalOpId) return [];
    return reviews.filter((review) => review.rentalOpId === rentalOpId);
  };

  const createDisputeInternal = (input) => {
    const rental = getRentalByIdFromState(input.rentalOpId);
    if (!rental) return null;

    const openedByRole = input.openedByRole ?? 'tenant';
    const dispute = {
      id: numericId('dispute'),
      rentalOpId: input.rentalOpId,
      equipmentHandoverId: input.equipmentHandoverId,
      openedById: openedByRole === 'owner' ? rental.ownerId : DEFAULT_TENANT_ID,
      openedByRole,
      reason: input.reason,
      details: input.details,
      tenantClaim: input.tenantClaim,
      requestedAmount: input.requestedAmount,
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    setDisputes((existing) => [dispute, ...existing]);
    setRentals((existing) =>
      existing.map((item) => (item.id === input.rentalOpId ? { ...item, status: 'disputed' } : item))
    );

    if (openedByRole === 'owner') {
      addNotification({
        type: 'dispute',
        emoji: '⚠️',
        title: 'نزاع من المؤجر',
        message: `أبلغ المؤجر عن نزاع على الطلب #${rental.orderNum}. راجع التفاصيل وقدّم ردك أو اعتراضك من صفحة التسليم والإرجاع.`,
        referenceType: 'dispute',
        referenceId: dispute.id,
        action: { label: 'الرد على النزاع', href: `/dashboard/order/${rental.id}/delivery` },
      });
      addOwnerNotification({
        type: 'dispute',
        emoji: '⚠️',
        title: 'تم تسجيل النزاع',
        message: `تم تسجيل نزاعك على الطلب #${rental.orderNum}.`,
        referenceType: 'dispute',
        referenceId: dispute.id,
        action: { label: 'متابعة', href: '/owner/delivery' },
      });
    } else {
      addNotification({
        type: 'dispute',
        emoji: '⚠️',
        title: 'تم فتح نزاع',
        message: `تم فتح نزاع على الطلب #${rental.orderNum}. سيتم مراجعته من قبل الإدارة.`,
        referenceType: 'dispute',
        referenceId: dispute.id,
        action: { label: 'عرض النزاع', href: `/dashboard/order/${rental.id}/delivery` },
      });
      addOwnerNotification({
        type: 'dispute',
        emoji: '⚠️',
        title: 'مطالبة من مستأجر',
        message: `تم فتح نزاع على الطلب #${rental.orderNum} من قِبل المستأجر. يرجى الرد على المطالبة.`,
        referenceType: 'dispute',
        referenceId: dispute.id,
        action: { label: 'عرض النزاع', href: '/owner/requests' },
      });
    }

    return dispute;
  };

  const createRentalFromCart = (cartItems, input) => {
    const createdAt = new Date().toISOString();
    const created = [];

    cartItems.forEach((item) => {
      const rental = {
        id: nextNumericRentalId([...rentals, ...created]),
        orderNum: nextOrderNum([...rentals, ...created]),
        tenantId: input.tenantId ?? DEFAULT_TENANT_ID,
        ownerId: item.ownerId,
        equipmentId: item.equipmentId,
        startDate: item.startDate,
        endDate: item.endDate,
        durationDays: item.days,
        rentalAmount: item.rentalAmount,
        insuranceAmount: item.deposit,
        totalAmount: item.totalAmount,
        status: 'pending',
        dailyRate: item.dailyRate,
        serviceFee: item.serviceFee,
        paymentStatus: 'unpaid',
        escrowStatus: 'not_started',
        deliveryInfo: input.deliveryInfo,
        timeSlot: input.timeSlot,
        notes: item.notes,
        createdAt,
      };
      created.push(rental);
    });

    if (!created.length) return null;

    setRentals((existing) => [...created, ...existing]);

    created.forEach((rental) => {
      const equipment = getEquipmentSnapshot(rental.equipmentId);
      addNotification({
        type: 'order',
        emoji: '📨',
        title: 'تم إرسال طلب الحجز',
        message: `تم إرسال طلب إيجار ${equipment.name} #${rental.orderNum} إلى المؤجر بانتظار الموافقة.`,
        referenceType: 'rental_operation',
        referenceId: rental.id,
        action: { label: 'عرض الطلب', href: `/dashboard/order/${rental.id}` },
      });
      addOwnerNotification({
        type: 'order',
        emoji: '📋',
        title: 'طلب حجز جديد',
        message: `مستأجر طلب تأجير ${equipment.name} #${rental.orderNum}. بانتظار موافقتك.`,
        referenceType: 'rental_operation',
        referenceId: rental.id,
        action: { label: 'مراجعة الطلب', href: '/owner/requests' },
      });
    });

    return created[0];
  };

  const approveRentalRequest = (rentalId) => {
    const rental = getRentalByIdFromState(rentalId);
    if (!rental) return;

    setRentals((existing) =>
      existing.map((item) =>
        item.id === rentalId
          ? { ...item, status: 'confirmed', paymentStatus: 'unpaid', escrowStatus: 'not_started' }
          : item
      )
    );

    const equipment = getEquipmentSnapshot(rental.equipmentId);
    addNotification({
      type: 'payment',
      emoji: '💰',
      title: 'تم قبول طلبك',
      message: `وافق المؤجر على طلب ${equipment.name} #${rental.orderNum}. الرجاء إتمام الدفع لتأكيد الحجز.`,
      action: { label: 'إتمام الدفع', href: `/dashboard/order/${rental.id}` },
    });
  };

  const rejectRentalRequest = (rentalId) => {
    const rental = getRentalByIdFromState(rentalId);
    if (!rental) return;

    setRentals((existing) =>
      existing.map((item) => (item.id === rentalId ? { ...item, status: 'cancelled' } : item))
    );

    const equipment = getEquipmentSnapshot(rental.equipmentId);
    addNotification({
      type: 'order',
      emoji: '❌',
      title: 'تم رفض طلب الحجز',
      message: `لم يتم قبول طلب ${equipment.name} #${rental.orderNum}. يمكنك اختيار معدة أخرى أو تاريخ مختلف.`,
      action: { label: 'عرض الطلب', href: `/dashboard/order/${rental.id}` },
    });
  };

  const payRental = (rentalId) => {
    const rental = getRentalByIdFromState(rentalId);
    if (!rental) return;

    setRentals((existing) =>
      existing.map((item) =>
        item.id === rentalId
          ? { ...item, paymentStatus: 'paid', escrowStatus: 'held', status: item.status === 'pending' ? 'confirmed' : item.status }
          : item
      )
    );

    const equipment = getEquipmentSnapshot(rental.equipmentId);
    addNotification({
      type: 'payment',
      emoji: '🔒',
      title: 'تم الدفع وحجز الضمان',
      message: `تم دفع طلب ${equipment.name} #${rental.orderNum} وحفظ المبلغ في الضمان.`,
      referenceType: 'rental_operation',
      referenceId: rental.id,
      action: { label: 'عرض الطلب', href: `/dashboard/order/${rental.id}` },
    });
    addOwnerNotification({
      type: 'payment',
      emoji: '💰',
      title: 'تأكيد الدفع في الضمان',
      message: `تم حجز مبلغ إيجار ${equipment.name} #${rental.orderNum} في الضمان. المعدة جاهزة للتسليم.`,
      referenceType: 'rental_operation',
      referenceId: rental.id,
      action: { label: 'إدارة التسليم', href: '/owner/delivery' },
    });
  };

  const createHandoverReport = (input) => {
    const rental = getRentalByIdFromState(input.rentalOpId);
    if (!rental) return null;

    const submittedByRole = input.submittedByRole ?? 'tenant';
    const report = {
      id: numericId('handover'),
      rentalOpId: input.rentalOpId,
      phase: input.phase,
      submittedById: submittedByRole === 'owner' ? rental.ownerId : DEFAULT_TENANT_ID,
      submittedByRole,
      conditionStatus: input.conditionStatus,
      hasIssues: input.hasIssues ?? Boolean(input.hasDamage),
      hasDamage: input.hasDamage,
      notes: input.notes,
      evidencePhotos: input.evidencePhotos,
      proposedDeduction: input.proposedDeduction,
      ownerDecision: input.ownerDecision,
      createdAt: new Date().toISOString(),
    };

    setHandoverReports((existing) => [report, ...existing]);
    setRentals((existing) =>
      existing.map((item) => {
        if (item.id !== input.rentalOpId) return item;
        if (input.phase === 'delivery' && submittedByRole === 'tenant') return { ...item, status: 'in_use' };
        if (input.phase === 'return' && submittedByRole === 'owner' && item.status !== 'disputed') {
          return {
            ...item,
            status: 'completed',
            escrowStatus: item.escrowStatus === 'held' ? 'released' : item.escrowStatus,
          };
        }
        return item;
      })
    );

    const equipment = getEquipmentSnapshot(rental.equipmentId);
    if (submittedByRole === 'tenant') {
      addNotification({
        type: input.phase === 'delivery' ? 'order' : 'return',
        emoji: input.phase === 'delivery' ? '📦' : '🔄',
        title: input.phase === 'delivery' ? 'تم تأكيد الاستلام' : 'تم تسجيل طلب الإرجاع',
        message: input.phase === 'delivery'
          ? `تم تأكيد استلام ${equipment.name} للطلب #${rental.orderNum}. الحالة أصبحت بانتظار الإرجاع.`
          : `تم تسجيل إرجاع ${equipment.name} للطلب #${rental.orderNum} وبانتظار تأكيد المؤجر.`,
        referenceType: 'handover',
        referenceId: report.id,
        action: {
          label: input.phase === 'delivery' ? 'عرض الطلب' : 'متابعة الإرجاع',
          href: `/dashboard/order/${rental.id}`,
        },
      });
      addOwnerNotification({
        type: input.phase === 'delivery' ? 'order' : 'return',
        emoji: input.phase === 'delivery' ? '📦' : '🔄',
        title: input.phase === 'delivery' ? 'تقرير استلام من المستأجر' : 'تقرير إرجاع من المستأجر',
        message: input.phase === 'delivery'
          ? `المستأجر أكّد استلام ${equipment.name} #${rental.orderNum}.`
          : `المستأجر أرسل طلب إرجاع ${equipment.name} #${rental.orderNum}. ارفع صورة وفعّل تأكيد الإرجاع.`,
        referenceType: 'handover',
        referenceId: report.id,
        action: { label: 'مراجعة التقرير', href: '/owner/delivery' },
      });
    } else {
      addNotification({
        type: input.phase === 'delivery' ? 'order' : 'return',
        emoji: input.phase === 'delivery' ? '✅' : '🔄',
        title: input.phase === 'delivery' ? 'المؤجر سلّم المعدة' : 'المؤجر أكّد الإرجاع',
        message: input.phase === 'delivery'
          ? `قام المؤجر بتسليم ${equipment.name} للطلب #${rental.orderNum} مع صورة توثيق. يرجى تأكيد الاستلام.`
          : `تم تأكيد إرجاع ${equipment.name} للطلب #${rental.orderNum} واكتمال العملية.`,
        referenceType: 'handover',
        referenceId: report.id,
        action: { label: input.phase === 'delivery' ? 'تأكيد الاستلام' : 'عرض الطلب', href: `/dashboard/order/${rental.id}` },
      });
    }

    return report;
  };

  const confirmHandoverReport = (handoverId, ownerId) => {
    setHandoverReports((existing) =>
      existing.map((report) =>
        report.id === handoverId
          ? { ...report, confirmedById: ownerId, confirmedByRole: 'owner', confirmedAt: new Date().toISOString() }
          : report
      )
    );
    const report = handoverReports.find((r) => r.id === handoverId);
    if (!report) return;

    const rental = getRentalByIdFromState(report.rentalOpId);
    if (!rental) return;

    setRentals((existing) =>
      existing.map((item) => {
        if (item.id === rental.id) {
          if (report.phase === 'delivery') {
            return { ...item, status: 'in_use' };
          } else if (report.phase === 'return') {
            return { ...item, status: 'completed', escrowStatus: 'released' };
          }
        }
        return item;
      })
    );

    const equipment = getEquipmentSnapshot(rental.equipmentId);
    addNotification({
      type: 'order',
      emoji: '✅',
      title: 'المؤجر أكّد تقرير التسليم',
      message: `وافق المؤجر على تقرير ${report.phase === 'delivery' ? 'الاستلام' : 'الإرجاع'} للطلب #${rental.orderNum}.`,
      referenceType: 'handover',
      referenceId: handoverId,
      action: { label: 'عرض الطلب', href: `/dashboard/order/${rental.id}` },
    });
  };

  const updateDisputeOwnerNotes = (disputeId, ownerNotes, proposedSolution) => {
    setDisputes((existing) =>
      existing.map((d) => (d.id === disputeId ? { ...d, ownerNotes, proposedSolution } : d))
    );
    const dispute = disputes.find((d) => d.id === disputeId);
    if (!dispute) return;
    const rental = getRentalByIdFromState(dispute.rentalOpId);
    if (!rental) return;
    addNotification({
      type: 'dispute',
      emoji: '📝',
      title: 'المؤجر رد على النزاع',
      message: `أضاف المؤجر رداً على النزاع للطلب #${rental.orderNum}. يرجى المراجعة.`,
      referenceType: 'dispute',
      referenceId: disputeId,
      action: { label: 'عرض النزاع', href: `/dashboard/order/${rental.id}/delivery` },
    });
  };

  const requestCompensation = (input) => {
    const rental = getRentalByIdFromState(input.rentalOpId);
    if (!rental) return null;

    const compensation = {
      id: numericId('comp'),
      rentalOpId: input.rentalOpId,
      handoverId: input.handoverId,
      requestedById: rental.ownerId,
      requestedAmount: input.requestedAmount,
      notes: input.notes,
      evidencePhotos: input.evidencePhotos,
      status: 'requested',
      createdAt: new Date().toISOString(),
    };

    setCompensationRequests((existing) => [compensation, ...existing]);
    addNotification({
      type: 'payment',
      emoji: '💰',
      title: 'طلب تعويض من المؤجر',
      message: `طالب المؤجر بتعويض ${formatCurrency(input.requestedAmount)} ر.ي على الطلب #${rental.orderNum}. يرجى مراجعة الطلب والرد.`,
      referenceType: 'rental_operation',
      referenceId: rental.id,
      action: { label: 'الرد على الطلب', href: `/dashboard/order/${rental.id}/delivery` },
    });
    addOwnerNotification({
      type: 'payment',
      emoji: '📩',
      title: 'تم إرسال طلب التعويض',
      message: `تم إرسال طلب التعويض للطلب #${rental.orderNum}. بانتظار رد المستأجر.`,
      referenceType: 'rental_operation',
      referenceId: rental.id,
      action: { label: 'متابعة', href: '/owner/delivery' },
    });

    return compensation;
  };

  const respondToCompensation = (compensationId, response) => {
    const compensation = compensationRequests.find((item) => item.id === compensationId);
    if (!compensation) return;

    setCompensationRequests((existing) =>
      existing.map((item) =>
        item.id === compensationId ? { ...item, status: response, respondedAt: new Date().toISOString() } : item
      )
    );

    const rental = getRentalByIdFromState(compensation.rentalOpId);
    if (!rental) return;

    if (response === 'accepted') {
      addOwnerNotification({
        type: 'payment',
        emoji: '✅',
        title: 'قبل المستأجر التعويض',
        message: `وافق المستأجر على طلب التعويض ${formatCurrency(compensation.requestedAmount)} ر.ي للطلب #${rental.orderNum}.`,
        referenceType: 'rental_operation',
        referenceId: rental.id,
      });
    } else {
      addOwnerNotification({
        type: 'dispute',
        emoji: '❌',
        title: 'رفض المستأجر التعويض',
        message: `رفض المستأجر طلب التعويض للطلب #${rental.orderNum}.`,
        referenceType: 'rental_operation',
        referenceId: rental.id,
      });
    }
  };

  const openCompensationDispute = (compensationId, tenantClaim, requestedAmount) => {
    const compensation = compensationRequests.find((item) => item.id === compensationId);
    if (!compensation) return;

    setCompensationRequests((existing) =>
      existing.map((item) =>
        item.id === compensationId
          ? { ...item, status: 'disputed', tenantResponse: tenantClaim, respondedAt: new Date().toISOString() }
          : item
      )
    );

    createDisputeInternal({
      rentalOpId: compensation.rentalOpId,
      equipmentHandoverId: compensation.handoverId,
      reason: 'damage',
      details: tenantClaim,
      openedByRole: 'tenant',
      tenantClaim,
      requestedAmount,
    });
  };

  const submitTenantDisputeResponse = (disputeId, tenantResponse) => {
    const before = disputes.find((x) => x.id === disputeId);
    setDisputes((existing) =>
      existing.map((d) =>
        d.id === disputeId
          ? { ...d, tenantClaim: tenantResponse, status: d.status === 'resolved' ? d.status : 'under_review' }
          : d
      )
    );
    const rental = before ? getRentalByIdFromState(before.rentalOpId) : undefined;
    if (!rental || !before) return;
    addOwnerNotification({
      type: 'dispute',
      emoji: '💬',
      title: 'رد المستأجر على النزاع',
      message: `قدّم المستأجر رداً على النزاع للطلب #${rental.orderNum}.`,
      referenceType: 'dispute',
      referenceId: disputeId,
      action: { label: 'مراجعة', href: '/owner/delivery' },
    });
  };

  const resolveDispute = (disputeId) => {
    setDisputes((existing) =>
      existing.map((d) => (d.id === disputeId ? { ...d, status: 'resolved', resolvedAt: new Date().toISOString() } : d))
    );
    const dispute = disputes.find((d) => d.id === disputeId);
    if (dispute) {
      setRentals((existing) =>
        existing.map((item) =>
          item.id === dispute.rentalOpId ? { ...item, status: 'completed', escrowStatus: 'released' } : item
        )
      );
      addOwnerNotification({
        type: 'dispute',
        emoji: '✅',
        title: 'نزاع تم حله',
        message: `وافق المستأجر على التسوية للنزاع المتعلق بالطلب. تم إغلاق النزاع.`,
        referenceType: 'dispute',
        referenceId: disputeId,
      });
    }
  };

  const escalateDispute = (disputeId) => {
    setDisputes((existing) =>
      existing.map((d) => (d.id === disputeId ? { ...d, status: 'under_review' } : d))
    );
    addOwnerNotification({
      type: 'dispute',
      emoji: '⏳',
      title: 'تصعيد النزاع',
      message: `رفض المستأجر التسوية المقترحة للنزاع. تم رفع الأمر للإدارة.`,
      referenceType: 'dispute',
      referenceId: disputeId,
    });
  };

  const submitReview = (input) => {
    const rental = getRentalByIdFromState(input.rentalOpId);
    if (!rental) return null;

    const review = {
      id: numericId('review'),
      reviewerId: DEFAULT_TENANT_ID,
      targetType: input.targetType,
      targetId: input.targetId,
      rentalOpId: input.rentalOpId,
      rating: input.rating,
      reviewText: input.reviewText,
      createdAt: new Date().toISOString(),
    };

    setReviews((existing) => [review, ...existing]);
    addNotification({
      type: 'review',
      emoji: '⭐',
      title: 'تم إرسال التقييم',
      message: `تم حفظ تقييمك للطلب #${rental.orderNum}.`,
      action: { label: 'عرض الطلب', href: `/dashboard/order/${rental.id}` },
    });
    return review;
  };

  const value = useMemo(() => ({
    rentals,
    handoverReports,
    disputes,
    compensationRequests,
    reviews,
    getRentalById: getRentalByIdFromState,
    getHandoverReportsForRental,
    getDisputesForRental,
    getCompensationForRental,
    getReviewsForRental,
    createDispute: createDisputeInternal,
    createRentalFromCart,
    approveRentalRequest,
    rejectRentalRequest,
    payRental,
    createHandoverReport,
    confirmHandoverReport,
    updateDisputeOwnerNotes,
    requestCompensation,
    respondToCompensation,
    openCompensationDispute,
    submitTenantDisputeResponse,
    resolveDispute,
    escalateDispute,
    submitReview,
  }), [rentals, handoverReports, disputes, compensationRequests, reviews]);

  return <RentalsContext.Provider value={value}>{children}</RentalsContext.Provider>;
}

export function useRentals() {
  const context = useContext(RentalsContext);
  if (!context) {
    throw new Error('useRentals must be used inside RentalsProvider');
  }
  return context;
}

export function useTenantRentals() {
  const { user } = useAuth();
  const { rentals } = useRentals();

  if (!user) return rentals;
  if (user.type !== 'tenant') return rentals;

  return rentals.filter((r) => r.tenantId === user.id);
}

export function useRentalById(id) {
  return useRentals().getRentalById(id);
}

export function useDisputes() {
  return useRentals().disputes;
}
