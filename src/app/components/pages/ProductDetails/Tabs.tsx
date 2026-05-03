import { useState } from 'react';
import { TabDescription } from './Tabs/Description';
import { TabTerms } from './Tabs/Terms';
import { TabReviews } from './Tabs/Reviews';

interface TabsProps {
  product: any;
}

export function Tabs({ product }: TabsProps) {
  const [activeTab, setActiveTab] = useState<'description' | 'terms' | 'reviews'>('description');

  return (
    <div className="border-t border-border">
      <div className="flex gap-6 border-b border-border">
        {[
          { id: 'description', label: 'الوصف' },
          { id: 'terms', label: 'الشروط' },
          { id: 'reviews', label: 'التقييمات' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-4 px-2 font-semibold border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="py-6">
        {activeTab === 'description' && <TabDescription product={product} />}
        {activeTab === 'terms' && <TabTerms />}
        {activeTab === 'reviews' && <TabReviews product={product} />}
      </div>
    </div>
  );
}
