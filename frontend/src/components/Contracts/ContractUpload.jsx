import React, { useState } from 'react';
import styles from './ContractUpload.module.css';

const ContractUpload = ({ projects, onUpload, onCancel }) => {
  const [formData, setFormData] = useState({
    projectId: '',
    file: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.file) return alert('Please select a file');
    
    const data = new FormData();
    data.append('projectId', formData.projectId);
    data.append('file', formData.file);
    
    // Fallback if not using FormData API properly based on requirements:
    onUpload({ projectId: formData.projectId, file: formData.file.name });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Select Project</label>
        <select 
          name="projectId" 
          value={formData.projectId} 
          onChange={handleChange} 
          required 
          className={styles.select}
        >
          <option value="">Choose a project...</option>
          {projects.map(p => (
            <option key={p._id || p.id} value={p._id || p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Upload PDF Contract</label>
        <div className={styles.dropzone}>
          <input 
            type="file" 
            accept=".pdf"
            onChange={handleFileChange}
            required
            className={styles.fileInput}
          />
          <div className={styles.droptext}>
            {formData.file ? formData.file.name : 'Drag & drop or click to browse (.pdf)'}
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={onCancel} className={styles.cancelBtn}>Cancel</button>
        <button type="submit" className={styles.submitBtn}>Upload Contract</button>
      </div>
    </form>
  );
};

export default ContractUpload;
