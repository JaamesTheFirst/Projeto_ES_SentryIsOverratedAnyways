import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { errorsService } from '../services/errors.service';
import styles from './ErrorDetailPage.module.css';
import '../styles/common.css';

export const ErrorDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: error, isLoading } = useQuery({
    queryKey: ['error', id],
    queryFn: () => errorsService.getById(id!),
    enabled: !!id,
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: 'resolved' | 'unresolved' | 'ignored') =>
      errorsService.update(id!, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['error', id] });
      queryClient.invalidateQueries({ queryKey: ['errors'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => errorsService.delete(id!),
    onSuccess: () => {
      navigate('/errors');
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <main className={`${styles.container} ${styles.mainContent}`}>
        <div>Loading error details...</div>
      </main>
    );
  }

  if (!error) {
    return (
      <main className={`${styles.container} ${styles.mainContent}`}>
        <div>Error not found</div>
      </main>
    );
  }

  const firstOccurrence = error.occurrences?.[0];

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
              <span className={styles.badge} style={{ background: '#f3f4f6', color: '#1f2937' }}>
                {error.status.charAt(0).toUpperCase() + error.status.slice(1)}
              </span>
            </div>
            <h1>
              {error.errorType}: {error.normalizedMessage}
            </h1>
          </div>
          <div className={styles.errorActions}>
            {error.status !== 'resolved' && (
              <button
                className={`${styles.btn} ${styles.btnSuccess} ${styles.btnSm}`}
                onClick={() => updateStatusMutation.mutate('resolved')}
                disabled={updateStatusMutation.isPending}
              >
                ✓ Resolve
              </button>
            )}
            <button className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}>Assign</button>
            <button
              className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}
              onClick={() => updateStatusMutation.mutate('ignored')}
            >
              Ignore
            </button>
            <button
              className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
              onClick={() => {
                if (confirm('Are you sure you want to delete this error?')) {
                  deleteMutation.mutate();
                }
              }}
              disabled={deleteMutation.isPending}
            >
              Delete
            </button>
          </div>
        </div>

        <div className={styles.errorMetaGrid}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Project</span>
            <span className={styles.metaValue}>
              {error.project?.icon || '🚀'} {error.project?.name || 'Unknown'}
            </span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Environment</span>
            <span className={styles.metaValue}>{firstOccurrence?.metadata?.environment || 'Unknown'}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>First Seen</span>
            <span className={styles.metaValue}>{formatDate(error.firstSeenAt)}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Last Seen</span>
            <span className={styles.metaValue}>{formatDate(error.lastSeenAt)}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Total Events</span>
            <span className={styles.metaValue} style={{ color: '#ef4444', fontWeight: 700 }}>
              {error.occurrenceCount} occurrences
            </span>
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.mainSection}>
          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>Stack Trace</h2>
            <div className={styles.stackTrace}>
              {firstOccurrence?.stackTrace ? (
                firstOccurrence.stackTrace.split('\n').map((line, i) => (
                  <div
                    key={i}
                    className={`${styles.stackTraceLine} ${i === 0 ? styles.stackTraceError : ''}`}
                  >
                    {line}
                  </div>
                ))
              ) : (
                <div className={styles.stackTraceLine}>No stack trace available</div>
              )}
            </div>
          </div>

          <div className={styles.sectionCard}>
            <div className={styles.tabs}>
              <div className={`${styles.tab} ${styles.active}`}>Context</div>
            </div>
            <div className={styles.contextData}>
              {firstOccurrence?.metadata?.url && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>URL:</strong> {firstOccurrence.metadata.url}
                </div>
              )}
              {firstOccurrence?.metadata?.browser && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Browser:</strong> {firstOccurrence.metadata.browser}
                </div>
              )}
              {firstOccurrence?.metadata?.os && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>OS:</strong> {firstOccurrence.metadata.os}
                </div>
              )}
              {firstOccurrence?.metadata?.framework && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Framework:</strong> {firstOccurrence.metadata.framework}
                </div>
              )}
              {(!firstOccurrence?.metadata || Object.keys(firstOccurrence.metadata).length === 0) && (
                <div style={{ color: '#6b7280' }}>No additional context available</div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.sidebarSection}>
          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>Error Information</h2>
            <div style={{ padding: '1rem 0' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>File:</strong> {error.file || 'Unknown'}
              </div>
              {error.line && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Line:</strong> {error.line}
                </div>
              )}
              {error.functionName && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Function:</strong> {error.functionName}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
