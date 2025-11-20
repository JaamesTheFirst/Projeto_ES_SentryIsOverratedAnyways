import { Link } from 'react-router-dom';
import styles from './ErrorsPage.module.css';
import '../styles/common.css';

const errors = [
  {
    id: 1,
    severity: 'error',
    title: "TypeError: Cannot read property 'map' of undefined",
    project: 'E-Commerce Web App',
    file: 'ProductList.jsx:45',
    time: '5 minutes ago',
    assigned: 'Unassigned',
    events: 127,
  },
  {
    id: 2,
    severity: 'error',
    title: 'Database Connection Failed',
    project: 'Backend API',
    file: 'database.ts:12',
    time: '15 minutes ago',
    assigned: 'John Smith',
    events: 234,
  },
  {
    id: 3,
    severity: 'warning',
    title: 'ReferenceError: fetch is not defined',
    project: 'API Service',
    file: 'api.service.ts:89',
    time: '1 hour ago',
    assigned: 'Sarah Johnson',
    events: 43,
  },
  {
    id: 4,
    severity: 'warning',
    title: 'Network Error: Request timeout',
    project: 'Mobile App iOS',
    file: 'NetworkManager.swift:234',
    time: '3 hours ago',
    assigned: 'Unassigned',
    events: 89,
  },
  {
    id: 5,
    severity: 'info',
    title: 'Validation Error: Invalid email format',
    project: 'E-Commerce Web App',
    file: 'LoginForm.tsx:67',
    time: '5 hours ago',
    assigned: 'Mike Wilson',
    events: 12,
  },
  {
    id: 6,
    severity: 'warning',
    title: 'Memory leak detected in component lifecycle',
    project: 'Admin Dashboard',
    file: 'DataTable.jsx:156',
    time: '1 day ago',
    assigned: 'Emma Davis',
    events: 67,
  },
  {
    id: 7,
    severity: 'error',
    title: 'Unhandled Promise Rejection: Network failure',
    project: 'Payment Gateway',
    file: 'payment.service.ts:98',
    time: '2 days ago',
    assigned: 'Tom Anderson',
    events: 178,
  },
  {
    id: 8,
    severity: 'info',
    title: 'Deprecated API warning: Using old authentication method',
    project: 'Android App',
    file: 'AuthManager.kt:45',
    time: '3 days ago',
    assigned: 'Unassigned',
    events: 23,
  },
];

export const ErrorsPage = () => {
  return (
    <main className={`${styles.container} ${styles.mainContent}`}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>All Errors</h1>
          <p className={styles.pageSubtitle}>Track and manage errors across all projects</p>
        </div>
        <div className={`${styles.flex} ${styles.gap2}`}>
          <button className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}>Export</button>
          <button className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}>Filters</button>
        </div>
      </div>

      <div className={styles.filtersSection}>
        <div className={styles.filtersRow}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>🔍</span>
            <input type="text" placeholder="Search errors by message, file, or project..." />
          </div>
          <select className={styles.formSelect} style={{ width: 'auto' }}>
            <option>All Projects</option>
            <option>Web App</option>
            <option>Mobile App</option>
            <option>Backend API</option>
          </select>
          <select className={styles.formSelect} style={{ width: 'auto' }}>
            <option>Last 7 days</option>
            <option>Last 24 hours</option>
            <option>Last 30 days</option>
            <option>All time</option>
          </select>
        </div>

        <div className={styles.filterChips}>
          <div className={`${styles.chip} ${styles.active}`}>🐛 All (1,247)</div>
          <div className={styles.chip}>🔴 Critical (234)</div>
          <div className={styles.chip}>⚠️ Warning (456)</div>
          <div className={styles.chip}>ℹ️ Info (557)</div>
          <div className={styles.chip}>✅ Resolved (863)</div>
          <div className={styles.chip}>❌ Unresolved (384)</div>
        </div>
      </div>

      <div className={styles.errorsTable}>
        <div className={styles.tableHeader}>
          <div className={`${styles.flex} ${styles.gap2}`} style={{ alignItems: 'center' }}>
            <input type="checkbox" style={{ width: '18px', height: '18px' }} />
            <span className={`${styles.textSm} ${styles.textMuted}`}>Select all</span>
          </div>
          <div className={`${styles.flex} ${styles.gap2}`}>
            <button className={`${styles.btn} ${styles.btnSm} ${styles.btnOutline}`}>Resolve Selected</button>
            <button className={`${styles.btn} ${styles.btnSm} ${styles.btnOutline}`}>Assign</button>
            <button className={`${styles.btn} ${styles.btnSm} ${styles.btnOutline}`}>Delete</button>
          </div>
        </div>

        {errors.map((error) => (
          <div key={error.id} className={styles.errorRow}>
            <div className={styles.errorCheckbox}>
              <input type="checkbox" />
            </div>
            <div className={styles.errorMain}>
              <div className={styles.errorTitleRow}>
                <span
                  className={`${styles.badge} ${
                    error.severity === 'error'
                      ? styles.badgeError
                      : error.severity === 'warning'
                      ? styles.badgeWarning
                      : styles.badgeInfo
                  }`}
                >
                  {error.severity === 'error' ? 'Critical' : error.severity === 'warning' ? 'Warning' : 'Info'}
                </span>
                <h3 className={styles.errorTitleText}>{error.title}</h3>
              </div>
              <div className={styles.errorDetails}>
                <span className={styles.errorDetailItem}>🚀 {error.project}</span>
                <span className={styles.errorDetailItem}>📁 {error.file}</span>
                <span className={styles.errorDetailItem}>🕐 {error.time}</span>
                <span className={styles.errorDetailItem}>👤 {error.assigned}</span>
              </div>
            </div>
            <div className={styles.errorCountBadge}>
              <span className={styles.errorCountNumber}>{error.events}</span>
              <span className={styles.errorCountLabel}>events</span>
            </div>
            <Link to="/error-detail" className={`${styles.btn} ${styles.btnSm} ${styles.btnOutline}`}>
              View
            </Link>
          </div>
        ))}
      </div>

      <div className={styles.pagination}>
        <div className={styles.paginationInfo}>Showing 1-8 of 1,247 errors</div>
        <div className={styles.paginationControls}>
          <button className={styles.pageBtn} disabled>
            ←
          </button>
          <button className={`${styles.pageBtn} ${styles.active}`}>1</button>
          <button className={styles.pageBtn}>2</button>
          <button className={styles.pageBtn}>3</button>
          <button className={styles.pageBtn}>...</button>
          <button className={styles.pageBtn}>157</button>
          <button className={styles.pageBtn}>→</button>
        </div>
      </div>
    </main>
  );
};
