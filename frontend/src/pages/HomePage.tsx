import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './HomePage.module.css';

export const HomePage = () => {
  const techStack = ['TypeScript', 'React', 'Vite', 'NestJS', 'PostgreSQL', 'Docker'];
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [showAuthMessage, setShowAuthMessage] = useState(false);

  const handleProtectedClick = (e: React.MouseEvent, path: string) => {
    if (!user) {
      e.preventDefault();
      setShowAuthMessage(true);
      setTimeout(() => setShowAuthMessage(false), 3000);
    } else {
      navigate(path);
    }
  };

  const gettingStartedSteps = [
    {
      step: 1,
      title: 'Create Your First Project',
      description: 'Set up a new project to start tracking errors',
      icon: '📁',
      action: user ? '/projects' : null,
    },
    {
      step: 2,
      title: 'Integrate Our SDK',
      description: 'Add our SDK to automatically capture errors',
      icon: '🔌',
      action: null,
    },
    {
      step: 3,
      title: 'Start Tracking Errors',
      description: 'Monitor errors in real-time and get notified',
      icon: '🐛',
      action: user ? '/errors' : null,
    },
  ];

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

        <div className={`${styles.card} ${styles.gettingStartedCard}`}>
          <h2>Getting Started</h2>
          <p>Follow these steps to start tracking errors in your applications:</p>
          <div className={styles.stepsGrid}>
            {gettingStartedSteps.map((step) => (
              <div key={step.step} className={styles.stepCard}>
                <div className={styles.stepNumber}>{step.step}</div>
                <h3 className={styles.stepTitle}>
                  <span>{step.icon}</span>
                  {step.title}
                </h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {showAuthMessage && (
          <div className={styles.authMessage}>
            <span>🔒</span> Please sign in to access this feature
          </div>
        )}

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

              <div
                className={styles.mockupCard}
                onClick={(e) => handleProtectedClick(e, '/projects')}
                style={{ cursor: 'pointer' }}
              >
                <h3>
                  <span className={styles.mockupIcon}>➕</span> New Project
                </h3>
                <p>Create a new project to start tracking errors</p>
              </div>
            </>
          ) : (
            <>
              <div
                className={styles.mockupCard}
                onClick={(e) => handleProtectedClick(e, '/dashboard')}
                style={{ cursor: 'pointer' }}
              >
                <h3>
                  <span className={styles.mockupIcon}>📊</span> Dashboard
                </h3>
                <p>Main overview with statistics, charts, and recent errors</p>
              </div>

              <div
                className={styles.mockupCard}
                onClick={(e) => handleProtectedClick(e, '/projects')}
                style={{ cursor: 'pointer' }}
              >
                <h3>
                  <span className={styles.mockupIcon}>📁</span> Projects
                </h3>
                <p>List of all projects with error counts and status</p>
              </div>

              <div
                className={styles.mockupCard}
                onClick={(e) => handleProtectedClick(e, '/errors')}
                style={{ cursor: 'pointer' }}
              >
                <h3>
                  <span className={styles.mockupIcon}>🐛</span> Errors List
                </h3>
                <p>Filterable and sortable list of errors with details</p>
              </div>

              <div
                className={styles.mockupCard}
                onClick={(e) => handleProtectedClick(e, '/register-incident')}
                style={{ cursor: 'pointer' }}
              >
                <h3>
                  <span className={styles.mockupIcon}>📝</span> Register Incident
                </h3>
                <p>Form to manually report and register new errors</p>
              </div>

              <div
                className={styles.mockupCard}
                onClick={(e) => handleProtectedClick(e, '/settings')}
                style={{ cursor: 'pointer' }}
              >
                <h3>
                  <span className={styles.mockupIcon}>⚙️</span> Settings
                </h3>
                <p>User profile, team management, and application settings</p>
              </div>

              <div
                className={styles.mockupCard}
                onClick={(e) => handleProtectedClick(e, '/projects')}
                style={{ cursor: 'pointer' }}
              >
                <h3>
                  <span className={styles.mockupIcon}>➕</span> New Project
                </h3>
                <p>Create a new project to start tracking errors</p>
              </div>
            </>
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
