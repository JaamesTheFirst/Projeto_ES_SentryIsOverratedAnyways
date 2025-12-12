import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { errorsService, ErrorFilters } from '../services/errors.service';
import styles from './ErrorsPage.module.css';
import '../styles/common.css';

export const ErrorsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<ErrorFilters>({
    dateRange: '7d',
    page: 1,
    limit: 20,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['errors', filters],
    queryFn: () => errorsService.getAll(filters),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'resolved' | 'unresolved' | 'ignored' }) =>
      errorsService.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['errors'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const errors = data?.items || [];
  const total = data?.total || 0;

  return (
    <main className={`${styles.container} ${styles.mainContent}`}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>All Errors</h1>
          <p className={styles.pageSubtitle}>Track and manage errors across all projects</p>
        </div>
        <div className={`${styles.flex} ${styles.gap2}`}>
          <button className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}>Export</button>
          <Link to="/register-incident" className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}>
            + Report Error
          </Link>
        </div>
      </div>

      <div className={styles.filtersSection}>
        <div className={styles.filtersRow}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search errors by message, file, or project..."
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            />
          </div>
          <select
            className={styles.formSelect}
            style={{ width: 'auto' }}
            value={filters.projectId || ''}
            onChange={(e) => setFilters({ ...filters, projectId: e.target.value || undefined, page: 1 })}
          >
            <option value="">All Projects</option>
            {/* TODO: Load projects dynamically */}
          </select>
          <select
            className={styles.formSelect}
            style={{ width: 'auto' }}
            value={filters.dateRange || '7d'}
            onChange={(e) => setFilters({ ...filters, dateRange: e.target.value as any, page: 1 })}
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="all">All time</option>
          </select>
        </div>

        <div className={styles.filterChips}>
          <div
            className={`${styles.chip} ${!filters.status ? styles.active : ''}`}
            onClick={() => setFilters({ ...filters, status: undefined })}
          >
            🐛 All ({total})
          </div>
          <div
            className={`${styles.chip} ${filters.severity === 'error' ? styles.active : ''}`}
            onClick={() => setFilters({ ...filters, severity: filters.severity === 'error' ? undefined : 'error' })}
          >
            🔴 Critical ({errors.filter((e) => e.severity === 'error' || e.severity === 'critical').length})
          </div>
          <div
            className={`${styles.chip} ${filters.severity === 'warning' ? styles.active : ''}`}
            onClick={() => setFilters({ ...filters, severity: filters.severity === 'warning' ? undefined : 'warning' })}
          >
            ⚠️ Warning ({errors.filter((e) => e.severity === 'warning').length})
          </div>
          <div
            className={`${styles.chip} ${filters.status === 'resolved' ? styles.active : ''}`}
            onClick={() => setFilters({ ...filters, status: filters.status === 'resolved' ? undefined : 'resolved' })}
          >
            ✅ Resolved ({errors.filter((e) => e.status === 'resolved').length})
          </div>
          <div
            className={`${styles.chip} ${filters.status === 'unresolved' ? styles.active : ''}`}
            onClick={() => setFilters({ ...filters, status: filters.status === 'unresolved' ? undefined : 'unresolved' })}
          >
            ❌ Unresolved ({errors.filter((e) => e.status === 'unresolved').length})
          </div>
        </div>
      </div>

      {isLoading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading errors...</div>
      ) : (
        <>
          <div className={styles.errorsTable}>
            {errors.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                No errors found
              </div>
            ) : (
              errors.map((error) => (
                <div key={error.id} className={styles.errorRow}>
                  <div className={styles.errorMain}>
                    <div className={styles.errorTitleRow}>
                      <span
                        className={`${styles.badge} ${
                          error.severity === 'error' || error.severity === 'critical'
                            ? styles.badgeError
                            : error.severity === 'warning'
                            ? styles.badgeWarning
                            : styles.badgeInfo
                        }`}
                      >
                        {error.severity === 'error' || error.severity === 'critical'
                          ? 'Critical'
                          : error.severity === 'warning'
                          ? 'Warning'
                          : 'Info'}
                      </span>
                      <h3 className={styles.errorTitleText}>
                        {error.errorType}: {error.normalizedMessage}
                      </h3>
                    </div>
                    <div className={styles.errorDetails}>
                      {error.project && <span className={styles.errorDetailItem}>🚀 {error.project.name}</span>}
                      {error.file && (
                        <span className={styles.errorDetailItem}>
                          📁 {error.file}
                          {error.line ? `:${error.line}` : ''}
                        </span>
                      )}
                      <span className={styles.errorDetailItem}>🕐 {formatTimeAgo(error.lastSeenAt)}</span>
                      {error.assignedTo && (
                        <span className={styles.errorDetailItem}>
                          👤 {error.assignedTo.firstName} {error.assignedTo.lastName}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={styles.errorCountBadge}>
                    <span className={styles.errorCountNumber}>{error.occurrenceCount}</span>
                    <span className={styles.errorCountLabel}>events</span>
                  </div>
                  <Link to={`/error-detail/${error.id}`} className={`${styles.btn} ${styles.btnSm} ${styles.btnOutline}`}>
                    View
                  </Link>
                </div>
              ))
            )}
          </div>

          {data && data.totalPages > 1 && (
            <div className={styles.pagination}>
              <div className={styles.paginationInfo}>
                Showing {((filters.page || 1) - 1) * (filters.limit || 20) + 1}-
                {Math.min((filters.page || 1) * (filters.limit || 20), total)} of {total} errors
              </div>
              <div className={styles.paginationControls}>
                <button
                  className={styles.pageBtn}
                  disabled={(filters.page || 1) === 1}
                  onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                >
                  ←
                </button>
                {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      className={`${styles.pageBtn} ${(filters.page || 1) === page ? styles.active : ''}`}
                      onClick={() => setFilters({ ...filters, page })}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  className={styles.pageBtn}
                  disabled={(filters.page || 1) === data.totalPages}
                  onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                >
                  →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
};
