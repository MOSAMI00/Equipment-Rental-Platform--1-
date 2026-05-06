import React from 'react';

const ProfileSidebar = ({ tabs, activeTab, onTabChange }) => (
  <div className="settings-sidebar">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        type="button"
        className={`settings-sidebar-item flex-center gap-2 ${activeTab === tab.id ? 'active' : ''}`}
        style={{ justifyContent: 'flex-start', width: '100%', border: 'none', textAlign: 'right', cursor: 'pointer' }}
        onClick={() => onTabChange(tab.id)}
      >
        {tab.icon} {tab.name}
      </button>
    ))}
  </div>
);

export default ProfileSidebar;
