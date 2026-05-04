import React, { useState, useMemo } from 'react';
import { CheckCircle, AlertTriangle, Package, RotateCcw, Eye, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../../auth/AuthContext';
import {
  useRentalPlatform,
  getEquipmentSnapshot,
  formatCurrency,
  formatRentalDateRange,
} from '../../../data/mock-api';
import { STATUS_CONFIG } from '../../tenant/Dashboard/shared/OrderTypes';

const CONDITION_LABELS = {
  excellent: '✨ ممتازة',
  good: '👍 جيدة',
  fair: '⚠️ مقبولة',
  poor: '❌ سيئة',
};

const TENANT_NAMES = { 'tenant-1': 'أحمد محمد' };

const Delivery = () => {
  const { user } = useAuth();
  const {
    rentals,
    handoverReports,
    disputes,
    createHandoverReport,
    confirmHandoverReport,
    updateDisputeOwnerNotes,
    createDispute,
  } = useRentalPlatform();

  const [activeTab, setActiveTab] = useState('pending_delivery');
  const [selectedRentalId, setSelectedRentalId] = useState(null);
  const [ownerNotes, setOwnerNotes] = useState('');
  const [proposedDeduction, setProposedDeduction] = useState('');
  const [ownerDecision, setOwnerDecision] = useState('full_refund');
  const [disputeNotes, setDisputeNotes] = useState('');
  const [deliveryEvidence, setDeliveryEvidence] = useState([]);
  const [returnEvidence, setReturnEvidence] = useState([]);
  const [deliveryExtraDescription, setDeliveryExtraDescription] = useState('');
  const [returnExtraDescription, setReturnExtraDescription] = useState('');

  // Rentals belonging to the current owner
  const ownerRentals = useMemo(
    () => rentals.filter((r) => r.ownerId === user?.id),
    [rentals, user?.id]
  );

  // Categorise rentals for each tab
  const pendingDelivery = useMemo(
    () => ownerRentals.filter((r) => {
      const ownerDelivery = handoverReports.find(
        (h) => h.rentalOpId === r.id && h.phase === 'delivery' && h.submittedByRole === 'owner'
      );
      return r.status === 'confirmed' && r.paymentStatus === 'paid' && !ownerDelivery;
    }),
    [ownerRentals, handoverReports]
  );
  const inUse = useMemo(
    () => ownerRentals.filter((r) => {
      const returnRequest = handoverReports.find(
        (h) => h.rentalOpId === r.id && h.phase === 'return' && h.submittedByRole === 'tenant'
      );
      return r.status === 'in_use' && !returnRequest;
    }),
    [ownerRentals, handoverReports]
  );
  const pendingTenantReceive = useMemo(
    () => ownerRentals.filter((r) => {
      const ownerDelivery = handoverReports.find(
        (h) => h.rentalOpId === r.id && h.phase === 'delivery' && h.submittedByRole === 'owner'
      );
      const tenantReceive = handoverReports.find(
        (h) => h.rentalOpId === r.id && h.phase === 'delivery' && h.submittedByRole === 'tenant'
      );
      return r.status === 'confirmed' && r.paymentStatus === 'paid' && ownerDelivery && !tenantReceive;
    }),
    [ownerRentals, handoverReports]
  );
  const pendingReturn = useMemo(
    () => ownerRentals.filter((r) => {
      const returnReport = handoverReports.find(
        (h) => h.rentalOpId === r.id && h.phase === 'return' && h.submittedByRole === 'tenant'
      );
      return r.status === 'in_use' && returnReport;
    }),
    [ownerRentals, handoverReports]
  );
  const openDisputes = useMemo(
    () => disputes.filter((d) => {
      const rental = ownerRentals.find((r) => r.id === d.rentalOpId);
      return rental && d.status !== 'resolved';
    }),
    [disputes, ownerRentals]
  );

  const tabList = [
    { id: 'pending_delivery', label: `📦 بانتظار التسليم (${pendingDelivery.length})` },
    { id: 'pending_receive', label: `🧾 بانتظار استلام المستأجر (${pendingTenantReceive.length})` },
    { id: 'in_use', label: `🔧 قيد الاستخدام (${inUse.length})` },
    { id: 'pending_return', label: `🔄 بانتظار الإرجاع (${pendingReturn.length})` },
    { id: 'disputes', label: `⚠️ النزاعات (${openDisputes.length})` },
  ];

  // Selected rental
  const selectedRental = useMemo(
    () => rentals.find((r) => r.id === selectedRentalId),
    [rentals, selectedRentalId]
  );
  const selectedEquipment = selectedRental
    ? getEquipmentSnapshot(selectedRental.equipmentId)
    : null;

  // Handover reports for selected rental
  const rentalHandovers = useMemo(
    () => handoverReports.filter((h) => h.rentalOpId === selectedRentalId),
    [handoverReports, selectedRentalId]
  );

  const ownerDeliveryReport = rentalHandovers.find((h) => h.phase === 'delivery' && h.submittedByRole === 'owner');
  const tenantDeliveryReport = rentalHandovers.find((h) => h.phase === 'delivery' && h.submittedByRole === 'tenant');
  const returnReport = rentalHandovers.find((h) => h.phase === 'return' && h.submittedByRole === 'tenant');

  // The list shown depends on active tab
  const currentList = useMemo(() => {
    if (activeTab === 'pending_delivery') return pendingDelivery;
    if (activeTab === 'pending_receive') return pendingTenantReceive;
    if (activeTab === 'in_use') return inUse;
    if (activeTab === 'pending_return') return pendingReturn;
    return [];
  }, [activeTab, pendingDelivery, pendingTenantReceive, inUse, pendingReturn]);

  const handleConfirmDelivery = () => {
    if (!selectedRental || deliveryEvidence.length === 0) return;
    const extra = deliveryExtraDescription.trim();
    createHandoverReport({
      rentalOpId: selectedRental.id,
      phase: 'delivery',
      submittedByRole: 'owner',
      hasIssues: false,
      notes: `صور توثيق تسليم المؤجر: ${deliveryEvidence.length}${extra ? ` — وصف إضافي: ${extra}` : ''}`,
      evidencePhotos: deliveryEvidence,
    });
    setDeliveryEvidence([]);
    setDeliveryExtraDescription('');
  };

  const handleConfirmReturn = () => {
    if (!selectedRental || !returnReport || returnEvidence.length === 0) return;
    const extra = returnExtraDescription.trim();
    createHandoverReport({
      rentalOpId: selectedRental.id,
      phase: 'return',
      submittedByRole: 'owner',
      hasIssues: Boolean(returnReport.hasDamage),
      hasDamage: Boolean(returnReport.hasDamage),
      ownerDecision,
      proposedDeduction: ownerDecision === 'partial_refund' ? Number(proposedDeduction || 0) : 0,
      notes: `صور توثيق استلام المؤجر بعد الإرجاع: ${returnEvidence.length}${extra ? ` — وصف إضافي: ${extra}` : ''}`,
      evidencePhotos: returnEvidence,
    });
    confirmHandoverReport(returnReport.id, user?.id);
    setReturnEvidence([]);
    setReturnExtraDescription('');
  };

  const handleSaveDisputeNotes = (disputeId) => {
    updateDisputeOwnerNotes(disputeId, disputeNotes, `اقتراح حل: خصم ${proposedDeduction} ر.ي`);
    setDisputeNotes('');
  };

  return (
    <div>
      <div className="flex-between mb-8">
        <h2 style={{ margin: 0 }}>التسليم والإرجاع</h2>
        {selectedRentalId && (
          <button
            className="owner-btn owner-btn-outline"
            style={{ fontSize: 12 }}
            onClick={() => setSelectedRentalId(null)}
          >
            <ChevronLeft size={14} /> عودة للقائمة
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="owner-tabs mb-6">
        {tabList.map((tab) => (
          <div
            key={tab.id}
            className={`owner-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => { setActiveTab(tab.id); setSelectedRentalId(null); }}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* DISPUTES TAB */}
      {activeTab === 'disputes' && (
        <div>
          {openDisputes.length === 0 ? (
            <div className="owner-card" style={{ textAlign: 'center', padding: 48 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
              <h3 style={{ color: 'var(--color-text-muted)' }}>لا توجد نزاعات مفتوحة</h3>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {openDisputes.map((dispute) => {
                const rental = ownerRentals.find((r) => r.id === dispute.rentalOpId);
                const equipment = rental ? getEquipmentSnapshot(rental.equipmentId) : null;
                return (
                  <div key={dispute.id} className="owner-card" style={{ borderRight: '4px solid #E74C3C' }}>
                    <div className="flex-between mb-4">
                      <div>
                        <span className="badge badge-disputed" style={{ marginLeft: 8 }}>
                          {dispute.status === 'open' ? '🔴 مفتوح' : '🟡 قيد المراجعة'}
                        </span>
                        <strong style={{ fontSize: 14 }}>{equipment?.name} — #{rental?.orderNum}</strong>
                      </div>
                      <span className="text-muted" style={{ fontSize: 12 }}>{dispute.createdAt.slice(0, 10)}</span>
                    </div>

                    <div style={{ backgroundColor: 'rgba(231,76,60,0.06)', borderRadius: 8, padding: 12, marginBottom: 12 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>مطالبة المستأجر:</p>
                      <p style={{ margin: '4px 0 0', fontSize: 13 }}>{dispute.details}</p>
                      {dispute.tenantClaim && (
                        <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--color-text-muted)' }}>{dispute.tenantClaim}</p>
                      )}
                    </div>

                    {dispute.ownerNotes && (
                      <div style={{ backgroundColor: 'rgba(45,90,39,0.06)', borderRadius: 8, padding: 12, marginBottom: 12 }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>ردك السابق:</p>
                        <p style={{ margin: '4px 0 0', fontSize: 13 }}>{dispute.ownerNotes}</p>
                      </div>
                    )}

                    {!dispute.ownerNotes && dispute.openedByRole !== 'owner' && (
                      <div className="owner-grid-2" style={{ gap: 12 }}>
                        <textarea
                          className="owner-input"
                          placeholder="أضف ملاحظاتك ووجهة نظرك..."
                          rows={3}
                          value={dispute.id === selectedRentalId ? disputeNotes : (dispute.ownerNotes ?? '')}
                          onChange={(e) => { setSelectedRentalId(dispute.id); setDisputeNotes(e.target.value); }}
                          style={{ width: '100%', resize: 'vertical', fontFamily: 'Cairo, sans-serif' }}
                        />
                        <div>
                          <select
                            className="owner-input w-full mb-2"
                            value={ownerDecision}
                            onChange={(e) => setOwnerDecision(e.target.value)}
                            style={{ width: '100%' }}
                          >
                            <option value="full_refund">استرداد كامل للتأمين</option>
                            <option value="partial_refund">استرداد جزئي</option>
                            <option value="no_refund">لا استرداد</option>
                          </select>
                          {ownerDecision === 'partial_refund' && (
                            <input
                              type="number"
                              className="owner-input w-full mb-2"
                              placeholder="مبلغ الخصم بالريال"
                              value={proposedDeduction}
                              onChange={(e) => setProposedDeduction(e.target.value)}
                              style={{ width: '100%' }}
                            />
                          )}
                          <button
                            className="owner-btn owner-btn-primary w-full"
                            style={{ width: '100%' }}
                            onClick={() => handleSaveDisputeNotes(dispute.id)}
                          >
                            حفظ الرد
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* OTHER TABS */}
      {activeTab !== 'disputes' && (
        <div className="owner-grid-2" style={{ alignItems: 'flex-start' }}>
          {/* Rental List (left side) */}
          <div>
            {currentList.length === 0 ? (
              <div className="owner-card" style={{ textAlign: 'center', padding: 40 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
                <h4 style={{ color: 'var(--color-text-muted)' }}>لا توجد عمليات في هذه الحالة</h4>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {currentList.map((rental) => {
                  const eq = getEquipmentSnapshot(rental.equipmentId);
                  const status = STATUS_CONFIG[rental.status];
                  const waitingTenantReceive = handoverReports.find(
                    (h) => h.rentalOpId === rental.id && h.phase === 'delivery' && h.submittedByRole === 'owner'
                  ) && !handoverReports.find(
                    (h) => h.rentalOpId === rental.id && h.phase === 'delivery' && h.submittedByRole === 'tenant'
                  );
                  const waitingOwnerReturnConfirm = handoverReports.find(
                    (h) => h.rentalOpId === rental.id && h.phase === 'return' && h.submittedByRole === 'tenant' && !h.confirmedAt
                  );
                  const isSelected = selectedRentalId === rental.id;

                  return (
                    <div
                      key={rental.id}
                      className="owner-card"
                      style={{
                        cursor: 'pointer',
                        borderRight: isSelected ? '4px solid var(--color-primary-green)' : '4px solid transparent',
                        transition: 'all 0.2s',
                      }}
                      onClick={() => setSelectedRentalId(isSelected ? null : rental.id)}
                    >
                      <div className="flex-between mb-2">
                        <strong>{eq.name}</strong>
                        <span className={`badge badge-${rental.status.replace('_', '-')}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-muted mb-2" style={{ fontSize: 13 }}>
                        {TENANT_NAMES[rental.tenantId] ?? 'مستأجر'} — {formatRentalDateRange(rental.startDate, rental.endDate)}
                      </p>
                      {waitingTenantReceive && (
                        <span className="badge badge-pending" style={{ fontSize: 11 }}>
                          ⏳ بانتظار تأكيد الاستلام من المستأجر
                        </span>
                      )}
                      {waitingOwnerReturnConfirm && (
                        <span className="badge badge-pending" style={{ fontSize: 11 }}>
                          ⏳ طلب إرجاع بانتظار توثيقك
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Detail Panel (right side) */}
          <div>
            {!selectedRental ? (
              <div className="owner-card" style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-muted)' }}>
                <Package size={40} style={{ margin: '0 auto 12px' }} />
                <p>اختر عملية من القائمة لعرض تفاصيلها</p>
              </div>
            ) : (
              <div>
                {/* Equipment Info */}
                <div className="owner-card mb-4">
                  <div className="flex-center gap-4 mb-4" style={{ justifyContent: 'flex-start' }}>
                    <img
                      src={selectedEquipment?.image}
                      alt=""
                      style={{ width: 72, height: 72, borderRadius: 10, objectFit: 'cover' }}
                    />
                    <div>
                      <h4 style={{ margin: '0 0 4px' }}>{selectedEquipment?.name}</h4>
                      <p className="text-muted mb-1" style={{ fontSize: 13 }}>
                        #{selectedRental.orderNum} — {TENANT_NAMES[selectedRental.tenantId]}
                      </p>
                      <p className="text-muted mb-0" style={{ fontSize: 13 }}>
                        📅 {formatRentalDateRange(selectedRental.startDate, selectedRental.endDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex-between">
                    <span className="text-muted">إجمالي الإيجار</span>
                    <strong style={{ color: 'var(--color-primary-green)' }}>
                      {formatCurrency(selectedRental.totalAmount)} ر.ي
                    </strong>
                  </div>
                </div>

                {/* Owner delivery documentation */}
                {!ownerDeliveryReport && selectedRental.status === 'confirmed' && selectedRental.paymentStatus === 'paid' && (
                  <div className="owner-card mb-4">
                    <div className="flex-between mb-4">
                      <h4 style={{ margin: 0 }}>📦 تسليم المعدة للمستأجر</h4>
                      <span className="badge badge-pending">مطلوب</span>
                    </div>
                    <p className="text-muted" style={{ fontSize: 13, marginBottom: 10 }}>
                      ارفع صورة توثيق واحدة على الأقل قبل تأكيد التسليم.
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="owner-input mb-3"
                      onChange={(e) => setDeliveryEvidence(Array.from(e.target.files || []).map((file) => file.name))}
                    />
                    <label className="text-muted" style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>
                      وصف إضافي (اختياري)
                    </label>
                    <textarea
                      className="owner-input mb-3"
                      rows={3}
                      placeholder="مثال: حالة المعدة عند التسليم، ملاحظات على الموقع، إلخ."
                      value={deliveryExtraDescription}
                      onChange={(e) => setDeliveryExtraDescription(e.target.value)}
                    />
                    <button
                      className="owner-btn owner-btn-success w-full"
                      style={{ width: '100%' }}
                      onClick={handleConfirmDelivery}
                      disabled={deliveryEvidence.length === 0}
                    >
                      <CheckCircle size={16} /> توثيق وتسليم المعدة
                    </button>
                  </div>
                )}

                {/* Delivery lifecycle */}
                {ownerDeliveryReport && (
                  <div className="owner-card mb-4">
                    <div className="flex-between mb-4">
                      <h4 style={{ margin: 0 }}>📦 دورة التسليم</h4>
                      {tenantDeliveryReport ? (
                        <span className="badge badge-completed">✅ المستأجر استلم</span>
                      ) : (
                        <span className="badge badge-pending">⏳ بانتظار تأكيد المستأجر</span>
                      )}
                    </div>
                    <p className="text-muted" style={{ fontSize: 13, marginBottom: 8 }}>
                      تم تسليم المعدة من المؤجر بتاريخ {ownerDeliveryReport.createdAt.slice(0, 10)}.
                    </p>
                    {ownerDeliveryReport.notes && (
                      <p className="text-muted" style={{ fontSize: 13, marginBottom: 10 }}>
                        {ownerDeliveryReport.notes}
                      </p>
                    )}
                    {!tenantDeliveryReport && (
                      <p className="text-muted" style={{ fontSize: 12 }}>
                        المستأجر لم يؤكد الاستلام بعد.
                      </p>
                    )}
                    {tenantDeliveryReport && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
                        <div>
                          <span className="text-muted" style={{ fontSize: 12 }}>حالة المعدة عند الاستلام</span>
                          <p style={{ fontWeight: 600, margin: '2px 0' }}>
                            {CONDITION_LABELS[tenantDeliveryReport.conditionStatus] ?? tenantDeliveryReport.conditionStatus ?? '—'}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted" style={{ fontSize: 12 }}>مشاكل</span>
                          <p style={{ fontWeight: 600, margin: '2px 0' }}>
                            {tenantDeliveryReport.hasIssues ? '⚠️ نعم' : '✅ لا'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Return Report */}
                {returnReport && (
                  <div className="owner-card mb-4">
                    <div className="flex-between mb-4">
                      <h4 style={{ margin: 0 }}>🔄 تقرير الإرجاع (من المستأجر)</h4>
                      {returnReport.confirmedAt ? (
                        <span className="badge badge-completed">✅ مؤكد</span>
                      ) : (
                        <span className="badge badge-pending">⏳ بانتظار قرارك</span>
                      )}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                      <div>
                        <span className="text-muted" style={{ fontSize: 12 }}>أضرار</span>
                        <p style={{ fontWeight: 600, margin: '2px 0', color: returnReport.hasDamage ? '#E74C3C' : '#27AE60' }}>
                          {returnReport.hasDamage ? '⚠️ يوجد أضرار' : '✅ لا أضرار'}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted" style={{ fontSize: 12 }}>قرار التأمين</span>
                        <p style={{ fontWeight: 600, margin: '2px 0' }}>
                          {returnReport.ownerDecision === 'full_refund' ? '✅ استرداد كامل'
                            : returnReport.ownerDecision === 'partial_refund' ? `⚠️ خصم ${formatCurrency(returnReport.proposedDeduction ?? 0)} ر.ي`
                            : returnReport.ownerDecision === 'no_refund' ? '❌ لا استرداد'
                            : '—'}
                        </p>
                      </div>
                    </div>
                    {returnReport.notes && (
                      <p className="text-muted" style={{ fontSize: 13, marginBottom: 12 }}>
                        {returnReport.notes}
                      </p>
                    )}
                    {!returnReport.confirmedAt && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="owner-input"
                          onChange={(e) => setReturnEvidence(Array.from(e.target.files || []).map((file) => file.name))}
                        />
                        <label className="text-muted" style={{ fontSize: 12 }}>
                          وصف إضافي (اختياري)
                        </label>
                        <textarea
                          className="owner-input"
                          rows={3}
                          placeholder="مثال: ملاحظات على الأضرار الملموسة، مطابقة للصور، إلخ."
                          value={returnExtraDescription}
                          onChange={(e) => setReturnExtraDescription(e.target.value)}
                        />
                        <select
                          className="owner-input"
                          value={ownerDecision}
                          onChange={(e) => setOwnerDecision(e.target.value)}
                        >
                          <option value="full_refund">استرداد كامل للتأمين</option>
                          <option value="partial_refund">استرداد جزئي</option>
                          <option value="no_refund">لا استرداد</option>
                        </select>
                        {ownerDecision === 'partial_refund' && (
                          <input
                            type="number"
                            className="owner-input"
                            placeholder="مبلغ الخصم بالريال"
                            value={proposedDeduction}
                            onChange={(e) => setProposedDeduction(e.target.value)}
                          />
                        )}
                        <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          className="owner-btn owner-btn-success"
                          style={{ flex: 1 }}
                          onClick={handleConfirmReturn}
                          disabled={returnEvidence.length === 0}
                        >
                          <CheckCircle size={14} /> توثيق وتأكيد الإرجاع
                        </button>
                        <button
                          className="owner-btn owner-btn-danger"
                          style={{ flex: 1 }}
                          onClick={() => {
                            const deduction = ownerDecision === 'full_refund' ? 0 : ownerDecision === 'partial_refund' ? Number(proposedDeduction || 0) : selectedRental.insuranceAmount;
                            createDispute({
                              rentalOpId: selectedRental.id,
                              equipmentHandoverId: returnReport.id,
                              reason: 'damage',
                              details: returnExtraDescription || 'اعتراض المؤجر على حالة المعدة عند الإرجاع.',
                              openedByRole: 'owner',
                              requestedAmount: deduction,
                            });
                            setActiveTab('disputes');
                          }}
                        >
                          <AlertTriangle size={14} /> فتح نزاع
                        </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* No reports yet */}
                {!ownerDeliveryReport && !returnReport && (
                  <div className="owner-card" style={{ textAlign: 'center', padding: 32 }}>
                    <Package size={32} style={{ margin: '0 auto 12px', color: 'var(--color-text-muted)' }} />
                    <p className="text-muted">بانتظار بدء المؤجر لعملية التسليم</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Delivery;
