import { Link, useLocation } from 'react-router-dom';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <>
      {!isHomePage && (
        <nav className={styles.navbar}>
          <div className={`${styles.container} ${styles.navbarContent}`}>
            <Link to="/" className={styles.navbarBrand}>
              <span>🚀</span>
              <span>Error Management</span>
            </Link>
            <ul className={styles.navbarMenu}>
              <li>
                <Link
                  to="/dashboard"
                  className={location.pathname === '/dashboard' ? styles.active : ''}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/projects"
                  className={location.pathname === '/projects' ? styles.active : ''}
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  to="/errors"
                  className={location.pathname === '/errors' || location.pathname === '/error-detail' ? styles.active : ''}
                >
                  Errors
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  className={location.pathname === '/settings' ? styles.active : ''}
                >
                  Settings
                </Link>
              </li>
            </ul>
            <div className={styles.navbarActions}>
              <Link to="/register-incident" className={`${styles.btn} ${styles.btnSm} ${styles.btnSecondary}`}>
                + Report Error
              </Link>
              <button className={`${styles.btn} ${styles.btnSm} ${styles.btnPrimary}`}>+ New Project</button>
              <div className={styles.userMenu}>
                <div className={styles.avatar}>JD</div>
                <span>John Doe</span>
              </div>
            </div>
          </div>
        </nav>
      )}
      {children}
    </>
  );
};

