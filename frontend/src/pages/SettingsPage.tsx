import { Link } from 'react-router-dom';
import styles from './SettingsPage.module.css';
import '../styles/common.css';

export const SettingsPage = () => {
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
            <li className={styles.settingsMenuItem}>
              <a href="#team-roles" className={styles.settingsMenuLink}>
                <span>👥</span>
                <span>Team & Roles</span>
              </a>
            </li>
          </ul>
        </aside>

        <div className={styles.settingsContent}>
          <section className={styles.settingsSection}>
            <div className={styles.sectionHeader}>
              <h2>Profile Settings</h2>
              <p className={styles.sectionDescription}>Update your personal information and profile picture</p>
            </div>

            <div className={styles.profileSection}>
              <div className={styles.profileAvatarSection}>
                <div className={styles.profileAvatarLarge}>JD</div>
                <button className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}>Change Photo</button>
              </div>

              <div className={styles.profileForm}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="firstName">
                      First Name
                    </label>
                    <input type="text" id="firstName" className={styles.formInput} defaultValue="John" />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="lastName">
                      Last Name
                    </label>
                    <input type="text" id="lastName" className={styles.formInput} defaultValue="Doe" />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="email">
                    Email Address
                  </label>
                  <input type="email" id="email" className={styles.formInput} defaultValue="john.doe@example.com" />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="bio">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    className={styles.formTextarea}
                    placeholder="Tell us about yourself..."
                    defaultValue="Full-stack developer passionate about building great user experiences."
                  ></textarea>
                </div>

                <div className={`${styles.flex} ${styles.gap2}`}>
                  <button className={`${styles.btn} ${styles.btnPrimary}`}>Save Changes</button>
                  <button className={`${styles.btn} ${styles.btnOutline}`}>Cancel</button>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.settingsSection}>
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
                  <input type="checkbox" defaultChecked />
                  <span className={styles.toggleSlider}></span>
                </label>
              </div>

              <div className={styles.notificationItem}>
                <div className={styles.notificationInfo}>
                  <h3>Browser Notifications</h3>
                  <p>Get real-time browser alerts for new errors</p>
                </div>
                <label className={styles.toggleSwitch}>
                  <input type="checkbox" defaultChecked />
                  <span className={styles.toggleSlider}></span>
                </label>
              </div>

              <div className={styles.notificationItem}>
                <div className={styles.notificationInfo}>
                  <h3>Weekly Summary</h3>
                  <p>Receive a weekly email with error statistics</p>
                </div>
                <label className={styles.toggleSwitch}>
                  <input type="checkbox" />
                  <span className={styles.toggleSlider}></span>
                </label>
              </div>
            </div>
          </section>

          <section className={styles.settingsSection}>
            <div className={styles.sectionHeader}>
              <h2>Security</h2>
              <p className={styles.sectionDescription}>Manage your password and security settings</p>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="currentPassword">
                Current Password
              </label>
              <input type="password" id="currentPassword" className={styles.formInput} placeholder="••••••••" />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="newPassword">
                  New Password
                </label>
                <input type="password" id="newPassword" className={styles.formInput} placeholder="••••••••" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input type="password" id="confirmPassword" className={styles.formInput} placeholder="••••••••" />
              </div>
            </div>

            <button className={`${styles.btn} ${styles.btnPrimary}`}>Update Password</button>
          </section>
        </div>
      </div>
    </main>
  );
};
