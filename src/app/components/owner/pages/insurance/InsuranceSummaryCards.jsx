import React from 'react';

const InsuranceSummaryCards = ({ cards }) => (
  <div className="owner-grid-3">
    {cards.map((card) => (
      <div key={card.label} className="owner-card owner-kpi-card">
        <div className="owner-kpi-info">
          <h4>{card.label}</h4>
          <p className={`kpi-value ${card.valueClassName ?? ''}`}>{card.value}</p>
        </div>
        <div className="owner-kpi-icon" style={card.iconStyle}>
          {card.icon}
        </div>
      </div>
    ))}
  </div>
);

export default InsuranceSummaryCards;
