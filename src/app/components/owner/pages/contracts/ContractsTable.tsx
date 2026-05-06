import React from 'react';
import { Eye, Download } from 'lucide-react';
import type { RentalListItem } from '../../../../types/owner';
import { formatCurrency } from '../../../../utils/formatters';

interface ContractsTableProps {
  contracts: RentalListItem[];
  onView: (id: string) => void;
}

export function ContractsTable({ contracts, onView }: ContractsTableProps) {
  return (
    <div className="owner-table-container">
      <table className="owner-table">
        <thead>
          <tr>
            <th>رقم العقد</th>
            <th>المستأجر</th>
            <th>المعدة</th>
            <th>تاريخ الإنشاء</th>
            <th>المبلغ</th>
            <th>إجراء</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map(contract => (
            <tr key={contract.id}>
              <td>{contract.orderNum ?? '—'}</td>
              <td>{contract.tenant?.name ?? '—'}</td>
              <td>{contract.equipment?.name ?? '—'}</td>
              <td>{contract.createdAt ? new Date(contract.createdAt).toLocaleDateString('ar-YE') : '—'}</td>
              <td>{formatCurrency(contract.rentalAmount ?? 0)} ر.ي</td>
              <td>
                <div className="flex-center gap-2" style={{justifyContent: 'flex-start'}}>
                  <button
                    className="owner-btn owner-btn-outline"
                    style={{padding: '4px 8px'}}
                    onClick={() => onView(String(contract.id))}
                  >
                    <Eye size={16}/> عرض
                  </button>
                  <button className="owner-btn owner-btn-outline" style={{padding: '4px 8px'}}>
                    <Download size={16}/> تحميل
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
