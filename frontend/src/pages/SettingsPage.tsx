import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/auth.service';
import styles from './SettingsPage.module.css';
import '../styles/common.css';

export const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    bio: user?.bio || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: user?.emailNotifications ?? true,
    browserNotifications: user?.browserNotifications ?? true,
    weeklySummary: user?.weeklySummary ?? false,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: typeof profileData) => authService.updateProfile(data),
    onSuccess: (updatedUser) => {
      updateUser(updatedUser);
      alert('Profile updated successfully!');
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      authService.changePassword(data),
    onSuccess: () => {
      alert('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    },
  });

  const updateNotificationsMutation = useMutation({
    mutationFn: (data: typeof notifications) => authService.updateProfile(data),
    onSuccess: (updatedUser) => {
      updateUser(updatedUser);
    },
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileData);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
  };

  const handleNotificationChange = (key: keyof typeof notifications, value: boolean) => {
    const newNotifications = { ...notifications, [key]: value };
    setNotifications(newNotifications);
    updateNotificationsMutation.mutate(newNotifications);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <main className={`${styles.container} ${styles.mainContent}`}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Settings</h1>
        <p className={styles.pageSubtitle}>Manage your account and application preferences</p>
      </div>

      <div className={styles.settingsLayout}>
        <aside className={styles.settingsSidebar}>
          <ul className={styles.settingsMenu}>
            <li className={styles.settingsMenuItem}>
              <a href="#profile" className={`${styles.settingsMenuLink} ${styles.active}`}>
                <span>👤</span>
                <span>Profile</span>
              </a>
            </li>
            <li className={styles.settingsMenuItem}>
              <a href="#notifications" className={styles.settingsMenuLink}>
                <span>🔔</span>
                <span>Notifications</span>
              </a>
            </li>
            <li className={styles.settingsMenuItem}>
              <a href="#security" className={styles.settingsMenuLink}>
                <span>🔐</span>
                <span>Security</span>
              </a>
            </li>
          </ul>
        </aside>

        <div className={styles.settingsContent}>
          <section className={styles.settingsSection} id="profile">
            <div className={styles.sectionHeader}>
              <h2>Profile Settings</h2>
              <p className={styles.sectionDescription}>Update your personal information and profile picture</p>
            </div>

            <div className={styles.profileSection}>
              <div className={styles.profileAvatarSection}>
                <div className={styles.profileAvatarLarge}>
                  {getInitials(user.firstName, user.lastName)}
                </div>
                <button className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}>Change Photo</button>
              </div>

              <form className={styles.profileForm} onSubmit={handleProfileSubmit}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="firstName">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      className={styles.formInput}
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="lastName">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      className={styles.formInput}
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="email">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className={styles.formInput}
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="bio">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    className={styles.formTextarea}
                    placeholder="Tell us about yourself..."
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  ></textarea>
                </div>

                <div className={`${styles.flex} ${styles.gap2}`}>
                  <button
                    type="submit"
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnOutline}`}
                    onClick={() => {
                      setProfileData({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        bio: user.bio || '',
                      });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </section>

          <section className={styles.settingsSection} id="notifications">
            <div className={styles.sectionHeader}>
              <h2>Notification Preferences</h2>
              <p className={styles.sectionDescription}>Choose how you want to be notified about errors and updates</p>
            </div>

            <div>
              <div className={styles.notificationItem}>
                <div className={styles.notificationInfo}>
                  <h3>Email Notifications</h3>
                  <p>Receive email alerts for critical errors</p>
                </div>
                <label className={styles.toggleSwitch}>
                  <input
                    type="checkbox"
                    checked={notifications.emailNotifications}
                    onChange={(e) => handleNotificationChange('emailNotifications', e.target.checked)}
                  />
                  <span className={styles.toggleSlider}></span>
                </label>
              </div>

              <div className={styles.notificationItem}>
                <div className={styles.notificationInfo}>
                  <h3>Browser Notifications</h3>
                  <p>Get real-time browser alerts for new errors</p>
                </div>
                <label className={styles.toggleSwitch}>
                  <input
                    type="checkbox"
                    checked={notifications.browserNotifications}
                    onChange={(e) => handleNotificationChange('browserNotifications', e.target.checked)}
                  />
                  <span className={styles.toggleSlider}></span>
                </label>
              </div>

              <div className={styles.notificationItem}>
                <div className={styles.notificationInfo}>
                  <h3>Weekly Summary</h3>
                  <p>Receive a weekly email with error statistics</p>
                </div>
                <label className={styles.toggleSwitch}>
                  <input
                    type="checkbox"
                    checked={notifications.weeklySummary}
                    onChange={(e) => handleNotificationChange('weeklySummary', e.target.checked)}
                  />
                  <span className={styles.toggleSlider}></span>
                </label>
              </div>
            </div>
          </section>

          <section className={styles.settingsSection} id="security">
            <div className={styles.sectionHeader}>
              <h2>Security</h2>
              <p className={styles.sectionDescription}>Manage your password and security settings</p>
            </div>

            <form onSubmit={handlePasswordSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="currentPassword">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  className={styles.formInput}
                  placeholder="••••••••"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="newPassword">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    className={styles.formInput}
                    placeholder="••••••••"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className={styles.formInput}
                    placeholder="••••••••"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>

              {changePasswordMutation.isError && (
                <div
                  style={{
                    padding: '0.75rem',
                    background: '#fee2e2',
                    color: '#dc2626',
                    borderRadius: '0.5rem',
                    marginBottom: '1rem',
                  }}
                >
                  {(changePasswordMutation.error as any)?.response?.data?.message || 'Failed to update password'}
                </div>
              )}

              <button
                type="submit"
                className={`${styles.btn} ${styles.btnPrimary}`}
                disabled={changePasswordMutation.isPending}
              >
                {changePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
};
