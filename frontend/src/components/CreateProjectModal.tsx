import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsService } from '../services/projects.service';
import styles from './CreateProjectModal.module.css';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '📁',
    status: 'active' as 'active' | 'archived' | 'maintenance',
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => projectsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      onClose();
      setFormData({ name: '', description: '', icon: '📁', status: 'active' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Create New Project</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="projectName">
              Project Name *
            </label>
            <input
              type="text"
              id="projectName"
              className={styles.formInput}
              placeholder="e.g., My Web App"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={createMutation.isPending}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="projectIcon">
              Icon
            </label>
            <input
              type="text"
              id="projectIcon"
              className={styles.formInput}
              placeholder="📁"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              maxLength={2}
              disabled={createMutation.isPending}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="projectDescription">
              Description
            </label>
            <textarea
              id="projectDescription"
              className={styles.formTextarea}
              placeholder="Describe your project..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              disabled={createMutation.isPending}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="projectStatus">
              Status
            </label>
            <select
              id="projectStatus"
              className={styles.formSelect}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              disabled={createMutation.isPending}
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          {createMutation.isError && (
            <div className={styles.errorMessage}>
              {(createMutation.error as any)?.response?.data?.message || 'Failed to create project'}
            </div>
          )}

          <div className={styles.modalActions}>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnOutline}`}
              onClick={onClose}
              disabled={createMutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`${styles.btn} ${styles.btnPrimary}`}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

