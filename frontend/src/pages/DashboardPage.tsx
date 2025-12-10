import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service';
import styles from './DashboardPage.module.css';
import '../styles/common.css';

export const DashboardPage = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getStats(),
  });

  if (isLoading) {
    return (
      <main className={`${styles.container} ${styles.mainContent}`}>
        <div>Loading dashboard...</div>
      </main>
    );
  }

  const recentErrors = stats?.recentErrors || [];
  const totalErrors = stats?.totalErrors || 0;
  const unresolved = stats?.unresolved || 0;
  const resolved = stats?.resolved || 0;
  const activeProjects = stats?.activeProjects || 0;

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

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
              <div className={styles.statValue}>{totalErrors.toLocaleString()}</div>
              <div className={styles.statLabel}>Total Errors</div>
            </div>
            <div className={`${styles.statIcon} ${styles.error}`}>🐛</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div>
              <div className={styles.statValue}>{unresolved.toLocaleString()}</div>
              <div className={styles.statLabel}>Unresolved</div>
            </div>
            <div className={`${styles.statIcon} ${styles.warning}`}>⚠️</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div>
              <div className={styles.statValue}>{resolved.toLocaleString()}</div>
              <div className={styles.statLabel}>Resolved</div>
            </div>
            <div className={`${styles.statIcon} ${styles.success}`}>✅</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div>
              <div className={styles.statValue}>{activeProjects}</div>
              <div className={styles.statLabel}>Active Projects</div>
            </div>
            <div className={`${styles.statIcon} ${styles.info}`}>📁</div>
          </div>
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
          {recentErrors.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
              No errors yet
            </div>
          ) : (
            recentErrors.map((error) => (
              <Link
                key={error.id}
                to={`/error-detail/${error.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className={styles.errorItem}>
                  <div className={styles.errorInfo}>
                    <div className={styles.errorTitle}>
                      {error.errorType}: {error.normalizedMessage}
                    </div>
                    <div className={styles.errorMeta}>
                      {error.project && <span>🚀 <strong>{error.project.name}</strong></span>}
                      {error.file && <span>📁 <strong>{error.file}{error.line ? `:${error.line}` : ''}</strong></span>}
                      <span>🕐 <strong>{formatTimeAgo(error.lastSeenAt)}</strong></span>
                    </div>
                  </div>
                  <div className={`${styles.flex} ${styles.gap2}`} style={{ alignItems: 'center' }}>
                    <span
                      className={`${styles.badge} ${
                        error.severity === 'critical' || error.severity === 'error'
                          ? styles.badgeError
                          : error.severity === 'warning'
                          ? styles.badgeWarning
                          : styles.badgeInfo
                      }`}
                    >
                      {error.severity.charAt(0).toUpperCase() + error.severity.slice(1)}
                    </span>
                    <span className={styles.errorCount}>{error.occurrenceCount} events</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
};
