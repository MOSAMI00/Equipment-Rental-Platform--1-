import React from 'react';
import { FilterTabs } from '../../../shared';

const RequestTabs = ({ tabs, activeTab, onTabChange }) => (
  <FilterTabs
    tabs={tabs}
    activeTab={activeTab}
    onTabChange={onTabChange}
  />
);

export default RequestTabs;
