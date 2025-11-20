import { Link } from 'react-router-dom';
import styles from './ErrorDetailPage.module.css';
import '../styles/common.css';

export const ErrorDetailPage = () => {
  return (
    <main className={`${styles.container} ${styles.mainContent}`}>
      <div className={styles.breadcrumb}>
        <Link to="/dashboard">Dashboard</Link>
        <span className={styles.breadcrumbSeparator}>›</span>
        <Link to="/errors">Errors</Link>
        <span className={styles.breadcrumbSeparator}>›</span>
        <span>Error Details</span>
      </div>

      <div className={styles.errorHeader}>
        <div className={styles.errorTitleSection}>
          <div className={styles.errorTitleMain}>
            <div className={`${styles.flex} ${styles.gap2}`} style={{ alignItems: 'center', marginBottom: '0.75rem' }}>
              <span className={`${styles.badge} ${styles.badgeError}`}>Critical</span>
              <span className={styles.badge} style={{ background: '#f3f4f6', color: '#1f2937' }}>
                Unresolved
              </span>
            </div>
            <h1>TypeError: Cannot read property 'map' of undefined</h1>
          </div>
          <div className={styles.errorActions}>
            <button className={`${styles.btn} ${styles.btnSuccess} ${styles.btnSm}`}>✓ Resolve</button>
            <button className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}>Assign</button>
            <button className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}>Ignore</button>
            <button className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}>Delete</button>
          </div>
        </div>

        <div className={styles.errorMetaGrid}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Project</span>
            <span className={styles.metaValue}>🚀 E-Commerce Web App</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Environment</span>
            <span className={styles.metaValue}>Production</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>First Seen</span>
            <span className={styles.metaValue}>Nov 10, 2025 14:23</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Last Seen</span>
            <span className={styles.metaValue}>Nov 14, 2025 16:45</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Total Events</span>
            <span className={styles.metaValue} style={{ color: '#ef4444', fontWeight: 700 }}>
              127 occurrences
            </span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Affected Users</span>
            <span className={styles.metaValue}>43 users</span>
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.mainSection}>
          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>Stack Trace</h2>
            <div className={styles.stackTrace}>
              <div className={`${styles.stackTraceLine} ${styles.stackTraceError}`}>
                TypeError: Cannot read property 'map' of undefined
              </div>
              <div className={styles.stackTraceLine}>
                at <span className={styles.stackTraceFile}>ProductList.render</span> (
                <span className={styles.stackTraceFile}>ProductList.jsx</span>:
                <span className={styles.stackTraceLineNumber}>45</span>:
                <span className={styles.stackTraceLineNumber}>12</span>)
              </div>
              <div className={styles.stackTraceLine}>
                at <span className={styles.stackTraceFile}>finishClassComponent</span> (
                react-dom.production.min.js:
                <span className={styles.stackTraceLineNumber}>8891</span>:
                <span className={styles.stackTraceLineNumber}>31</span>)
              </div>
              <div className={styles.stackTraceLine}>
                at <span className={styles.stackTraceFile}>updateClassComponent</span> (
                react-dom.production.min.js:
                <span className={styles.stackTraceLineNumber}>8856</span>:
                <span className={styles.stackTraceLineNumber}>24</span>)
              </div>
            </div>
          </div>

          <div className={styles.sectionCard}>
            <div className={styles.tabs}>
              <div className={`${styles.tab} ${styles.active}`}>Context</div>
              <div className={styles.tab}>Request</div>
              <div className={styles.tab}>User Agent</div>
              <div className={styles.tab}>Breadcrumbs</div>
            </div>
            <div className={styles.contextData}>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>URL:</strong> https://example.com/products
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Browser:</strong> Chrome 119.0.0.0
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>OS:</strong> Windows 10
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Screen:</strong> 1920x1080
              </div>
            </div>
          </div>

          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>Occurrences Over Time</h2>
            <div className={styles.occurrenceChart}>
              📈 Error frequency chart (Last 7 days)
              <br />
              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>(Would be implemented with Chart.js)</span>
            </div>
          </div>
        </div>

        <div className={styles.sidebarSection}>
          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>Activity Timeline</h2>
            <div className={styles.timeline}>
              <div className={styles.timelineItem}>
                <div className={styles.timelineIcon}>🐛</div>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineTitle}>Error first occurred</div>
                  <div className={styles.timelineMeta}>Nov 10, 2025 at 14:23</div>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineIcon}>👤</div>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineTitle}>Assigned to John Smith</div>
                  <div className={styles.timelineMeta}>Nov 11, 2025 at 09:15</div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>Top Affected Users</h2>
            <div className={styles.affectedUsers}>
              <div className={styles.userItem}>
                <div className={styles.userAvatar}>AM</div>
                <div className={styles.userInfo}>
                  <div className={styles.userName}>Alice Miller</div>
                  <div className={styles.userEmail}>alice@example.com</div>
                </div>
                <div className={styles.userCount}>23×</div>
              </div>
              <div className={styles.userItem}>
                <div className={styles.userAvatar}>BJ</div>
                <div className={styles.userInfo}>
                  <div className={styles.userName}>Bob Johnson</div>
                  <div className={styles.userEmail}>bob@example.com</div>
                </div>
                <div className={styles.userCount}>18×</div>
              </div>
            </div>
            <button className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`} style={{ width: '100%', marginTop: '0.5rem' }}>
              View All Users
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
