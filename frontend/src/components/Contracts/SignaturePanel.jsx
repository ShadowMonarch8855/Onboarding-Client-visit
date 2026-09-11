import React, { useState } from 'react';
import { FiCheck } from 'react-icons/fi';
import styles from './SignaturePanel.module.css';

const SignaturePanel = ({ contract, onSign, onCancel }) => {
  const [signerName, setSignerName] = useState('');
  const [signed, setSigned] = useState(false);

  const handleSign = (e) => {
    e.preventDefault();
    setSigned(true);
    setTimeout(() => {
      onSign({ signerName, signedAt: new Date().toISOString() });
    }, 1000);
  };

  if (signed) {
    return (
      <div className={styles.successPanel}>
        <FiCheck className={styles.successIcon} />
        <h3>Contract Signed!</h3>
        <p>Thank you, {signerName}. The contract is now legally binding.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSign} className={styles.form}>
      <p className={styles.notice}>
        By typing your name below and clicking "Sign Contract", you agree to be legally bound by the terms of this agreement.
      </p>
      
      <div className={styles.formGroup}>
        <label className={styles.label}>Signer Name</label>
        <input 
          type="text" 
          value={signerName} 
          onChange={(e) => setSignerName(e.target.value)} 
          required 
          className={styles.input}
          placeholder="e.g. Jane Doe"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Date</label>
        <div className={styles.dateDisplay}>
          {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={onCancel} className={styles.cancelBtn}>Cancel</button>
        <button type="submit" className={styles.submitBtn}>Sign Contract</button>
      </div>
    </form>
  );
};

export default SignaturePanel;
