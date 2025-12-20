import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import styles from './LoginPage.module.css'; // Reuse login styles

export const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const registerData: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role?: 'user' | 'admin';
      } = {
        email,
        password,
        firstName,
        lastName,
        role,
      };
      await authService.register(registerData);

      // Registration successful, redirect to login
      navigate('/login', { 
        state: { message: 'Registration successful! Please sign in.' } 
      });
    } catch (err: any) {
      // Handle different error types
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else if (err.code === 'ERR_NETWORK' || err.message?.includes('fetch')) {
        setError('Cannot connect to server. Make sure the backend is running on http://localhost:3000');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <div className={styles.logo}>🚀</div>
          <h1>Create Account</h1>
          <p>Sign up for Error Management Platform</p>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="firstName">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              className={styles.formInput}
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="lastName">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              className={styles.formInput}
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
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
              name="new-password"
              autoComplete="new-password"
              className={styles.formInput}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
            />
            <small className={styles.textSm} style={{ color: '#6b7280', marginTop: '0.25rem', display: 'block' }}>
              Must be at least 6 characters
            </small>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="role">
              Role
            </label>
            <select
              id="role"
              className={styles.formInput}
              value={role}
              onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
              required
              disabled={loading}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <small className={styles.textSm} style={{ color: '#6b7280', marginTop: '0.25rem', display: 'block' }}>
              Select your account role
            </small>
          </div>

          <button 
            type="submit" 
            className={`${styles.btn} ${styles.btnPrimary}`}
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className={styles.formFooter}>
          <p className={`${styles.textSm} ${styles.textMuted}`}>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>

      <div className={styles.backLink}>
        <Link to="/">← Back to Home</Link>
      </div>
    </div>
  );
};

