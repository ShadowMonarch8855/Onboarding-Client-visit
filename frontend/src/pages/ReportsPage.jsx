import React, { useState, useEffect } from 'react';
import { FiUsers, FiFolder, FiDollarSign, FiActivity } from 'react-icons/fi';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, 
  PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer 
} from 'recharts';
import { getStats } from '../api/dashboard.api';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import styles from './ReportsPage.module.css';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const mockAuditLogs = [
  { id: 1, timestamp: new Date().toISOString(), user: 'Admin User', action: 'Created Project', entity: 'Project Alpha', details: 'Status: Draft' },
  { id: 2, timestamp: new Date(Date.now() - 3600000).toISOString(), user: 'Team Member', action: 'Uploaded Asset', entity: 'Logo.png', details: 'Size: 2.4MB' },
  { id: 3, timestamp: new Date(Date.now() - 7200000).toISOString(), user: 'Client User', action: 'Signed Contract', entity: 'Contract v1', details: 'IP: 192.168.1.1' },
];

const mockChartData = {
  projectStatus: [
    { name: 'Draft', value: 4 },
    { name: 'In Progress', value: 8 },
    { name: 'Completed', value: 15 },
    { name: 'On Hold', value: 2 },
  ],
  invoiceStatus: [
    { name: 'Draft', count: 3 },
    { name: 'Sent', count: 5 },
    { name: 'Paid', count: 12 },
    { name: 'Overdue', count: 2 },
  ],
  onboarding: [
    { month: 'Jan', completions: 4 },
    { month: 'Feb', completions: 7 },
    { month: 'Mar', completions: 5 },
    { month: 'Apr', completions: 10 },
    { month: 'May', completions: 14 },
  ]
};

const ReportsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // If API is missing, use fallback
        const res = await getStats().catch(() => ({ 
          data: { totalClients: 24, totalProjects: 38, totalRevenue: 125000, activeOnboardings: 6 } 
        }));
        setStats(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) return <div className={styles.loadingContainer}><LoadingSpinner /></div>;

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Reports & Analytics</h1>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper} style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}>
            <FiUsers />
          </div>
          <div>
            <p className={styles.statLabel}>Total Clients</p>
            <p className={styles.statValue}>{stats.totalClients}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper} style={{ backgroundColor: '#f5f3ff', color: '#8b5cf6' }}>
            <FiFolder />
          </div>
          <div>
            <p className={styles.statLabel}>Total Projects</p>
            <p className={styles.statValue}>{stats.totalProjects}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper} style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
            <FiDollarSign />
          </div>
          <div>
            <p className={styles.statLabel}>Total Revenue</p>
            <p className={styles.statValue}>${stats.totalRevenue?.toLocaleString()}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper} style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}>
            <FiActivity />
          </div>
          <div>
            <p className={styles.statLabel}>Active Onboardings</p>
            <p className={styles.statValue}>{stats.activeOnboardings}</p>
          </div>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h3>Project Status Distribution</h3>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={mockChartData.projectStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {mockChartData.projectStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3>Invoices by Status</h3>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockChartData.invoiceStatus}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${styles.chartCard} ${styles.fullWidth}`}>
          <h3>Onboarding Completions (YTD)</h3>
          <div className={styles.chartWrapper} style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockChartData.onboarding}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip />
                <Line type="monotone" dataKey="completions" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className={styles.auditLogSection}>
        <h3 className={styles.sectionTitle}>Recent Activity Log</h3>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {mockAuditLogs.map(log => (
                <tr key={log.id}>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                  <td className={styles.bold}>{log.user}</td>
                  <td>{log.action}</td>
                  <td>{log.entity}</td>
                  <td className={styles.muted}>{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
