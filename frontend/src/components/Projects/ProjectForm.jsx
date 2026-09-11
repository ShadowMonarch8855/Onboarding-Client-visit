import React, { useState } from 'react';
import styles from './ProjectForm.module.css';

const ProjectForm = ({ clients, users, initialData, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    clientId: '',
    assignedUserId: '',
    timezone: 'UTC',
    status: 'active'
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <form className={styles.form} onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
      <div className={styles.field}>
        <label>Project Name</label>
        <input required type="text" name="name" value={formData.name} onChange={handleChange} />
      </div>
      <div className={styles.field}>
        <label>Client</label>
        <select required name="clientId" value={formData.clientId} onChange={handleChange}>
          <option value="">Select Client</option>
          {clients?.map(c => <option key={c._id} value={c._id}>{c.companyName}</option>)}
        </select>
      </div>
      <div className={styles.field}>
        <label>Assigned User</label>
        <select name="assignedUserId" value={formData.assignedUserId} onChange={handleChange}>
          <option value="">Unassigned</option>
          {users?.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
        </select>
      </div>
      <div className={styles.field}>
        <label>Status</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="on_hold">On Hold</option>
        </select>
      </div>
      <div className={styles.actions}>
        <button type="button" onClick={onCancel} className="btn">Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>Save</button>
      </div>
    </form>
  );
};

export default ProjectForm;
