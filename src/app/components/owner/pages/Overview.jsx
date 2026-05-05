import React, { useEffect, useMemo, useState } from 'react';
import { ClipboardList, DollarSign, Wrench, Star, CheckCircle, XCircle, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../../../auth/AuthContext';
import { formatCurrency, getEquipmentSnapshot, getOwnerEquipmentSnapshots, getTenantProfile } from '../../../data/mock-api';
import { STATUS_CONFIG } from '../../tenant/Dashboard/shared/OrderTypes';
import KPICard from '../shared/KPICard';
import { ChartSkeleton, KPICardSkeleton } from '../shared/OwnerSkeletons';
import { useOwnerPageProps } from '../../../inertia/owner-page-props';

const ORDER_COLORS = {
  pending: '#F39C12',
  confirmed: '#3498DB',
  in_use: '#E67E22',
  completed: '#27AE60',
  cancelled: '#95A5A6',
  disputed: '#E74C3C',
};

const dataOrdersLabels = {
  pending: 'بانتظار',
  confirmed: 'مؤكد',
  in_use: 'قيد الاستخدام',
  completed: 'مكتمل',
  cancelled: 'ملغي',
  disputed: 'نزاع',
};

const Overview = () => {
  const { user } = useAuth();
  const { rentals, reviews } = useOwnerPageProps();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 350);
    return () => window.clearTimeout(timer);
  }, []);

  const ownerRentals = useMemo(
    () => rentals.filter((rental) => rental.ownerId === user?.id),
    [rentals, user?.id],
  );

  const equipment = useMemo(
    () => getOwnerEquipmentSnapshots(user?.id),
    [user?.id],
  );

  const ownerReviews = useMemo(
    () => reviews.filter((review) => review.targetId === user?.id),
    [reviews, user?.id],
  );

  const dataEarnings = useMemo(() => {
    const formatter = new Intl.DateTimeFormat('ar-YE', { month: 'short' });
    const now = new Date();
    const rows = [];
    for (let i = 5; i >= 0; i -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = date.getMonth();
      const year = date.getFullYear();
      const amount = ownerRentals
        .filter((rental) => {
          const created = new Date(rental.createdAt);
          return created.getMonth() === month && created.getFullYear() === year;
        })
        .reduce((total, rental) => total + rental.rentalAmount, 0);
      rows.push({ name: formatter.format(date), amount });
    }
    return rows;
  }, [ownerRentals]);

  const dataOrders = useMemo(() => {
    const counters = ownerRentals.reduce((acc, rental) => {
      const key = rental.status;
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});
    return Object.keys(counters).map((status) => ({
      name: status,
      value: counters[status],
      color: ORDER_COLORS[status] ?? '#95A5A6',
    }));
  }, [ownerRentals]);

  const totalRating = ownerReviews.reduce((sum, item) => sum + item.rating, 0);
  const averageRating = ownerReviews.length ? (totalRating / ownerReviews.length).toFixed(1) : '0.0';
  const monthEarnings = dataEarnings[dataEarnings.length - 1]?.amount ?? 0;
  const previousMonthEarnings = dataEarnings[dataEarnings.length - 2]?.amount ?? 0;
  const monthGrowth = previousMonthEarnings > 0
    ? Math.round(((monthEarnings - previousMonthEarnings) / previousMonthEarnings) * 100)
    : 0;

  const recentRentals = ownerRentals
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div>
      {/* Row 1: 4 KPI Cards */}
      <div className="owner-grid-4">
        {isLoading ? (
          <>
            <KPICardSkeleton />
            <KPICardSkeleton />
            <KPICardSkeleton />
            <KPICardSkeleton />
          </>
        ) : (
          <>
            <KPICard
              title="📋 الطلبات النشطة"
              value={`${ownerRentals.filter((item) => ['pending', 'confirmed', 'in_use'].includes(item.status)).length} طلبات`}
              sub={<span className="text-success">▲ هذا الأسبوع</span>}
              icon={<ClipboardList />}
              iconStyle={{ color: 'var(--color-confirmed)', backgroundColor: 'rgba(52, 152, 219, 0.1)' }}
            />
            <KPICard
              title="💰 الأرباح هذا الشهر"
              value={`${formatCurrency(monthEarnings)} ر.ي`}
              sub={<span><span className="text-success">▲ {monthGrowth >= 0 ? `+${monthGrowth}%` : `${monthGrowth}%`}</span> مقارنة بالشهر الماضي</span>}
              icon={<DollarSign />}
              iconStyle={{ color: 'var(--color-completed)', backgroundColor: 'rgba(39, 174, 96, 0.1)' }}
            />
            <KPICard
              title="🔧 المعدات المتاحة"
              value={`${equipment.length} / ${equipment.length}`}
              sub={<span className="badge badge-available" style={{ fontSize: 11 }}>{equipment.length} متاحة</span>}
              icon={<Wrench />}
            />
            <KPICard
              title="⭐ متوسط التقييم"
              value={`${averageRating} / 5`}
              sub={`${ownerReviews.length} تقييم`}
              icon={<Star />}
              iconStyle={{ color: '#F39C12', backgroundColor: 'rgba(243, 156, 18, 0.1)' }}
            />
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="owner-grid-2">
        {/* Bar Chart */}
        {isLoading ? <ChartSkeleton height={280} /> : (
          <div className="owner-card">
            <h4 className="mb-6">📊 الأرباح — آخر 6 أشهر</h4>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <BarChart data={dataEarnings}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => `${Number(v).toLocaleString()} ر.ي`} />
                  <Bar dataKey="amount" fill="#2D5A27" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Donut Chart — Order Statuses */}
        {isLoading ? <ChartSkeleton height={220} /> : (
          <div className="owner-card">
            <h4 className="mb-6">📈 توزيع حالات الطلبات</h4>
            <div style={{ width: '100%', height: 220, display: 'flex', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={dataOrders} innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={3}>
                    {dataOrders.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, n) => [`${v} طلب`, dataOrdersLabels[n] || n]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-center gap-4 mt-2 w-full" style={{ flexWrap: 'wrap' }}>
              {dataOrders.map(item => (
                <div key={item.name} className="flex-center gap-2">
                  <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: item.color }}></div>
                  <span className="text-muted" style={{ fontSize: 12 }}>{dataOrdersLabels[item.name]}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recent Orders Table */}
      <div className="owner-card">
        <div className="flex-between mb-6">
          <h4 style={{ margin: 0 }}>آخر 5 طلبات واردة</h4>
          <button className="owner-btn owner-btn-outline" style={{ fontSize: 13 }}>عرض الكل</button>
        </div>
        <div className="owner-table-container">
          <table className="owner-table">
            <thead>
              <tr>
                <th>#</th>
                <th>المستأجر</th>
                <th>المعدة</th>
                <th>الفترة</th>
                <th>المبلغ</th>
                <th>الحالة</th>
                <th>الإجراء</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: 24, color: 'var(--color-text-muted)' }}>
                    جاري تحميل الطلبات...
                  </td>
                </tr>
              ) : recentRentals.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: 24, color: 'var(--color-text-muted)' }}>
                    لا توجد طلبات حتى الآن
                  </td>
                </tr>
              ) : (
                recentRentals.map((rental) => {
                  const equipmentSnapshot = getEquipmentSnapshot(rental.equipmentId);
                  const tenant = getTenantProfile(rental.tenantId);
                  const status = STATUS_CONFIG[rental.status];
                  return (
                    <tr key={rental.id}>
                      <td>{rental.orderNum}</td>
                      <td>
                        <div className="flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
                          <img src="https://i.pravatar.cc/32?img=12" alt={tenant.name} style={{ borderRadius: '50%', width: 28, height: 28 }} />
                          {tenant.name}
                        </div>
                      </td>
                      <td>{equipmentSnapshot.name}</td>
                      <td>{`${rental.startDate} - ${rental.endDate}`}</td>
                      <td>{formatCurrency(rental.totalAmount)} ر.ي</td>
                      <td><span className={`badge badge-${rental.status.replace('_', '-')}`}>{status.label}</span></td>
                      <td>
                        {rental.status === 'pending' ? (
                          <div className="flex-center gap-2">
                            <button className="owner-btn owner-btn-success" style={{ padding: '4px 10px', fontSize: 12 }}><CheckCircle size={14} /> قبول</button>
                            <button className="owner-btn owner-btn-danger" style={{ padding: '4px 10px', fontSize: 12 }}><XCircle size={14} /></button>
                          </div>
                        ) : (
                          <button className="owner-btn owner-btn-outline" style={{ padding: '4px 10px', fontSize: 12 }}><Eye size={14} /> عرض</button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview;
