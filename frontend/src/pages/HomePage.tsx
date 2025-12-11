import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './HomePage.module.css';

export const HomePage = () => {
  const techStack = ['TypeScript', 'React', 'Vite', 'NestJS', 'PostgreSQL', 'Docker'];
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>🚀 Error Management Platform</h1>
        <p className={styles.subtitle}>Sentry is Overrated Anyways</p>
      </header>

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.cardContentWrapper}>
            <div className={styles.cardContent}>
              <h2>
                {user ? `Welcome back, ${user.firstName}!` : 'Welcome to Your Error Management Dashboard'}
              </h2>
              <p>This is a modern error tracking and monitoring platform built with:</p>
              <div className={styles.techStack}>
                {techStack.map((tech) => (
                  <span key={tech} className={styles.badge}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            {!loading && (
              <>
                {user ? (
                  <Link to="/dashboard" className={styles.loginLink}>
                    <span>📊</span> Go to Dashboard
                  </Link>
                ) : (
                  <Link to="/login" className={styles.loginLink}>
                    <span>🔐</span> Sign In
                  </Link>
                )}
              </>
            )}
          </div>
        </div>

        <div className={`${styles.card} ${styles.mockupPagesCard}`}>
          <h2>Mockup Pages</h2>
          <p>Explore the HTML/CSS mockups for all application screens:</p>
        </div>

        <div className={styles.mockupsGrid}>
          {user ? (
            <>
              <Link to="/dashboard" className={styles.mockupCard}>
                <h3>
                  <span className={styles.mockupIcon}>📊</span> Dashboard
                </h3>
                <p>Main overview with statistics, charts, and recent errors</p>
              </Link>

              <Link to="/projects" className={styles.mockupCard}>
                <h3>
                  <span className={styles.mockupIcon}>📁</span> Projects
                </h3>
                <p>List of all projects with error counts and status</p>
              </Link>

              <Link to="/errors" className={styles.mockupCard}>
                <h3>
                  <span className={styles.mockupIcon}>🐛</span> Errors List
                </h3>
                <p>Filterable and sortable list of errors with details</p>
              </Link>

              <Link to="/register-incident" className={styles.mockupCard}>
                <h3>
                  <span className={styles.mockupIcon}>📝</span> Register Incident
                </h3>
                <p>Form to manually report and register new errors</p>
              </Link>

              <Link to="/settings" className={styles.mockupCard}>
                <h3>
                  <span className={styles.mockupIcon}>⚙️</span> Settings
                </h3>
                <p>User profile, team management, and application settings</p>
              </Link>
            </>
          ) : (
            <div style={{ gridColumn: '1 / -1', padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
              Please sign in to access the application features
            </div>
          )}
        </div>
      </main>

      <div className={styles.footer}>
        <p>Sprint 3 - Mockups e Iniciar a Implementação (HTML, CSS)</p>
        <p>Software Engineering Project - November 2025</p>
      </div>
    </div>
  );
};
