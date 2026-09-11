import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { forgotPassword } from '../api/auth.api';
import styles from './ForgotPasswordPage.module.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      await forgotPassword(email);
      setSubmitted(true);
      toast.success('Reset link sent!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.card}>
        <div className={styles.logoContainer}>
          <div className={styles.logo}>ClientFlow</div>
        </div>
        
        <h2 className={styles.title}>Reset your password</h2>
        
        {submitted ? (
          <div className={styles.successMessage}>
            <p>Check your email for reset instructions.</p>
            <p className={styles.subText}>If an account exists for {email}, we've sent a password reset link.</p>
            <Link to="/login" className={styles.backLink}>Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter your email address and we'll send you a link to reset your password.
            </p>
            
            <div className={styles.formGroup}>
              <label htmlFor="email">Email address</label>
              <input 
                id="email"
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
                placeholder="you@company.com"
                disabled={loading}
              />
            </div>
            
            <button type="submit" className={styles.submitBtn} disabled={loading || !email}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            
            <div className={styles.footer}>
              <Link to="/login" className={styles.backLink}>Back to Login</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
