import React, { useState } from 'react';
import { PageHeader } from '../../../shared';
import ClaimModal from './ClaimModal';
import InsuranceSummaryCards from './InsuranceSummaryCards';
import InsuranceTable from './InsuranceTable';
import { insuranceRows, insuranceSummaryCards } from './insuranceData';

const Insurance = () => {
  const [claimRow, setClaimRow] = useState(null);

  return (
    <div>
      <PageHeader title="إدارة التأمين" />

      <InsuranceSummaryCards cards={insuranceSummaryCards} />

      <InsuranceTable rows={insuranceRows} onOpenClaim={setClaimRow} />

      <ClaimModal claimRow={claimRow} onClose={() => setClaimRow(null)} />
    </div>
  );
};

export default Insurance;
