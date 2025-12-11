import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isHomePage = location.pathname === '/';

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

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
                  className={location.pathname === '/errors' || location.pathname.startsWith('/error-detail') ? styles.active : ''}
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
              <button
                className={`${styles.btn} ${styles.btnSm} ${styles.btnPrimary}`}
                onClick={() => navigate('/projects')}
              >
                + New Project
              </button>
              <div className={styles.userMenu}>
                <div className={styles.avatar}>
                  {user ? getInitials(user.firstName, user.lastName) : 'U'}
                </div>
                <span>{user ? `${user.firstName} ${user.lastName}` : 'User'}</span>
                <button
                  onClick={logout}
                  style={{
                    marginLeft: '0.5rem',
                    padding: '0.25rem 0.5rem',
                    background: 'transparent',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}
      {children}
    </>
  );
};

