import React, { useState } from 'react';
import styles from './ProjectTabs.module.css';

const tabs = ['Overview', 'Onboarding', 'Invoices', 'Contracts', 'Assets', 'Information'];

const ProjectTabs = ({ activeTab, setActiveTab, onTabChange }) => {
  const handleTabClick = setActiveTab || onTabChange;
  return (
    <div className={styles.tabs}>
      {tabs.map(tab => (
        <button 
          key={tab} 
          className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
          onClick={() => handleTabClick(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default ProjectTabs;
