import { Link } from 'react-router-dom';
import styles from './RegisterIncidentPage.module.css';
import '../styles/common.css';

export const RegisterIncidentPage = () => {
  return (
    <main className={`${styles.container} ${styles.mainContent}`}>
      <div className={styles.formContainer}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Register New Incident</h1>
          <p className={styles.pageSubtitle}>Report an error or exception that occurred in your application</p>
        </div>

        <form>
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>📝 Basic Information</h2>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="errorTitle">
                Error Title / Message *
              </label>
              <input
                type="text"
                id="errorTitle"
                className={styles.formInput}
                placeholder="e.g., TypeError: Cannot read property 'map' of undefined"
                required
              />
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="project">
                  Project *
                </label>
                <select id="project" className={styles.formSelect} required>
                  <option value="">Select a project...</option>
                  <option>E-Commerce Web App</option>
                  <option>Mobile App iOS</option>
                  <option>Android App</option>
                  <option>Backend API</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="environment">
                  Environment *
                </label>
                <select id="environment" className={styles.formSelect} required>
                  <option value="">Select environment...</option>
                  <option>Production</option>
                  <option>Staging</option>
                  <option>Development</option>
                  <option>Testing</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Severity Level *</label>
              <div className={styles.severitySelector}>
                <div className={styles.severityOption}>
                  <input type="radio" name="severity" id="critical" value="critical" />
                  <label htmlFor="critical">
                    <div className={styles.severityIcon}>🔴</div>
                    <div style={{ fontWeight: 600 }}>Critical</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Urgent fix needed</div>
                  </label>
                </div>
                <div className={styles.severityOption}>
                  <input type="radio" name="severity" id="error" value="error" defaultChecked />
                  <label htmlFor="error">
                    <div className={styles.severityIcon}>🔴</div>
                    <div style={{ fontWeight: 600 }}>Error</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Needs attention</div>
                  </label>
                </div>
                <div className={styles.severityOption}>
                  <input type="radio" name="severity" id="warning" value="warning" />
                  <label htmlFor="warning">
                    <div className={styles.severityIcon}>⚠️</div>
                    <div style={{ fontWeight: 600 }}>Warning</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Monitor closely</div>
                  </label>
                </div>
                <div className={styles.severityOption}>
                  <input type="radio" name="severity" id="info" value="info" />
                  <label htmlFor="info">
                    <div className={styles.severityIcon}>ℹ️</div>
                    <div style={{ fontWeight: 600 }}>Info</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>For reference</div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>🐛 Error Details</h2>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="errorFile">
                  File / Component
                </label>
                <input type="text" id="errorFile" className={styles.formInput} placeholder="e.g., ProductList.jsx" />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="lineNumber">
                  Line Number
                </label>
                <input type="number" id="lineNumber" className={styles.formInput} placeholder="e.g., 45" />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="stackTrace">
                Stack Trace *
              </label>
              <textarea
                id="stackTrace"
                className={styles.codeEditor}
                placeholder="Paste your stack trace here..."
                required
              ></textarea>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Or Upload Stack Trace File</label>
              <div className={styles.fileUploadArea}>
                <div className={styles.fileUploadIcon}>📄</div>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Click to upload or drag and drop</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>TXT, LOG files up to 10MB</div>
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>📋 Context Information</h2>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="url">
                  URL / Route
                </label>
                <input type="text" id="url" className={styles.formInput} placeholder="e.g., /products" />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="userAgent">
                  Browser / User Agent
                </label>
                <input type="text" id="userAgent" className={styles.formInput} placeholder="e.g., Chrome 119.0.0.0" />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="additionalContext">
                Additional Context / Notes
              </label>
              <textarea
                id="additionalContext"
                className={styles.formTextarea}
                placeholder="Any additional information that might help debug this error..."
              ></textarea>
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
              Submit Incident
            </button>
            <Link to="/errors" className={`${styles.btn} ${styles.btnOutline}`}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
};
