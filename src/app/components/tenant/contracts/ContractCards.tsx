import { ContractCard } from './ContractCard';

interface ContractCardsProps {
  contracts: any[];
}

export function ContractCards({ contracts }: ContractCardsProps) {
  return (
    <div className="md:hidden flex flex-col gap-3">
      {contracts.map(contract => (
        <ContractCard key={contract.id} contract={contract} />
      ))}
    </div>
  );
}
