import React from 'react';
import styles from './ProgressBar.module.css';

const ProgressBar = ({ progress }) => {
  return (
    <div className={styles.container}>
      <div className={styles.bar} style={{ width: `${progress}%` }}></div>
      <span className={styles.label}>{progress}%</span>
    </div>
  );
};

export default ProgressBar;
