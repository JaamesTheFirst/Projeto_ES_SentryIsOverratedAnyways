import { Link } from 'react-router-dom';
import styles from './LoginPage.module.css';

export const LoginPage = () => {
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <div className={styles.logo}>🚀</div>
          <h1>Welcome Back</h1>
          <p>Sign in to Error Management Platform</p>
        </div>

        <form>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className={styles.formInput}
              placeholder="you@example.com"
              required
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
              required
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

          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} style={{ width: '100%' }}>
            Sign In
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

