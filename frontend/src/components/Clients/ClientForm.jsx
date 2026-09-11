import React, { useState } from 'react';
import styles from './ClientForm.module.css';

const ClientForm = ({ initialData, onSubmit, loading, onCancel }) => {
  const [formData, setFormData] = useState(initialData || {
    companyName: '',
    contactName: '',
    email: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label>Company Name</label>
        <input required type="text" name="companyName" value={formData.companyName} onChange={handleChange} />
      </div>
      <div className={styles.field}>
        <label>Contact Name</label>
        <input required type="text" name="contactName" value={formData.contactName} onChange={handleChange} />
      </div>
      <div className={styles.field}>
        <label>Email</label>
        <input required type="email" name="email" value={formData.email} onChange={handleChange} />
      </div>
      <div className={styles.field}>
        <label>Phone</label>
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
      </div>
      <div className={styles.actions}>
        <button type="button" onClick={onCancel} className="btn" disabled={loading}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save Client'}
        </button>
      </div>
    </form>
  );
};

export default ClientForm;
