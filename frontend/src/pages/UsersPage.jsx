import React, { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Modal from '../components/Common/Modal';
import StatusBadge from '../components/Common/StatusBadge';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import styles from './UsersPage.module.css';

import { getUsers, register } from '../api/auth.api';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client'
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      setUsers(res.data || []);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await register(formData);
      toast.success(`${formData.role === 'client' ? 'Client' : 'User'} account created successfully!`);
      setIsModalOpen(false);
      setFormData({ name: '', email: '', password: '', role: 'client' });
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>User Management</h1>
        <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
          <FiPlus /> Add User
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td className={styles.userName}>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={styles.roleBadge}>{user.role.replace('_', ' ')}</span>
                  </td>
                  <td><StatusBadge status={user.status} /></td>
                  <td>
                    <button className={styles.actionBtn}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New User">
        <form onSubmit={handleCreateUser} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Full Name</label>
            <input 
              type="text" 
              required 
              className={styles.input} 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. John Client"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Email Address</label>
            <input 
              type="email" 
              required 
              className={styles.input} 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="client@company.com"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Password</label>
            <input 
              type="password" 
              required 
              className={styles.input} 
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter secure password"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Role</label>
            <select 
              className={styles.input}
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="client">Client</option>
              <option value="team_member">Team Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className={styles.actions}>
            <button type="button" onClick={() => setIsModalOpen(false)} className={styles.cancelBtn}>Cancel</button>
            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UsersPage;
