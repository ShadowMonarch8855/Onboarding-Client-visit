import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleQuickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(email.trim(), password);
      toast.success('Login successful!');
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.error || 'Invalid credentials';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Login to ClientFlow</h2>
        <div className={styles.field}>
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@clientflow.com" />
        </div>
        <div className={styles.field}>
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Enter your password" />
        </div>
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>

        <div style={{ marginTop: '0.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
          <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 0.5rem 0', textAlign: 'center' }}>Quick Demo Logins:</p>
          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
            <button 
              type="button" 
              onClick={() => handleQuickFill('admin@clientflow.com', 'Admin@123')}
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer' }}
            >
              Admin
            </button>
            <button 
              type="button" 
              onClick={() => handleQuickFill('team1@clientflow.com', 'password123')}
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer' }}
            >
              Team Member
            </button>
            <button 
              type="button" 
              onClick={() => handleQuickFill('client@clientflow.com', 'password123')}
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer' }}
            >
              Client
            </button>
          </div>
        </div>

        <div className={styles.links}>
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
      </form>
    </div>
  );
}
