import React from 'react';
import styles from './Pagination.module.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className={styles.container}>
      <button 
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={styles.btn}
      >
        Previous
      </button>
      <span className={styles.info}>Page {currentPage} of {totalPages}</span>
      <button 
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={styles.btn}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
