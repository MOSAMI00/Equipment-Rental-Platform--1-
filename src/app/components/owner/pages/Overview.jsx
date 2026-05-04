import React from 'react';
import { ClipboardList, DollarSign, Wrench, Star, CheckCircle, XCircle, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const dataEarnings = [
  { name: 'نوفمبر', amount: 150000 },
  { name: 'ديسمبر', amount: 180000 },
  { name: 'يناير', amount: 200000 },
  { name: 'فبراير', amount: 170000 },
  { name: 'مارس', amount: 220000 },
  { name: 'أبريل', amount: 245000 },
];

const dataOrders = [
  { name: 'Pending', value: 3, color: '#F39C12' },
  { name: 'Confirmed', value: 2, color: '#3498DB' },
  { name: 'In Use', value: 2, color: '#E67E22' },
  { name: 'Completed', value: 12, color: '#27AE60' },
  { name: 'Cancelled', value: 1, color: '#95A5A6' },
];

const dataOrdersLabels = {
  Pending: 'بانتظار',
  Confirmed: 'مؤكد',
  'In Use': 'قيد الاستخدام',
  Completed: 'مكتمل',
  Cancelled: 'ملغي',
};

const Overview = () => {
  return (
    <div>
      {/* Row 1: 4 KPI Cards */}
      <div className="owner-grid-4">
        <div className="owner-card owner-kpi-card">
          <div className="owner-kpi-info">
            <h4>📋 الطلبات النشطة</h4>
            <p className="kpi-value">8 طلبات</p>
            <p className="kpi-sub"><span className="text-success">▲ هذا الأسبوع</span></p>
          </div>
          <div className="owner-kpi-icon" style={{ color: 'var(--color-confirmed)', backgroundColor: 'rgba(52, 152, 219, 0.1)' }}>
            <ClipboardList />
          </div>
        </div>

        <div className="owner-card owner-kpi-card">
          <div className="owner-kpi-info">
            <h4>💰 الأرباح هذا الشهر</h4>
            <p className="kpi-value">245,000 ر.ي</p>
            <p className="kpi-sub"><span className="text-success">▲ +15%</span> مقارنة بالشهر الماضي</p>
          </div>
          <div className="owner-kpi-icon" style={{ color: 'var(--color-completed)', backgroundColor: 'rgba(39, 174, 96, 0.1)' }}>
            <DollarSign />
          </div>
        </div>

        <div className="owner-card owner-kpi-card">
          <div className="owner-kpi-info">
            <h4>🔧 المعدات المتاحة</h4>
            <p className="kpi-value">5 / 8</p>
            <p className="kpi-sub"><span className="badge badge-available" style={{ fontSize: 11 }}>5 متاحة</span></p>
          </div>
          <div className="owner-kpi-icon"><Wrench /></div>
        </div>

        <div className="owner-card owner-kpi-card">
          <div className="owner-kpi-info">
            <h4>⭐ متوسط التقييم</h4>
            <p className="kpi-value">4.8 / 5</p>
            <p className="kpi-sub">102 تقييم</p>
          </div>
          <div className="owner-kpi-icon" style={{ color: '#F39C12', backgroundColor: 'rgba(243, 156, 18, 0.1)' }}>
            <Star />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="owner-grid-2">
        {/* Bar Chart */}
        <div className="owner-card">
          <h4 className="mb-6">📊 الأرباح — آخر 6 أشهر</h4>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={dataEarnings}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => `${v.toLocaleString()} ر.ي`} />
                <Bar dataKey="amount" fill="#2D5A27" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart — Order Statuses */}
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
              <tr>
                <td>#1047</td>
                <td>
                  <div className="flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
                    <img src="https://i.pravatar.cc/32?img=12" alt="" style={{ borderRadius: '50%', width: 28, height: 28 }} />
                    أحمد محمد
                  </div>
                </td>
                <td>مولد كهرباء 10KVA</td>
                <td>01-04 فبراير</td>
                <td>45,000 ر.ي</td>
                <td><span className="badge badge-pending">⏳ Pending</span></td>
                <td>
                  <div className="flex-center gap-2">
                    <button className="owner-btn owner-btn-success" style={{ padding: '4px 10px', fontSize: 12 }}><CheckCircle size={14} /> قبول</button>
                    <button className="owner-btn owner-btn-danger" style={{ padding: '4px 10px', fontSize: 12 }}><XCircle size={14} /></button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>#1046</td>
                <td>
                  <div className="flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
                    <img src="https://i.pravatar.cc/32?img=33" alt="" style={{ borderRadius: '50%', width: 28, height: 28 }} />
                    سارة أحمد
                  </div>
                </td>
                <td>كاميرا Sony A7 III</td>
                <td>28-30 يناير</td>
                <td>2,550 ر.ي</td>
                <td><span className="badge badge-confirmed">✅ Confirmed</span></td>
                <td><button className="owner-btn owner-btn-outline" style={{ padding: '4px 10px', fontSize: 12 }}><Eye size={14} /> عرض</button></td>
              </tr>
              <tr>
                <td>#1045</td>
                <td>
                  <div className="flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
                    <img src="https://i.pravatar.cc/32?img=15" alt="" style={{ borderRadius: '50%', width: 28, height: 28 }} />
                    خالد ناصر
                  </div>
                </td>
                <td>مولد كهرباء 5KVA</td>
                <td>25-27 يناير</td>
                <td>30,000 ر.ي</td>
                <td><span className="badge badge-in-use">🔧 In Use</span></td>
                <td><button className="owner-btn owner-btn-outline" style={{ padding: '4px 10px', fontSize: 12 }}><Eye size={14} /> عرض</button></td>
              </tr>
              <tr>
                <td>#1044</td>
                <td>
                  <div className="flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
                    <img src="https://i.pravatar.cc/32?img=20" alt="" style={{ borderRadius: '50%', width: 28, height: 28 }} />
                    ياسر علي
                  </div>
                </td>
                <td>دريل بوش احترافي</td>
                <td>20-22 يناير</td>
                <td>450 ر.ي</td>
                <td><span className="badge badge-completed">🎉 Completed</span></td>
                <td><button className="owner-btn owner-btn-outline" style={{ padding: '4px 10px', fontSize: 12 }}><Eye size={14} /> عرض</button></td>
              </tr>
              <tr>
                <td>#1043</td>
                <td>
                  <div className="flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
                    <img src="https://i.pravatar.cc/32?img=25" alt="" style={{ borderRadius: '50%', width: 28, height: 28 }} />
                    فاطمة حسن
                  </div>
                </td>
                <td>لابتوب Dell XPS</td>
                <td>18-19 يناير</td>
                <td>3,400 ر.ي</td>
                <td><span className="badge badge-cancelled">❌ Cancelled</span></td>
                <td><button className="owner-btn owner-btn-outline" style={{ padding: '4px 10px', fontSize: 12 }}><Eye size={14} /> عرض</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview;
