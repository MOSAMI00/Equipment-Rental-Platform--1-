import React from 'react';
import { ChevronLeft } from 'lucide-react';
import type { HandoverReport } from '../../../../data/mock-api';
import DeliveryTabs from './DeliveryTabs';
import {
  DisputeList,
  RentalDetailPanel,
  RentalListPanel,
} from './DeliveryPanels';
import { useOwnerDeliveryWorkflow } from './useOwnerDeliveryWorkflow';

const Delivery = () => {
  const workflow = useOwnerDeliveryWorkflow();

  return (
    <div>
      <div className="flex-between mb-8">
        <h2 style={{ margin: 0 }}>التسليم والإرجاع</h2>
        {workflow.selectedRentalId ? (
          <button className="owner-btn owner-btn-outline" style={{ fontSize: 12 }} onClick={() => workflow.setSelectedRentalId(null)}>
            <ChevronLeft size={14} /> عودة للقائمة
          </button>
        ) : null}
      </div>

      <DeliveryTabs
        tabs={workflow.tabList}
        activeTab={workflow.activeTab}
        onTabChange={workflow.handleTabChange}
      />

      {workflow.activeTab === 'disputes' ? (
        <DisputeList
          disputes={workflow.openDisputes}
          ownerRentals={workflow.ownerRentals}
          editingDisputeId={workflow.editingDisputeId}
          disputeNotes={workflow.disputeNotes}
          ownerDecision={workflow.ownerDecision}
          proposedDeduction={workflow.proposedDeduction}
          setEditingDisputeId={workflow.setEditingDisputeId}
          setDisputeNotes={workflow.setDisputeNotes}
          setOwnerDecision={workflow.setOwnerDecision}
          setProposedDeduction={workflow.setProposedDeduction}
          onSave={workflow.handleSaveDisputeNotes}
        />
      ) : (
        <div className="owner-grid-2" style={{ alignItems: 'flex-start' }}>
          <RentalListPanel
            rentals={workflow.currentList}
            handoverReports={workflow.handoverReports as HandoverReport[]}
            selectedRentalId={workflow.selectedRentalId}
            onSelect={workflow.setSelectedRentalId}
          />
          <RentalDetailPanel
            selectedRental={workflow.selectedRental}
            ownerDeliveryReport={workflow.ownerDeliveryReport}
            tenantDeliveryReport={workflow.tenantDeliveryReport}
            returnReport={workflow.returnReport}
            compensationRequest={workflow.compensation}
            deliveryEvidence={workflow.deliveryEvidence}
            returnEvidence={workflow.returnEvidence}
            deliveryExtraDescription={workflow.deliveryExtraDescription}
            returnExtraDescription={workflow.returnExtraDescription}
            ownerDecision={workflow.ownerDecision}
            proposedDeduction={workflow.proposedDeduction}
            setDeliveryEvidence={workflow.setDeliveryEvidence}
            setReturnEvidence={workflow.setReturnEvidence}
            setDeliveryExtraDescription={workflow.setDeliveryExtraDescription}
            setReturnExtraDescription={workflow.setReturnExtraDescription}
            setOwnerDecision={workflow.setOwnerDecision}
            setProposedDeduction={workflow.setProposedDeduction}
            onConfirmDelivery={workflow.handleConfirmDelivery}
            onConfirmReturn={workflow.handleConfirmReturn}
            onOpenDispute={workflow.handleOpenReturnDispute}
            onRequestCompensation={workflow.handleRequestCompensation}
          />
        </div>
      )}
    </div>
  );
};

export default Delivery;
