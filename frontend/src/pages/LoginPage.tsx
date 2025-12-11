import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './LoginPage.module.css';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <div className={styles.logo}>🚀</div>
          <h1>Welcome Back</h1>
          <p>Sign in to Error Management Platform</p>
        </div>

        {error && (
          <div style={{ padding: '0.75rem', background: '#fee2e2', color: '#dc2626', borderRadius: '0.5rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className={styles.formInput}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className={styles.formInput}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className={styles.flexBetween}>
            <div className={styles.checkboxGroup}>
              <input type="checkbox" id="remember" />
              <label htmlFor="remember" className={styles.textSm}>
                Remember me
              </label>
            </div>
            <a href="#" className={styles.textSm} style={{ color: '#667eea', textDecoration: 'none' }}>
              Forgot password?
            </a>
          </div>

          <button 
            type="submit" 
            className={`${styles.btn} ${styles.btnPrimary}`} 
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className={styles.divider}>
          <span>or continue with</span>
        </div>

        <div className={styles.socialLogin}>
          <button className={styles.socialBtn}>🔵 Google</button>
          <button className={styles.socialBtn}>⚫ GitHub</button>
        </div>

        <div className={styles.formFooter}>
          <p className={`${styles.textSm} ${styles.textMuted}`}>
            Don't have an account? <a href="#">Sign up</a>
          </p>
        </div>
      </div>

      <div className={styles.backLink}>
        <Link to="/">← Back to Home</Link>
      </div>
    </div>
  );
};

