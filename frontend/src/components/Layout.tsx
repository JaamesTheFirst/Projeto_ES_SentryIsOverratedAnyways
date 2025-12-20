import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ChatHelper } from './ChatHelper';
import { Notifications } from './Notifications';
import { projectsService } from '../services/projects.service';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isHomePage = location.pathname === '/';
  const [userProjects, setUserProjects] = useState<any[]>([]);

  useEffect(() => {
    if (user && !isHomePage) {
      projectsService.getAll().then(setUserProjects).catch(() => setUserProjects([]));
    }
  }, [user, isHomePage]);

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
            {user?.role === 'admin' && (
              <div className={styles.adminWarning}>
                ⚠️ Admin Mode
              </div>
            )}
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
              {user?.role === 'admin' && (
                <li>
                  <Link
                    to="/admin"
                    className={location.pathname === '/admin' ? styles.active : ''}
                  >
                    Admin
                  </Link>
                </li>
              )}
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
              {user && <Notifications />}
              <div className={styles.userMenu}>
                <div className={styles.avatar}>
                  {user ? getInitials(user.firstName, user.lastName) : 'U'}
                </div>
                <button
                  onClick={logout}
                  className={styles.logoutBtn}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}
      {children}
      {!isHomePage && user && (
        <ChatHelper
          currentPage={location.pathname}
          userProjects={userProjects}
          availableFeatures={['dashboard', 'projects', 'errors', 'register-incident', 'settings']}
        />
      )}
    </>
  );
};

