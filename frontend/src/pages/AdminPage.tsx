import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/admin.service';
import { User, ErrorGroup, ErrorFilters } from '../types';
import { ErrorSeverity, ErrorStatus } from '../types';
import styles from './AdminPage.module.css';
import '../styles/common.css';

export const AdminPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'errors'>('users');
  const [errorFilters, setErrorFilters] = useState<ErrorFilters>({
    dateRange: '7d',
    page: 1,
    limit: 20,
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminService.getAllUsers(),
  });

  const { data: errorsData, isLoading: errorsLoading } = useQuery({
    queryKey: ['admin-errors', errorFilters],
    queryFn: () => adminService.getAllErrors(errorFilters),
    enabled: activeTab === 'errors',
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: 'user' | 'admin' }) =>
      adminService.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => adminService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  const filteredUsers = users?.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchLower) ||
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower)
    );
  }) || [];

  const handleRoleChange = (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      updateRoleMutation.mutate({ userId, role: newRole });
    }
  };

  const handleDeleteUser = (user: User) => {
    if (window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName} (${user.email})? This action cannot be undone.`)) {
      deleteUserMutation.mutate(user.id);
    }
  };

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

  if (usersLoading && activeTab === 'users') {
    return (
      <main className={`${styles.container} ${styles.mainContent}`}>
        <div>Loading...</div>
      </main>
    );
  }

  return (
    <main className={`${styles.container} ${styles.mainContent}`}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Admin Dashboard</h1>
          <p className={styles.pageSubtitle}>Manage users, errors, and system settings</p>
        </div>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'users' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 User Management
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'errors' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('errors')}
        >
          🐛 Error Management
        </button>
      </div>

      {activeTab === 'users' && (
        <>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{users?.length || 0}</div>
              <div className={styles.statLabel}>Total Users</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>
                {users?.filter((u) => u.role === 'admin').length || 0}
              </div>
              <div className={styles.statLabel}>Admins</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>
                {users?.filter((u) => u.role === 'user').length || 0}
              </div>
              <div className={styles.statLabel}>Regular Users</div>
            </div>
          </div>

          <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>User Management</h2>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.usersTable}>
          {filteredUsers.length === 0 ? (
            <div className={styles.emptyState}>
              {users?.length === 0 ? 'No users found' : 'No users match your search'}
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className={styles.userInfo}>
                        <div className={styles.avatar}>
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </div>
                        <div>
                          <div className={styles.userName}>
                            {user.firstName} {user.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <select
                        className={`${styles.roleSelect} ${
                          user.role === 'admin' ? styles.roleAdmin : styles.roleUser
                        }`}
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
                        disabled={updateRoleMutation.isPending}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                        onClick={() => handleDeleteUser(user)}
                        disabled={deleteUserMutation.isPending}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
        </>
      )}

      {activeTab === 'errors' && (
        <>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{errorsData?.total || 0}</div>
              <div className={styles.statLabel}>Total Errors</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>
                {errorsData?.items?.filter((e) => e.status === 'unresolved').length || 0}
              </div>
              <div className={styles.statLabel}>Unresolved</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>
                {errorsData?.items?.filter((e) => e.severity === 'critical' || e.severity === 'error').length || 0}
              </div>
              <div className={styles.statLabel}>Critical</div>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>All Errors</h2>
              <div className={styles.filtersRow}>
                <div className={styles.searchBox}>
                  <span className={styles.searchIcon}>🔍</span>
                  <input
                    type="text"
                    placeholder="Search errors..."
                    value={errorFilters.search || ''}
                    onChange={(e) => setErrorFilters({ ...errorFilters, search: e.target.value, page: 1 })}
                  />
                </div>
                <select
                  className={styles.formSelect}
                  value={errorFilters.status || ''}
                  onChange={(e) => setErrorFilters({ ...errorFilters, status: e.target.value as ErrorStatus || undefined, page: 1 })}
                >
                  <option value="">All Status</option>
                  <option value="unresolved">Unresolved</option>
                  <option value="resolved">Resolved</option>
                  <option value="ignored">Ignored</option>
                </select>
                <select
                  className={styles.formSelect}
                  value={errorFilters.severity || ''}
                  onChange={(e) => setErrorFilters({ ...errorFilters, severity: e.target.value as ErrorSeverity || undefined, page: 1 })}
                >
                  <option value="">All Severity</option>
                  <option value="critical">Critical</option>
                  <option value="error">Error</option>
                  <option value="warning">Warning</option>
                  <option value="info">Info</option>
                </select>
              </div>
            </div>

            {errorsLoading ? (
              <div className={styles.emptyState}>Loading errors...</div>
            ) : errorsData?.items.length === 0 ? (
              <div className={styles.emptyState}>No errors found</div>
            ) : (
              <div className={styles.errorsList}>
                {errorsData?.items.map((error) => (
                  <Link
                    key={error.id}
                    to={`/error-detail/${error.id}`}
                    className={styles.errorCard}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div className={styles.errorCardHeader}>
                      <div>
                        <h3 className={styles.errorCardTitle}>
                          {error.errorType}: {error.normalizedMessage}
                        </h3>
                        <div className={styles.errorCardMeta}>
                          {error.project && <span>🚀 {error.project.name}</span>}
                          {error.file && <span>📁 {error.file}{error.line ? `:${error.line}` : ''}</span>}
                          <span>🕐 {formatTimeAgo(error.lastSeenAt)}</span>
                        </div>
                      </div>
                      <div className={styles.errorCardBadges}>
                        <span
                          className={`${styles.badge} ${
                            error.severity === 'critical' || error.severity === 'error'
                              ? styles.badgeError
                              : error.severity === 'warning'
                              ? styles.badgeWarning
                              : styles.badgeInfo
                          }`}
                        >
                          {error.severity}
                        </span>
                        <span className={styles.badge}>{error.status}</span>
                        <span className={styles.badge}>{error.occurrenceCount} events</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {errorsData && errorsData.totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.pageBtn}
                  disabled={errorFilters.page === 1}
                  onClick={() => setErrorFilters({ ...errorFilters, page: (errorFilters.page || 1) - 1 })}
                >
                  ←
                </button>
                <span>
                  Page {errorFilters.page || 1} of {errorsData.totalPages}
                </span>
                <button
                  className={styles.pageBtn}
                  disabled={(errorFilters.page || 1) === errorsData.totalPages}
                  onClick={() => setErrorFilters({ ...errorFilters, page: (errorFilters.page || 1) + 1 })}
                >
                  →
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
};


