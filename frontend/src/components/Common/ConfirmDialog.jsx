import React from 'react';
import Modal from './Modal';
import styles from './ConfirmDialog.module.css';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', danger = false, variant }) => {
  const isDanger = danger || variant === 'danger';
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className={styles.body}>
        <p>{message}</p>
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button 
            className={`${styles.confirmBtn} ${isDanger ? styles.danger : ''}`} 
            onClick={() => { onConfirm(); }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
