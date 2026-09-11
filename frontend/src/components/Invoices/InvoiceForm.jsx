import React, { useState } from 'react';
import styles from './InvoiceForm.module.css';

const InvoiceForm = ({ projects, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    projectId: '',
    amount: '',
    dueDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount)
    });
  };

  // Mock invoice number for preview
  const invoicePreview = `INV-${Math.floor(Math.random() * 9000) + 1000}`;

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Invoice Number (Auto-generated)</label>
        <input 
          type="text" 
          value={invoicePreview} 
          disabled 
          className={styles.inputDisabled}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Project</label>
        <select 
          name="projectId" 
          value={formData.projectId} 
          onChange={handleChange} 
          required 
          className={styles.select}
        >
          <option value="">Select a project...</option>
          {projects.map(p => (
            <option key={p._id || p.id} value={p._id || p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Amount ($)</label>
        <input 
          type="number" 
          name="amount" 
          value={formData.amount} 
          onChange={handleChange} 
          required 
          min="0" 
          step="0.01" 
          className={styles.input}
          placeholder="0.00"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Due Date</label>
        <input 
          type="date" 
          name="dueDate" 
          value={formData.dueDate} 
          onChange={handleChange} 
          required 
          className={styles.input}
        />
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={onCancel} className={styles.cancelBtn} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Creating...' : 'Create Invoice'}
        </button>
      </div>
    </form>
  );
};

export default InvoiceForm;
