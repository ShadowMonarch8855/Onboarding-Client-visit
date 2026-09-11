import React from 'react';
import StatCard from '../components/Dashboard/StatCard';
import ProgressChart from '../components/Dashboard/ProgressChart';
import RecentActivity from '../components/Dashboard/RecentActivity';
import { FiUsers, FiFolder, FiFileText, FiClock } from 'react-icons/fi';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const chartData = [
    { name: 'Project Alpha', progress: 75 },
    { name: 'Project Beta', progress: 40 },
    { name: 'Project Gamma', progress: 90 }
  ];

  const activities = [
    { type: 'contract_signed', description: 'Acme Corp signed the master service agreement.', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { type: 'document_uploaded', description: 'TechStart uploaded their brand guidelines.', timestamp: new Date(Date.now() - 7200000).toISOString() }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.statsGrid}>
        <StatCard title="Total Clients" value="24" icon={<FiUsers />} variant="primary" trend={12} />
        <StatCard title="Active Projects" value="12" icon={<FiFolder />} variant="success" trend={8} />
        <StatCard title="Pending Invoices" value="3" icon={<FiFileText />} variant="warning" />
        <StatCard title="Active Onboardings" value="5" icon={<FiClock />} variant="danger" />
      </div>
      <div className={styles.mainGrid}>
        <div className={styles.chartSection}>
          <ProgressChart data={chartData} />
        </div>
        <div className={styles.activitySection}>
          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  );
}
