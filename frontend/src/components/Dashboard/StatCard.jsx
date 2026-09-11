import React from 'react';
import styles from './StatCard.module.css';

const StatCard = ({ title, value, icon, variant = 'primary', trend }) => {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div>
          <h4 className={styles.title}>{title}</h4>
          <p className={styles.value}>{value}</p>
        </div>
        <div className={`${styles.iconWrapper} ${styles[variant]}`}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className={styles.trend}>
          <span className={trend > 0 ? styles.positive : styles.negative}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          <span className={styles.trendLabel}>vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
