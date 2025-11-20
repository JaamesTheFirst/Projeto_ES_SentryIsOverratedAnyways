import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

export const HomePage = () => {
  const techStack = ['TypeScript', 'React', 'Vite', 'NestJS', 'PostgreSQL', 'Docker'];

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
              <h2>Welcome to Your Error Management Dashboard</h2>
              <p>This is a modern error tracking and monitoring platform built with:</p>
              <div className={styles.techStack}>
                {techStack.map((tech) => (
                  <span key={tech} className={styles.badge}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <Link to="/login" className={styles.loginLink}>
              <span>🔐</span> View Login Page
            </Link>
          </div>
        </div>

        <div className={`${styles.card} ${styles.mockupPagesCard}`}>
          <h2>Mockup Pages</h2>
          <p>Explore the HTML/CSS mockups for all application screens:</p>
        </div>

        <div className={styles.mockupsGrid}>
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

          <Link to="/error-detail" className={styles.mockupCard}>
            <h3>
              <span className={styles.mockupIcon}>🔍</span> Error Detail
            </h3>
            <p>Detailed view of a single error with stack trace</p>
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
        </div>
      </main>

      <div className={styles.footer}>
        <p>Sprint 3 - Mockups e Iniciar a Implementação (HTML, CSS)</p>
        <p>Software Engineering Project - November 2025</p>
      </div>
    </div>
  );
};
