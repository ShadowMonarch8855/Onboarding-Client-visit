import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FiCheckCircle, FiFileText, FiUpload, FiMessageSquare } from 'react-icons/fi';
import styles from './RecentActivity.module.css';

const getIcon = (type) => {
  switch (type) {
    case 'contract_signed': return <FiFileText />;
    case 'document_uploaded': return <FiUpload />;
    case 'step_completed': return <FiCheckCircle />;
    default: return <FiMessageSquare />;
  }
};

const RecentActivity = ({ activities = [] }) => {
  if (!activities.length) return <div className={styles.empty}>No recent activity</div>;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Recent Activity</h3>
      <div className={styles.list}>
        {activities.map((activity, index) => (
          <div key={index} className={styles.item}>
            <div className={styles.iconWrapper}>{getIcon(activity.type)}</div>
            <div className={styles.content}>
              <p className={styles.desc}>{activity.description}</p>
              <span className={styles.time}>
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
