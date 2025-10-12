import { useEffect, useState } from 'react';
import { api } from '../services/api';
import styles from './HomePage.module.css';

export const HomePage = () => {
  const [apiStatus, setApiStatus] = useState<{
    status: string;
    message: string;
    loading: boolean;
  }>({
    status: 'loading',
    message: '',
    loading: true,
  });

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await api.get('/health');
        setApiStatus({
          status: 'success',
          message: 'API is running!',
          loading: false,
        });
        console.log('API Health Check:', response.data);
      } catch (error) {
        setApiStatus({
          status: 'error',
          message: 'Failed to connect to API',
          loading: false,
        });
        console.error('API Error:', error);
      }
    };

    checkApiStatus();
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          🚀 Error Management Platform
        </h1>
        <p className={styles.subtitle}>
          Sentry is Overrated Anyways
        </p>
      </header>

      <main className={styles.main}>
        <div className={styles.card}>
          <h2>Welcome to Your Error Management Dashboard</h2>
          <p>
            This is a modern error tracking and monitoring platform built with:
          </p>
          <div className={styles.techStack}>
            <span className={styles.badge}>TypeScript</span>
            <span className={styles.badge}>React</span>
            <span className={styles.badge}>Vite</span>
            <span className={styles.badge}>NestJS</span>
            <span className={styles.badge}>PostgreSQL</span>
            <span className={styles.badge}>Docker</span>
          </div>
        </div>

        <div className={`${styles.card} ${styles.statusCard}`}>
          <h3>API Status</h3>
          <div className={styles.status}>
            {apiStatus.loading ? (
              <div className={styles.loading}>Checking...</div>
            ) : (
              <>
                <div
                  className={`${styles.statusIndicator} ${
                    apiStatus.status === 'success'
                      ? styles.success
                      : styles.error
                  }`}
                />
                <span>{apiStatus.message}</span>
              </>
            )}
          </div>
        </div>

        <div className={styles.features}>
          <div className={styles.feature}>
            <h3>📊 Real-time Monitoring</h3>
            <p>Track errors and exceptions as they happen in your applications</p>
          </div>
          <div className={styles.feature}>
            <h3>🔍 Detailed Insights</h3>
            <p>Get comprehensive stack traces and context for every error</p>
          </div>
          <div className={styles.feature}>
            <h3>⚡ Fast & Efficient</h3>
            <p>Built with modern technologies for optimal performance</p>
          </div>
        </div>
      </main>
    </div>
  );
};

