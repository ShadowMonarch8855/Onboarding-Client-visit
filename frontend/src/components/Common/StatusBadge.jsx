import React from 'react';
import styles from './StatusBadge.module.css';

const getStatusColor = (status) => {
  const normalized = status?.toLowerCase() || '';
  if (['active', 'paid', 'completed', 'signed', 'approved'].includes(normalized)) return styles.success;
  if (['sent', 'in_progress', 'pending'].includes(normalized)) return styles.primary;
  if (['overdue', 'changes_requested', 'review'].includes(normalized)) return styles.warning;
  if (['cancelled', 'failed', 'archived', 'rejected'].includes(normalized)) return styles.danger;
  return styles.default;
};

const StatusBadge = ({ status }) => {
  if (!status) return null;
  return (
    <span className={`${styles.badge} ${getStatusColor(status)}`}>
      {status.replace(/_/g, ' ').toUpperCase()}
    </span>
  );
};

export default StatusBadge;
