import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, Plus, MapPin, Edit2, Trash2, EyeOff, Star } from 'lucide-react';

const MyEquipment = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Header */}
      <div className="flex-between mb-8" style={{ flexWrap: 'wrap', gap: 16 }}>
        <h2 style={{ margin: 0 }}>معداتي</h2>
        <div className="flex-center gap-4" style={{ flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', right: 12, top: 12, color: 'var(--color-text-muted)' }} />
            <input type="text" className="owner-input" placeholder="🔍 بحث..." style={{ paddingRight: 36, width: 180 }} />
          </div>
          <select className="owner-input" style={{ width: 130 }}>
            <option>الفئة ▼</option>
            <option>مولدات</option>
            <option>بناء</option>
            <option>تصوير</option>
          </select>
          <select className="owner-input" style={{ width: 130 }}>
            <option>الحالة ▼</option>
            <option>متاح</option>
            <option>محجوز</option>
            <option>مخفي</option>
            <option>معطّل</option>
          </select>
          <button className="owner-btn owner-btn-primary" onClick={() => navigate('/owner/equipment/add')}>
            <Plus size={18} /> إضافة معدة جديدة
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="owner-grid-3">
        {/* Equipment Card 1 — Available */}
        <div className="owner-card equipment-card">
          <img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=400" alt="Generator" className="equipment-image" />
          <div className="equipment-details">
            <div className="flex-between mb-2">
              <h3 className="equipment-title" style={{ margin: 0 }}>مولد كهرباء 10KVA</h3>
              <span className="badge badge-available">● متاح</span>
            </div>
            <div className="equipment-info-row"><MapPin size={14} /> صنعاء - الوحدة</div>
            <div className="equipment-info-row">💰 15,000 ر.ي / اليوم</div>
            <div className="equipment-info-row">⭐ 4.7 | 47 تأجير</div>
            <div className="equipment-actions">
              <button className="owner-btn owner-btn-outline" style={{ flex: 1, padding: '6px 0', fontSize: 12 }}><Edit2 size={14} /> تعديل</button>
              <button className="owner-btn owner-btn-outline" style={{ flex: 1, padding: '6px 0', fontSize: 12, color: 'var(--color-disputed)' }}><Trash2 size={14} /> حذف</button>
              <button className="owner-btn owner-btn-outline" style={{ flex: 1, padding: '6px 0', fontSize: 12 }}><EyeOff size={14} /> إخفاء</button>
            </div>
          </div>
        </div>

        {/* Equipment Card 2 — Booked */}
        <div className="owner-card equipment-card">
          <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400" alt="Camera" className="equipment-image" />
          <div className="equipment-details">
            <div className="flex-between mb-2">
              <h3 className="equipment-title" style={{ margin: 0 }}>كاميرا Sony A7 III</h3>
              <span className="badge badge-confirmed">● محجوز</span>
            </div>
            <div className="equipment-info-row"><MapPin size={14} /> صنعاء - شارع الستين</div>
            <div className="equipment-info-row">💰 850 ر.ي / اليوم</div>
            <div className="equipment-info-row">⭐ 4.9 | 23 تأجير</div>
            <div className="equipment-actions">
              <button className="owner-btn owner-btn-outline" style={{ flex: 1, padding: '6px 0', fontSize: 12 }}><Edit2 size={14} /> تعديل</button>
              <button className="owner-btn owner-btn-outline" style={{ flex: 1, padding: '6px 0', fontSize: 12, color: 'var(--color-disputed)' }}><Trash2 size={14} /> حذف</button>
              <button className="owner-btn owner-btn-outline" style={{ flex: 1, padding: '6px 0', fontSize: 12 }}><EyeOff size={14} /> إخفاء</button>
            </div>
          </div>
        </div>

        {/* Equipment Card 3 — Hidden */}
        <div className="owner-card equipment-card" style={{ opacity: 0.6 }}>
          <img src="https://images.unsplash.com/photo-1588600878108-578307a3cc9d?auto=format&fit=crop&q=80&w=400" alt="Drill" className="equipment-image" />
          <div className="equipment-details">
            <div className="flex-between mb-2">
              <h3 className="equipment-title" style={{ margin: 0 }}>دريل كهربائي بوش</h3>
              <span className="badge badge-cancelled">● مخفي</span>
            </div>
            <div className="equipment-info-row"><MapPin size={14} /> صنعاء - حدة</div>
            <div className="equipment-info-row">💰 150 ر.ي / اليوم</div>
            <div className="equipment-info-row">⭐ 4.5 | 12 تأجير</div>
            <div className="equipment-actions">
              <button className="owner-btn owner-btn-outline" style={{ flex: 1, padding: '6px 0', fontSize: 12 }}><Edit2 size={14} /> تعديل</button>
              <button className="owner-btn owner-btn-outline" style={{ flex: 1, padding: '6px 0', fontSize: 12, color: 'var(--color-disputed)' }}><Trash2 size={14} /> حذف</button>
              <button className="owner-btn owner-btn-outline" style={{ flex: 1, padding: '6px 0', fontSize: 12, color: 'var(--color-completed)' }}><Star size={14} /> إظهار</button>
            </div>
          </div>
        </div>

        {/* Add New Card */}
        <div className="owner-card flex-center" style={{ border: '2px dashed var(--color-border)', backgroundColor: 'transparent', cursor: 'pointer', minHeight: 300, flexDirection: 'column' }} onClick={() => navigate('/owner/equipment/add')}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'rgba(45, 90, 39, 0.1)', color: 'var(--color-primary-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Plus size={32} />
          </div>
          <h4 style={{ color: 'var(--color-primary-green)', margin: 0 }}>إضافة معدة جديدة</h4>
        </div>
      </div>
    </div>
  );
};

export default MyEquipment;
