import { Link } from 'react-router-dom';
import styles from './ProjectsPage.module.css';
import '../styles/common.css';

const projects = [
  {
    icon: '🌐',
    title: 'E-Commerce Web App',
    status: 'active',
    description: 'Main customer-facing e-commerce platform built with React and Node.js',
    errors: 342,
    unresolved: 89,
    lastError: '24h',
    updated: 'Updated 2 hours ago',
  },
  {
    icon: '📱',
    title: 'Mobile App iOS',
    status: 'active',
    description: 'Native iOS application built with Swift for enhanced mobile experience',
    errors: 127,
    unresolved: 23,
    lastError: '1h',
    updated: 'Updated 5 hours ago',
  },
  {
    icon: '🤖',
    title: 'Android App',
    status: 'active',
    description: 'Native Android application built with Kotlin for Google Play Store',
    errors: 298,
    unresolved: 67,
    lastError: '3h',
    updated: 'Updated 1 day ago',
  },
  {
    icon: '⚙️',
    title: 'Backend API',
    status: 'active',
    description: 'REST API service handling all backend operations with NestJS',
    errors: 156,
    unresolved: 12,
    lastError: '30m',
    updated: 'Updated 30 minutes ago',
  },
  {
    icon: '💳',
    title: 'Payment Gateway',
    status: 'active',
    description: 'Secure payment processing microservice with Stripe integration',
    errors: 45,
    unresolved: 3,
    lastError: '2d',
    updated: 'Updated 2 days ago',
  },
  {
    icon: '👥',
    title: 'Admin Dashboard',
    status: 'maintenance',
    description: 'Internal admin panel for managing users and platform settings',
    errors: 78,
    unresolved: 15,
    lastError: '5h',
    updated: 'Updated 3 hours ago',
  },
];

export const ProjectsPage = () => {
  return (
    <main className={`${styles.container} ${styles.mainContent}`}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Projects</h1>
          <p className={styles.pageSubtitle}>Manage and monitor all your applications</p>
        </div>
        <button className={`${styles.btn} ${styles.btnPrimary}`}>+ Create New Project</button>
      </div>

      <div className={styles.filtersBar}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input type="text" placeholder="Search projects..." />
        </div>
        <div className={styles.filterGroup}>
          <label className={`${styles.textSm} ${styles.textMuted}`}>Status:</label>
          <select className={styles.formSelect} style={{ width: 'auto', padding: '0.5rem 1rem' }}>
            <option>All Projects</option>
            <option>Active</option>
            <option>Archived</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={`${styles.textSm} ${styles.textMuted}`}>Sort by:</label>
          <select className={styles.formSelect} style={{ width: 'auto', padding: '0.5rem 1rem' }}>
            <option>Most Recent</option>
            <option>Most Errors</option>
            <option>Name A-Z</option>
          </select>
        </div>
      </div>

      <div className={styles.projectsGrid}>
        {projects.map((project, index) => (
          <div key={index} className={styles.projectCard}>
            <div className={styles.projectIcon}>{project.icon}</div>
            <div className={styles.projectHeader}>
              <div style={{ flex: 1 }}>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <div className={`${styles.flex} ${styles.gap1}`} style={{ marginBottom: '0.5rem' }}>
                  <span className={project.status === 'active' ? styles.statusDotActive : styles.statusDotWarning}></span>
                  <span className={`${styles.textSm} ${styles.textMuted}`}>
                    {project.status === 'active' ? 'Active' : 'Maintenance'}
                  </span>
                </div>
              </div>
            </div>
            <p className={styles.projectDescription}>{project.description}</p>
            <div className={styles.projectStats}>
              <div className={styles.projectStat}>
                <div className={styles.projectStatValue}>{project.errors}</div>
                <div className={styles.projectStatLabel}>Errors</div>
              </div>
              <div className={styles.projectStat}>
                <div className={styles.projectStatValue}>{project.unresolved}</div>
                <div className={styles.projectStatLabel}>Unresolved</div>
              </div>
              <div className={styles.projectStat}>
                <div className={styles.projectStatValue}>{project.lastError}</div>
                <div className={styles.projectStatLabel}>Last Error</div>
              </div>
            </div>
            <div className={styles.projectFooter}>
              <div className={styles.projectMeta}>{project.updated}</div>
              <button className={`${styles.btn} ${styles.btnSm} ${styles.btnOutline}`}>View Details</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};
