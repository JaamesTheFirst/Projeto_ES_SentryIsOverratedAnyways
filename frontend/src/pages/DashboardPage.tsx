import { Link } from 'react-router-dom';
import styles from './DashboardPage.module.css';
import '../styles/common.css';

export const DashboardPage = () => {
  return (
    <main className={`${styles.container} ${styles.mainContent}`}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>Welcome back! Here's what's happening with your projects.</p>
        </div>
        <div className={styles.quickActions}>
          <button className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}>Last 7 days ▾</button>
          <button className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}>Export Report</button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div>
              <div className={styles.statValue}>1,247</div>
              <div className={styles.statLabel}>Total Errors</div>
            </div>
            <div className={`${styles.statIcon} ${styles.error}`}>🐛</div>
          </div>
          <div className={`${styles.statTrend} ${styles.up}`}>↑ 12% from last week</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div>
              <div className={styles.statValue}>384</div>
              <div className={styles.statLabel}>Unresolved</div>
            </div>
            <div className={`${styles.statIcon} ${styles.warning}`}>⚠️</div>
          </div>
          <div className={`${styles.statTrend} ${styles.up}`}>↑ 5% from last week</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div>
              <div className={styles.statValue}>863</div>
              <div className={styles.statLabel}>Resolved</div>
            </div>
            <div className={`${styles.statIcon} ${styles.success}`}>✅</div>
          </div>
          <div className={`${styles.statTrend} ${styles.down}`}>↓ 3% from last week</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div>
              <div className={styles.statValue}>12</div>
              <div className={styles.statLabel}>Active Projects</div>
            </div>
            <div className={`${styles.statIcon} ${styles.info}`}>📁</div>
          </div>
          <div className={styles.statTrend} style={{ color: '#6b7280' }}>No change</div>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Error Trends</h2>
          <div className={`${styles.flex} ${styles.gap2}`}>
            <button className={`${styles.btn} ${styles.btnSm} ${styles.btnSecondary}`}>Day</button>
            <button className={`${styles.btn} ${styles.btnSm} ${styles.btnOutline}`}>Week</button>
            <button className={`${styles.btn} ${styles.btnSm} ${styles.btnOutline}`}>Month</button>
          </div>
        </div>
        <div className={styles.chartPlaceholder}>
          📊 Error Trends Chart
          <br />
          <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
            (Chart visualization would be implemented with Chart.js or similar)
          </span>
        </div>
      </div>

      <div className={styles.recentErrors}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Recent Errors</h2>
          <Link to="/errors" className={`${styles.btn} ${styles.btnSm} ${styles.btnOutline}`}>
            View All
          </Link>
        </div>
        <div>
          <div className={styles.errorItem}>
            <div className={styles.errorInfo}>
              <div className={styles.errorTitle}>TypeError: Cannot read property 'map' of undefined</div>
              <div className={styles.errorMeta}>
                <span>🚀 <strong>Web App</strong></span>
                <span>📁 <strong>ProductList.jsx:45</strong></span>
                <span>🕐 <strong>5 minutes ago</strong></span>
              </div>
            </div>
            <div className={`${styles.flex} ${styles.gap2}`} style={{ alignItems: 'center' }}>
              <span className={`${styles.badge} ${styles.badgeError}`}>Critical</span>
              <span className={styles.errorCount}>127 events</span>
            </div>
          </div>

          <div className={styles.errorItem}>
            <div className={styles.errorInfo}>
              <div className={styles.errorTitle}>ReferenceError: fetch is not defined</div>
              <div className={styles.errorMeta}>
                <span>🚀 <strong>API Service</strong></span>
                <span>📁 <strong>api.service.ts:89</strong></span>
                <span>🕐 <strong>1 hour ago</strong></span>
              </div>
            </div>
            <div className={`${styles.flex} ${styles.gap2}`} style={{ alignItems: 'center' }}>
              <span className={`${styles.badge} ${styles.badgeWarning}`}>Warning</span>
              <span className={styles.errorCount}>43 events</span>
            </div>
          </div>

          <div className={styles.errorItem}>
            <div className={styles.errorInfo}>
              <div className={styles.errorTitle}>Network Error: Request timeout</div>
              <div className={styles.errorMeta}>
                <span>🚀 <strong>Mobile App</strong></span>
                <span>📁 <strong>NetworkManager.swift:234</strong></span>
                <span>🕐 <strong>3 hours ago</strong></span>
              </div>
            </div>
            <div className={`${styles.flex} ${styles.gap2}`} style={{ alignItems: 'center' }}>
              <span className={`${styles.badge} ${styles.badgeWarning}`}>Warning</span>
              <span className={styles.errorCount}>89 events</span>
            </div>
          </div>

          <div className={styles.errorItem}>
            <div className={styles.errorInfo}>
              <div className={styles.errorTitle}>Database Connection Failed</div>
              <div className={styles.errorMeta}>
                <span>🚀 <strong>Backend API</strong></span>
                <span>📁 <strong>database.ts:12</strong></span>
                <span>🕐 <strong>5 hours ago</strong></span>
              </div>
            </div>
            <div className={`${styles.flex} ${styles.gap2}`} style={{ alignItems: 'center' }}>
              <span className={`${styles.badge} ${styles.badgeError}`}>Critical</span>
              <span className={styles.errorCount}>234 events</span>
            </div>
          </div>

          <div className={styles.errorItem}>
            <div className={styles.errorInfo}>
              <div className={styles.errorTitle}>Validation Error: Invalid email format</div>
              <div className={styles.errorMeta}>
                <span>🚀 <strong>Web App</strong></span>
                <span>📁 <strong>LoginForm.tsx:67</strong></span>
                <span>🕐 <strong>1 day ago</strong></span>
              </div>
            </div>
            <div className={`${styles.flex} ${styles.gap2}`} style={{ alignItems: 'center' }}>
              <span className={`${styles.badge} ${styles.badgeInfo}`}>Info</span>
              <span className={styles.errorCount}>12 events</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
