import React from 'react';
import { EmptyState as SharedEmptyState } from '../../shared/EmptyState';

const EmptyState = ({ action, ...props }) => (
  <SharedEmptyState {...props}>
    {action ? <div className="mt-4">{action}</div> : null}
  </SharedEmptyState>
);

export default EmptyState;
