import React from 'react';

const EmptyState = ({ icon, title, description, action }) => (
  <div className="owner-card text-center" style={{ padding: 40 }}>
    <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
    <h3 style={{ marginTop: 0, marginBottom: 8 }}>{title}</h3>
    <p className="text-muted" style={{ margin: 0 }}>{description}</p>
    {action ? <div className="mt-4">{action}</div> : null}
  </div>
);

export default EmptyState;
