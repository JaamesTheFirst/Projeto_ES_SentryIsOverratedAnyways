import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsService } from '../services/projects.service';
import { CreateProjectModal } from '../components/CreateProjectModal';
import styles from './ProjectsPage.module.css';
import '../styles/common.css';

export const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsService.getAll(),
  });

  const filteredProjects = projects?.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  if (isLoading) {
    return (
      <main className={`${styles.container} ${styles.mainContent}`}>
        <div>Loading projects...</div>
      </main>
    );
  }

  return (
    <main className={`${styles.container} ${styles.mainContent}`}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Projects</h1>
          <p className={styles.pageSubtitle}>Manage and monitor all your applications</p>
        </div>
        <button 
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={() => setIsCreateModalOpen(true)}
        >
          + Create New Project
        </button>
      </div>

      <div className={styles.filtersBar}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles.filterGroup}>
          <label className={`${styles.textSm} ${styles.textMuted}`}>Status:</label>
          <select
            className={styles.formSelect}
            style={{ width: 'auto', padding: '0.5rem 1rem' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Projects</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      <div className={styles.projectsGrid}>
        {filteredProjects.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
            {projects?.length === 0 ? 'No projects yet. Create your first project!' : 'No projects match your filters.'}
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div key={project.id} className={styles.projectCard}>
              <div className={styles.projectIcon}>{project.icon || '📁'}</div>
              <div className={styles.projectHeader}>
                <div style={{ flex: 1 }}>
                  <h3 className={styles.projectTitle}>{project.name}</h3>
                  <div className={`${styles.flex} ${styles.gap1}`} style={{ marginBottom: '0.5rem' }}>
                    <span
                      className={
                        project.status === 'active'
                          ? styles.statusDotActive
                          : project.status === 'maintenance'
                          ? styles.statusDotWarning
                          : styles.statusDotWarning
                      }
                    ></span>
                    <span className={`${styles.textSm} ${styles.textMuted}`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              <p className={styles.projectDescription}>{project.description || 'No description'}</p>
              <div className={styles.projectStats}>
                <div className={styles.projectStat}>
                  <div className={styles.projectStatValue}>-</div>
                  <div className={styles.projectStatLabel}>Errors</div>
                </div>
                <div className={styles.projectStat}>
                  <div className={styles.projectStatValue}>-</div>
                  <div className={styles.projectStatLabel}>Unresolved</div>
                </div>
                <div className={styles.projectStat}>
                  <div className={styles.projectStatValue}>-</div>
                  <div className={styles.projectStatLabel}>Last Error</div>
                </div>
              </div>
              <div className={styles.projectFooter}>
                <div className={styles.projectMeta}>Updated {formatTimeAgo(project.updatedAt)}</div>
                <button className={`${styles.btn} ${styles.btnSm} ${styles.btnOutline}`}>View Details</button>
              </div>
            </div>
          ))
        )}
      </div>

      <CreateProjectModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </main>
  );
};
