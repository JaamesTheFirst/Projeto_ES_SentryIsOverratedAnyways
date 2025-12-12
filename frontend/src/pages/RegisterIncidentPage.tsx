import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { errorsService } from '../services/errors.service';
import { projectsService } from '../services/projects.service';
import { ErrorSeverity } from '../types';
import styles from './RegisterIncidentPage.module.css';
import '../styles/common.css';

export const RegisterIncidentPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    projectId: '',
    stackTrace: '',
    severity: 'error' as ErrorSeverity,
    file: '',
    line: '',
    url: '',
    userAgent: '',
    environment: 'production',
  });

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) =>
      errorsService.create({
        title: data.title,
        projectId: data.projectId,
        stackTrace: data.stackTrace,
        severity: data.severity,
        file: data.file || undefined,
        line: data.line || undefined,
        url: data.url || undefined,
        userAgent: data.userAgent || undefined,
        environment: data.environment || undefined,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['errors'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      navigate(`/error-detail/${data.id}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <main className={`${styles.container} ${styles.mainContent}`}>
      <div className={styles.formContainer}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Register New Incident</h1>
          <p className={styles.pageSubtitle}>Report an error or exception that occurred in your application</p>
        </div>

        <form onSubmit={handleSubmit}>
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
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="project">
                  Project *
                </label>
                <select
                  id="project"
                  className={styles.formSelect}
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  required
                >
                  <option value="">Select a project...</option>
                  {projects?.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.icon} {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="environment">
                  Environment *
                </label>
                <select
                  id="environment"
                  className={styles.formSelect}
                  value={formData.environment}
                  onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                  required
                >
                  <option value="production">Production</option>
                  <option value="staging">Staging</option>
                  <option value="development">Development</option>
                  <option value="testing">Testing</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Severity Level *</label>
              <div className={styles.severitySelector}>
                {(['critical', 'error', 'warning', 'info'] as ErrorSeverity[]).map((severity) => (
                  <div key={severity} className={styles.severityOption}>
                    <input
                      type="radio"
                      name="severity"
                      id={severity}
                      value={severity}
                      checked={formData.severity === severity}
                      onChange={() => setFormData({ ...formData, severity })}
                    />
                    <label htmlFor={severity}>
                      <div className={styles.severityIcon}>
                        {severity === 'critical' || severity === 'error' ? '🔴' : severity === 'warning' ? '⚠️' : 'ℹ️'}
                      </div>
                      <div style={{ fontWeight: 600 }}>
                        {severity.charAt(0).toUpperCase() + severity.slice(1)}
                      </div>
                    </label>
                  </div>
                ))}
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
                <input
                  type="text"
                  id="errorFile"
                  className={styles.formInput}
                  placeholder="e.g., ProductList.jsx"
                  value={formData.file}
                  onChange={(e) => setFormData({ ...formData, file: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="lineNumber">
                  Line Number
                </label>
                <input
                  type="number"
                  id="lineNumber"
                  className={styles.formInput}
                  placeholder="e.g., 45"
                  value={formData.line}
                  onChange={(e) => setFormData({ ...formData, line: e.target.value })}
                />
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
                value={formData.stackTrace}
                onChange={(e) => setFormData({ ...formData, stackTrace: e.target.value })}
                required
                rows={10}
              ></textarea>
            </div>
          </div>

          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>📋 Context Information</h2>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="url">
                  URL / Route
                </label>
                <input
                  type="text"
                  id="url"
                  className={styles.formInput}
                  placeholder="e.g., /products"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="userAgent">
                  Browser / User Agent
                </label>
                <input
                  type="text"
                  id="userAgent"
                  className={styles.formInput}
                  placeholder="e.g., Chrome 119.0.0.0"
                  value={formData.userAgent}
                  onChange={(e) => setFormData({ ...formData, userAgent: e.target.value })}
                />
              </div>
            </div>
          </div>

          {createMutation.isError && (
            <div style={{ padding: '0.75rem', background: '#fee2e2', color: '#dc2626', borderRadius: '0.5rem', marginBottom: '1rem' }}>
              {(createMutation.error as any)?.response?.data?.message || 'Failed to create error'}
            </div>
          )}

          <div className={styles.formActions}>
            <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Submitting...' : 'Submit Incident'}
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
